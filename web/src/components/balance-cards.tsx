import { Card, CardContent } from '@/components/ui/card'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Skeleton } from '@/components/ui/skeleton'
import { formatIdr, usdcToNumber } from '@/lib/format'
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
}

function BalanceCard({ label, amount, loading, rate, caption }: BalanceCardProps) {
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
              <NumberTicker
                value={usdcToNumber(amount)}
                decimalPlaces={2}
                className="text-3xl font-semibold tracking-tight text-foreground tabular-nums"
              />
              <span className="text-sm text-muted-foreground">USDC</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground tabular-nums">
              ~ {formatIdr(amount, rate)} (estimated rate)
            </p>
          </>
        ) : (
          <>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-muted-foreground/50">--</p>
            <p className="mt-1 text-sm text-muted-foreground">Connect a wallet to load balances</p>
          </>
        )}
        {caption && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {caption}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function BalanceCards({ account, loading, rate }: BalanceCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <BalanceCard
        label="Spendable"
        amount={account ? account.spend : null}
        loading={loading}
        rate={rate}
      />
      <BalanceCard
        label="Savings"
        amount={account ? account.shares : null}
        loading={loading}
        rate={rate}
        caption="earning yield in DeFindex vault"
      />
    </div>
  )
}
