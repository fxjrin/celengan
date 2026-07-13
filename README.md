# Celengan

Programmable savings on every payment. Built on Stellar by Cyphras Labs for
the APAC Stellar Hackathon 2026.

Celengan (Indonesian for piggy bank) is a payment splitter for gig workers
and small merchants: every incoming USDC payment is automatically split
between a spendable balance and a yield-earning DeFindex vault, with an
optional time lock for goals and emergency funds. Workers in Indonesia and
across Southeast Asia rarely have an employer pension or automatic savings;
Celengan makes saving the default instead of an afterthought.

## How it works

```
customer/platform                     celengan contract
      |  pay(from, to, amount)              |
      +------------------------------------>+
                                            |-- amount * (1 - split) -> spendable balance
                                            |-- amount * split -------> DeFindex USDC vault
                                            |                           (earns yield via Blend)
      worker <- withdraw_spend / withdraw_savings (time lock optional)
```

The recipient sets their own savings rule (default 20%). The savings share is
deposited into the DeFindex USDC vault in the same transaction, so the worker
holds yield-bearing vault shares, not idle balance. Savings can be locked
until a chosen date; locks can only be extended, never shortened.

## Deployed contracts (testnet)

| Contract | Address |
| --- | --- |
| Celengan | `CBF2XQAEPAXQ5XX3T4HOFYGNQ37KP5CF5K2TQMF5DPLC6YLIWUMS77AX` |
| DeFindex USDC vault | `CBMVK2JK6NTOT2O4HNQAIQFJY232BHKGLIMXDVQVHIIZKDACXDFZDWHN` |
| USDC (Blend testnet SAC) | `CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU` |

## Repository layout

- `contracts/` - Soroban contract (Rust, soroban-sdk 26, OpenZeppelin
  stellar-access and stellar-contract-utils)
- `web/` - frontend (Vite, React, TypeScript, Tailwind CSS v4, shadcn/ui,
  Stellar Wallets Kit)
- `packages/celengan` - TypeScript bindings generated from the deployed
  contract
- `scripts/` - deploy and end-to-end verification scripts

## Running locally

Frontend (defaults to the live testnet deployment):

```
cd web
pnpm install
pnpm dev
```

Contract tests:

```
cd contracts
cargo test
```

End-to-end check on testnet (faucet -> pay -> split -> vault -> withdraw):

```
./scripts/e2e.sh CBF2XQAEPAXQ5XX3T4HOFYGNQ37KP5CF5K2TQMF5DPLC6YLIWUMS77AX
```

## Trying the app

1. Install a Stellar wallet (Freighter works well) and switch it to testnet.
2. Connect the wallet on the dashboard.
3. Use "Get test USDC" to fund the wallet (XLM via friendbot plus 1,000
   testnet USDC via the Blend faucet, trustline included).
4. Simulate an incoming payment and watch it split between spendable and
   savings, then try both withdrawals, the savings rule slider, and the lock.
5. Share your payment link (`/pay/<address>?name=...&amount=...`, with a QR
   code) and pay it from a second wallet: the payer signs, the recipient's
   split rule routes part of the payment straight into their vault.

The app ships in English and Indonesian with a settings dialog for language
and primary display currency; history is reconstructed from on-chain contract
events, so it survives refreshes and device switches.

## Design notes

- The contract pre-authorizes the vault's nested token pull with
  `authorize_as_current_contract`, since invoker auth does not reach
  sub-invocations; this is what lets a contract deposit into DeFindex on its
  own behalf.
- Withdrawals are not pausable. Pause stops inflows only, so the owner can
  never freeze user exits.
- If the vault is unavailable, `pay` degrades gracefully: the savings share
  is credited as spendable instead of failing the payment.
- Savings payouts are measured as balance deltas rather than trusting the
  vault's reported amount, keeping pooled spendable funds untouchable.
- Locks are capped at five years to keep a typo from freezing funds forever.

## Roadmap

- Username registry so payment links read `/pay/budi` instead of an address
- IDR display via an on-chain FX oracle once IDR feeds are available
  (Reflector's testnet FX feed does not serve IDR yet)
- Anchor cash-out integration (SEP-31 style corridors like PeraHub in the
  Philippines) for a full earn -> save -> cash-out loop
- Mainnet deployment against the DeFindex mainnet USDC vaults
