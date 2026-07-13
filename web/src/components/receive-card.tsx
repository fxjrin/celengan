import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Link2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { TokenIcon } from '@/components/brand/token-icon'
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
import { useAppState } from '@/lib/app-state'
import { celengan } from '@/lib/celengan'
import { parseUsdc } from '@/lib/format'
import { formatMoney, useT } from '@/lib/i18n'
import { useSettings } from '@/lib/settings'
import type { CelenganAccount } from '@/lib/types'
import { useWallet } from '@/lib/wallet'

const QUICK_AMOUNTS = ['25', '50', '100']
const PLACEHOLDER_AMOUNT = 1_000_000_000n // 100 USDC, so the preview teaches before any typing

type ReceiveCardProps = {
  account: CelenganAccount
  showFaucetRow: boolean
  onFaucet: () => void
}

export function ReceiveCard({ account, showFaucetRow, onFaucet }: ReceiveCardProps) {
  const t = useT()
  const { address } = useWallet()
  const { rate, busy, runAction } = useAppState()
  const { locale } = useSettings()
  const [value, setValue] = useState('')
  const anyBusy = busy !== null

  const previewAmount = (): bigint => {
    if (value.trim() === '') return PLACEHOLDER_AMOUNT
    try {
      return parseUsdc(value)
    } catch {
      return PLACEHOLDER_AMOUNT
    }
  }

  const amount = previewAmount()
  const saved = (amount * BigInt(account.splitBps)) / 10_000n
  const preview = t('receive.preview', {
    spend: formatMoney(amount - saved, 'usdc', rate, locale),
    save: formatMoney(saved, 'usdc', rate, locale),
  })

  const handleSubmit = async () => {
    let parsed: bigint
    try {
      parsed = parseUsdc(value)
      if (parsed <= 0n) throw new Error('invalid amount')
    } catch {
      toast.error(t('errors.invalidAmount'))
      return
    }
    if (!address) return
    const ok = await runAction('pay', 'success.paid', () => celengan.pay(address, address, parsed))
    if (ok) setValue('')
  }

  return (
    <Card className="rounded-2xl shadow-none">
      <CardHeader>
        <CardTitle>{t('receive.title')}</CardTitle>
        <CardDescription>{t('receive.caption')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <TokenIcon
              token="usdc"
              size={22}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
            />
            <Input
              value={value}
              placeholder={t('receive.amountPlaceholder')}
              inputMode="decimal"
              className="pl-11 tabular-nums"
              disabled={anyBusy}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <Button onClick={() => void handleSubmit()} disabled={anyBusy || value.trim() === ''}>
            {busy === 'pay' ? `${t('common.loading')}...` : t('receive.button')}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{t('receive.quickAmounts')}</span>
          {QUICK_AMOUNTS.map((quick) => (
            <Button
              key={quick}
              variant="outline"
              size="sm"
              className="rounded-full tabular-nums"
              disabled={anyBusy}
              onClick={() => setValue(quick)}
            >
              {quick}
            </Button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground tabular-nums">{preview}</p>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-1">
        {showFaucetRow && (
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">{t('faucet.caption')}</p>
            <Button variant="ghost" size="sm" disabled={anyBusy} onClick={onFaucet}>
              {busy === 'faucet' ? `${t('common.loading')}...` : t('faucet.button')}
            </Button>
          </div>
        )}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="justify-start gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link to="/app/link">
            <Link2Icon className="size-4" />
            {t('paylink.share')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
