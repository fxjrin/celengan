import { Link } from 'react-router-dom'
import { LockKeyholeIcon, PiggyBankIcon, SplitIcon, SproutIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: SplitIcon,
    title: 'Auto-split',
    text: 'Every incoming payment is split between spending and savings by a rule you set once.',
  },
  {
    icon: SproutIcon,
    title: 'Yield via DeFindex',
    text: 'The saved share goes straight into a DeFindex vault and starts earning yield.',
  },
  {
    icon: LockKeyholeIcon,
    title: 'Time-locked goals',
    text: 'Lock your savings until a date you choose, so the goal survives the temptation.',
  },
]

export function Landing() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <PiggyBankIcon className="size-5 text-primary" />
          <span className="text-lg font-semibold tracking-tight">celengan</span>
        </div>
        <Badge variant="secondary">Testnet MVP</Badge>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Setiap pembayaran masuk, langsung nabung.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Programmable savings on every payment, on Stellar.
        </p>
        <Button asChild size="lg" className="mt-8 px-6">
          <Link to="/app">Launch App</Link>
        </Button>
        <div className="mt-14 grid w-full max-w-3xl gap-4 text-left sm:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="rounded-2xl shadow-none">
              <CardContent>
                <feature.icon className="size-5 text-primary" />
                <p className="mt-3 font-medium">{feature.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{feature.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <footer className="px-6 py-5 text-center text-sm text-muted-foreground">
        Built by Cyphras Labs for the APAC Stellar Hackathon
      </footer>
    </div>
  )
}
