export type CelenganAccount = {
  splitBps: number
  spend: bigint
  shares: bigint
  lockUntil: bigint
}

export interface CelenganService {
  getAccount(user: string): Promise<CelenganAccount>
  pay(from: string, to: string, amount: bigint): Promise<void>
  withdrawSpend(user: string, amount: bigint): Promise<void>
  withdrawSavings(user: string, shares: bigint): Promise<bigint>
  setSplit(user: string, bps: number): Promise<void>
  setLock(user: string, until: bigint): Promise<void>
}
