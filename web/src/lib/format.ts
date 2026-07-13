const USDC_SCALE = 10_000_000n

export function parseUsdc(input: string): bigint {
  const trimmed = input.trim()
  if (!/^\d+(\.\d{1,7})?$/.test(trimmed)) throw new Error('Invalid amount')
  const [whole, frac = ''] = trimmed.split('.')
  return BigInt(whole) * USDC_SCALE + BigInt(frac.padEnd(7, '0'))
}

// plain decimal string that parseUsdc accepts, for prefilling inputs
export function usdcToInput(amount: bigint): string {
  const whole = (amount / USDC_SCALE).toString()
  const frac = (amount % USDC_SCALE).toString().padStart(7, '0').replace(/0+$/, '')
  return frac === '' ? whole : `${whole}.${frac}`
}

export function usdcToNumber(amount: bigint): number {
  return Number(amount) / 1e7
}
