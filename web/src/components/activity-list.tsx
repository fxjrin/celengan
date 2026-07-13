import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  LockIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import { AddressAvatar } from '@/components/brand/address-avatar'
import { TokenIcon } from '@/components/brand/token-icon'
import { Skeleton } from '@/components/ui/skeleton'
import { type ActivityItem } from '@/lib/activity'
import { useAppState } from '@/lib/app-state'
import { formatDate, formatDateTime, formatMoney, useT } from '@/lib/i18n'
import { useSettings } from '@/lib/settings'
import { useWallet } from '@/lib/wallet'

const ICONS: Record<ActivityItem['kind'], typeof LockIcon> = {
  pay: ArrowDownLeftIcon,
  wd_spend: ArrowUpRightIcon,
  wd_save: ArrowUpRightIcon,
  split: SlidersHorizontalIcon,
  lock: LockIcon,
}

type ActivityListProps = {
  items: ActivityItem[]
  loading: boolean
}

const TOKEN_KINDS: readonly ActivityItem['kind'][] = ['pay', 'wd_spend', 'wd_save']

export function ActivityList({ items, loading }: ActivityListProps) {
  const { rate } = useAppState()
  const { locale, primaryCurrency } = useSettings()
  const { address } = useWallet()
  const t = useT()

  const money = (amount: bigint | undefined): string =>
    formatMoney(amount ?? 0n, primaryCurrency, rate, locale)

  const label = (item: ActivityItem): string => {
    switch (item.kind) {
      case 'pay':
        return t('activity.pay', { amount: money(item.amount), saved: money(item.saved) })
      case 'wd_spend':
        return t('activity.wdSpend', { amount: money(item.amount) })
      case 'wd_save':
        return t('activity.wdSave', { amount: money(item.amount) })
      case 'split':
        return t('activity.split', { pct: (item.bps ?? 0) / 100 })
      case 'lock':
        return t('activity.lock', { date: formatDate(item.until ?? 0n, locale) })
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-4/5" />
        <Skeleton className="h-9 w-3/5" />
      </div>
    )
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('activity.empty')}</p>
  }

  return (
    <ul className="-mx-2 space-y-1">
      {items.map((item) => {
        const Icon = ICONS[item.kind]
        const externalPayer =
          item.kind === 'pay' && item.from !== undefined && item.from !== address
        return (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-muted/50"
          >
            <span className="relative shrink-0">
              {externalPayer ? (
                <AddressAvatar address={item.from ?? ''} size={40} className="rounded-full" />
              ) : TOKEN_KINDS.includes(item.kind) ? (
                // token first so the currency is recognizable at a glance
                <span className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <TokenIcon token="usdc" size={24} />
                </span>
              ) : (
                <span className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <Icon className="size-4 text-muted-foreground" />
                </span>
              )}
              {TOKEN_KINDS.includes(item.kind) &&
                (externalPayer ? (
                  <span className="absolute -right-1 -bottom-1 flex rounded-full ring-2 ring-card">
                    <TokenIcon token="usdc" size={16} />
                  </span>
                ) : (
                  <span className="absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full bg-card ring-2 ring-card">
                    <Icon className="size-3 text-muted-foreground" />
                  </span>
                ))}
            </span>
            <span className="min-w-0 flex-1">{label(item)}</span>
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
              {formatDateTime(item.at, locale)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
