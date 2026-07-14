import {
  Address,
  Contract,
  Keypair,
  TransactionBuilder,
  nativeToScVal,
  rpc,
  scValToNative,
  type xdr,
} from 'celengan'
// imported directly (not via 'celengan') because the bindings package's own generated
// `Account` contract-data interface shadows the sdk's `Account` class re-export
import { Account } from '@stellar/stellar-sdk'
import type { ActivityItem } from '@/lib/activity'
import { NETWORK_PASSPHRASE, RPC_URL, USDC_ID, VAULT_ID } from '@/lib/config'

const SHARE_SCALE = 10_000_000n // dfToken and USDC both use 7 decimals on this vault
const SCALAR_7 = 10_000_000n
const SCALAR_12 = 10_000_000_000_000n
const UTIL_95 = 9_500_000n
const UTIL_TAIL = 500_000n // 1.0 - 0.95, the width of the third rate-curve tier

// The DeFindex vault's single strategy (CALLOM5I7XLQPPOPQMYAHUWW4N7O3JKT42KQ4ASEEVBXDJQNJOALFSUY)
// lends into this Blend USDC pool. There is no public getter for it: it was found by reading the
// strategy contract's instance storage entry for its `Config.pool` field on testnet
// (stellar contract data read, DataKey::Config -> { pool: "CCEBVDYM32YNYCVNRXQKDFFPISJJCV557CDZEIRBEE4NCV4KHPQ44HGF", ... }).
const BLEND_POOL_ID = 'CCEBVDYM32YNYCVNRXQKDFFPISJJCV557CDZEIRBEE4NCV4KHPQ44HGF'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

// simulateTransaction never reads or signs against the source account, so a throwaway
// keypair is enough to shape a valid read-only transaction envelope
async function simulateReadCall(
  contractId: string,
  method: string,
  args: xdr.ScVal[],
): Promise<unknown> {
  const server = new rpc.Server(RPC_URL)
  const account = new Account(Keypair.random().publicKey(), '0')
  const tx = new TransactionBuilder(account, { fee: '100', networkPassphrase: NETWORK_PASSPHRASE })
    .addOperation(new Contract(contractId).call(method, ...args))
    .setTimeout(30)
    .build()
  const sim = await server.simulateTransaction(tx)
  if (rpc.Api.isSimulationError(sim)) throw new Error(sim.error)
  if (!sim.result) throw new Error('yield: empty simulation result')
  return scValToNative(sim.result.retval)
}

/**
 * USDC value of one full vault share (7 decimals), read live from the vault.
 * Returns null if the read fails so the UI can degrade to a placeholder.
 */
export async function getSharePrice(): Promise<bigint | null> {
  try {
    // the vault currently holds a single asset (USDC), so the per-shares vector has one entry
    const result = await simulateReadCall(VAULT_ID, 'get_asset_amounts_per_shares', [
      nativeToScVal(SHARE_SCALE, { type: 'i128' }),
    ])
    const price = Array.isArray(result) ? result[0] : null
    return typeof price === 'bigint' ? price : null
  } catch {
    return null
  }
}

export type VaultStats = {
  totalSupply: bigint | null
  idle: bigint | null
  invested: bigint | null
}

/**
 * Vault-wide share supply and the idle/invested USDC split, read live from the vault.
 * Each field decodes independently and falls back to null on a shape mismatch or rpc failure.
 */
export async function getVaultStats(): Promise<VaultStats> {
  const [supplyResult, fundsResult] = await Promise.allSettled([
    simulateReadCall(VAULT_ID, 'total_supply', []),
    simulateReadCall(VAULT_ID, 'fetch_total_managed_funds', []),
  ])

  const totalSupply =
    supplyResult.status === 'fulfilled' && typeof supplyResult.value === 'bigint'
      ? supplyResult.value
      : null

  let idle: bigint | null = null
  let invested: bigint | null = null
  if (fundsResult.status === 'fulfilled' && Array.isArray(fundsResult.value)) {
    const usdcEntry = fundsResult.value.find((entry) => isRecord(entry) && entry.asset === USDC_ID)
    if (isRecord(usdcEntry)) {
      if (typeof usdcEntry.idle_amount === 'bigint') idle = usdcEntry.idle_amount
      if (typeof usdcEntry.invested_amount === 'bigint') invested = usdcEntry.invested_amount
    }
  }

  return { totalSupply, idle, invested }
}

type ReserveConfig = {
  util: number
  r_base: number
  r_one: number
  r_two: number
  r_three: number
}

type ReserveData = {
  b_rate: bigint
  b_supply: bigint
  d_rate: bigint
  d_supply: bigint
  ir_mod: bigint
}

function isReserveConfig(value: unknown): value is ReserveConfig {
  return (
    isRecord(value) &&
    typeof value.util === 'number' &&
    typeof value.r_base === 'number' &&
    typeof value.r_one === 'number' &&
    typeof value.r_two === 'number' &&
    typeof value.r_three === 'number'
  )
}

function isReserveData(value: unknown): value is ReserveData {
  return (
    isRecord(value) &&
    typeof value.b_rate === 'bigint' &&
    typeof value.b_supply === 'bigint' &&
    typeof value.d_rate === 'bigint' &&
    typeof value.d_supply === 'bigint' &&
    typeof value.ir_mod === 'bigint'
  )
}

function isReserve(value: unknown): value is { config: ReserveConfig; data: ReserveData } {
  return isRecord(value) && isReserveConfig(value.config) && isReserveData(value.data)
}

function isPoolConfig(value: unknown): value is { bstop_rate: number } {
  return isRecord(value) && typeof value.bstop_rate === 'number'
}

function fixedMulCeil(a: bigint, b: bigint, scalar: bigint): bigint {
  return (a * b + (scalar - 1n)) / scalar
}

function fixedMulFloor(a: bigint, b: bigint, scalar: bigint): bigint {
  return (a * b) / scalar
}

function fixedDivCeil(a: bigint, b: bigint, scalar: bigint): bigint {
  return (a * scalar + (b - 1n)) / b
}

// utilization = liabilities / supply, capped at 100%; mirrors Reserve::utilization in
// blend-contracts-v2 pool/src/pool/reserve.rs (liabilities == 0 short-circuits to 0 so a
// pool with target_util == 0 never divides by zero below)
function reserveUtilization(data: ReserveData): bigint {
  const totalLiabilities = fixedMulCeil(data.d_supply, data.d_rate, SCALAR_12)
  const totalSupply = fixedMulFloor(data.b_supply, data.b_rate, SCALAR_12)
  if (totalLiabilities === 0n) return 0n
  if (totalLiabilities >= totalSupply) return SCALAR_7
  return fixedDivCeil(totalLiabilities, totalSupply, SCALAR_7)
}

// three-tier borrow rate curve read off the reserve's live ir_mod modifier; mirrors
// calc_accrual's rate formula in blend-contracts-v2 pool/src/pool/interest.rs (the ir_mod
// update itself is skipped since we read the already-current modifier from chain)
function currentBorrowApr(config: ReserveConfig, data: ReserveData, curUtil: bigint): bigint {
  const targetUtil = BigInt(config.util)
  const rBase = BigInt(config.r_base)
  const rOne = BigInt(config.r_one)
  const rTwo = BigInt(config.r_two)
  const rThree = BigInt(config.r_three)
  const irMod = data.ir_mod

  if (curUtil <= targetUtil) {
    const utilScalar = fixedDivCeil(curUtil, targetUtil, SCALAR_7)
    const baseRate = fixedMulCeil(utilScalar, rOne, SCALAR_7) + rBase
    return fixedMulCeil(baseRate, irMod, SCALAR_7)
  }
  if (curUtil <= UTIL_95) {
    const utilScalar = fixedDivCeil(curUtil - targetUtil, UTIL_95 - targetUtil, SCALAR_7)
    const baseRate = fixedMulCeil(utilScalar, rTwo, SCALAR_7) + rOne + rBase
    return fixedMulCeil(baseRate, irMod, SCALAR_7)
  }
  const utilScalar = fixedDivCeil(curUtil - UTIL_95, UTIL_TAIL, SCALAR_7)
  const extraRate = fixedMulCeil(utilScalar, rThree, SCALAR_7)
  const intersection = fixedMulCeil(irMod, rTwo + rOne + rBase, SCALAR_7)
  return extraRate + intersection
}

/**
 * Effective APY suppliers earn on the Blend USDC pool the vault's strategy lends into
 * (supply APR = borrow APR x utilization x (1 - backstop take rate), compounded continuously).
 * Returns null if the pool or reserve cannot be read so the UI can degrade to a placeholder.
 */
export async function getBlendSupplyApy(): Promise<number | null> {
  try {
    const [reserveRaw, poolConfigRaw] = await Promise.all([
      simulateReadCall(BLEND_POOL_ID, 'get_reserve', [Address.fromString(USDC_ID).toScVal()]),
      simulateReadCall(BLEND_POOL_ID, 'get_config', []),
    ])
    if (!isReserve(reserveRaw) || !isPoolConfig(poolConfigRaw)) return null

    const curUtil = reserveUtilization(reserveRaw.data)
    if (curUtil === 0n) return 0 // nothing borrowed, so suppliers earn nothing right now

    const borrowApr = currentBorrowApr(reserveRaw.config, reserveRaw.data, curUtil)
    const util = Number(curUtil) / 1e7
    const bstop = Number(poolConfigRaw.bstop_rate) / 1e7
    const supplyApr = (Number(borrowApr) / 1e7) * util * (1 - bstop)
    return Math.exp(supplyApr) - 1
  } catch {
    return null
  }
}

export type SavingsPosition = {
  principal: bigint
  currentValue: bigint
  earnings: bigint
}

/**
 * Cost basis and live value of the savings pocket, replayed from event history.
 *
 * MVP simplification: pay events carry the saved USDC amount but not the shares minted, so
 * this assumes shares mint 1:1 with the amount saved (true for every pay on this testnet vault
 * so far, since the share price has stayed at 1.0). wd_save events carry exact shares withdrawn,
 * so those reduce cost basis proportionally rather than by assumption. The UI marks this an
 * estimate.
 */
export function computeSavingsPosition(
  activity: ActivityItem[],
  shares: bigint,
  sharePrice: bigint,
): SavingsPosition {
  const oldestFirst = [...activity].reverse()
  let runningShares = 0n
  let basis = 0n
  for (const item of oldestFirst) {
    if (item.kind === 'pay' && item.saved !== undefined) {
      runningShares += item.saved
      basis += item.saved
    } else if (item.kind === 'wd_save' && item.shares !== undefined) {
      if (runningShares > 0n) basis -= (basis * item.shares) / runningShares
      runningShares -= item.shares
      if (runningShares < 0n) runningShares = 0n
    }
  }
  const currentValue = (shares * sharePrice) / SHARE_SCALE
  return { principal: basis, currentValue, earnings: currentValue - basis }
}
