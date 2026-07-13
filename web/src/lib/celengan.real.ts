import { Client } from 'celengan'
import { CONTRACT_ID, NETWORK_PASSPHRASE, RPC_URL } from '@/lib/config'
import type { CelenganAccount, CelenganService } from '@/lib/types'
import { requireWalletBridge } from '@/lib/wallet-bridge'

function reader(): Client {
  return new Client({
    contractId: CONTRACT_ID,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
  })
}

function signer(): Client {
  const { address, sign } = requireWalletBridge()
  return new Client({
    contractId: CONTRACT_ID,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    publicKey: address,
    signTransaction: (xdr: string) => sign(xdr),
  })
}

export const celenganReal: CelenganService = {
  async getAccount(user: string): Promise<CelenganAccount> {
    const tx = await reader().account_of({ user })
    const acc = tx.result
    return {
      splitBps: acc.split_bps,
      spend: acc.spend,
      shares: acc.shares,
      lockUntil: acc.lock_until,
    }
  },

  async pay(from: string, to: string, amount: bigint): Promise<void> {
    const tx = await signer().pay({ from, to, amount })
    await tx.signAndSend()
  },

  async withdrawSpend(user: string, amount: bigint): Promise<void> {
    const tx = await signer().withdraw_spend({ user, amount })
    await tx.signAndSend()
  },

  async withdrawSavings(user: string, shares: bigint): Promise<bigint> {
    const tx = await signer().withdraw_savings({ user, shares })
    const sent = await tx.signAndSend()
    return sent.result
  },

  async setSplit(user: string, bps: number): Promise<void> {
    const tx = await signer().set_split({ user, bps })
    await tx.signAndSend()
  },

  async setLock(user: string, until: bigint): Promise<void> {
    const tx = await signer().set_lock({ user, until })
    await tx.signAndSend()
  },
}
