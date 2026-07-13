export const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015'
export const RPC_URL = 'https://soroban-testnet.stellar.org'

// Testnet deployment defaults; set VITE_CELENGAN_ID="" to use the mock service.
export const CONTRACT_ID: string =
  import.meta.env.VITE_CELENGAN_ID ?? 'CBF2XQAEPAXQ5XX3T4HOFYGNQ37KP5CF5K2TQMF5DPLC6YLIWUMS77AX'
export const USDC_ID: string =
  import.meta.env.VITE_USDC_ID ?? 'CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU'
export const VAULT_ID: string =
  import.meta.env.VITE_VAULT_ID ?? 'CBMVK2JK6NTOT2O4HNQAIQFJY232BHKGLIMXDVQVHIIZKDACXDFZDWHN'
