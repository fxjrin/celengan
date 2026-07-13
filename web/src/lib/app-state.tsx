import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import { fetchActivity, type ActivityItem } from '@/lib/activity'
import { celengan } from '@/lib/celengan'
import { errorKey } from '@/lib/errors'
import { useT, type MessageKey } from '@/lib/i18n'
import { FALLBACK_IDR_RATE, getUsdIdrRate } from '@/lib/rates'
import type { CelenganAccount } from '@/lib/types'
import { useWallet } from '@/lib/wallet'

type AccountStatus = 'disconnected' | 'loading' | 'ready' | 'error'

type AppStateValue = {
  account: CelenganAccount | null
  accountStatus: AccountStatus
  rate: number
  activity: ActivityItem[]
  activityLoading: boolean
  busy: string | null
  refresh: () => Promise<void>
  runAction: (key: string, successKey: MessageKey, fn: () => Promise<void>) => Promise<boolean>
}

const AppStateContext = createContext<AppStateValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const { address } = useWallet()
  const t = useT()
  const [account, setAccount] = useState<CelenganAccount | null>(null)
  const [accountStatus, setAccountStatus] = useState<AccountStatus>('disconnected')
  const [rate, setRate] = useState(FALLBACK_IDR_RATE)
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [activityLoading, setActivityLoading] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const addressRef = useRef(address)

  useEffect(() => {
    void getUsdIdrRate().then(setRate)
  }, [])

  const load = useCallback(async (addr: string, initial: boolean) => {
    if (initial) {
      setAccount(null)
      setAccountStatus('loading')
      setActivity([])
      setActivityLoading(true)
    }
    const [accountResult, activityResult] = await Promise.allSettled([
      celengan.getAccount(addr),
      fetchActivity(addr),
    ])
    if (addressRef.current !== addr) return
    if (accountResult.status === 'fulfilled') {
      setAccount(accountResult.value)
      setAccountStatus('ready')
    } else {
      setAccount(null)
      setAccountStatus('error')
    }
    if (activityResult.status === 'fulfilled') setActivity(activityResult.value)
    setActivityLoading(false)
  }, [])

  useEffect(() => {
    addressRef.current = address
    if (!address) {
      setAccount(null)
      setAccountStatus('disconnected')
      setActivity([])
      setActivityLoading(false)
      setBusy(null)
      return
    }
    void load(address, true)
  }, [address, load])

  const refresh = useCallback(async () => {
    if (addressRef.current) await load(addressRef.current, false)
  }, [load])

  const runAction = useCallback(
    async (key: string, successKey: MessageKey, fn: () => Promise<void>): Promise<boolean> => {
      if (!address) {
        toast.error(t('common.connectFirst'))
        return false
      }
      setBusy(key)
      try {
        await fn()
        await load(address, false)
        toast.success(t(successKey))
        return true
      } catch (e) {
        toast.error(t(errorKey(e)))
        return false
      } finally {
        setBusy(null)
      }
    },
    [address, load, t],
  )

  const value = useMemo(
    () => ({
      account,
      accountStatus,
      rate,
      activity,
      activityLoading,
      busy,
      refresh,
      runAction,
    }),
    [account, accountStatus, rate, activity, activityLoading, busy, refresh, runAction],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
