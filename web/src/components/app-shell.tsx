import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useTheme } from 'next-themes'
import {
  ActivityIcon,
  CoinsIcon,
  ExternalLinkIcon,
  LayoutDashboardIcon,
  LinkIcon,
  Loader2Icon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  WalletIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { AddressAvatar } from '@/components/brand/address-avatar'
import { FloatingDeco } from '@/components/brand/floating-deco'
import { LogoMark, LogoWordmark } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { EXPLORER_CONTRACT_URL } from '@/lib/config'
import { errorKey } from '@/lib/errors'
import { useT, type MessageKey } from '@/lib/i18n'
import { useFaucet } from '@/lib/use-faucet'
import { cn } from '@/lib/utils'
import { useWallet } from '@/lib/wallet'

const ITEM =
  'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
const ITEM_IDLE = 'text-muted-foreground hover:bg-muted hover:text-foreground'
const ITEM_ACTIVE = 'bg-primary/10 text-primary'

// long enough to cross the gap between edge, toggle, and panel without flicker
const CLOSE_DELAY_MS = 200

function shortAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

function greetingKey(hour: number): MessageKey {
  if (hour >= 5 && hour < 12) return 'greeting.morning'
  if (hour >= 12 && hour < 17) return 'greeting.afternoon'
  if (hour >= 17 && hour < 21) return 'greeting.evening'
  return 'greeting.night'
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="px-3 pt-5 pb-1.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
      {children}
    </p>
  )
}

type SidebarContentProps = {
  withHeader?: boolean
  onNavigate?: () => void
}

function SidebarContent({ withHeader = false, onNavigate }: SidebarContentProps) {
  const t = useT()
  const { address, connecting, connect, disconnect } = useWallet()
  const { faucetBusy, anyBusy, runFaucet } = useFaucet()

  const handleConnect = async () => {
    try {
      await connect()
    } catch (e) {
      const key = errorKey(e)
      if (key === 'errors.walletCancelled') return // user closed the modal on purpose
      toast.error(t(key))
    }
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    cn(ITEM, isActive ? ITEM_ACTIVE : ITEM_IDLE)

  return (
    <div className="flex h-full flex-col p-4">
      {withHeader && (
        <div className="px-3 pt-1 pb-2">
          <LogoWordmark />
        </div>
      )}
      <nav className="min-h-0 flex-1 overflow-y-auto">
        <SectionLabel>{t('nav.menu')}</SectionLabel>
        <NavLink to="/app" end onClick={onNavigate} className={navClass}>
          <LayoutDashboardIcon className="size-4" />
          {t('nav.dashboard')}
        </NavLink>
        <NavLink to="/app/activity" onClick={onNavigate} className={navClass}>
          <ActivityIcon className="size-4" />
          {t('nav.activity')}
        </NavLink>
        <SectionLabel>{t('nav.action')}</SectionLabel>
        <NavLink to="/app/link" onClick={onNavigate} className={navClass}>
          <LinkIcon className="size-4" />
          {t('nav.paymentLink')}
        </NavLink>
        <button
          type="button"
          className={cn(ITEM, ITEM_IDLE, 'disabled:pointer-events-none disabled:opacity-50')}
          disabled={anyBusy}
          onClick={() => void runFaucet()}
        >
          {faucetBusy ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <CoinsIcon className="size-4" />
          )}
          {faucetBusy ? `${t('common.loading')}...` : t('nav.faucet')}
        </button>
        <SectionLabel>{t('nav.protocol')}</SectionLabel>
        <NavLink to="/app/settings" onClick={onNavigate} className={navClass}>
          <SettingsIcon className="size-4" />
          {t('settings.title')}
        </NavLink>
        <a
          href={EXPLORER_CONTRACT_URL}
          target="_blank"
          rel="noreferrer"
          className={cn(ITEM, ITEM_IDLE)}
        >
          <ExternalLinkIcon className="size-4" />
          {t('nav.viewContract')}
        </a>
      </nav>
      <div className="mt-2 border-t pt-2">
        {address ? (
          <button
            type="button"
            className={cn(ITEM, 'text-destructive hover:bg-destructive/10 hover:text-destructive')}
            onClick={() => void disconnect()}
          >
            <LogOutIcon className="size-4" />
            {t('nav.disconnect')}
          </button>
        ) : (
          <button
            type="button"
            className={cn(
              ITEM,
              'text-primary hover:bg-primary/10 disabled:pointer-events-none disabled:opacity-50',
            )}
            disabled={connecting}
            onClick={() => void handleConnect()}
          >
            <WalletIcon className="size-4" />
            {connecting ? `${t('topbar.connecting')}...` : t('topbar.connect')}
          </button>
        )}
      </div>
    </div>
  )
}

function ThemeToggle() {
  const t = useT()
  const { resolvedTheme, setTheme } = useTheme()
  const dark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t('shell.theme')}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
    >
      {dark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </Button>
  )
}

function AddressChip({ address }: { address: string }) {
  const t = useT()

  const copy = async () => {
    await navigator.clipboard.writeText(address)
    toast.success(t('settings.copied'))
  }

  return (
    <button
      type="button"
      aria-label={t('shell.copyAddress')}
      className="flex items-center gap-2 rounded-full border bg-card py-1 pr-3 pl-1 font-mono text-xs text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      onClick={() => void copy()}
    >
      <AddressAvatar address={address} size={24} className="rounded-full" />
      {shortAddress(address)}
    </button>
  )
}

function isDesktop(): boolean {
  return window.matchMedia('(min-width: 768px)').matches
}

export function AppShell() {
  const t = useT()
  const { address } = useWallet()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const closeTimer = useRef<number | null>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const reveal = useCallback(() => {
    cancelClose()
    setSidebarOpen(true)
  }, [cancelClose])

  const scheduleHide = useCallback(() => {
    cancelClose()
    closeTimer.current = window.setTimeout(() => setSidebarOpen(false), CLOSE_DELAY_MS)
  }, [cancelClose])

  useEffect(() => cancelClose, [cancelClose])

  useEffect(() => {
    if (!sidebarOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setSidebarOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [sidebarOpen])

  // touch taps fire hover events right before click, which would open the
  // sidebar and let the click toggle it straight back closed
  const handleHoverReveal = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && isDesktop()) reveal()
  }

  const handleHoverHide = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') scheduleHide()
  }

  const handleToggle = () => {
    if (isDesktop()) {
      cancelClose()
      setSidebarOpen((open) => !open)
    } else {
      setSheetOpen(true)
    }
  }

  return (
    <div className="relative min-h-svh">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <FloatingDeco side="both" className="opacity-40" />
      </div>
      {/* invisible strip that reveals the sidebar when the cursor nears the left edge */}
      <div
        className="fixed inset-y-0 left-0 z-30 hidden w-4 md:block"
        onPointerEnter={handleHoverReveal}
        onPointerLeave={handleHoverHide}
      />
      <button
        ref={toggleRef}
        type="button"
        aria-label={t('shell.openMenu')}
        aria-expanded={sidebarOpen || sheetOpen}
        aria-controls="app-sidebar"
        className="fixed top-4 left-4 z-50 flex size-10 items-center justify-center rounded-xl border bg-card shadow-sm outline-none transition-shadow hover:shadow-md focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        onPointerEnter={handleHoverReveal}
        onPointerLeave={handleHoverHide}
        onClick={handleToggle}
      >
        <LogoMark size={22} />
      </button>
      <aside
        id="app-sidebar"
        inert={!sidebarOpen}
        className={cn(
          'fixed top-16 bottom-4 left-4 z-40 hidden w-64 flex-col overflow-hidden rounded-2xl border bg-card shadow-lg shadow-stone-950/10 transition-transform duration-200 ease-out md:flex',
          sidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2.5rem)]',
        )}
        onPointerEnter={handleHoverReveal}
        onPointerLeave={handleHoverHide}
      >
        <SidebarContent onNavigate={() => setSidebarOpen(false)} />
      </aside>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="left"
          className="w-72"
          closeLabel={t('common.close')}
          aria-describedby={undefined}
        >
          <SheetTitle className="sr-only">{t('nav.menu')}</SheetTitle>
          <SidebarContent withHeader onNavigate={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>
      <main className="relative z-10 mx-auto w-full max-w-2xl px-4 pt-16 pb-12">
        <div className="mb-8 flex items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            {t(greetingKey(new Date().getHours()))}
          </h1>
          <div className="flex items-center gap-2">
            {address && <AddressChip address={address} />}
            <ThemeToggle />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
