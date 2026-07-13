import { Link } from 'react-router-dom'
import { PiggyBankIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ConnectButton } from '@/components/connect-button'

export function TopBar() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <PiggyBankIcon className="size-5 text-primary" />
            <span className="text-lg font-semibold tracking-tight">celengan</span>
          </Link>
          <Badge variant="secondary">Testnet</Badge>
        </div>
        <ConnectButton />
      </div>
    </header>
  )
}
