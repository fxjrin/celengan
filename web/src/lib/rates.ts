export const FALLBACK_IDR_RATE = 16300

let cached: Promise<number> | null = null

async function fetchRate(): Promise<number> {
  const res = await fetch('https://open.er-api.com/v6/latest/USD')
  if (!res.ok) throw new Error(`Rate fetch failed: ${res.status}`)
  const data = (await res.json()) as { rates?: Record<string, number> }
  const idr = data.rates?.IDR
  if (typeof idr !== 'number' || idr <= 0) throw new Error('IDR rate missing')
  return idr
}

export function getUsdIdrRate(): Promise<number> {
  cached ??= fetchRate().catch(() => FALLBACK_IDR_RATE)
  return cached
}
