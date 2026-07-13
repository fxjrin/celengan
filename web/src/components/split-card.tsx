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
import { Slider } from '@/components/ui/slider'
import { useT } from '@/lib/i18n'

type SplitCardProps = {
  splitBps: number | null
  disabled: boolean
  saving: boolean
  onSave: (bps: number) => void
}

export function SplitCard({ splitBps, disabled, saving, onSave }: SplitCardProps) {
  const t = useT()
  const [draft, setDraft] = useState<number | null>(null)
  const percent = draft ?? (splitBps !== null ? Math.round(splitBps / 100) : 20)
  const unchanged = splitBps !== null && percent * 100 === splitBps

  return (
    <Card className="rounded-2xl shadow-none">
      <CardHeader>
        <CardTitle>{t('rules.title')}</CardTitle>
        <CardDescription>{t('rules.splitCaption')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-3xl font-semibold tracking-tight tabular-nums">{percent}%</p>
        <Slider
          value={[percent]}
          min={0}
          max={100}
          step={1}
          disabled={disabled}
          onValueChange={(values) => setDraft(values[0])}
        />
        <p className="text-sm text-muted-foreground">
          {t('rules.splitSentence', { pct: percent })}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onSave(percent * 100)} disabled={disabled || saving || unchanged}>
          {saving ? `${t('common.loading')}...` : t('rules.saveButton')}
        </Button>
      </CardFooter>
    </Card>
  )
}
