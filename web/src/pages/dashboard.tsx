import { useEffect, useState } from 'react'
import { ActivityCard } from '@/components/activity-card'
import { BalanceHero } from '@/components/balance-hero'
import { ConnectButton } from '@/components/connect-button'
import { OnboardingChecklist } from '@/components/onboarding-checklist'
import { ReceiveCard } from '@/components/receive-card'
import { RulesCard } from '@/components/rules-card'
import { TopBar } from '@/components/top-bar'
import { WithdrawCard } from '@/components/withdraw-card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppState } from '@/lib/app-state'
import { requestTestUsdc } from '@/lib/faucet'
import { useT } from '@/lib/i18n'
import { useWallet } from '@/lib/wallet'
import { requireWalletBridge } from '@/lib/wallet-bridge'

export function Dashboard() {
  const { address } = useWallet()
  const { account, accountStatus, rate, activity, busy, refresh, runAction } = useAppState()
  const t = useT()
  const [fauceted, setFauceted] = useState(
    () => address !== null && localStorage.getItem(`celengan:fauceted:${address}`) === '1',
  )

  useEffect(() => {
    setFauceted(address !== null && localStorage.getItem(`celengan:fauceted:${address}`) === '1')
  }, [address])

  const handleFaucet = async () => {
    const ok = await runAction('faucet', 'faucet.success', () =>
      requestTestUsdc(requireWalletBridge()),
    )
    if (ok && address) {
      localStorage.setItem(`celengan:fauceted:${address}`, '1')
      setFauceted(true)
    }
  }

  const scrollToReceive = () => {
    document.getElementById('receive')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!address) {
    return (
      <div className="min-h-svh">
        <TopBar />
        <main className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-24 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{t('dashboard.connectTitle')}</h1>
          <p className="mt-2 max-w-md text-muted-foreground">{t('dashboard.connectCaption')}</p>
          <div className="mt-6">
            <ConnectButton />
          </div>
        </main>
      </div>
    )
  }

  const loading = accountStatus === 'loading'
  const funded = fauceted || activity.length > 0
  const received = activity.some((item) => item.kind === 'pay')
  const onboarding = !(funded && received)

  return (
    <div className="min-h-svh">
      <TopBar />
      <main key={address} className="mx-auto w-full max-w-2xl space-y-4 px-4 py-8">
        {accountStatus === 'error' ? (
          <div className="flex items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-3 text-sm">
            <span>{t('errors.loadFailed')}</span>
            <Button variant="outline" size="sm" onClick={() => void refresh()}>
              {t('common.retry')}
            </Button>
          </div>
        ) : (
          <BalanceHero account={account} loading={loading} rate={rate} />
        )}
        {loading && (
          <>
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </>
        )}
        {account !== null && (
          <>
            {onboarding && (
              <OnboardingChecklist
                connected
                funded={funded}
                received={received}
                faucetBusy={busy === 'faucet'}
                onFaucet={() => void handleFaucet()}
                onGoToReceive={scrollToReceive}
              />
            )}
            <ReceiveCard
              account={account}
              showFaucetRow={!onboarding}
              onFaucet={() => void handleFaucet()}
            />
            <RulesCard account={account} />
            <WithdrawCard account={account} />
            <ActivityCard />
          </>
        )}
      </main>
    </div>
  )
}
