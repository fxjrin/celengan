#![no_std]

use soroban_sdk::auth::{ContractContext, InvokerContractAuthEntry, SubContractInvocation};
use soroban_sdk::{
    contract, contractclient, contracterror, contractimpl, contracttype, panic_with_error,
    symbol_short, token, vec, Address, Env, IntoVal, Map, Symbol, Val, Vec,
};
use stellar_access::ownable;
use stellar_contract_utils::pausable;
use stellar_macros::{only_owner, when_not_paused};

pub const BPS_DENOM: u32 = 10_000;
pub const DEFAULT_SPLIT_BPS: u32 = 2_000;

const ACCOUNT_TTL_THRESHOLD: u32 = 518_400; // 30 days in ledgers
const ACCOUNT_TTL_EXTEND_TO: u32 = 3_110_400; // 180 days in ledgers
const MAX_LOCK_SECS: u64 = 157_680_000; // 5 years; caps fat-fingered locks

// verified live on the deployed testnet pool: USDC is reserve index 3
// (get_reserve_list position and get_reserve().config.index both agree)
const BLEND_USDC_RESERVE_INDEX: u32 = 3;
// blend-contracts-v2 pool/src/pool/actions.rs RequestType enum
const BLEND_REQUEST_SUPPLY: u32 = 0; // non-collateral supply; never opens a borrow-eligible position
const BLEND_REQUEST_WITHDRAW: u32 = 1;
// blend-contracts-v2 pool/src/constants.rs SCALAR_12; b_rate is always fixed-point at this
// scale regardless of the underlying asset's own decimals
const BLEND_RATE_SCALAR: i128 = 1_000_000_000_000;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    InvalidAmount = 1,
    InvalidSplit = 2,
    InsufficientSpend = 3,
    InsufficientShares = 4,
    SavingsLocked = 5,
    LockNotExtended = 6,
    EmptyWithdrawal = 7,
    LockTooLong = 8,
    SwitchTargetWithBalance = 9,
}

#[contracttype]
#[derive(Clone)]
pub struct Config {
    pub usdc: Address,
    pub vault: Address,
    pub blend_pool: Address,
}

#[contracttype]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum YieldTarget {
    Defindex,
    Blend,
}

#[contracttype]
#[derive(Clone)]
pub struct Account {
    pub split_bps: u32,
    pub spend: i128,
    pub shares: i128,
    pub lock_until: u64,
    // shares only ever mean units of whichever target this is; switching
    // targets is blocked while a balance is held, so the two never mix
    pub yield_target: YieldTarget,
}

#[contracttype]
#[derive(Clone)]
enum DataKey {
    Config,
    Account(Address),
}

// Mirrors the DeFindex vault interface; the allocation report in deposit's
// return value is decoded as a raw Val because it is never inspected here.
#[contractclient(name = "VaultClient")]
pub trait Vault {
    fn deposit(
        e: Env,
        amounts_desired: Vec<i128>,
        amounts_min: Vec<i128>,
        from: Address,
        invest: bool,
    ) -> (Vec<i128>, i128, Val);

    fn withdraw(
        e: Env,
        withdraw_shares: i128,
        min_amounts_out: Vec<i128>,
        from: Address,
    ) -> Vec<i128>;
}

// Mirrors blend-contracts-v2's Request/Positions/Reserve* shapes (field
// names and types only; Soroban struct XDR is keyed by name, not
// declaration order). request_type is a bare u32 on the wire, matching the
// pool's own interface, even though Blend's Rust source models it as an enum.
#[contracttype]
#[derive(Clone)]
pub struct BlendRequest {
    pub address: Address,
    pub amount: i128,
    pub request_type: u32,
}

#[contracttype]
#[derive(Clone)]
pub struct BlendPositions {
    pub collateral: Map<u32, i128>,
    pub liabilities: Map<u32, i128>,
    pub supply: Map<u32, i128>,
}

#[contracttype]
#[derive(Clone)]
pub struct BlendReserveConfig {
    pub c_factor: u32,
    pub decimals: u32,
    pub enabled: bool,
    pub index: u32,
    pub l_factor: u32,
    pub max_util: u32,
    pub r_base: u32,
    pub r_one: u32,
    pub r_three: u32,
    pub r_two: u32,
    pub reactivity: u32,
    pub supply_cap: i128,
    pub util: u32,
}

#[contracttype]
#[derive(Clone)]
pub struct BlendReserveData {
    pub b_rate: i128,
    pub b_supply: i128,
    pub backstop_credit: i128,
    pub d_rate: i128,
    pub d_supply: i128,
    pub ir_mod: i128,
    pub last_time: u64,
}

#[contracttype]
#[derive(Clone)]
pub struct BlendReserve {
    pub asset: Address,
    pub config: BlendReserveConfig,
    pub data: BlendReserveData,
    pub scalar: i128,
}

#[contractclient(name = "BlendPoolClient")]
pub trait BlendPool {
    fn submit(
        e: Env,
        from: Address,
        spender: Address,
        to: Address,
        requests: Vec<BlendRequest>,
    ) -> BlendPositions;

    fn get_positions(e: Env, address: Address) -> BlendPositions;

    fn get_reserve(e: Env, asset: Address) -> BlendReserve;
}

#[contract]
pub struct Celengan;

#[contractimpl]
impl Celengan {
    pub fn __constructor(e: &Env, owner: Address, usdc: Address, vault: Address, blend_pool: Address) {
        ownable::set_owner(e, &owner);
        e.storage().instance().set(
            &DataKey::Config,
            &Config {
                usdc,
                vault,
                blend_pool,
            },
        );
    }

    /// Pays `to` through the splitter: the savings share of `amount` goes to
    /// `to`'s chosen yield source, the rest is credited to the spendable balance.
    #[when_not_paused]
    pub fn pay(e: &Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        if amount <= 0 {
            panic_with_error!(e, Error::InvalidAmount);
        }
        let cfg = Self::config(e);
        token::TokenClient::new(e, &cfg.usdc).transfer(
            &from,
            &e.current_contract_address(),
            &amount,
        );

        let mut acc = Self::load_account(e, &to);
        let saved = amount * acc.split_bps as i128 / BPS_DENOM as i128;
        acc.spend += amount - saved;
        if saved > 0 {
            let minted = match acc.yield_target {
                YieldTarget::Defindex => Self::supply_defindex(e, &cfg, saved),
                YieldTarget::Blend => Self::supply_blend(e, &cfg, saved),
            };
            match minted {
                Some(shares) => acc.shares += shares,
                None => acc.spend += saved, // yield source outage must not block payroll
            }
        }
        Self::store_account(e, &to, &acc);
        e.events()
            .publish((symbol_short!("pay"), &to), (from, amount, saved));
    }

    // Withdrawals are deliberately not pausable: pause stops inflows only,
    // so the owner can never freeze user exits.
    pub fn withdraw_spend(e: &Env, user: Address, amount: i128) {
        user.require_auth();
        if amount <= 0 {
            panic_with_error!(e, Error::InvalidAmount);
        }
        let mut acc = Self::load_account(e, &user);
        if amount > acc.spend {
            panic_with_error!(e, Error::InsufficientSpend);
        }
        acc.spend -= amount;
        Self::store_account(e, &user, &acc);

        let cfg = Self::config(e);
        token::TokenClient::new(e, &cfg.usdc).transfer(
            &e.current_contract_address(),
            &user,
            &amount,
        );
        e.events()
            .publish((symbol_short!("wd_spend"), &user), amount);
    }

    /// Redeems savings shares from `user`'s yield source and sends the
    /// resulting USDC to them.
    pub fn withdraw_savings(e: &Env, user: Address, shares: i128) -> i128 {
        user.require_auth();
        if shares <= 0 {
            panic_with_error!(e, Error::InvalidAmount);
        }
        let mut acc = Self::load_account(e, &user);
        if shares > acc.shares {
            panic_with_error!(e, Error::InsufficientShares);
        }
        if e.ledger().timestamp() < acc.lock_until {
            panic_with_error!(e, Error::SavingsLocked);
        }

        // The payout is measured as a balance delta instead of trusting a
        // source's reported amount, so the pooled spend funds stay untouchable.
        let cfg = Self::config(e);
        let usdc = token::TokenClient::new(e, &cfg.usdc);
        let before = usdc.balance(&e.current_contract_address());
        let burnt = match acc.yield_target {
            YieldTarget::Defindex => {
                VaultClient::new(e, &cfg.vault).withdraw(
                    &shares,
                    &vec![e, 0],
                    &e.current_contract_address(),
                );
                shares
            }
            YieldTarget::Blend => Self::redeem_blend(e, &cfg, shares),
        };
        let amount = usdc.balance(&e.current_contract_address()) - before;
        if amount <= 0 {
            panic_with_error!(e, Error::EmptyWithdrawal);
        }
        acc.shares -= burnt;
        Self::store_account(e, &user, &acc);
        usdc.transfer(&e.current_contract_address(), &user, &amount);
        e.events()
            .publish((symbol_short!("wd_save"), &user), (burnt, amount));
        amount
    }

    pub fn set_split(e: &Env, user: Address, bps: u32) {
        user.require_auth();
        if bps > BPS_DENOM {
            panic_with_error!(e, Error::InvalidSplit);
        }
        let mut acc = Self::load_account(e, &user);
        acc.split_bps = bps;
        Self::store_account(e, &user, &acc);
        e.events().publish((symbol_short!("split"), &user), bps);
    }

    /// Locks savings withdrawals until `until`; a lock can only be extended.
    pub fn set_lock(e: &Env, user: Address, until: u64) {
        user.require_auth();
        let mut acc = Self::load_account(e, &user);
        if until <= acc.lock_until {
            panic_with_error!(e, Error::LockNotExtended);
        }
        if until > e.ledger().timestamp() + MAX_LOCK_SECS {
            panic_with_error!(e, Error::LockTooLong);
        }
        acc.lock_until = until;
        Self::store_account(e, &user, &acc);
        e.events().publish((symbol_short!("lock"), &user), until);
    }

    /// Switches which protocol `user`'s future savings earn yield in. Only
    /// allowed at a zero balance, since the two sources' shares are not
    /// interchangeable and withdrawing first keeps the accounting simple.
    pub fn set_yield_target(e: &Env, user: Address, target: YieldTarget) {
        user.require_auth();
        let mut acc = Self::load_account(e, &user);
        if acc.shares != 0 {
            panic_with_error!(e, Error::SwitchTargetWithBalance);
        }
        acc.yield_target = target;
        Self::store_account(e, &user, &acc);
        e.events()
            .publish((symbol_short!("target"), &user), target);
    }

    pub fn account_of(e: &Env, user: Address) -> Account {
        Self::load_account(e, &user)
    }

    pub fn usdc(e: &Env) -> Address {
        Self::config(e).usdc
    }

    pub fn vault(e: &Env) -> Address {
        Self::config(e).vault
    }

    pub fn blend_pool(e: &Env) -> Address {
        Self::config(e).blend_pool
    }

    pub fn owner(e: &Env) -> Option<Address> {
        ownable::get_owner(e)
    }

    pub fn paused(e: &Env) -> bool {
        pausable::paused(e)
    }

    #[only_owner]
    pub fn pause(e: &Env) {
        pausable::pause(e);
    }

    #[only_owner]
    pub fn unpause(e: &Env) {
        pausable::unpause(e);
    }

    fn config(e: &Env) -> Config {
        e.storage().instance().get(&DataKey::Config).unwrap()
    }

    fn supply_defindex(e: &Env, cfg: &Config, saved: i128) -> Option<i128> {
        Self::authorize_pull(e, &cfg.usdc, &cfg.vault, saved);
        match VaultClient::new(e, &cfg.vault).try_deposit(
            &vec![e, saved],
            &vec![e, saved],
            &e.current_contract_address(),
            &true,
        ) {
            Ok(Ok((_, shares, _))) => Some(shares),
            _ => None,
        }
    }

    // b-tokens minted are measured as a Positions delta (read before and
    // after submit) instead of computed from `saved` and a locally-read
    // b_rate, so a rate change between the two reads can never desync our
    // ledger from Blend's own truth.
    fn supply_blend(e: &Env, cfg: &Config, saved: i128) -> Option<i128> {
        let pool = BlendPoolClient::new(e, &cfg.blend_pool);
        let before = match pool.try_get_positions(&e.current_contract_address()) {
            Ok(Ok(positions)) => positions,
            _ => return None,
        };
        Self::authorize_pull(e, &cfg.usdc, &cfg.blend_pool, saved);
        let requests = vec![
            e,
            BlendRequest {
                address: cfg.usdc.clone(),
                amount: saved,
                request_type: BLEND_REQUEST_SUPPLY,
            },
        ];
        let after = match pool.try_submit(
            &e.current_contract_address(),
            &e.current_contract_address(),
            &e.current_contract_address(),
            &requests,
        ) {
            Ok(Ok(positions)) => positions,
            _ => return None,
        };
        let before_supply = before.supply.get(BLEND_USDC_RESERVE_INDEX).unwrap_or(0);
        let after_supply = after.supply.get(BLEND_USDC_RESERVE_INDEX).unwrap_or(0);
        Some(after_supply - before_supply)
    }

    // Blend's Withdraw request takes an amount in underlying units and burns
    // b_token_up(amount), clamped to this CONTRACT's total pooled balance -
    // not to any individual user's shares. Requesting the wrong amount could
    // therefore redeem another user's savings, so the underlying amount is
    // floor-rounded from `shares` (never rounds up past what the caller
    // owns), and the actual burn is re-measured from the Positions delta
    // rather than assumed to equal the request.
    fn redeem_blend(e: &Env, cfg: &Config, shares: i128) -> i128 {
        let pool = BlendPoolClient::new(e, &cfg.blend_pool);
        let reserve = pool.get_reserve(&cfg.usdc);
        let request_amount = (shares * reserve.data.b_rate) / BLEND_RATE_SCALAR;
        if request_amount <= 0 {
            panic_with_error!(e, Error::EmptyWithdrawal);
        }
        let before = pool.get_positions(&e.current_contract_address());
        let before_supply = before.supply.get(BLEND_USDC_RESERVE_INDEX).unwrap_or(0);
        let requests = vec![
            e,
            BlendRequest {
                address: cfg.usdc.clone(),
                amount: request_amount,
                request_type: BLEND_REQUEST_WITHDRAW,
            },
        ];
        let after = pool.submit(
            &e.current_contract_address(),
            &e.current_contract_address(),
            &e.current_contract_address(),
            &requests,
        );
        let after_supply = after.supply.get(BLEND_USDC_RESERVE_INDEX).unwrap_or(0);
        before_supply - after_supply
    }

    // The destination pulls USDC from this contract inside its own frame, so
    // the token transfer must be pre-authorized; invoker auth does not reach it.
    fn authorize_pull(e: &Env, usdc: &Address, to: &Address, amount: i128) {
        e.authorize_as_current_contract(vec![
            e,
            InvokerContractAuthEntry::Contract(SubContractInvocation {
                context: ContractContext {
                    contract: usdc.clone(),
                    fn_name: Symbol::new(e, "transfer"),
                    args: (e.current_contract_address(), to.clone(), amount).into_val(e),
                },
                sub_invocations: vec![e],
            }),
        ]);
    }

    fn load_account(e: &Env, user: &Address) -> Account {
        let key = DataKey::Account(user.clone());
        match e.storage().persistent().get(&key) {
            Some(acc) => {
                e.storage().persistent().extend_ttl(
                    &key,
                    ACCOUNT_TTL_THRESHOLD,
                    ACCOUNT_TTL_EXTEND_TO,
                );
                acc
            }
            None => Account {
                split_bps: DEFAULT_SPLIT_BPS,
                spend: 0,
                shares: 0,
                lock_until: 0,
                yield_target: YieldTarget::Defindex,
            },
        }
    }

    fn store_account(e: &Env, user: &Address, acc: &Account) {
        let key = DataKey::Account(user.clone());
        e.storage().persistent().set(&key, acc);
        e.storage()
            .persistent()
            .extend_ttl(&key, ACCOUNT_TTL_THRESHOLD, ACCOUNT_TTL_EXTEND_TO);
    }
}

#[cfg(test)]
mod test;
