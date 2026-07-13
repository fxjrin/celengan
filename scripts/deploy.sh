#!/usr/bin/env bash
set -euo pipefail

# Deploys the celengan contract to testnet against the DeFindex USDC vault.
# Usage: ./scripts/deploy.sh <deployer-identity> <owner-g-address>

NETWORK=testnet
USDC=CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU
VAULT=CBMVK2JK6NTOT2O4HNQAIQFJY232BHKGLIMXDVQVHIIZKDACXDFZDWHN

DEPLOYER=${1:?deployer identity required}
OWNER=${2:?owner G-address required}

cd "$(dirname "$0")/../contracts"
stellar contract build

stellar contract deploy \
  --wasm target/wasm32v1-none/release/celengan.wasm \
  --source-account "$DEPLOYER" \
  --network "$NETWORK" \
  -- \
  --owner "$OWNER" \
  --usdc "$USDC" \
  --vault "$VAULT"
