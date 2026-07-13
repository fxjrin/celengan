import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ActionsCard } from '@/components/actions-card'
import { ActivityCard, type ActivityEntry } from '@/components/activity-card'
import { BalanceCards } from '@/components/balance-cards'
import { LockCard } from '@/components/lock-card'
import { SplitCard } from '@/components/split-card'
import { TopBar } from '@/components/top-bar'
import { celengan } from '@/lib/celengan'
import { errorMessage } from '@/lib/errors'
import { requestTestUsdc } from '@/lib/faucet'
import { formatUsdc, parseUsdc } from '@/lib/format'
import { FALLBACK_IDR_RATE, getUsdIdrRate } from '@/lib/rates'
import type { CelenganAccount } from '@/lib/types'
import { useWallet } from '@/lib/wallet'
import { requireWalletBridge } from '@/lib/wallet-bridge'

let nextActivityId = 0

export function Dashboard() {
  const { address } = useWallet()
  const [account, setAccount] = useState<CelenganAccount | null>(null)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [rate, setRate] = useState(FALLBACK_IDR_RATE)
  const [activity, setActivity] = useState<ActivityEntry[]>([])

  useEffect(() => {
    void getUsdIdrRate().then(setRate)
  }, [])

  useEffect(() => {
    if (!address) {
      setAccount(null)
      return
    }
    let cancelled = false
    setAccount(null)
    setLoading(true)
    celengan
      .getAccount(address)
      .then((acc) => {
        if (!cancelled) setAccount(acc)
      })
      .catch((e: unknown) => {
        if (!cancelled) toast.error(errorMessage(e))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [address])

  const runAction = useCallback(
    async (key: string, label: string, fn: () => Promise<void>): Promise<boolean> => {
      if (!address) return false
      setBusy(key)
      try {
        await fn()
        setAccount(await celengan.getAccount(address))
        const entry = { id: nextActivityId++, label, at: new Date() }
        setActivity((prev) => [entry, ...prev])
        toast.success(label)
        return true
      } catch (e) {
        toast.error(errorMessage(e))
        return false
      } finally {
        setBusy(null)
      }
    },
    [address],
  )

  const parseAmount = (raw: string): bigint | null => {
    try {
      const amount = parseUsdc(raw)
      if (amount <= 0n) throw new Error('Enter an amount above zero')
      return amount
    } catch (e) {
      toast.error(errorMessage(e))
      return null
    }
  }

  const handleFaucet = async (): Promise<boolean> => {
    if (!address) return false
    return runAction('faucet', 'Received 1,000 testnet USDC', () =>
      requestTestUsdc(requireWalletBridge()),
    )
  }

  const handlePay = async (raw: string): Promise<boolean> => {
    const amount = parseAmount(raw)
    if (amount === null || !address) return false
    return runAction('pay', `Payment received: ${formatUsdc(amount)} USDC`, () =>
      celengan.pay(address, address, amount),
    )
  }

  const handleWithdrawSpend = async (raw: string): Promise<boolean> => {
    const amount = parseAmount(raw)
    if (amount === null || !address) return false
    return runAction('spend', `Withdrew spendable: ${formatUsdc(amount)} USDC`, () =>
      celengan.withdrawSpend(address, amount),
    )
  }

  const handleWithdrawSavings = async (raw: string): Promise<boolean> => {
    const shares = parseAmount(raw)
    if (shares === null || !address) return false
    return runAction('savings', `Withdrew savings: ${formatUsdc(shares)} shares`, async () => {
      await celengan.withdrawSavings(address, shares)
    })
  }

  const handleSaveSplit = (bps: number) => {
    if (!address) return
    void runAction('split', `Savings rule set to ${bps / 100}%`, () =>
      celengan.setSplit(address, bps),
    )
  }

  const handleLock = (until: bigint) => {
    if (!address) return
    const dateLabel = new Date(Number(until) * 1000).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    void runAction('lock', `Savings locked until ${dateLabel}`, () =>
      celengan.setLock(address, until),
    )
  }

  const disabled = !address || loading

  return (
    <div className="min-h-svh">
      <TopBar />
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <BalanceCards account={account} loading={loading} rate={rate} />
        <div className="mt-4 grid items-start gap-4 md:grid-cols-2">
          <SplitCard
            key={address ?? 'disconnected'}
            splitBps={account ? account.splitBps : null}
            disabled={disabled}
            saving={busy === 'split'}
            onSave={handleSaveSplit}
          />
          <LockCard
            lockUntil={account ? account.lockUntil : null}
            disabled={disabled}
            saving={busy === 'lock'}
            onLock={handleLock}
          />
          <ActionsCard
            disabled={disabled}
            busy={busy}
            onFaucet={handleFaucet}
            onPay={handlePay}
            onWithdrawSpend={handleWithdrawSpend}
            onWithdrawSavings={handleWithdrawSavings}
          />
          <ActivityCard entries={activity} />
        </div>
      </main>
    </div>
  )
}
