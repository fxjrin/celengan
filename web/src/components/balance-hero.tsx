import { LockIcon } from 'lucide-react'
import { TokenIcon } from '@/components/brand/token-icon'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Skeleton } from '@/components/ui/skeleton'
import { usdcToNumber } from '@/lib/format'
import { formatDate, formatMoney, useT } from '@/lib/i18n'
import { useSettings } from '@/lib/settings'
import type { CelenganAccount } from '@/lib/types'

const MIN_SEGMENT_PCT = 4 // keep tiny pockets visible on the bar

type BalanceHeroProps = {
  account: CelenganAccount | null
  loading: boolean
  rate: number
}

function segmentWidths(spend: number, save: number): [number, number] {
  const total = spend + save
  if (total <= 0) return [0, 0]
  let spendPct = (spend / total) * 100
  if (spend > 0 && spendPct < MIN_SEGMENT_PCT) spendPct = MIN_SEGMENT_PCT
  if (save > 0 && spendPct > 100 - MIN_SEGMENT_PCT) spendPct = 100 - MIN_SEGMENT_PCT
  return [spendPct, 100 - spendPct]
}

export function BalanceHero({ account, loading, rate }: BalanceHeroProps) {
  const t = useT()
  const { locale, primaryCurrency } = useSettings()
  const secondaryCurrency = primaryCurrency === 'idr' ? 'usdc' : 'idr'
  const intl = locale === 'id' ? 'id-ID' : 'en-US'

  const primary = (amount: bigint): string => formatMoney(amount, primaryCurrency, rate, locale)
  const secondary = (amount: bigint): string =>
    formatMoney(amount, secondaryCurrency, rate, locale)

  if (loading || account === null) {
    return (
      <Card className="rounded-2xl shadow-none">
        <CardContent>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-10 w-48" />
          <Skeleton className="mt-2 h-4 w-32" />
          <div className="mt-6 flex justify-between">
            <Skeleton className="h-14 w-32" />
            <Skeleton className="h-14 w-32" />
          </div>
          <Skeleton className="mt-3 h-3 w-full rounded-full" />
        </CardContent>
      </Card>
    )
  }

  const total = account.spend + account.shares // shares valued 1:1 for the MVP
  const locked = Number(account.lockUntil) * 1000 > Date.now()
  const [spendPct, savePct] = segmentWidths(
    usdcToNumber(account.spend),
    usdcToNumber(account.shares),
  )

  return (
    <Card className="rounded-2xl shadow-none">
      <CardContent>
        <p className="text-sm text-muted-foreground">{t('balances.total')}</p>
        <div className="mt-1 flex items-baseline gap-2">
          {primaryCurrency === 'idr' ? (
            <>
              <span className="text-lg text-muted-foreground">Rp</span>
              <NumberTicker
                value={usdcToNumber(total) * rate}
                decimalPlaces={0}
                locale={intl}
                className="text-4xl font-semibold tracking-tight text-foreground tabular-nums"
              />
            </>
          ) : (
            <>
              <NumberTicker
                value={usdcToNumber(total)}
                decimalPlaces={2}
                locale={intl}
                className="text-4xl font-semibold tracking-tight text-foreground tabular-nums"
              />
              <span className="inline-flex items-center gap-1.5 text-lg text-muted-foreground">
                <TokenIcon token="usdc" size={18} />
                USDC
              </span>
            </>
          )}
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground tabular-nums">
          {secondaryCurrency === 'usdc' && <TokenIcon token="usdc" size={14} />}~{' '}
          {secondary(total)}
        </p>
        {primaryCurrency === 'idr' && (
          <p className="mt-1 text-xs text-muted-foreground">
            {t('balances.rateCaption', { rate: Math.round(rate).toLocaleString(intl) })}
          </p>
        )}
        <div className="mt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                <span className="size-2 rounded-full bg-sky-500 dark:bg-sky-400" />
                {t('balances.spendable')}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-lg font-semibold tracking-tight tabular-nums">
                <TokenIcon token="usdc" size={14} />
                {primary(account.spend)}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">
                ~ {secondary(account.spend)}
              </p>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end gap-1.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                {t('balances.savings')}
                <span className="size-2 rounded-full bg-amber-500 dark:bg-amber-400" />
              </p>
              <p className="mt-1 flex items-center justify-end gap-1.5 text-lg font-semibold tracking-tight tabular-nums">
                <TokenIcon token="usdc" size={14} />
                {primary(account.shares)}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">
                ~ {secondary(account.shares)}
              </p>
            </div>
          </div>
          <div className="mt-3 flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-muted">
            {spendPct > 0 && (
              <div
                className="rounded-full bg-sky-500 dark:bg-sky-400"
                style={{ width: `${spendPct}%` }}
              />
            )}
            {savePct > 0 && (
              <div
                className="rounded-full bg-amber-500 dark:bg-amber-400"
                style={{ width: `${savePct}%` }}
              />
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
            {locked && (
              <Badge variant="secondary" className="gap-1 text-xs">
                <LockIcon className="size-3" />
                {t('balances.lockedUntil', { date: formatDate(account.lockUntil, locale) })}
              </Badge>
            )}
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {t('balances.earningCaption')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
