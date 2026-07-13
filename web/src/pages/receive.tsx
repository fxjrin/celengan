import { AccountPanel } from '@/components/account-panel'
import { ConnectPrompt } from '@/components/connect-prompt'
import { PageHeader } from '@/components/page-header'
import { ReceiveCard } from '@/components/receive-card'
import { useT } from '@/lib/i18n'
import { useFaucet } from '@/lib/use-faucet'
import { useWallet } from '@/lib/wallet'

export function ReceivePage() {
  const t = useT()
  const { address } = useWallet()
  const { runFaucet } = useFaucet()

  if (!address) return <ConnectPrompt />

  return (
    <section className="space-y-5">
      <PageHeader title={t('nav.receive')} caption={t('page.receiveCaption')} />
      <AccountPanel>
        {(account) => (
          <ReceiveCard account={account} showFaucetRow onFaucet={() => void runFaucet()} />
        )}
      </AccountPanel>
    </section>
  )
}
