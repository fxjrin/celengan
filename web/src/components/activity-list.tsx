import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  LockIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { type ActivityItem } from '@/lib/activity'
import { useAppState } from '@/lib/app-state'
import { formatDate, formatDateTime, formatMoney, useT } from '@/lib/i18n'
import { useSettings } from '@/lib/settings'

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

export function ActivityList({ items, loading }: ActivityListProps) {
  const { rate } = useAppState()
  const { locale, primaryCurrency } = useSettings()
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
    <ul className="space-y-3">
      {items.map((item) => {
        const Icon = ICONS[item.kind]
        return (
          <li key={item.id} className="flex items-center gap-3 text-sm">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <Icon className="size-4 text-muted-foreground" />
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
