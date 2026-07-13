import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PiggyBankIcon, SettingsIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConnectButton } from '@/components/connect-button'
import { SettingsDialog } from '@/components/settings-dialog'
import { useT } from '@/lib/i18n'

export function TopBar() {
  const t = useT()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <PiggyBankIcon className="size-5 text-primary" />
            <span className="text-lg font-semibold tracking-tight">celengan</span>
          </Link>
          <Badge variant="secondary">{t('topbar.testnet')}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('topbar.settings')}
            onClick={() => setSettingsOpen(true)}
          >
            <SettingsIcon className="size-4" />
          </Button>
          <ConnectButton />
        </div>
      </div>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  )
}
