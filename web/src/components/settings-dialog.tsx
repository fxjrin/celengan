import { CopyIcon, ExternalLinkIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { CONTRACT_ID, EXPLORER_CONTRACT_URL } from '@/lib/config'
import { useT } from '@/lib/i18n'
import { useSettings } from '@/lib/settings'

function shortContract(id: string): string {
  return `${id.slice(0, 4)}...${id.slice(-4)}`
}

type SettingsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const t = useT()
  const { locale, setLocale, primaryCurrency, setPrimaryCurrency } = useSettings()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CONTRACT_ID)
    toast.success(t('settings.copied'))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('settings.title')}</DialogTitle>
          <DialogDescription>{t('settings.about')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="settings-language">{t('settings.language')}</Label>
            <Select
              value={locale}
              onValueChange={(v) => {
                if (v === 'en' || v === 'id') setLocale(v)
              }}
            >
              <SelectTrigger id="settings-language" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('settings.langEn')}</SelectItem>
                <SelectItem value="id">{t('settings.langId')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="settings-currency">{t('settings.currency')}</Label>
            <Select
              value={primaryCurrency}
              onValueChange={(v) => {
                if (v === 'idr' || v === 'usdc') setPrimaryCurrency(v)
              }}
            >
              <SelectTrigger id="settings-currency" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idr">{t('settings.currencyIdr')}</SelectItem>
                <SelectItem value="usdc">{t('settings.currencyUsdc')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">{t('settings.network')}</span>
              <span>{t('settings.networkTestnet')}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">{t('settings.contract')}</span>
              <span className="flex items-center gap-1">
                <span className="font-mono text-xs">{shortContract(CONTRACT_ID)}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t('settings.copy')}
                  onClick={() => void handleCopy()}
                >
                  <CopyIcon />
                </Button>
              </span>
            </div>
            <a
              href={EXPLORER_CONTRACT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
            >
              {t('settings.viewExplorer')}
              <ExternalLinkIcon className="size-3.5" />
            </a>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">{t('settings.byline')}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
