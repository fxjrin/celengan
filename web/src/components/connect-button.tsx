import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { errorKey } from '@/lib/errors'
import { useT } from '@/lib/i18n'
import { useWallet } from '@/lib/wallet'

function shortAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function ConnectButton() {
  const t = useT()
  const { address, connecting, connect, disconnect } = useWallet()

  const handleConnect = async () => {
    try {
      await connect()
    } catch (e) {
      const key = errorKey(e)
      if (key === 'errors.walletCancelled') return // user closed the modal on purpose
      toast.error(t(key))
    }
  }

  if (address) {
    return (
      <Button variant="outline" className="tabular-nums" onClick={() => void disconnect()}>
        {shortAddress(address)}
      </Button>
    )
  }

  return (
    <Button onClick={() => void handleConnect()} disabled={connecting}>
      {connecting ? `${t('topbar.connecting')}...` : t('topbar.connect')}
    </Button>
  )
}
