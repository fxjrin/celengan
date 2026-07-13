import type { CelenganAccount, CelenganService } from '@/lib/types'

const LATENCY_MS = 800
const DEFAULT_SPLIT_BPS = 2000
const BPS_DENOMINATOR = 10_000n

const accounts = new Map<string, CelenganAccount>()

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, LATENCY_MS))
}

function account(user: string): CelenganAccount {
  let acc = accounts.get(user)
  if (!acc) {
    acc = { splitBps: DEFAULT_SPLIT_BPS, spend: 0n, shares: 0n, lockUntil: 0n }
    accounts.set(user, acc)
  }
  return acc
}

function nowSeconds(): bigint {
  return BigInt(Math.floor(Date.now() / 1000))
}

export const celenganMock: CelenganService = {
  async getAccount(user) {
    await delay()
    return { ...account(user) }
  },

  async pay(_from, to, amount) {
    await delay()
    const acc = account(to)
    const saved = (amount * BigInt(acc.splitBps)) / BPS_DENOMINATOR
    acc.shares += saved // mock vault mints shares 1:1 with deposited USDC
    acc.spend += amount - saved
  },

  async withdrawSpend(user, amount) {
    await delay()
    const acc = account(user)
    if (amount > acc.spend) throw new Error('Insufficient spendable balance')
    acc.spend -= amount
  },

  async withdrawSavings(user, shares) {
    await delay()
    const acc = account(user)
    if (acc.lockUntil > nowSeconds()) throw new Error('Savings are locked')
    if (shares > acc.shares) throw new Error('Insufficient savings shares')
    acc.shares -= shares
    return shares // 1:1 redemption in mock
  },

  async setSplit(user, bps) {
    await delay()
    account(user).splitBps = bps
  },

  async setLock(user, until) {
    await delay()
    account(user).lockUntil = until
  },
}
