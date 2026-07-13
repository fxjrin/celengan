import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { NETWORK_PASSPHRASE } from '@/lib/config'

type Kit = typeof import('@creit-tech/stellar-wallets-kit').StellarWalletsKit

type WalletContextValue = {
  address: string | null
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  signTransaction: (xdr: string) => Promise<string>
}

const WalletContext = createContext<WalletContextValue | null>(null)

let kitPromise: Promise<Kit> | null = null

// lazy so the app renders even if no wallet extension exists or the kit fails to load
function loadKit(): Promise<Kit> {
  kitPromise ??= (async () => {
    const [{ StellarWalletsKit, Networks }, { defaultModules }] = await Promise.all([
      import('@creit-tech/stellar-wallets-kit'),
      import('@creit-tech/stellar-wallets-kit/modules/utils'),
    ])
    StellarWalletsKit.init({ modules: defaultModules(), network: Networks.TESTNET })
    return StellarWalletsKit
  })()
  return kitPromise
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)

  const connect = useCallback(async () => {
    setConnecting(true)
    try {
      const kit = await loadKit()
      const result = await kit.authModal()
      setAddress(result.address)
    } finally {
      setConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    setAddress(null)
    try {
      const kit = await loadKit()
      await kit.disconnect()
    } catch {
      // local state is already cleared; kit cleanup is best-effort
    }
  }, [])

  const signTransaction = useCallback(
    async (xdr: string) => {
      if (!address) throw new Error('Wallet not connected')
      const kit = await loadKit()
      const { signedTxXdr } = await kit.signTransaction(xdr, {
        networkPassphrase: NETWORK_PASSPHRASE,
        address,
      })
      return signedTxXdr
    },
    [address],
  )

  const value = useMemo(
    () => ({ address, connecting, connect, disconnect, signTransaction }),
    [address, connecting, connect, disconnect, signTransaction],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
