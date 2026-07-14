import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getBlendSupplyApy,
  getSharePrice,
  getSoroswapStats,
  getVaultStats,
  type SoroswapStats,
  type VaultStats,
} from '@/lib/yield'

type YieldData = {
  sharePrice: bigint | null
  vaultStats: VaultStats
  blendApy: number | null
  soroswapStats: SoroswapStats
}

const EMPTY_STATS: VaultStats = { totalSupply: null, idle: null, invested: null }
const EMPTY_SOROSWAP_STATS: SoroswapStats = { apy: null, tvl: null }

export function useYieldData() {
  const [data, setData] = useState<YieldData>({
    sharePrice: null,
    vaultStats: EMPTY_STATS,
    blendApy: null,
    soroswapStats: EMPTY_SOROSWAP_STATS,
  })
  const [loading, setLoading] = useState(true)
  // guards against an in-flight refresh overwriting a newer one's result
  const runId = useRef(0)

  const load = useCallback(async () => {
    const id = ++runId.current
    setLoading(true)
    const [sharePrice, vaultStats, blendApy, soroswapStats] = await Promise.all([
      getSharePrice(),
      getVaultStats(),
      getBlendSupplyApy(),
      getSoroswapStats(),
    ])
    if (runId.current !== id) return
    setData({ sharePrice, vaultStats, blendApy, soroswapStats })
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { data, loading, refresh: load }
}
