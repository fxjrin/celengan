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

type ActionsCardProps = {
  disabled: boolean
  busy: string | null
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
  onSubmit,
}: ActionRowProps) {
  const [value, setValue] = useState('')

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
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          onClick={() => void handleSubmit()}
          disabled={disabled || busy || value.trim() === ''}
        >
          {busy ? busyLabel : buttonLabel}
        </Button>
      </div>
    </div>
  )
}

export function ActionsCard({
  disabled,
  busy,
  onPay,
  onWithdrawSpend,
  onWithdrawSavings,
}: ActionsCardProps) {
  const anyBusy = busy !== null

  return (
    <Card className="rounded-2xl shadow-none">
      <CardHeader>
        <CardTitle>Actions</CardTitle>
        <CardDescription>Try the flow with testnet USDC</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ActionRow
          title="Simulate incoming payment"
          caption="A demo payer sends USDC to your account"
          buttonLabel="Pay"
          busyLabel="Paying..."
          placeholder="25.00"
          disabled={disabled || anyBusy}
          busy={busy === 'pay'}
          onSubmit={onPay}
        />
        <Separator />
        <ActionRow
          title="Withdraw spendable"
          caption="Move USDC out of your spendable balance"
          buttonLabel="Withdraw"
          busyLabel="Withdrawing..."
          placeholder="10.00"
          disabled={disabled || anyBusy}
          busy={busy === 'spend'}
          onSubmit={onWithdrawSpend}
        />
        <Separator />
        <ActionRow
          title="Withdraw savings"
          caption="Redeem vault shares back to USDC"
          buttonLabel="Withdraw"
          busyLabel="Withdrawing..."
          placeholder="5.00"
          disabled={disabled || anyBusy}
          busy={busy === 'savings'}
          onSubmit={onWithdrawSavings}
        />
      </CardContent>
    </Card>
  )
}
