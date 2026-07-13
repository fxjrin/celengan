import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { errorMessage } from '@/lib/errors'
import { useWallet } from '@/lib/wallet'

function shortAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function ConnectButton() {
  const { address, connecting, connect, disconnect } = useWallet()

  const handleConnect = async () => {
    try {
      await connect()
    } catch (e) {
      const message = errorMessage(e)
      if (message.includes('closed the modal')) return
      toast.error(message)
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
      {connecting ? 'Connecting...' : 'Connect wallet'}
    </Button>
  )
}
