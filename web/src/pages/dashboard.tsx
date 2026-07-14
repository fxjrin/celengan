import type { ComponentType } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  SlidersHorizontalIcon,
  TrendingUpIcon,
} from 'lucide-react'
import { ActivityCard } from '@/components/activity-card'
import { BalanceHero } from '@/components/balance-hero'
import { ConnectPrompt } from '@/components/connect-prompt'
import { OnboardingChecklist } from '@/components/onboarding-checklist'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppState } from '@/lib/app-state'
import { useT, type MessageKey } from '@/lib/i18n'
import { faucetedFlag, useFaucet } from '@/lib/use-faucet'
import { useWallet } from '@/lib/wallet'

type QuickAction = {
  to: string
  icon: ComponentType<{ className?: string }>
  title: MessageKey
  caption: MessageKey
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    to: '/app/receive',
    icon: ArrowDownLeftIcon,
    title: 'nav.receive',
    caption: 'page.receiveCaption',
  },
  {
    to: '/app/withdraw',
    icon: ArrowUpRightIcon,
    title: 'nav.withdraw',
    caption: 'page.withdrawCaption',
  },
  {
    to: '/app/rules',
    icon: SlidersHorizontalIcon,
    title: 'nav.rules',
    caption: 'page.rulesCaption',
  },
  {
    to: '/app/yield',
    icon: TrendingUpIcon,
    title: 'nav.yield',
    caption: 'page.yieldCaption',
  },
]

export function Dashboard() {
  const { address } = useWallet()
  const { account, accountStatus, rate, activity, refresh } = useAppState()
  const { faucetBusy, runFaucet } = useFaucet()
  const navigate = useNavigate()
  const t = useT()

  if (!address) return <ConnectPrompt />

  const loading = accountStatus === 'loading'
  const funded = faucetedFlag(address) || activity.length > 0
  const received = activity.some((item) => item.kind === 'pay')
  const onboarding = !(funded && received)

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
        <BalanceHero account={account} activity={activity} loading={loading} rate={rate} />
      )}
      {loading && <Skeleton className="h-40 w-full rounded-2xl" />}
      {account !== null && (
        <>
          {onboarding && (
            <OnboardingChecklist
              connected
              funded={funded}
              received={received}
              faucetBusy={faucetBusy}
              onFaucet={() => void runFaucet()}
              onGoToReceive={() => void navigate('/app/receive')}
            />
          )}
          <section
            aria-label={t('dashboard.quickActions')}
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="rounded-2xl border bg-card p-4 outline-none transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md active:translate-y-0 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <action.icon className="size-4" />
                </span>
                <p className="mt-3 text-sm font-medium">{t(action.title)}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t(action.caption)}</p>
              </Link>
            ))}
          </section>
          <ActivityCard />
        </>
      )}
    </div>
  )
}
