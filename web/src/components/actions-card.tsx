import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useAppState } from '@/lib/app-state'
import { parseUsdc } from '@/lib/format'
import { formatDate, formatMoney, useT } from '@/lib/i18n'
import { useSettings } from '@/lib/settings'

type ActionsCardProps = {
  disabled: boolean
  busy: string | null
  onFaucet: () => Promise<boolean>
  onPay: (amount: string) => Promise<boolean>
  onWithdrawSpend: (amount: string) => Promise<boolean>
  onWithdrawSavings: (shares: string) => Promise<boolean>
}

type ActionRowProps = {
  title: string
  caption: string
  buttonLabel: string
  busyLabel: string
  placeholder: string
  disabled: boolean
  busy: boolean
  disabledReason?: string
  hint?: (value: string) => string | null
  onSubmit: (value: string) => Promise<boolean>
}

function ActionRow({
  title,
  caption,
  buttonLabel,
  busyLabel,
  placeholder,
  disabled,
  busy,
  disabledReason,
  hint,
  onSubmit,
}: ActionRowProps) {
  const [value, setValue] = useState('')
  const hintText = hint ? hint(value) : null
  const blocked = disabledReason !== undefined

  const handleSubmit = async () => {
    if (await onSubmit(value)) setValue('')
  }

  return (
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{caption}</p>
      <div className="mt-2 flex gap-2">
        <Input
          value={value}
          placeholder={placeholder}
          inputMode="decimal"
          className="tabular-nums"
          disabled={disabled || blocked}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          onClick={() => void handleSubmit()}
          disabled={disabled || busy || blocked || value.trim() === ''}
        >
          {busy ? busyLabel : buttonLabel}
        </Button>
      </div>
      {disabledReason !== undefined ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{disabledReason}</p>
      ) : (
        hintText !== null && <p className="mt-1.5 text-xs text-muted-foreground">{hintText}</p>
      )}
    </div>
  )
}

export function ActionsCard({
  disabled,
  busy,
  onFaucet,
  onPay,
  onWithdrawSpend,
  onWithdrawSavings,
}: ActionsCardProps) {
  const t = useT()
  const { account, rate } = useAppState()
  const { locale, primaryCurrency } = useSettings()
  const anyBusy = busy !== null
  const busyLabel = `${t('common.loading')}...`

  const payHint = (value: string): string | null => {
    if (!account || value.trim() === '') return null
    let amount: bigint
    try {
      amount = parseUsdc(value)
    } catch {
      return null
    }
    const saved = (amount * BigInt(account.splitBps)) / 10_000n
    return t('receive.preview', {
      spend: formatMoney(amount - saved, primaryCurrency, rate, locale),
      save: formatMoney(saved, primaryCurrency, rate, locale),
    })
  }

  const savingsLocked =
    account !== null && Number(account.lockUntil) * 1000 > Date.now()
  const lockedReason =
    savingsLocked && account
      ? t('withdraw.lockedReason', { date: formatDate(account.lockUntil, locale) })
      : undefined

  return (
    <Card className="rounded-2xl shadow-none">
      <CardHeader>
        <CardTitle>{t('actions.title')}</CardTitle>
        <CardDescription>{t('actions.caption')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium">{t('faucet.title')}</p>
            <p className="text-xs text-muted-foreground">{t('faucet.caption')}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => void onFaucet()}
            disabled={disabled || anyBusy}
          >
            {busy === 'faucet' ? busyLabel : t('faucet.button')}
          </Button>
        </div>
        <Separator />
        <ActionRow
          title={t('receive.title')}
          caption={t('receive.caption')}
          buttonLabel={t('receive.button')}
          busyLabel={busyLabel}
          placeholder={t('receive.amountPlaceholder')}
          disabled={disabled || anyBusy}
          busy={busy === 'pay'}
          hint={payHint}
          onSubmit={onPay}
        />
        <Separator />
        <ActionRow
          title={t('withdraw.spendTitle')}
          caption={t('withdraw.spendCaption')}
          buttonLabel={t('withdraw.button')}
          busyLabel={busyLabel}
          placeholder={t('receive.amountPlaceholder')}
          disabled={disabled || anyBusy}
          busy={busy === 'spend'}
          onSubmit={onWithdrawSpend}
        />
        <Separator />
        <ActionRow
          title={t('withdraw.saveTitle')}
          caption={t('withdraw.sharesHint')}
          buttonLabel={t('withdraw.button')}
          busyLabel={busyLabel}
          placeholder={t('receive.amountPlaceholder')}
          disabled={disabled || anyBusy}
          busy={busy === 'savings'}
          disabledReason={lockedReason}
          onSubmit={onWithdrawSavings}
        />
      </CardContent>
    </Card>
  )
}
