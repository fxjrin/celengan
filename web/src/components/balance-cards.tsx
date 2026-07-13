import { Card, CardContent } from '@/components/ui/card'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Skeleton } from '@/components/ui/skeleton'
import { usdcToNumber } from '@/lib/format'
import { formatDate, formatMoney, useT } from '@/lib/i18n'
import { useSettings } from '@/lib/settings'
import type { CelenganAccount } from '@/lib/types'

type BalanceCardsProps = {
  account: CelenganAccount | null
  loading: boolean
  rate: number
}

type BalanceCardProps = {
  label: string
  amount: bigint | null
  loading: boolean
  rate: number
  caption?: string
  extra?: string
}

function BalanceCard({ label, amount, loading, rate, caption, extra }: BalanceCardProps) {
  const t = useT()
  const { locale, primaryCurrency } = useSettings()

  return (
    <Card className="rounded-2xl shadow-none">
      <CardContent>
        <p className="text-sm text-muted-foreground">{label}</p>
        {loading ? (
          <div className="mt-2 space-y-2">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-4 w-48" />
          </div>
        ) : amount !== null ? (
          <>
            <div className="mt-1 flex items-baseline gap-2">
              {primaryCurrency === 'idr' ? (
                <>
                  <span className="text-sm text-muted-foreground">Rp</span>
                  <NumberTicker
                    value={usdcToNumber(amount) * rate}
                    decimalPlaces={0}
                    className="text-3xl font-semibold tracking-tight text-foreground tabular-nums"
                  />
                </>
              ) : (
                <>
                  <NumberTicker
                    value={usdcToNumber(amount)}
                    decimalPlaces={2}
                    className="text-3xl font-semibold tracking-tight text-foreground tabular-nums"
                  />
                  <span className="text-sm text-muted-foreground">USDC</span>
                </>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground tabular-nums">
              ~ {formatMoney(amount, primaryCurrency === 'idr' ? 'usdc' : 'idr', rate, locale)}
            </p>
          </>
        ) : (
          <>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-muted-foreground/50">--</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('balances.connectPrompt')}</p>
          </>
        )}
        {caption && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {caption}
          </p>
        )}
        {extra && <p className="mt-1 text-xs text-muted-foreground">{extra}</p>}
      </CardContent>
    </Card>
  )
}

export function BalanceCards({ account, loading, rate }: BalanceCardsProps) {
  const t = useT()
  const { locale } = useSettings()
  const locked =
    account !== null && Number(account.lockUntil) * 1000 > Date.now()

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <BalanceCard
        label={t('balances.spendable')}
        amount={account ? account.spend : null}
        loading={loading}
        rate={rate}
      />
      <BalanceCard
        label={t('balances.savings')}
        amount={account ? account.shares : null}
        loading={loading}
        rate={rate}
        caption={t('balances.earningCaption')}
        extra={
          locked && account
            ? t('balances.lockedUntil', { date: formatDate(account.lockUntil, locale) })
            : undefined
        }
      />
    </div>
  )
}
