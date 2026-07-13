import { useMemo, useState } from 'react'
import { CopyIcon } from 'lucide-react'
import { toast } from 'sonner'
import { renderSVG } from 'uqr'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { parseUsdc } from '@/lib/format'
import { useT } from '@/lib/i18n'
import { useWallet } from '@/lib/wallet'

function buildLink(address: string, name: string, amount: string): string {
  const params = new URLSearchParams()
  const trimmedName = name.trim()
  if (trimmedName !== '') params.set('name', trimmedName)
  const trimmedAmount = amount.trim()
  try {
    if (parseUsdc(trimmedAmount) > 0n) params.set('amount', trimmedAmount)
  } catch {
    // invalid or empty preset amounts are simply left out of the link
  }
  const query = params.toString()
  return `${window.location.origin}/pay/${address}${query === '' ? '' : `?${query}`}`
}

type PaymentLinkDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentLinkDialog({ open, onOpenChange }: PaymentLinkDialogProps) {
  const t = useT()
  const { address } = useWallet()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  const link = useMemo(
    () => (address === null ? '' : buildLink(address, name, amount)),
    [address, name, amount],
  )
  const qr = useMemo(() => (link === '' ? '' : renderSVG(link)), [link])

  if (address === null) return null

  const copy = async () => {
    await navigator.clipboard.writeText(link)
    toast.success(t('settings.copied'))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('paylink.title')}</DialogTitle>
          <DialogDescription>{t('paylink.caption')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="paylink-name">{t('paylink.nameLabel')}</Label>
              <Input
                id="paylink-name"
                value={name}
                placeholder={t('paylink.namePlaceholder')}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="paylink-amount">{t('paylink.amountLabel')}</Label>
              <Input
                id="paylink-amount"
                value={amount}
                placeholder={t('paylink.amountPlaceholder')}
                inputMode="decimal"
                className="tabular-nums"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          {/* white card in both themes so scanners always see dark modules on white */}
          <div className="mx-auto w-fit rounded-2xl border bg-white p-3">
            <div
              className="size-44 [&_svg]:h-full [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: qr }}
            />
          </div>
          <div className="flex items-center gap-2">
            <p className="min-w-0 flex-1 truncate rounded-xl border bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground">
              {link}
            </p>
            <Button size="sm" className="shrink-0" onClick={() => void copy()}>
              <CopyIcon />
              {t('paylink.copy')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
