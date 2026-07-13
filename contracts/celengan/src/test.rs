#![cfg(test)]

use crate::{Celengan, CelenganClient, DEFAULT_SPLIT_BPS};
use soroban_sdk::testutils::{Address as _, Ledger};
use soroban_sdk::token::{StellarAssetClient, TokenClient};
use soroban_sdk::{contract, contractimpl, contracttype, token, vec, Address, Env, Vec};

#[contracttype]
enum VaultKey {
    Token,
    PriceBps,
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

    pub fn deposit(
        e: Env,
        amounts_desired: Vec<i128>,
        _amounts_min: Vec<i128>,
        from: Address,
        _invest: bool,
    ) -> (Vec<i128>, i128) {
        from.require_auth();
        let token_addr: Address = e.storage().instance().get(&VaultKey::Token).unwrap();
        let price: i128 = e.storage().instance().get(&VaultKey::PriceBps).unwrap();
        let amount = amounts_desired.get(0).unwrap();
        token::TokenClient::new(&e, &token_addr).transfer(
            &from,
            &e.current_contract_address(),
            &amount,
        );
        (amounts_desired, amount * 10_000 / price)
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

struct Setup<'a> {
    e: &'a Env,
    client: CelenganClient<'a>,
    owner: Address,
    usdc: TokenClient<'a>,
    usdc_admin: StellarAssetClient<'a>,
    vault: Address,
}

fn setup(e: &Env) -> Setup<'_> {
    e.mock_all_auths();
    let owner = Address::generate(e);
    let issuer = Address::generate(e);
    let sac = e.register_stellar_asset_contract_v2(issuer);
    let usdc = TokenClient::new(e, &sac.address());
    let usdc_admin = StellarAssetClient::new(e, &sac.address());
    let vault = e.register(MockVault, (&sac.address(),));
    let id = e.register(Celengan, (&owner, &sac.address(), &vault));
    Setup {
        e,
        client: CelenganClient::new(e, &id),
        owner,
        usdc,
        usdc_admin,
        vault,
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
    assert_eq!(s.client.owner(), Some(s.owner.clone()));
    assert!(!s.client.paused());
}

#[test]
fn new_account_has_default_split() {
    let e = Env::default();
    let s = setup(&e);
    let user = Address::generate(&e);
    let acc = s.client.account_of(&user);
    assert_eq!(acc.split_bps, DEFAULT_SPLIT_BPS);
    assert_eq!(acc.spend, 0);
    assert_eq!(acc.shares, 0);
    assert_eq!(acc.lock_until, 0);
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
