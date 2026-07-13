import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatDate, useT } from '@/lib/i18n'
import { useSettings } from '@/lib/settings'

type LockCardProps = {
  lockUntil: bigint | null
  disabled: boolean
  saving: boolean
  onLock: (until: bigint) => void
}

export function LockCard({ lockUntil, disabled, saving, onLock }: LockCardProps) {
  const t = useT()
  const { locale } = useSettings()
  const [date, setDate] = useState('')
  const today = new Date().toISOString().slice(0, 10)
  const locked = lockUntil !== null && Number(lockUntil) * 1000 > Date.now()

  const handleLock = () => {
    onLock(BigInt(Math.floor(new Date(`${date}T00:00:00`).getTime() / 1000)))
  }

  return (
    <Card className="rounded-2xl shadow-none">
      <CardHeader>
        <CardTitle>{t('rules.lockTitle')}</CardTitle>
        <CardDescription>
          {locked && lockUntil !== null
            ? t('rules.lockedStatus', { date: formatDate(lockUntil, locale) })
            : t('rules.noLock')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <label className="text-sm font-medium" htmlFor="lock-date">
          {t('rules.lockLabel')}
        </label>
        <Input
          id="lock-date"
          type="date"
          className="mt-2"
          min={today}
          value={date}
          disabled={disabled}
          onChange={(e) => setDate(e.target.value)}
        />
        <p className="mt-2 text-xs text-muted-foreground">{t('rules.lockCaption')}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLock} disabled={disabled || saving || date === '' || date < today}>
          {saving ? `${t('common.loading')}...` : t('rules.lockButton')}
        </Button>
      </CardFooter>
    </Card>
  )
}
