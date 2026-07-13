#![cfg(test)]

use crate::{Celengan, CelenganClient, DEFAULT_SPLIT_BPS};
use soroban_sdk::{testutils::Address as _, Address, Env};

fn setup(e: &Env) -> (CelenganClient<'_>, Address, Address, Address) {
    let owner = Address::generate(e);
    let usdc = Address::generate(e);
    let vault = Address::generate(e);
    let id = e.register(Celengan, (&owner, &usdc, &vault));
    (CelenganClient::new(e, &id), owner, usdc, vault)
}

#[test]
fn constructor_stores_config() {
    let e = Env::default();
    let (client, _, usdc, vault) = setup(&e);
    assert_eq!(client.usdc(), usdc);
    assert_eq!(client.vault(), vault);
}

#[test]
fn new_account_has_default_split() {
    let e = Env::default();
    let (client, _, _, _) = setup(&e);
    let user = Address::generate(&e);
    let acc = client.account_of(&user);
    assert_eq!(acc.split_bps, DEFAULT_SPLIT_BPS);
    assert_eq!(acc.spend, 0);
    assert_eq!(acc.shares, 0);
}
