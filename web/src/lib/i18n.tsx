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
  'landing.feature4Title': 'Get paid with a link',
  'landing.feature4Body':
    'Share your payment link or QR code. Customers pay in USDC and part of every sale goes straight to savings.',
  'landing.footer': 'Built on Stellar testnet. Demo funds only, no real money.',

  'topbar.connect': 'Connect wallet',
  'topbar.disconnect': 'Disconnect',
  'topbar.connected': 'Connected',
  'topbar.connecting': 'Connecting',
  'topbar.testnet': 'Testnet',

  'dashboard.connectTitle': 'Connect your wallet',
  'dashboard.connectCaption':
    'Every payment you receive lands in two pockets: one to spend, one that grows as savings.',

  'greeting.morning': 'Good morning',
  'greeting.afternoon': 'Good afternoon',
  'greeting.evening': 'Good evening',
  'greeting.night': 'Good night',

  'nav.menu': 'Menu',
  'nav.action': 'Action',
  'nav.protocol': 'Protocol',
  'nav.dashboard': 'Dashboard',
  'nav.activity': 'Activity',
  'nav.faucet': 'Get test USDC',
  'nav.paymentLink': 'Payment link',
  'nav.viewContract': 'View contract',
  'nav.disconnect': 'Disconnect wallet',

  'shell.openMenu': 'Open menu',
  'shell.theme': 'Toggle theme',
  'shell.copyAddress': 'Copy address',

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

  'receive.title': 'Receive a payment',
  'receive.caption':
    'In this demo your wallet plays the customer: it pays you, and Celengan splits the money the moment it arrives.',
  'receive.amountPlaceholder': 'Amount in USDC',
  'receive.preview': '{spend} to spending, {save} to savings',
  'receive.button': 'Receive payment',
  'receive.quickAmounts': 'Quick amounts',

  'rules.title': 'Your saving rules',
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
  'withdraw.max': 'Max',
  'withdraw.sharesPlaceholder': 'Shares to withdraw',
  'withdraw.button': 'Withdraw',
  'withdraw.lockedReason': 'Savings are locked until {date}',
  'withdraw.sharesHint':
    'Savings are held as vault shares; the USDC you receive includes any yield earned.',

  'pay.title': 'Pay {name}',
  'pay.splitInfo': '{pct}% of this payment goes straight to their savings',
  'pay.payingFrom': 'Paying from',
  'pay.button': 'Pay now',
  'pay.connectCta': 'Connect wallet to pay',
  'pay.connectCaption': 'You pay straight from your own Stellar wallet. No account needed.',
  'pay.successTitle': 'Payment sent',
  'pay.successBody': 'Your payment to {name} went through.',
  'pay.payAgain': 'Pay again',
  'pay.createOwn': 'Create your own Celengan',
  'pay.invalidTitle': 'This payment link looks broken',
  'pay.goHome': 'Go to Celengan',

  'paylink.title': 'Your payment link',
  'paylink.caption':
    'Anyone with this link can pay you. Your split rule tucks part of every payment into savings automatically.',
  'paylink.nameLabel': 'Display name',
  'paylink.namePlaceholder': 'Shown to the payer, optional',
  'paylink.amountLabel': 'Preset amount',
  'paylink.amountPlaceholder': 'USDC, optional',
  'paylink.copy': 'Copy link',
  'paylink.share': 'Share your payment link',

  'activity.title': 'Activity',
  'activity.viewAll': 'View all',
  'activity.filterAll': 'All',
  'activity.filterPayments': 'Payments',
  'activity.filterWithdrawals': 'Withdrawals',
  'activity.filterChanges': 'Changes',
  'activity.empty': 'Nothing here yet. Receive a payment to get things moving.',
  'activity.pay': 'Received {amount}, saved {saved}',
  'activity.wdSpend': 'Withdrew {amount} from spendable',
  'activity.wdSave': 'Withdrew {amount} from savings',
  'activity.split': 'Savings split set to {pct}%',
  'activity.lock': 'Savings locked until {date}',

  'settings.title': 'Settings',
  'settings.preferences': 'Preferences',
  'settings.language': 'Language',
  'settings.theme': 'Theme',
  'settings.themeLight': 'Light',
  'settings.themeDark': 'Dark',
  'settings.themeSystem': 'System',
  'settings.aboutTitle': 'About',
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

  'faucet.caption': 'Get 1,000 testnet USDC and some XLM for fees, free.',
  'faucet.button': 'Get test funds',
  'faucet.success': 'Test funds are on the way to your wallet',

  'success.paid': 'Payment received and split',
  'success.linkPaid': 'Payment sent',
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
  'errors.invalidPayAddress': 'The address in this payment link is not a valid Stellar address.',

  'common.loading': 'Loading',
  'common.retry': 'Try again',
  'common.close': 'Close',
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
  'landing.feature4Title': 'Dibayar lewat tautan',
  'landing.feature4Body':
    'Bagikan tautan pembayaran atau kode QR-mu. Pelanggan membayar dengan USDC dan sebagian dari tiap penjualan langsung masuk tabungan.',
  'landing.footer': 'Dibangun di Stellar testnet. Dana demo saja, bukan uang sungguhan.',

  'topbar.connect': 'Hubungkan dompet',
  'topbar.disconnect': 'Putuskan',
  'topbar.connected': 'Terhubung',
  'topbar.connecting': 'Menghubungkan',
  'topbar.testnet': 'Testnet',

  'dashboard.connectTitle': 'Hubungkan dompetmu',
  'dashboard.connectCaption':
    'Setiap pembayaran yang kamu terima masuk ke dua kantong: satu siap dipakai, satu tumbuh jadi tabungan.',

  'greeting.morning': 'Selamat pagi',
  'greeting.afternoon': 'Selamat siang',
  'greeting.evening': 'Selamat sore',
  'greeting.night': 'Selamat malam',

  'nav.menu': 'Menu',
  'nav.action': 'Aksi',
  'nav.protocol': 'Protokol',
  'nav.dashboard': 'Dasbor',
  'nav.activity': 'Aktivitas',
  'nav.faucet': 'Ambil USDC uji',
  'nav.paymentLink': 'Tautan pembayaran',
  'nav.viewContract': 'Lihat kontrak',
  'nav.disconnect': 'Putuskan dompet',

  'shell.openMenu': 'Buka menu',
  'shell.theme': 'Ganti tema',
  'shell.copyAddress': 'Salin alamat',

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

  'receive.title': 'Terima pembayaran',
  'receive.caption':
    'Di demo ini dompetmu berperan jadi pelanggan yang membayar kamu; Celengan langsung membagi uangnya begitu masuk.',
  'receive.amountPlaceholder': 'Jumlah dalam USDC',
  'receive.preview': '{spend} siap dipakai, {save} masuk tabungan',
  'receive.button': 'Terima pembayaran',
  'receive.quickAmounts': 'Pilih nominal',

  'rules.title': 'Aturan menabungmu',
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
  'withdraw.max': 'Maks',
  'withdraw.sharesPlaceholder': 'Jumlah unit yang mau ditarik',
  'withdraw.button': 'Tarik',
  'withdraw.lockedReason': 'Tabungan terkunci sampai {date}',
  'withdraw.sharesHint':
    'Tabungan disimpan sebagai unit vault; USDC yang kamu terima sudah termasuk imbal hasil.',

  'pay.title': 'Bayar {name}',
  'pay.splitInfo': '{pct}% dari pembayaran ini langsung masuk ke tabungannya',
  'pay.payingFrom': 'Membayar dari',
  'pay.button': 'Bayar sekarang',
  'pay.connectCta': 'Hubungkan dompet untuk membayar',
  'pay.connectCaption': 'Kamu bayar langsung dari dompet Stellar-mu sendiri. Tidak perlu akun.',
  'pay.successTitle': 'Pembayaran terkirim',
  'pay.successBody': 'Pembayaranmu ke {name} sudah masuk.',
  'pay.payAgain': 'Bayar lagi',
  'pay.createOwn': 'Bikin Celengan-mu sendiri',
  'pay.invalidTitle': 'Tautan pembayaran ini tidak valid',
  'pay.goHome': 'Buka Celengan',

  'paylink.title': 'Tautan pembayaranmu',
  'paylink.caption':
    'Siapa pun yang punya tautan ini bisa membayar kamu. Aturan porsimu otomatis menyisihkan sebagian dari tiap pembayaran ke tabungan.',
  'paylink.nameLabel': 'Nama tampilan',
  'paylink.namePlaceholder': 'Ditampilkan ke pembayar, opsional',
  'paylink.amountLabel': 'Nominal awal',
  'paylink.amountPlaceholder': 'USDC, opsional',
  'paylink.copy': 'Salin tautan',
  'paylink.share': 'Bagikan tautan pembayaranmu',

  'activity.title': 'Aktivitas',
  'activity.viewAll': 'Lihat semua',
  'activity.filterAll': 'Semua',
  'activity.filterPayments': 'Pembayaran',
  'activity.filterWithdrawals': 'Penarikan',
  'activity.filterChanges': 'Perubahan',
  'activity.empty': 'Belum ada apa-apa. Terima pembayaran dulu untuk memulai.',
  'activity.pay': 'Terima {amount}, {saved} ditabung',
  'activity.wdSpend': 'Tarik {amount} dari dana siap pakai',
  'activity.wdSave': 'Tarik {amount} dari tabungan',
  'activity.split': 'Porsi tabungan diubah jadi {pct}%',
  'activity.lock': 'Tabungan dikunci sampai {date}',

  'settings.title': 'Pengaturan',
  'settings.preferences': 'Preferensi',
  'settings.language': 'Bahasa',
  'settings.theme': 'Tema',
  'settings.themeLight': 'Terang',
  'settings.themeDark': 'Gelap',
  'settings.themeSystem': 'Ikuti sistem',
  'settings.aboutTitle': 'Tentang',
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

  'faucet.caption': 'Dapatkan 1.000 USDC testnet dan sedikit XLM untuk biaya, gratis.',
  'faucet.button': 'Ambil dana uji',
  'faucet.success': 'Dana uji sedang meluncur ke dompetmu',

  'success.paid': 'Pembayaran diterima dan dibagi',
  'success.linkPaid': 'Pembayaran terkirim',
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
  'errors.faucetUnavailable': 'Faucet sedang tidak tersedia. Coba beberapa saat lagi.',
  'errors.faucetAlreadyFunded': 'Dompet ini sudah punya dana uji.',
  'errors.loadFailed': 'Tidak bisa memuat akunmu. Periksa koneksimu dan coba lagi.',
  'errors.invalidPayAddress': 'Alamat di tautan pembayaran ini bukan alamat Stellar yang valid.',

  'common.loading': 'Memuat',
  'common.retry': 'Coba lagi',
  'common.close': 'Tutup',
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
