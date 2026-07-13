import { LockIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Skeleton } from '@/components/ui/skeleton'
import { usdcToNumber } from '@/lib/format'
import { formatDate, formatMoney, useT } from '@/lib/i18n'
import { useSettings } from '@/lib/settings'
import type { CelenganAccount } from '@/lib/types'

type BalanceHeroProps = {
  account: CelenganAccount | null
  loading: boolean
  rate: number
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
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const total = account.spend + account.shares // shares valued 1:1 for the MVP
  const locked = Number(account.lockUntil) * 1000 > Date.now()

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
              <span className="text-lg text-muted-foreground">USDC</span>
            </>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground tabular-nums">~ {secondary(total)}</p>
        {primaryCurrency === 'idr' && (
          <p className="mt-1 text-xs text-muted-foreground">
            {t('balances.rateCaption', { rate: Math.round(rate).toLocaleString(intl) })}
          </p>
        )}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">{t('balances.spendable')}</p>
            <p className="mt-1 text-lg font-semibold tracking-tight tabular-nums">
              {primary(account.spend)}
            </p>
            <p className="text-xs text-muted-foreground tabular-nums">
              ~ {secondary(account.spend)}
            </p>
          </div>
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">{t('balances.savings')}</p>
              {locked && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <LockIcon className="size-3" />
                  {t('balances.lockedUntil', { date: formatDate(account.lockUntil, locale) })}
                </Badge>
              )}
            </div>
            <p className="mt-1 text-lg font-semibold tracking-tight tabular-nums">
              {primary(account.shares)}
            </p>
            <p className="text-xs text-muted-foreground tabular-nums">
              ~ {secondary(account.shares)}
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {t('balances.earningCaption')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
