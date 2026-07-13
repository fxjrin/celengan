#![no_std]

use soroban_sdk::auth::{ContractContext, InvokerContractAuthEntry, SubContractInvocation};
use soroban_sdk::{
    contract, contractclient, contracterror, contractimpl, contracttype, panic_with_error,
    symbol_short, token, vec, Address, Env, IntoVal, Symbol, Vec,
};
use stellar_access::ownable;
use stellar_contract_utils::pausable;
use stellar_macros::{only_owner, when_not_paused};

pub const BPS_DENOM: u32 = 10_000;
pub const DEFAULT_SPLIT_BPS: u32 = 2_000;

const ACCOUNT_TTL_THRESHOLD: u32 = 518_400; // 30 days in ledgers
const ACCOUNT_TTL_EXTEND_TO: u32 = 3_110_400; // 180 days in ledgers

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
}

#[contracttype]
#[derive(Clone)]
pub struct Config {
    pub usdc: Address,
    pub vault: Address,
}

#[contracttype]
#[derive(Clone)]
pub struct Account {
    pub split_bps: u32,
    pub spend: i128,
    pub shares: i128,
    pub lock_until: u64,
}

#[contracttype]
#[derive(Clone)]
enum DataKey {
    Config,
    Account(Address),
}

#[contractclient(name = "VaultClient")]
pub trait Vault {
    fn deposit(
        e: Env,
        amounts_desired: Vec<i128>,
        amounts_min: Vec<i128>,
        from: Address,
        invest: bool,
    ) -> (Vec<i128>, i128);

    fn withdraw(
        e: Env,
        withdraw_shares: i128,
        min_amounts_out: Vec<i128>,
        from: Address,
    ) -> Vec<i128>;
}

#[contract]
pub struct Celengan;

#[contractimpl]
impl Celengan {
    pub fn __constructor(e: &Env, owner: Address, usdc: Address, vault: Address) {
        ownable::set_owner(e, &owner);
        e.storage()
            .instance()
            .set(&DataKey::Config, &Config { usdc, vault });
    }

    /// Pays `to` through the splitter: the savings share of `amount` goes to
    /// the vault, the rest is credited to the spendable balance.
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
            Self::authorize_vault_pull(e, &cfg, saved);
            let (_, shares) = VaultClient::new(e, &cfg.vault).deposit(
                &vec![e, saved],
                &vec![e, saved],
                &e.current_contract_address(),
                &true,
            );
            acc.shares += shares;
        }
        Self::store_account(e, &to, &acc);
        e.events()
            .publish((symbol_short!("pay"), &to), (from, amount, saved));
    }

    #[when_not_paused]
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

    /// Redeems vault shares and sends the resulting USDC to the user.
    #[when_not_paused]
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
        acc.shares -= shares;
        Self::store_account(e, &user, &acc);

        let cfg = Self::config(e);
        let amounts = VaultClient::new(e, &cfg.vault).withdraw(
            &shares,
            &vec![e, 0],
            &e.current_contract_address(),
        );
        let amount = amounts.get(0).unwrap_or(0);
        if amount > 0 {
            token::TokenClient::new(e, &cfg.usdc).transfer(
                &e.current_contract_address(),
                &user,
                &amount,
            );
        }
        e.events()
            .publish((symbol_short!("wd_save"), &user), (shares, amount));
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
    }

    /// Locks savings withdrawals until `until`; a lock can only be extended.
    pub fn set_lock(e: &Env, user: Address, until: u64) {
        user.require_auth();
        let mut acc = Self::load_account(e, &user);
        if until <= acc.lock_until {
            panic_with_error!(e, Error::LockNotExtended);
        }
        acc.lock_until = until;
        Self::store_account(e, &user, &acc);
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

    // The vault pulls USDC from this contract inside its own frame, so the
    // token transfer must be pre-authorized; invoker auth does not reach it.
    fn authorize_vault_pull(e: &Env, cfg: &Config, amount: i128) {
        e.authorize_as_current_contract(vec![
            e,
            InvokerContractAuthEntry::Contract(SubContractInvocation {
                context: ContractContext {
                    contract: cfg.usdc.clone(),
                    fn_name: Symbol::new(e, "transfer"),
                    args: (
                        e.current_contract_address(),
                        cfg.vault.clone(),
                        amount,
                    )
                        .into_val(e),
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
