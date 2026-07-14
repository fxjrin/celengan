import { useCallback, useEffect, useRef, useState } from 'react'
import { RefreshCwIcon } from 'lucide-react'
import { ConnectPrompt } from '@/components/connect-prompt'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { YieldPositionCard } from '@/components/yield-position-card'
import { YieldSourcesCard } from '@/components/yield-sources-card'
import { useAppState } from '@/lib/app-state'
import { useT } from '@/lib/i18n'
import { useWallet } from '@/lib/wallet'
import { getBlendSupplyApy, getSharePrice, getVaultStats, type VaultStats } from '@/lib/yield'

type YieldData = {
  sharePrice: bigint | null
  vaultStats: VaultStats
  blendApy: number | null
}

const EMPTY_STATS: VaultStats = { totalSupply: null, idle: null, invested: null }

function useYieldData() {
  const [data, setData] = useState<YieldData>({
    sharePrice: null,
    vaultStats: EMPTY_STATS,
    blendApy: null,
  })
  const [loading, setLoading] = useState(true)
  // guards against an in-flight refresh overwriting a newer one's result
  const runId = useRef(0)

  const load = useCallback(async () => {
    const id = ++runId.current
    setLoading(true)
    const [sharePrice, vaultStats, blendApy] = await Promise.all([
      getSharePrice(),
      getVaultStats(),
      getBlendSupplyApy(),
    ])
    if (runId.current !== id) return
    setData({ sharePrice, vaultStats, blendApy })
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { data, loading, refresh: load }
}

export function YieldPage() {
  const { address } = useWallet()
  const { account, accountStatus, activity, rates } = useAppState()
  const { data, loading, refresh } = useYieldData()
  const t = useT()

  if (!address) return <ConnectPrompt />

  const tvl =
    data.vaultStats.idle !== null && data.vaultStats.invested !== null
      ? data.vaultStats.idle + data.vaultStats.invested
      : null

  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <PageHeader title={t('nav.yield')} caption={t('page.yieldCaption')} />
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={t('yield.refresh')}
          disabled={loading}
          onClick={() => void refresh()}
        >
          <RefreshCwIcon className={loading ? 'animate-spin' : ''} />
        </Button>
      </div>
      <YieldPositionCard
        account={account}
        activity={activity}
        sharePrice={data.sharePrice}
        loading={accountStatus === 'loading'}
        rates={rates}
      />
      <YieldSourcesCard blendApy={data.blendApy} tvl={tvl} loading={loading} rates={rates} />
    </section>
  )
}
