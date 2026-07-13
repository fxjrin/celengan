import { useCallback } from 'react'
import { useAppState } from '@/lib/app-state'
import { requestTestUsdc } from '@/lib/faucet'
import { useWallet } from '@/lib/wallet'
import { requireWalletBridge } from '@/lib/wallet-bridge'

export function faucetedFlag(address: string): boolean {
  return localStorage.getItem(`celengan:fauceted:${address}`) === '1'
}

export function useFaucet(): {
  faucetBusy: boolean
  anyBusy: boolean
  runFaucet: () => Promise<void>
} {
  const { address } = useWallet()
  const { busy, runAction } = useAppState()

  const runFaucet = useCallback(async () => {
    await runAction('faucet', 'faucet.success', async () => {
      await requestTestUsdc(requireWalletBridge())
      // flag before the refresh so the onboarding checklist ticks on the refresh render
      if (address) localStorage.setItem(`celengan:fauceted:${address}`, '1')
    })
  }, [address, runAction])

  return { faucetBusy: busy === 'faucet', anyBusy: busy !== null, runFaucet }
}
