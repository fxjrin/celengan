import { useState } from 'react'
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
  MenuIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  WalletIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { LogoWordmark } from '@/components/brand/logo'
import { PaymentLinkDialog } from '@/components/payment-link-dialog'
import { SettingsDialog } from '@/components/settings-dialog'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { EXPLORER_CONTRACT_URL } from '@/lib/config'
import { errorKey } from '@/lib/errors'
import { useT, type MessageKey } from '@/lib/i18n'
import { useFaucet } from '@/lib/use-faucet'
import { cn } from '@/lib/utils'
import { useWallet } from '@/lib/wallet'

const ITEM =
  'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors'
const ITEM_IDLE = 'text-muted-foreground hover:bg-muted hover:text-foreground'
const ITEM_ACTIVE = 'bg-primary/10 text-primary'

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
  onOpenSettings: () => void
  onOpenPaymentLink: () => void
  onNavigate?: () => void
}

function SidebarContent({ onOpenSettings, onOpenPaymentLink, onNavigate }: SidebarContentProps) {
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
      <div className="px-3 pt-1 pb-2">
        <LogoWordmark />
      </div>
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
        <button
          type="button"
          data-slot="paylink-entry"
          className={cn(ITEM, ITEM_IDLE, 'disabled:pointer-events-none disabled:opacity-50')}
          disabled={!address}
          onClick={onOpenPaymentLink}
        >
          <LinkIcon className="size-4" />
          {t('nav.paymentLink')}
        </button>
        {!address && (
          <p className="px-3 pb-1 text-[11px] text-muted-foreground">{t('common.connectFirst')}</p>
        )}
        <SectionLabel>{t('nav.protocol')}</SectionLabel>
        <button type="button" className={cn(ITEM, ITEM_IDLE)} onClick={onOpenSettings}>
          <SettingsIcon className="size-4" />
          {t('settings.title')}
        </button>
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
      className="rounded-full border bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      onClick={() => void copy()}
    >
      {shortAddress(address)}
    </button>
  )
}

export function AppShell() {
  const t = useT()
  const { address } = useWallet()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [paylinkOpen, setPaylinkOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div className="min-h-svh">
      <aside className="fixed inset-y-4 left-4 z-40 hidden w-64 flex-col overflow-hidden rounded-3xl border bg-card shadow-lg shadow-stone-950/5 md:flex">
        <SidebarContent
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenPaymentLink={() => setPaylinkOpen(true)}
        />
      </aside>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur md:hidden">
        <LogoWordmark />
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('shell.openMenu')}>
              <MenuIcon className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72" aria-describedby={undefined}>
            <SheetTitle className="sr-only">{t('nav.menu')}</SheetTitle>
            <SidebarContent
              onOpenSettings={() => {
                setSheetOpen(false)
                setSettingsOpen(true)
              }}
              onOpenPaymentLink={() => {
                setSheetOpen(false)
                setPaylinkOpen(true)
              }}
              onNavigate={() => setSheetOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </header>
      <div className="md:pl-72">
        <main className="mx-auto w-full max-w-2xl px-4 py-8 md:py-10">
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
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <PaymentLinkDialog open={paylinkOpen} onOpenChange={setPaylinkOpen} />
    </div>
  )
}
