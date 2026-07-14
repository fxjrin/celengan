#![cfg(test)]

use crate::{
    BlendPositions, BlendReserve, BlendReserveConfig, BlendReserveData, BlendRequest, Celengan,
    CelenganClient, YieldTarget, BLEND_REQUEST_SUPPLY, BLEND_REQUEST_WITHDRAW,
    BLEND_USDC_RESERVE_INDEX, DEFAULT_SPLIT_BPS,
};
use soroban_sdk::testutils::{Address as _, Ledger};
use soroban_sdk::token::{StellarAssetClient, TokenClient};
use soroban_sdk::{contract, contractimpl, contracttype, map, token, vec, Address, Env, Map, Vec};

#[contracttype]
enum VaultKey {
    Token,
    PriceBps,
    Fail,
}

#[soroban_sdk::contracterror]
#[derive(Copy, Clone)]
#[repr(u32)]
pub enum MockVaultError {
    Forced = 100,
}

#[contract]
pub struct MockVault;

#[contractimpl]
impl MockVault {
    pub fn __constructor(e: &Env, token: Address) {
        e.storage().instance().set(&VaultKey::Token, &token);
        e.storage().instance().set(&VaultKey::PriceBps, &10_000i128);
    }

    pub fn set_price_bps(e: &Env, bps: i128) {
        e.storage().instance().set(&VaultKey::PriceBps, &bps);
    }

    pub fn set_fail(e: &Env, fail: bool) {
        e.storage().instance().set(&VaultKey::Fail, &fail);
    }

    pub fn deposit(
        e: Env,
        amounts_desired: Vec<i128>,
        _amounts_min: Vec<i128>,
        from: Address,
        _invest: bool,
    ) -> (Vec<i128>, i128, Option<i128>) {
        from.require_auth();
        if e.storage()
            .instance()
            .get(&VaultKey::Fail)
            .unwrap_or(false)
        {
            soroban_sdk::panic_with_error!(&e, MockVaultError::Forced);
        }
        let token_addr: Address = e.storage().instance().get(&VaultKey::Token).unwrap();
        let price: i128 = e.storage().instance().get(&VaultKey::PriceBps).unwrap();
        let amount = amounts_desired.get(0).unwrap();
        token::TokenClient::new(&e, &token_addr).transfer(
            &from,
            &e.current_contract_address(),
            &amount,
        );
        (amounts_desired, amount * 10_000 / price, None)
    }

    pub fn withdraw(
        e: Env,
        withdraw_shares: i128,
        _min_amounts_out: Vec<i128>,
        from: Address,
    ) -> Vec<i128> {
        from.require_auth();
        let token_addr: Address = e.storage().instance().get(&VaultKey::Token).unwrap();
        let price: i128 = e.storage().instance().get(&VaultKey::PriceBps).unwrap();
        let amount = withdraw_shares * price / 10_000;
        token::TokenClient::new(&e, &token_addr).transfer(
            &e.current_contract_address(),
            &from,
            &amount,
        );
        vec![&e, amount]
    }
}

// Mirrors blend-contracts-v2's own floor/ceil conventions exactly (not an
// approximation), so tests exercise the same rounding boundaries the real
// pool would produce: to_b_token_down floors, to_b_token_up ceils,
// to_asset_from_b_token floors.
const MOCK_RATE_SCALE: i128 = 1_000_000_000_000;

#[contracttype]
enum BlendMockKey {
    Token,
    Rate,
    Fail,
    FailAfterTransfer,
    Supply(Address),
}

#[contract]
pub struct MockBlendPool;

#[contractimpl]
impl MockBlendPool {
    pub fn __constructor(e: &Env, token: Address) {
        e.storage().instance().set(&BlendMockKey::Token, &token);
        e.storage()
            .instance()
            .set(&BlendMockKey::Rate, &MOCK_RATE_SCALE);
    }

    pub fn set_rate(e: &Env, rate: i128) {
        e.storage().instance().set(&BlendMockKey::Rate, &rate);
    }

    pub fn set_fail(e: &Env, fail: bool) {
        e.storage().instance().set(&BlendMockKey::Fail, &fail);
    }

    // fails after the token has already left the caller, to prove a trapped
    // submit() rolls the transfer back rather than stranding it mid-call
    pub fn set_fail_after_transfer(e: &Env, fail: bool) {
        e.storage()
            .instance()
            .set(&BlendMockKey::FailAfterTransfer, &fail);
    }

    fn positions_for(e: &Env, supply: i128) -> BlendPositions {
        BlendPositions {
            collateral: Map::new(e),
            liabilities: Map::new(e),
            supply: map![e, (BLEND_USDC_RESERVE_INDEX, supply)],
        }
    }

    pub fn submit(
        e: Env,
        from: Address,
        spender: Address,
        to: Address,
        requests: Vec<BlendRequest>,
    ) -> BlendPositions {
        spender.require_auth();
        if e.storage()
            .instance()
            .get(&BlendMockKey::Fail)
            .unwrap_or(false)
        {
            panic!("blend pool forced failure");
        }
        let token_addr: Address = e.storage().instance().get(&BlendMockKey::Token).unwrap();
        let rate: i128 = e.storage().instance().get(&BlendMockKey::Rate).unwrap();
        let key = BlendMockKey::Supply(from.clone());
        let mut supply: i128 = e.storage().persistent().get(&key).unwrap_or(0);
        let usdc = token::TokenClient::new(&e, &token_addr);

        for req in requests.iter() {
            if req.request_type == BLEND_REQUEST_SUPPLY {
                usdc.transfer(&from, &e.current_contract_address(), &req.amount);
                if e.storage()
                    .instance()
                    .get(&BlendMockKey::FailAfterTransfer)
                    .unwrap_or(false)
                {
                    panic!("blend pool forced failure after transfer");
                }
                let minted = (req.amount * MOCK_RATE_SCALE) / rate; // floor
                supply += minted;
            } else if req.request_type == BLEND_REQUEST_WITHDRAW {
                let mut burn = (req.amount * MOCK_RATE_SCALE + rate - 1) / rate; // ceil
                if burn > supply {
                    burn = supply;
                }
                let payout = (burn * rate) / MOCK_RATE_SCALE; // floor
                supply -= burn;
                if payout > 0 {
                    usdc.transfer(&e.current_contract_address(), &to, &payout);
                }
            }
        }
        e.storage().persistent().set(&key, &supply);
        Self::positions_for(&e, supply)
    }

    pub fn get_positions(e: Env, address: Address) -> BlendPositions {
        let key = BlendMockKey::Supply(address);
        let supply: i128 = e.storage().persistent().get(&key).unwrap_or(0);
        Self::positions_for(&e, supply)
    }

    pub fn get_reserve(e: Env, asset: Address) -> BlendReserve {
        let rate: i128 = e.storage().instance().get(&BlendMockKey::Rate).unwrap();
        BlendReserve {
            asset,
            config: BlendReserveConfig {
                c_factor: 0,
                decimals: 7,
                enabled: true,
                index: BLEND_USDC_RESERVE_INDEX,
                l_factor: 0,
                max_util: 0,
                r_base: 0,
                r_one: 0,
                r_three: 0,
                r_two: 0,
                reactivity: 0,
                supply_cap: 0,
                util: 0,
            },
            data: BlendReserveData {
                b_rate: rate,
                b_supply: 0,
                backstop_credit: 0,
                d_rate: 0,
                d_supply: 0,
                ir_mod: 0,
                last_time: 0,
            },
            scalar: 10_000_000,
        }
    }
}

struct Setup<'a> {
    client: CelenganClient<'a>,
    owner: Address,
    usdc: TokenClient<'a>,
    usdc_admin: StellarAssetClient<'a>,
    vault: Address,
    blend: Address,
}

fn setup(e: &Env) -> Setup<'_> {
    e.mock_all_auths();
    let owner = Address::generate(e);
    let issuer = Address::generate(e);
    let sac = e.register_stellar_asset_contract_v2(issuer);
    let usdc = TokenClient::new(e, &sac.address());
    let usdc_admin = StellarAssetClient::new(e, &sac.address());
    let vault = e.register(MockVault, (&sac.address(),));
    let blend = e.register(MockBlendPool, (&sac.address(),));
    let id = e.register(Celengan, (&owner, &sac.address(), &vault, &blend));
    Setup {
        client: CelenganClient::new(e, &id),
        owner,
        usdc,
        usdc_admin,
        vault,
        blend,
    }
}

fn fund(s: &Setup, who: &Address, amount: i128) {
    s.usdc_admin.mint(who, &amount);
}

#[test]
fn constructor_stores_config() {
    let e = Env::default();
    let s = setup(&e);
    assert_eq!(s.client.usdc(), s.usdc.address);
    assert_eq!(s.client.vault(), s.vault);
    assert_eq!(s.client.blend_pool(), s.blend);
    assert_eq!(s.client.owner(), Some(s.owner.clone()));
    assert!(!s.client.paused());
}

#[test]
fn new_account_has_default_split_and_defindex_target() {
    let e = Env::default();
    let s = setup(&e);
    let user = Address::generate(&e);
    let acc = s.client.account_of(&user);
    assert_eq!(acc.split_bps, DEFAULT_SPLIT_BPS);
    assert_eq!(acc.spend, 0);
    assert_eq!(acc.shares, 0);
    assert_eq!(acc.lock_until, 0);
    assert_eq!(acc.yield_target, YieldTarget::Defindex);
}

#[test]
fn pay_splits_between_spend_and_vault() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 1_000_0000000);

    s.client.pay(&payer, &worker, &100_0000000);

    let acc = s.client.account_of(&worker);
    assert_eq!(acc.spend, 80_0000000);
    assert_eq!(acc.shares, 20_0000000);
    assert_eq!(s.usdc.balance(&s.client.address), 80_0000000);
    assert_eq!(s.usdc.balance(&s.vault), 20_0000000);
}

#[test]
fn pay_with_zero_split_keeps_all_spendable() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.set_split(&worker, &0);

    s.client.pay(&payer, &worker, &100);

    let acc = s.client.account_of(&worker);
    assert_eq!(acc.spend, 100);
    assert_eq!(acc.shares, 0);
}

#[test]
fn pay_with_full_split_saves_everything() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.set_split(&worker, &10_000);

    s.client.pay(&payer, &worker, &100);

    let acc = s.client.account_of(&worker);
    assert_eq!(acc.spend, 0);
    assert_eq!(acc.shares, 100);
}

#[test]
fn pay_rounds_savings_down() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 10);

    s.client.pay(&payer, &worker, &1);

    let acc = s.client.account_of(&worker);
    assert_eq!(acc.spend, 1);
    assert_eq!(acc.shares, 0);
}

#[test]
#[should_panic(expected = "Error(Contract, #1)")]
fn pay_rejects_zero_amount() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    s.client.pay(&payer, &worker, &0);
}

#[test]
#[should_panic(expected = "Error(Contract, #2)")]
fn set_split_rejects_over_100_percent() {
    let e = Env::default();
    let s = setup(&e);
    let user = Address::generate(&e);
    s.client.set_split(&user, &10_001);
}

#[test]
fn withdraw_spend_transfers_to_user() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.pay(&payer, &worker, &100);

    s.client.withdraw_spend(&worker, &50);

    assert_eq!(s.usdc.balance(&worker), 50);
    assert_eq!(s.client.account_of(&worker).spend, 30);
}

#[test]
#[should_panic(expected = "Error(Contract, #3)")]
fn withdraw_spend_rejects_overdraw() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.pay(&payer, &worker, &100);
    s.client.withdraw_spend(&worker, &81);
}

#[test]
fn withdraw_savings_redeems_shares() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.pay(&payer, &worker, &100);

    let amount = s.client.withdraw_savings(&worker, &20);

    assert_eq!(amount, 20);
    assert_eq!(s.usdc.balance(&worker), 20);
    assert_eq!(s.client.account_of(&worker).shares, 0);
}

#[test]
fn withdraw_savings_receives_accrued_yield() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100_0000000);
    s.client.pay(&payer, &worker, &100_0000000);
    fund(&s, &s.vault, 2_0000000); // simulates vault earnings
    MockVaultClient::new(&e, &s.vault).set_price_bps(&11_000);

    let amount = s.client.withdraw_savings(&worker, &20_0000000);

    assert_eq!(amount, 22_0000000);
    assert_eq!(s.usdc.balance(&worker), 22_0000000);
}

#[test]
#[should_panic(expected = "Error(Contract, #4)")]
fn withdraw_savings_rejects_over_shares() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.pay(&payer, &worker, &100);
    s.client.withdraw_savings(&worker, &21);
}

#[test]
#[should_panic(expected = "Error(Contract, #5)")]
fn withdraw_savings_respects_lock() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.pay(&payer, &worker, &100);
    s.client.set_lock(&worker, &1_000);
    s.client.withdraw_savings(&worker, &20);
}

#[test]
fn withdraw_savings_allowed_after_lock_expires() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.pay(&payer, &worker, &100);
    s.client.set_lock(&worker, &1_000);
    e.ledger().set_timestamp(1_000);

    let amount = s.client.withdraw_savings(&worker, &20);
    assert_eq!(amount, 20);
}

#[test]
#[should_panic(expected = "Error(Contract, #6)")]
fn set_lock_can_only_extend() {
    let e = Env::default();
    let s = setup(&e);
    let user = Address::generate(&e);
    s.client.set_lock(&user, &1_000);
    s.client.set_lock(&user, &500);
}

#[test]
#[should_panic(expected = "Error(Contract, #1000)")]
fn pause_blocks_pay() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.pause();
    s.client.pay(&payer, &worker, &100);
}

#[test]
fn unpause_restores_pay() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.pause();
    s.client.unpause();
    s.client.pay(&payer, &worker, &100);
    assert_eq!(s.client.account_of(&worker).spend, 80);
}

#[test]
fn withdrawals_work_while_paused() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.pay(&payer, &worker, &100);
    s.client.pause();

    s.client.withdraw_spend(&worker, &80);
    let amount = s.client.withdraw_savings(&worker, &20);

    assert_eq!(amount, 20);
    assert_eq!(s.usdc.balance(&worker), 100);
}

#[test]
fn vault_failure_credits_savings_as_spend() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    MockVaultClient::new(&e, &s.vault).set_fail(&true);

    s.client.pay(&payer, &worker, &100);

    let acc = s.client.account_of(&worker);
    assert_eq!(acc.spend, 100);
    assert_eq!(acc.shares, 0);
    assert_eq!(s.usdc.balance(&s.client.address), 100);
}

#[test]
#[should_panic(expected = "Error(Contract, #7)")]
fn zero_value_withdrawal_reverts() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.pay(&payer, &worker, &100);
    MockVaultClient::new(&e, &s.vault).set_price_bps(&0);
    s.client.withdraw_savings(&worker, &20);
}

#[test]
#[should_panic(expected = "Error(Contract, #8)")]
fn set_lock_rejects_absurd_horizon() {
    let e = Env::default();
    let s = setup(&e);
    let user = Address::generate(&e);
    s.client.set_lock(&user, &(crate::MAX_LOCK_SECS + 1));
}

// -- Blend yield target --

#[test]
fn set_yield_target_switches_to_blend() {
    let e = Env::default();
    let s = setup(&e);
    let user = Address::generate(&e);
    s.client.set_yield_target(&user, &YieldTarget::Blend);
    assert_eq!(s.client.account_of(&user).yield_target, YieldTarget::Blend);
}

#[test]
#[should_panic(expected = "Error(Contract, #9)")]
fn set_yield_target_blocked_with_balance() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.pay(&payer, &worker, &100);
    s.client.set_yield_target(&worker, &YieldTarget::Blend);
}

#[test]
fn pay_routes_to_blend_when_selected() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.set_yield_target(&worker, &YieldTarget::Blend);

    s.client.pay(&payer, &worker, &100);

    let acc = s.client.account_of(&worker);
    assert_eq!(acc.spend, 80);
    assert_eq!(acc.shares, 20); // 1:1 rate by default
    assert_eq!(s.usdc.balance(&s.blend), 20);
    assert_eq!(s.usdc.balance(&s.client.address), 80);
}

#[test]
fn blend_withdraw_savings_redeems_shares() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.set_yield_target(&worker, &YieldTarget::Blend);
    s.client.pay(&payer, &worker, &100);

    let amount = s.client.withdraw_savings(&worker, &20);

    assert_eq!(amount, 20);
    assert_eq!(s.usdc.balance(&worker), 20);
    assert_eq!(s.client.account_of(&worker).shares, 0);
}

#[test]
fn blend_withdraw_savings_receives_accrued_yield() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100_0000000);
    s.client.set_yield_target(&worker, &YieldTarget::Blend);
    s.client.pay(&payer, &worker, &100_0000000);
    fund(&s, &s.blend, 2_0000000); // simulates pool interest accrual
    MockBlendPoolClient::new(&e, &s.blend).set_rate(&1_100_000_000_000); // 1.10x

    let amount = s.client.withdraw_savings(&worker, &20_0000000);

    assert_eq!(amount, 22_0000000);
    assert_eq!(s.usdc.balance(&worker), 22_0000000);
}

#[test]
fn blend_pay_shares_measured_as_positions_delta_at_accrued_rate() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100_0000000);
    s.client.set_yield_target(&worker, &YieldTarget::Blend);
    MockBlendPoolClient::new(&e, &s.blend).set_rate(&1_250_000_000_000); // 1.25x already accrued

    s.client.pay(&payer, &worker, &100_0000000);

    // saved = 20_0000000 USDC; minted b-tokens = floor(saved * SCALE / rate)
    let acc = s.client.account_of(&worker);
    assert_eq!(acc.shares, 16_0000000);
}

#[test]
fn blend_failure_credits_savings_as_spend() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.set_yield_target(&worker, &YieldTarget::Blend);
    MockBlendPoolClient::new(&e, &s.blend).set_fail(&true);

    s.client.pay(&payer, &worker, &100);

    let acc = s.client.account_of(&worker);
    assert_eq!(acc.spend, 100);
    assert_eq!(acc.shares, 0);
    assert_eq!(s.usdc.balance(&s.client.address), 100);
}

#[test]
#[should_panic(expected = "Error(Contract, #4)")]
fn blend_withdraw_savings_rejects_over_shares() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.set_yield_target(&worker, &YieldTarget::Blend);
    s.client.pay(&payer, &worker, &100);
    s.client.withdraw_savings(&worker, &21);
}

#[test]
fn blend_withdraw_rounding_with_nonzero_remainder_zeroes_out_exactly() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 1_000_0000000);
    s.client.set_yield_target(&worker, &YieldTarget::Blend);
    s.client.set_split(&worker, &10_000); // save everything, exact share count
    // a rate with no clean relationship to the deposit forces a nonzero
    // floor remainder in redeem_blend's shares -> underlying conversion
    MockBlendPoolClient::new(&e, &s.blend).set_rate(&1_333_333_333_333);

    s.client.pay(&payer, &worker, &777_0000000);
    let shares = s.client.account_of(&worker).shares;
    assert!(shares > 0);

    s.client.withdraw_savings(&worker, &shares);

    // to_burn == shares exactly whenever b_rate >= SCALAR_12 (proved during
    // review), even though the double floor-rounding on the underlying
    // payout can leave up to 1 stroop of protocol-favoring dust at Blend
    // itself - that dust belongs to the pool, not to any Celengan user, and
    // never shows up as unaccounted value in this contract's own ledger
    assert_eq!(s.client.account_of(&worker).shares, 0);
    assert!(s.usdc.balance(&s.blend) <= 1);
    // switching now must succeed, proving no dust was left stranded at Blend
    s.client.set_yield_target(&worker, &YieldTarget::Defindex);
}

#[test]
fn blend_transfer_rolls_back_when_submit_fails_after_it() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 100);
    s.client.set_yield_target(&worker, &YieldTarget::Blend);
    MockBlendPoolClient::new(&e, &s.blend).set_fail_after_transfer(&true);

    s.client.pay(&payer, &worker, &100);

    // the mock's transfer-then-panic proves try_submit's failure unwinds the
    // whole sub-call, so the contract's own balance is exactly as if the
    // Blend attempt had never touched the token contract at all
    assert_eq!(s.usdc.balance(&s.client.address), 100);
    assert_eq!(s.usdc.balance(&s.blend), 0);
    let acc = s.client.account_of(&worker);
    assert_eq!(acc.spend, 100);
    assert_eq!(acc.shares, 0);
}

#[test]
fn blend_multiple_users_do_not_contaminate_each_others_shares() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let alice = Address::generate(&e);
    let bob = Address::generate(&e);
    fund(&s, &payer, 1_000);
    s.client.set_yield_target(&alice, &YieldTarget::Blend);
    s.client.set_yield_target(&bob, &YieldTarget::Blend);

    s.client.pay(&payer, &alice, &100); // alice: 20 shares
    s.client.pay(&payer, &bob, &500); // bob: 100 shares

    assert_eq!(s.client.account_of(&alice).shares, 20);
    assert_eq!(s.client.account_of(&bob).shares, 100);

    let alice_amount = s.client.withdraw_savings(&alice, &20);
    assert_eq!(alice_amount, 20);
    assert_eq!(s.client.account_of(&alice).shares, 0);
    // bob's position is untouched by alice's withdrawal
    assert_eq!(s.client.account_of(&bob).shares, 100);

    let bob_amount = s.client.withdraw_savings(&bob, &100);
    assert_eq!(bob_amount, 100);
    assert_eq!(s.client.account_of(&bob).shares, 0);
}

#[test]
fn switching_target_after_full_withdrawal_is_allowed() {
    let e = Env::default();
    let s = setup(&e);
    let payer = Address::generate(&e);
    let worker = Address::generate(&e);
    fund(&s, &payer, 200);
    s.client.pay(&payer, &worker, &100); // defindex, 20 shares

    s.client.withdraw_savings(&worker, &20);
    s.client.set_yield_target(&worker, &YieldTarget::Blend);
    s.client.pay(&payer, &worker, &100); // now routes to blend

    let acc = s.client.account_of(&worker);
    assert_eq!(acc.yield_target, YieldTarget::Blend);
    assert_eq!(acc.shares, 20);
    assert_eq!(s.usdc.balance(&s.vault), 0);
    assert_eq!(s.usdc.balance(&s.blend), 20);
}
