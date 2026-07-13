import { ActivityCard } from '@/components/activity-card'
import { BalanceHero } from '@/components/balance-hero'
import { ConnectPrompt } from '@/components/connect-prompt'
import { OnboardingChecklist } from '@/components/onboarding-checklist'
import { ReceiveCard } from '@/components/receive-card'
import { RulesCard } from '@/components/rules-card'
import { WithdrawCard } from '@/components/withdraw-card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppState } from '@/lib/app-state'
import { useT } from '@/lib/i18n'
import { faucetedFlag, useFaucet } from '@/lib/use-faucet'
import { useWallet } from '@/lib/wallet'

export function Dashboard() {
  const { address } = useWallet()
  const { account, accountStatus, rate, activity, refresh } = useAppState()
  const { faucetBusy, runFaucet } = useFaucet()
  const t = useT()

  if (!address) return <ConnectPrompt />

  const loading = accountStatus === 'loading'
  const funded = faucetedFlag(address) || activity.length > 0
  const received = activity.some((item) => item.kind === 'pay')
  const onboarding = !(funded && received)

  const scrollToReceive = () => {
    document.getElementById('receive')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div key={address} className="space-y-5">
      {accountStatus === 'error' ? (
        <div className="flex items-center justify-between gap-4 rounded-2xl border bg-card px-5 py-4 text-sm">
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
              faucetBusy={faucetBusy}
              onFaucet={() => void runFaucet()}
              onGoToReceive={scrollToReceive}
            />
          )}
          <ReceiveCard
            account={account}
            showFaucetRow={!onboarding}
            onFaucet={() => void runFaucet()}
          />
          <RulesCard account={account} />
          <WithdrawCard account={account} />
          <ActivityCard />
        </>
      )}
    </div>
  )
}
