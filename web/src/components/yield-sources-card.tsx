import type { ComponentType } from 'react'
import { ArrowLeftRightIcon, CoinsIcon, LandmarkIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatMoney, intlLocale, useT, type MessageKey } from '@/lib/i18n'
import type { FxRates } from '@/lib/rates'
import { useSettings } from '@/lib/settings'

type YieldSourcesCardProps = {
  blendApy: number | null
  tvl: bigint | null
  loading: boolean
  rates: FxRates
}

type SourceRow = {
  key: string
  icon: ComponentType<{ className?: string }>
  name: MessageKey
  route: MessageKey
  badge: 'active' | 'soon'
  apy: number | null
  tvl: bigint | null
}

function formatApy(value: number | null, locale: string): string {
  if (value === null) return '-'
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function YieldSourcesCard({ blendApy, tvl, loading, rates }: YieldSourcesCardProps) {
  const t = useT()
  const { locale, primaryCurrency } = useSettings()
  const intl = intlLocale(locale)

  const sources: SourceRow[] = [
    {
      key: 'defindex',
      icon: LandmarkIcon,
      name: 'yield.sourceDefindexName',
      route: 'yield.sourceDefindexRoute',
      badge: 'active',
      apy: blendApy,
      tvl,
    },
    {
      key: 'blend',
      icon: CoinsIcon,
      name: 'yield.sourceBlendName',
      route: 'yield.sourceBlendRoute',
      badge: 'soon',
      apy: blendApy,
      tvl: null,
    },
    {
      key: 'soroswap',
      icon: ArrowLeftRightIcon,
      name: 'yield.sourceSoroswapName',
      route: 'yield.sourceSoroswapRoute',
      badge: 'soon',
      apy: null,
      tvl: null,
    },
  ]

  const bestApy = sources.reduce<number | null>(
    (best, source) => (source.apy !== null && (best === null || source.apy > best) ? source.apy : best),
    null,
  )

  return (
    <Card className="rounded-2xl shadow-none">
      <CardHeader>
        <CardTitle>{t('yield.sourcesTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : (
          <ul className="-mx-2 space-y-1">
            {sources.map((source) => {
              const Icon = source.icon
              const isBest = bestApy !== null && source.apy === bestApy
              return (
                <li
                  key={source.key}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <Icon className="size-4 text-muted-foreground" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-1.5 font-medium">
                      {t(source.name)}
                      <Badge variant={source.badge === 'active' ? 'default' : 'outline'}>
                        {t(source.badge === 'active' ? 'yield.badgeActive' : 'yield.badgeSoon')}
                      </Badge>
                      {isBest && (
                        <Badge variant="secondary" className="bg-gold/15 text-gold-ink">
                          {t('yield.bestYield')}
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{t(source.route)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold tabular-nums">
                      {formatApy(source.apy, intl)}{' '}
                      <span className="text-xs font-normal text-muted-foreground">
                        {t('yield.apyLabel')}
                      </span>
                    </p>
                    {source.tvl !== null && (
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {formatMoney(source.tvl, primaryCurrency, rates, locale)} {t('yield.tvlLabel')}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted-foreground">{t('yield.sourcesCaption')}</p>
      </CardContent>
    </Card>
  )
}
