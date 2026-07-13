import { toast } from 'sonner'
import { ActionsCard } from '@/components/actions-card'
import { ActivityCard } from '@/components/activity-card'
import { BalanceCards } from '@/components/balance-cards'
import { LockCard } from '@/components/lock-card'
import { SplitCard } from '@/components/split-card'
import { TopBar } from '@/components/top-bar'
import { Button } from '@/components/ui/button'
import { useAppState } from '@/lib/app-state'
import { celengan } from '@/lib/celengan'
import { requestTestUsdc } from '@/lib/faucet'
import { parseUsdc } from '@/lib/format'
import { useT } from '@/lib/i18n'
import { useWallet } from '@/lib/wallet'
import { requireWalletBridge } from '@/lib/wallet-bridge'

export function Dashboard() {
  const { address } = useWallet()
  const { account, accountStatus, rate, busy, refresh, runAction } = useAppState()
  const t = useT()

  const parseAmount = (raw: string): bigint | null => {
    try {
      const amount = parseUsdc(raw)
      if (amount <= 0n) throw new Error('invalid amount')
      return amount
    } catch {
      toast.error(t('errors.invalidAmount'))
      return null
    }
  }

  const handleFaucet = async (): Promise<boolean> =>
    runAction('faucet', 'faucet.success', () => requestTestUsdc(requireWalletBridge()))

  const handlePay = async (raw: string): Promise<boolean> => {
    const amount = parseAmount(raw)
    if (amount === null || !address) return false
    return runAction('pay', 'success.paid', () => celengan.pay(address, address, amount))
  }

  const handleWithdrawSpend = async (raw: string): Promise<boolean> => {
    const amount = parseAmount(raw)
    if (amount === null || !address) return false
    return runAction('spend', 'success.withdrewSpend', () =>
      celengan.withdrawSpend(address, amount),
    )
  }

  const handleWithdrawSavings = async (raw: string): Promise<boolean> => {
    const shares = parseAmount(raw)
    if (shares === null || !address) return false
    return runAction('savings', 'success.withdrewSavings', async () => {
      await celengan.withdrawSavings(address, shares)
    })
  }

  const handleSaveSplit = (bps: number) => {
    if (!address) return
    void runAction('split', 'success.splitSaved', () => celengan.setSplit(address, bps))
  }

  const handleLock = (until: bigint) => {
    if (!address) return
    void runAction('lock', 'success.lockSet', () => celengan.setLock(address, until))
  }

  const loading = accountStatus === 'loading'
  const disabled = !address || loading || busy !== null

  return (
    <div className="min-h-svh">
      <TopBar />
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        {accountStatus === 'error' && (
          <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-3 text-sm">
            <span>{t('errors.loadFailed')}</span>
            <Button variant="outline" size="sm" onClick={() => void refresh()}>
              {t('common.retry')}
            </Button>
          </div>
        )}
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
          <ActivityCard />
        </div>
      </main>
    </div>
  )
}
