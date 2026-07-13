import { useCallback } from 'react'
import { useSettings } from '@/lib/settings'

const en = {
  'landing.heroTitle': 'Save a slice of every payment, automatically',
  'landing.heroSubtitle':
    'Celengan splits every payment you receive: part stays ready to spend, part goes straight into a yield-earning savings vault on Stellar.',
  'landing.cta': 'Open the app',
  'landing.feature1Title': 'Auto-split payments',
  'landing.feature1Body':
    'Pick a percentage once. Every incoming payment is split between spending and savings before you can touch it.',
  'landing.feature2Title': 'Savings that work',
  'landing.feature2Body':
    'Your savings go into a DeFindex vault on Stellar testnet and start earning right away.',
  'landing.feature3Title': 'Lock it in',
  'landing.feature3Body':
    'Set a lock date to keep your future self honest. Savings stay put until the day you choose.',
  'landing.footer': 'Built on Stellar testnet. Demo funds only, no real money.',

  'topbar.launch': 'Launch app',
  'topbar.settings': 'Settings',
  'topbar.connect': 'Connect wallet',
  'topbar.disconnect': 'Disconnect',
  'topbar.connected': 'Connected',
  'topbar.connecting': 'Connecting',
  'topbar.testnet': 'Testnet',

  'dashboard.connectTitle': 'Connect your wallet',
  'dashboard.connectCaption':
    'Every payment you receive lands in two pockets: one to spend, one that grows as savings.',

  'onboarding.title': 'Get set up in three steps',
  'onboarding.step1Title': 'Connect your wallet',
  'onboarding.step1Caption': 'Use Freighter or any Stellar wallet to get started.',
  'onboarding.step2Title': 'Grab test funds',
  'onboarding.step2Caption': 'Get free testnet USDC from the faucet, plus XLM for fees.',
  'onboarding.step3Title': 'Receive your first payment',
  'onboarding.step3Caption':
    'Send yourself a payment and watch it split into spending and savings.',
  'onboarding.done': 'All set',

  'balances.total': 'Total balance',
  'balances.spendable': 'Spendable',
  'balances.savings': 'Savings',
  'balances.earningCaption': 'Earning yield in the vault',
  'balances.lockedUntil': 'Locked until {date}',
  'balances.rateCaption': 'Estimated at Rp {rate} per USDC',
  'balances.connectPrompt': 'Connect a wallet to see your balances',

  'receive.title': 'Receive a payment',
  'receive.caption':
    'In this demo your wallet plays the customer: it pays you, and Celengan splits the money the moment it arrives.',
  'receive.amountPlaceholder': 'Amount in USDC',
  'receive.preview': '{spend} to spending, {save} to savings',
  'receive.button': 'Receive payment',
  'receive.quickAmounts': 'Quick amounts',

  'rules.title': 'Your saving rules',
  'rules.splitCaption': 'How much of every incoming payment goes to savings',
  'rules.lockTitle': 'Time lock',
  'rules.splitLabel': 'Savings split',
  'rules.splitSentence': '{pct}% of every payment goes to savings',
  'rules.saveButton': 'Save rule',
  'rules.lockLabel': 'Lock savings until',
  'rules.lockCaption': 'A lock can only be extended, never shortened. Pick your date carefully.',
  'rules.lockButton': 'Lock savings',
  'rules.lockedStatus': 'Locked until {date}',
  'rules.noLock': 'Savings are unlocked. Set a date to protect your goal.',

  'withdraw.title': 'Withdraw',
  'withdraw.spendTab': 'Spendable',
  'withdraw.saveTab': 'Savings',
  'withdraw.spendTitle': 'Withdraw spendable',
  'withdraw.spendCaption': 'Move USDC from your spendable balance back to your wallet',
  'withdraw.saveTitle': 'Withdraw savings',
  'withdraw.max': 'Max',
  'withdraw.button': 'Withdraw',
  'withdraw.lockedReason': 'Savings are locked until {date}',
  'withdraw.sharesHint':
    'Savings are held as vault shares; the USDC you receive includes any yield earned.',

  'actions.title': 'Actions',
  'actions.caption': 'Try the full flow with testnet USDC',

  'activity.title': 'Activity',
  'activity.empty': 'Nothing here yet. Receive a payment to get things moving.',
  'activity.pay': 'Received {amount}, saved {saved}',
  'activity.wdSpend': 'Withdrew {amount} from spendable',
  'activity.wdSave': 'Withdrew {amount} from savings',
  'activity.split': 'Savings split set to {pct}%',
  'activity.lock': 'Savings locked until {date}',

  'settings.title': 'Settings',
  'settings.language': 'Language',
  'settings.currency': 'Display currency',
  'settings.currencyIdr': 'Rupiah (IDR)',
  'settings.currencyUsdc': 'USDC',
  'settings.network': 'Network',
  'settings.networkTestnet': 'Stellar Testnet',
  'settings.contract': 'Contract',
  'settings.viewExplorer': 'View on explorer',
  'settings.copy': 'Copy',
  'settings.copied': 'Copied',
  'settings.about': 'Celengan is a demo of programmable savings on Stellar testnet.',
  'settings.byline': 'Celengan by Cyphras Labs',
  'settings.langEn': 'English',
  'settings.langId': 'Bahasa Indonesia',

  'faucet.title': 'Test funds',
  'faucet.caption': 'Get 1,000 testnet USDC and some XLM for fees, free.',
  'faucet.button': 'Get test funds',
  'faucet.success': 'Test funds are on the way to your wallet',

  'success.paid': 'Payment received and split',
  'success.withdrewSpend': 'Withdrawn to your wallet',
  'success.withdrewSavings': 'Savings withdrawn to your wallet',
  'success.splitSaved': 'Saving rule updated',
  'success.lockSet': 'Savings locked',

  'errors.invalidAmount': 'That amount does not look right. Enter a number above zero.',
  'errors.invalidSplit': 'The split must be between 0% and 100%.',
  'errors.insufficientSpendable': 'Not enough spendable balance for that.',
  'errors.insufficientShares': 'You do not have that much in savings.',
  'errors.savingsLocked': 'Your savings are still locked.',
  'errors.lockNotExtended': 'A lock can only be extended, not shortened.',
  'errors.emptyWithdrawal': 'There is nothing to withdraw.',
  'errors.lockTooFar': 'That lock date is too far in the future.',
  'errors.paused': 'The contract is paused right now. Try again later.',
  'errors.walletCancelled': 'Request cancelled in your wallet.',
  'errors.generic': 'Something went wrong. Please try again.',
  'errors.faucetUnavailable': 'The faucet is unavailable right now. Try again in a bit.',
  'errors.faucetAlreadyFunded': 'This wallet already has test funds.',
  'errors.loadFailed': 'Could not load your account. Check your connection and try again.',

  'common.loading': 'Loading',
  'common.cancel': 'Cancel',
  'common.close': 'Close',
  'common.retry': 'Try again',
  'common.connectFirst': 'Connect your wallet first.',
}

export type MessageKey = keyof typeof en

const id = {
  'landing.heroTitle': 'Sisihkan tabungan dari setiap pembayaran, otomatis',
  'landing.heroSubtitle':
    'Celengan membagi setiap pembayaran yang kamu terima: sebagian siap dipakai, sebagian langsung masuk brankas tabungan yang menghasilkan di Stellar.',
  'landing.cta': 'Buka aplikasi',
  'landing.feature1Title': 'Bagi otomatis',
  'landing.feature1Body':
    'Atur persentasenya sekali saja. Setiap pembayaran masuk langsung dibagi antara dana siap pakai dan tabungan.',
  'landing.feature2Title': 'Tabungan yang bekerja',
  'landing.feature2Body':
    'Tabunganmu masuk ke vault DeFindex di Stellar testnet dan langsung mulai menghasilkan.',
  'landing.feature3Title': 'Kunci tabunganmu',
  'landing.feature3Body':
    'Pasang tanggal kunci supaya kamu tidak mudah tergoda. Tabungan tetap tersimpan sampai hari yang kamu pilih.',
  'landing.footer': 'Dibangun di Stellar testnet. Dana demo saja, bukan uang sungguhan.',

  'topbar.launch': 'Buka aplikasi',
  'topbar.settings': 'Pengaturan',
  'topbar.connect': 'Hubungkan dompet',
  'topbar.disconnect': 'Putuskan',
  'topbar.connected': 'Terhubung',
  'topbar.connecting': 'Menghubungkan',
  'topbar.testnet': 'Testnet',

  'dashboard.connectTitle': 'Hubungkan dompetmu',
  'dashboard.connectCaption':
    'Setiap pembayaran yang kamu terima masuk ke dua kantong: satu siap dipakai, satu tumbuh jadi tabungan.',

  'onboarding.title': 'Siap dalam tiga langkah',
  'onboarding.step1Title': 'Hubungkan dompetmu',
  'onboarding.step1Caption': 'Pakai Freighter atau dompet Stellar lain untuk mulai.',
  'onboarding.step2Title': 'Ambil dana uji',
  'onboarding.step2Caption': 'Klaim USDC testnet gratis dari faucet, plus XLM untuk biaya.',
  'onboarding.step3Title': 'Terima pembayaran pertamamu',
  'onboarding.step3Caption':
    'Kirim pembayaran ke dirimu sendiri dan lihat uangnya terbagi ke dana siap pakai dan tabungan.',
  'onboarding.done': 'Semua beres',

  'balances.total': 'Total saldo',
  'balances.spendable': 'Siap dipakai',
  'balances.savings': 'Tabungan',
  'balances.earningCaption': 'Menghasilkan imbal hasil di vault',
  'balances.lockedUntil': 'Terkunci sampai {date}',
  'balances.rateCaption': 'Perkiraan kurs Rp {rate} per USDC',
  'balances.connectPrompt': 'Hubungkan dompet untuk melihat saldomu',

  'receive.title': 'Terima pembayaran',
  'receive.caption':
    'Di demo ini dompetmu berperan jadi pelanggan: dia membayar kamu, dan Celengan langsung membagi uangnya begitu masuk.',
  'receive.amountPlaceholder': 'Jumlah dalam USDC',
  'receive.preview': '{spend} siap dipakai, {save} masuk tabungan',
  'receive.button': 'Terima pembayaran',
  'receive.quickAmounts': 'Pilih nominal',

  'rules.title': 'Aturan menabungmu',
  'rules.splitCaption': 'Seberapa besar bagian dari setiap pembayaran masuk yang ditabung',
  'rules.lockTitle': 'Kunci waktu',
  'rules.splitLabel': 'Porsi tabungan',
  'rules.splitSentence': '{pct}% dari setiap pembayaran masuk ke tabungan',
  'rules.saveButton': 'Simpan aturan',
  'rules.lockLabel': 'Kunci tabungan sampai',
  'rules.lockCaption':
    'Kunci hanya bisa diperpanjang, tidak bisa dipersingkat. Pilih tanggalnya baik-baik.',
  'rules.lockButton': 'Kunci tabungan',
  'rules.lockedStatus': 'Terkunci sampai {date}',
  'rules.noLock': 'Tabungan belum terkunci. Pasang tanggal untuk menjaga targetmu.',

  'withdraw.title': 'Tarik dana',
  'withdraw.spendTab': 'Siap dipakai',
  'withdraw.saveTab': 'Tabungan',
  'withdraw.spendTitle': 'Tarik dana siap pakai',
  'withdraw.spendCaption': 'Pindahkan USDC dari saldo siap pakai kembali ke dompetmu',
  'withdraw.saveTitle': 'Tarik tabungan',
  'withdraw.max': 'Maks',
  'withdraw.button': 'Tarik',
  'withdraw.lockedReason': 'Tabungan terkunci sampai {date}',
  'withdraw.sharesHint':
    'Tabungan disimpan sebagai unit vault; USDC yang kamu terima sudah termasuk imbal hasil.',

  'actions.title': 'Aksi',
  'actions.caption': 'Coba alur lengkapnya pakai USDC testnet',

  'activity.title': 'Aktivitas',
  'activity.empty': 'Belum ada apa-apa. Terima pembayaran dulu untuk memulai.',
  'activity.pay': 'Terima {amount}, {saved} ditabung',
  'activity.wdSpend': 'Tarik {amount} dari dana siap pakai',
  'activity.wdSave': 'Tarik {amount} dari tabungan',
  'activity.split': 'Porsi tabungan diubah jadi {pct}%',
  'activity.lock': 'Tabungan dikunci sampai {date}',

  'settings.title': 'Pengaturan',
  'settings.language': 'Bahasa',
  'settings.currency': 'Mata uang tampilan',
  'settings.currencyIdr': 'Rupiah (IDR)',
  'settings.currencyUsdc': 'USDC',
  'settings.network': 'Jaringan',
  'settings.networkTestnet': 'Stellar Testnet',
  'settings.contract': 'Kontrak',
  'settings.viewExplorer': 'Lihat di explorer',
  'settings.copy': 'Salin',
  'settings.copied': 'Tersalin',
  'settings.about': 'Celengan adalah demo tabungan terprogram di Stellar testnet.',
  'settings.byline': 'Celengan oleh Cyphras Labs',
  'settings.langEn': 'English',
  'settings.langId': 'Bahasa Indonesia',

  'faucet.title': 'Dana uji',
  'faucet.caption': 'Dapatkan 1.000 USDC testnet dan sedikit XLM untuk biaya, gratis.',
  'faucet.button': 'Ambil dana uji',
  'faucet.success': 'Dana uji sedang meluncur ke dompetmu',

  'success.paid': 'Pembayaran diterima dan dibagi',
  'success.withdrewSpend': 'Berhasil ditarik ke dompetmu',
  'success.withdrewSavings': 'Tabungan berhasil ditarik ke dompetmu',
  'success.splitSaved': 'Aturan menabung diperbarui',
  'success.lockSet': 'Tabungan dikunci',

  'errors.invalidAmount': 'Jumlahnya belum pas. Masukkan angka di atas nol.',
  'errors.invalidSplit': 'Porsi tabungan harus antara 0% dan 100%.',
  'errors.insufficientSpendable': 'Saldo siap pakai tidak cukup.',
  'errors.insufficientShares': 'Tabunganmu tidak sebanyak itu.',
  'errors.savingsLocked': 'Tabunganmu masih terkunci.',
  'errors.lockNotExtended': 'Kunci hanya bisa diperpanjang, tidak bisa dipersingkat.',
  'errors.emptyWithdrawal': 'Tidak ada yang bisa ditarik.',
  'errors.lockTooFar': 'Tanggal kuncinya terlalu jauh di masa depan.',
  'errors.paused': 'Kontrak sedang dijeda. Coba lagi nanti.',
  'errors.walletCancelled': 'Permintaan dibatalkan di dompetmu.',
  'errors.generic': 'Ada yang tidak beres. Coba lagi, ya.',
  'errors.faucetUnavailable': 'Faucet sedang tidak tersedia. Coba lagi sebentar lagi.',
  'errors.faucetAlreadyFunded': 'Dompet ini sudah punya dana uji.',
  'errors.loadFailed': 'Tidak bisa memuat akunmu. Periksa koneksimu dan coba lagi.',

  'common.loading': 'Memuat',
  'common.cancel': 'Batal',
  'common.close': 'Tutup',
  'common.retry': 'Coba lagi',
  'common.connectFirst': 'Hubungkan dompetmu dulu.',
} satisfies Record<MessageKey, string>

const messages: Record<'en' | 'id', Record<MessageKey, string>> = { en, id }

export function useT(): (key: MessageKey, vars?: Record<string, string | number>) => string {
  const { locale } = useSettings()
  return useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => {
      const template = messages[locale][key]
      if (!vars) return template
      return template.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in vars ? String(vars[name]) : match,
      )
    },
    [locale],
  )
}

function intlLocale(locale: string): string {
  return locale.startsWith('id') ? 'id-ID' : 'en-US'
}

export function formatMoney(
  amount: bigint,
  currency: 'idr' | 'usdc',
  rate: number,
  locale: string,
): string {
  const usd = Number(amount) / 1e7
  if (currency === 'idr') {
    return new Intl.NumberFormat(intlLocale(locale), {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(usd * rate)
  }
  const formatted = new Intl.NumberFormat(intlLocale(locale), {
    maximumFractionDigits: 2,
  }).format(usd)
  return `${formatted} USDC`
}

export function formatDate(unixSeconds: bigint, locale: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(Number(unixSeconds) * 1000))
}

export function formatDateTime(at: Date, locale: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(at)
}
