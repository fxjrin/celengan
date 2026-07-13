# Celengan

Programmable savings on every payment. Built on Stellar by Cyphras Labs.

Celengan is a payment splitter for gig workers and small merchants: every
incoming USDC payment is automatically split between a spendable balance and
a yield-earning savings vault, with an optional time lock for emergency funds.

## How it works

1. A customer or platform pays a worker through the Celengan contract.
2. The contract splits the payment by the worker's configured ratio.
3. The savings portion is deposited into a DeFindex vault to earn yield.
4. The worker withdraws spending money anytime; savings unlock at the date
   they chose.

## Repository layout

- `contracts/` - Soroban smart contract (Rust)
- `web/` - frontend (React, TypeScript, Tailwind CSS)
- `scripts/` - deploy and end-to-end verification scripts

## Status

Testnet MVP for the APAC Stellar Hackathon 2026.
