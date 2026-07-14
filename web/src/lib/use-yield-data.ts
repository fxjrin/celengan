import { useCallback, useEffect, useRef, useState } from 'react'
import { getBlendSupplyApy, getSharePrice, getVaultStats, type VaultStats } from '@/lib/yield'

type YieldData = {
  sharePrice: bigint | null
  vaultStats: VaultStats
  blendApy: number | null
}

const EMPTY_STATS: VaultStats = { totalSupply: null, idle: null, invested: null }

export function useYieldData() {
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
