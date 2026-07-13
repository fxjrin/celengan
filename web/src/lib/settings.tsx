import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Locale = 'en' | 'id'
export type PrimaryCurrency = 'idr' | 'usdc'

type SettingsContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  primaryCurrency: PrimaryCurrency
  setPrimaryCurrency: (currency: PrimaryCurrency) => void
}

const LOCALE_KEY = 'celengan:locale'
const CURRENCY_KEY = 'celengan:currency'

const SettingsContext = createContext<SettingsContextValue | null>(null)

function initialLocale(): Locale {
  const stored = localStorage.getItem(LOCALE_KEY)
  if (stored === 'en' || stored === 'id') return stored
  return navigator.language.startsWith('id') ? 'id' : 'en'
}

function initialCurrency(): PrimaryCurrency {
  const stored = localStorage.getItem(CURRENCY_KEY)
  if (stored === 'idr' || stored === 'usdc') return stored
  return 'idr'
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [primaryCurrency, setCurrencyState] = useState<PrimaryCurrency>(initialCurrency)

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem(LOCALE_KEY, next)
    setLocaleState(next)
  }, [])

  const setPrimaryCurrency = useCallback((next: PrimaryCurrency) => {
    localStorage.setItem(CURRENCY_KEY, next)
    setCurrencyState(next)
  }, [])

  const value = useMemo(
    () => ({ locale, setLocale, primaryCurrency, setPrimaryCurrency }),
    [locale, setLocale, primaryCurrency, setPrimaryCurrency],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
