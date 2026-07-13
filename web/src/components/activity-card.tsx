import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { type ActivityItem } from '@/lib/activity'
import { useAppState } from '@/lib/app-state'
import { formatDate, formatDateTime, formatMoney, useT } from '@/lib/i18n'
import { useSettings } from '@/lib/settings'

export function ActivityCard() {
  const { activity, activityLoading, rate } = useAppState()
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

  return (
    <Card className="rounded-2xl shadow-none">
      <CardHeader>
        <CardTitle>{t('activity.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {activityLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ) : activity.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('activity.empty')}</p>
        ) : (
          <ul className="space-y-3">
            {activity.map((item) => (
              <li key={item.id} className="flex items-baseline justify-between gap-4 text-sm">
                <span>{label(item)}</span>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {formatDateTime(item.at, locale)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
