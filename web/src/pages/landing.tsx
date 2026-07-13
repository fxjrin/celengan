import { Link } from 'react-router-dom'
import { LockKeyholeIcon, PiggyBankIcon, SplitIcon, SproutIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useT, type MessageKey } from '@/lib/i18n'

const features: { icon: typeof SplitIcon; title: MessageKey; body: MessageKey }[] = [
  { icon: SplitIcon, title: 'landing.feature1Title', body: 'landing.feature1Body' },
  { icon: SproutIcon, title: 'landing.feature2Title', body: 'landing.feature2Body' },
  { icon: LockKeyholeIcon, title: 'landing.feature3Title', body: 'landing.feature3Body' },
]

export function Landing() {
  const t = useT()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <PiggyBankIcon className="size-5 text-primary" />
          <span className="text-lg font-semibold tracking-tight">celengan</span>
        </div>
        <Badge variant="secondary">{t('topbar.testnet')}</Badge>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t('landing.heroTitle')}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          {t('landing.heroSubtitle')}
        </p>
        <Button asChild size="lg" className="mt-8 px-6">
          <Link to="/app">{t('landing.cta')}</Link>
        </Button>
        <div className="mt-14 grid w-full max-w-3xl gap-4 text-left sm:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="rounded-2xl shadow-none">
              <CardContent>
                <feature.icon className="size-5 text-primary" />
                <p className="mt-3 font-medium">{t(feature.title)}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t(feature.body)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <footer className="px-6 py-5 text-center text-sm text-muted-foreground">
        {t('landing.footer')}
      </footer>
    </div>
  )
}
