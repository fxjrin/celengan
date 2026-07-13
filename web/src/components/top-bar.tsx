import { Link } from 'react-router-dom'
import { PiggyBankIcon, SettingsIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConnectButton } from '@/components/connect-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useT } from '@/lib/i18n'
import { useSettings } from '@/lib/settings'

function SettingsMenu() {
  const t = useT()
  const { locale, setLocale, primaryCurrency, setPrimaryCurrency } = useSettings()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('topbar.settings')}>
          <SettingsIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('settings.language')}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(v) => {
            if (v === 'en' || v === 'id') setLocale(v)
          }}
        >
          <DropdownMenuRadioItem value="en">{t('settings.langEn')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="id">{t('settings.langId')}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t('settings.currency')}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={primaryCurrency}
          onValueChange={(v) => {
            if (v === 'idr' || v === 'usdc') setPrimaryCurrency(v)
          }}
        >
          <DropdownMenuRadioItem value="idr">{t('settings.currencyIdr')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="usdc">{t('settings.currencyUsdc')}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function TopBar() {
  const t = useT()

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <PiggyBankIcon className="size-5 text-primary" />
            <span className="text-lg font-semibold tracking-tight">celengan</span>
          </Link>
          <Badge variant="secondary">{t('topbar.testnet')}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <SettingsMenu />
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}
