import { TokenIcon } from '@/components/brand/token-icon'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usdcToInput } from '@/lib/format'
import { formatMoney, useT } from '@/lib/i18n'
import { useSettings } from '@/lib/settings'
import { computeSavingsPosition } from '@/lib/yield'
import type { ActivityItem } from '@/lib/activity'
import type { CelenganAccount } from '@/lib/types'

type YieldPositionCardProps = {
  account: CelenganAccount | null
  activity: ActivityItem[]
  sharePrice: bigint | null
  loading: boolean
  rate: number
}

function Stat({
  label,
  amount,
  secondary,
  tone,
  badge,
}: {
  label: string
  amount: string
  secondary: string
  tone?: 'gold' | 'muted'
  badge?: string
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
        {label}
        {badge && (
          <Badge variant="outline" className="h-4 px-1.5 text-[10px] font-normal normal-case">
            {badge}
          </Badge>
        )}
      </p>
      <p
        className={
          'mt-1 flex items-center gap-1.5 text-lg font-semibold tracking-tight tabular-nums ' +
          (tone === 'gold' ? 'text-gold-ink' : tone === 'muted' ? 'text-muted-foreground' : '')
        }
      >
        <TokenIcon token="usdc" size={20} />
        {amount}
      </p>
      <p className="text-xs text-muted-foreground tabular-nums">{secondary}</p>
    </div>
  )
}

export function YieldPositionCard({
  account,
  activity,
  sharePrice,
  loading,
  rate,
}: YieldPositionCardProps) {
  const t = useT()
  const { locale, primaryCurrency } = useSettings()
  const secondaryCurrency = primaryCurrency === 'idr' ? 'usdc' : 'idr'

  const primary = (amount: bigint): string => formatMoney(amount, primaryCurrency, rate, locale)
  const secondary = (amount: bigint): string =>
    formatMoney(amount, secondaryCurrency, rate, locale)

  if (loading || account === null) {
    return (
      <Card className="rounded-2xl shadow-none">
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <Skeleton className="mt-5 h-4 w-2/3" />
        </CardContent>
      </Card>
    )
  }

  const position = computeSavingsPosition(activity, account.shares, sharePrice ?? 0n)
  const earningsTone = position.earnings > 0n ? 'gold' : 'muted'

  return (
    <Card className="rounded-2xl shadow-none">
      <CardHeader>
        <CardTitle>{t('yield.positionTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <Stat
            label={t('yield.principal')}
            amount={primary(position.principal)}
            secondary={`~ ${secondary(position.principal)}`}
            badge={t('yield.estimate')}
          />
          {sharePrice !== null ? (
            <>
              <Stat
                label={t('yield.currentValue')}
                amount={primary(position.currentValue)}
                secondary={`~ ${secondary(position.currentValue)}`}
              />
              <Stat
                label={t('yield.earnings')}
                amount={`${position.earnings > 0n ? '+' : ''}${primary(position.earnings)}`}
                secondary={`~ ${secondary(position.earnings)}`}
                tone={earningsTone}
              />
            </>
          ) : (
            <>
              <Stat label={t('yield.currentValue')} amount="-" secondary="-" tone="muted" />
              <Stat label={t('yield.earnings')} amount="-" secondary="-" tone="muted" />
            </>
          )}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t pt-3 text-xs text-muted-foreground">
          <span>
            {t('yield.shares')}: <span className="tabular-nums">{usdcToInput(account.shares)}</span>
          </span>
          <span>
            {t('yield.sharePrice')}:{' '}
            <span className="tabular-nums">
              {sharePrice !== null ? usdcToInput(sharePrice) : '-'}
            </span>
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {t('yield.estimateHint')} {t('yield.earningsCaption')}
        </p>
      </CardContent>
    </Card>
  )
}
