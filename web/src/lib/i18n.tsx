import { useCallback } from 'react'
import type { FxRates } from '@/lib/rates'
import { useSettings, type Locale } from '@/lib/settings'

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
  'dashboard.quickActions': 'Quick actions',

  'greeting.morning': 'Good morning',
  'greeting.afternoon': 'Good afternoon',
  'greeting.evening': 'Good evening',
  'greeting.night': 'Good night',

  'nav.menu': 'Menu',
  'nav.action': 'Action',
  'nav.protocol': 'Protocol',
  'nav.dashboard': 'Dashboard',
  'nav.activity': 'Activity',
  'nav.yield': 'Yield',
  'nav.receive': 'Receive',
  'nav.withdraw': 'Withdraw',
  'nav.rules': 'Rules',
  'nav.faucet': 'Get test USDC',
  'nav.paymentLink': 'Payment link',
  'nav.viewContract': 'View contract',
  'nav.disconnect': 'Disconnect wallet',

  'shell.openMenu': 'Open menu',
  'shell.theme': 'Toggle theme',
  'shell.copyAddress': 'Copy address',

  'page.receiveCaption': 'Take a payment and watch it split on arrival.',
  'page.withdrawCaption': 'Move money out of spending or savings.',
  'page.rulesCaption': 'Tune your savings split and time lock.',
  'page.settingsCaption': 'Language, currency, theme, and network details.',
  'page.yieldCaption': 'See where your savings earn, and how much.',

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
  'balances.rateCaption': 'Estimated at {amount} per USDC',
  'balances.pocketsHint': 'Spending you can withdraw anytime - savings grow in a yield vault.',
  'balances.emptyHint': 'No balance yet.',
  'balances.earningsLine': '+{amount} earned so far',

  'receive.title': 'Receive a payment',
  'receive.caption':
    'In this demo your wallet plays the customer: it pays you, and Celengan splits the money the moment it arrives.',
  'receive.amountPlaceholder': 'Amount in USDC',
  'receive.preview': '{spend} to spending, {save} to savings',
  'receive.button': 'Receive payment',
  'receive.quickAmounts': 'Quick amounts',
  'receive.realPaymentHint':
    'This simulates a customer paying you. To get paid for real, share your payment link instead.',
  'receive.faucetWhy': 'You need testnet USDC in your wallet before you can simulate a payment.',

  'rules.title': 'Your saving rules',
  'rules.lockTitle': 'Time lock',
  'rules.splitLabel': 'Savings split',
  'rules.splitSentence': '{pct}% of every payment goes to savings',
  'rules.saveButton': 'Save rule',
  'rules.lockLabel': 'Lock savings until',
  'rules.lockCaption':
    'A lock can only be extended, never shortened, and the contract caps how far into the future you can set it. Pick your date carefully.',
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

  'yield.positionTitle': 'Your savings position',
  'yield.principal': 'Principal saved',
  'yield.currentValue': 'Current value',
  'yield.earnings': 'Earnings',
  'yield.estimate': 'Estimate',
  'yield.estimateHint':
    'Estimated from your payment history, assuming a 1:1 share price at each deposit.',
  'yield.shares': 'Vault shares',
  'yield.sharePrice': 'Share price',
  'yield.earningsCaption': 'Earnings are your current value minus what you have put in.',
  'yield.refresh': 'Refresh',
  'yield.sourcesTitle': 'Where your yield comes from',
  'yield.sourcesCaption':
    'Your savings currently route through DeFindex. More sources are on the roadmap.',
  'yield.bestYield': 'Best yield',
  'yield.badgeActive': 'Active',
  'yield.badgeSoon': 'Coming soon',
  'yield.apyLabel': 'APY',
  'yield.tvlLabel': 'TVL',
  'yield.sourceDefindexName': 'DeFindex USDC vault',
  'yield.sourceDefindexRoute': 'Routes into the Blend USDC pool',
  'yield.sourceBlendName': 'Blend USDC pool',
  'yield.sourceBlendRoute': 'Lend USDC directly on Blend',
  'yield.sourceSoroswapName': 'Soroswap USDC LP',
  'yield.sourceSoroswapRoute': 'Provide USDC liquidity on Soroswap',

  'pay.title': 'Pay {name}',
  'pay.splitInfo': '{pct}% of this payment goes straight to their savings',
  'pay.signHint':
    'Your wallet signs a single transaction. The split into spending and savings happens automatically on-chain.',
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
  'settings.currencyVnd': 'Vietnamese Dong (VND)',
  'settings.currencyPhp': 'Philippine Peso (PHP)',
  'settings.preferencesHint':
    'Language and currency only change how amounts are displayed. They do not affect your wallet or the blockchain.',
  'settings.network': 'Network',
  'settings.networkTestnet': 'Stellar Testnet',
  'settings.networkTestnetHint':
    'This app runs on Stellar testnet. Funds here are for testing only and have no real value.',
  'settings.contract': 'Contract',
  'settings.viewExplorer': 'View on explorer',
  'settings.copy': 'Copy',
  'settings.copied': 'Copied',
  'settings.about': 'Celengan is a demo of programmable savings on Stellar testnet.',
  'settings.byline': 'Celengan by Cyphras Labs',
  'settings.langEn': 'English',
  'settings.langId': 'Bahasa Indonesia',
  'settings.langVi': 'Tiếng Việt',
  'settings.langFil': 'Filipino',

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
  'dashboard.quickActions': 'Aksi cepat',

  'greeting.morning': 'Selamat pagi',
  'greeting.afternoon': 'Selamat siang',
  'greeting.evening': 'Selamat sore',
  'greeting.night': 'Selamat malam',

  'nav.menu': 'Menu',
  'nav.action': 'Aksi',
  'nav.protocol': 'Protokol',
  'nav.dashboard': 'Dasbor',
  'nav.activity': 'Aktivitas',
  'nav.yield': 'Imbal hasil',
  'nav.receive': 'Terima',
  'nav.withdraw': 'Tarik dana',
  'nav.rules': 'Aturan',
  'nav.faucet': 'Ambil USDC uji',
  'nav.paymentLink': 'Tautan pembayaran',
  'nav.viewContract': 'Lihat kontrak',
  'nav.disconnect': 'Putuskan dompet',

  'shell.openMenu': 'Buka menu',
  'shell.theme': 'Ganti tema',
  'shell.copyAddress': 'Salin alamat',

  'page.receiveCaption': 'Terima pembayaran dan lihat uangnya langsung terbagi.',
  'page.withdrawCaption': 'Tarik danamu dari kantong siap pakai atau tabungan.',
  'page.rulesCaption': 'Atur porsi tabungan dan kunci waktumu.',
  'page.settingsCaption': 'Bahasa, mata uang, tema, dan detail jaringan.',
  'page.yieldCaption': 'Lihat dari mana tabunganmu menghasilkan, dan berapa banyak.',

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
  'balances.rateCaption': 'Perkiraan {amount} per USDC',
  'balances.pocketsHint':
    'Dana siap pakai bisa kamu tarik kapan saja - tabungan tumbuh di brankas berimbal hasil.',
  'balances.emptyHint': 'Saldo masih kosong.',
  'balances.earningsLine': '+{amount} sudah dihasilkan',

  'receive.title': 'Terima pembayaran',
  'receive.caption':
    'Di demo ini dompetmu berperan jadi pelanggan yang membayar kamu; Celengan langsung membagi uangnya begitu masuk.',
  'receive.amountPlaceholder': 'Jumlah dalam USDC',
  'receive.preview': '{spend} siap dipakai, {save} masuk tabungan',
  'receive.button': 'Terima pembayaran',
  'receive.quickAmounts': 'Pilih nominal',
  'receive.realPaymentHint':
    'Ini cuma simulasi pelanggan yang membayar kamu. Supaya benar-benar dibayar, bagikan tautan pembayaranmu.',
  'receive.faucetWhy':
    'Kamu butuh USDC testnet di dompetmu dulu sebelum bisa simulasikan pembayaran.',

  'rules.title': 'Aturan menabungmu',
  'rules.lockTitle': 'Kunci waktu',
  'rules.splitLabel': 'Porsi tabungan',
  'rules.splitSentence': '{pct}% dari setiap pembayaran masuk ke tabungan',
  'rules.saveButton': 'Simpan aturan',
  'rules.lockLabel': 'Kunci tabungan sampai',
  'rules.lockCaption':
    'Kunci hanya bisa diperpanjang, tidak bisa dipersingkat, dan kontrak membatasi seberapa jauh tanggalnya bisa dipasang. Pilih tanggalnya baik-baik.',
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

  'yield.positionTitle': 'Posisi tabunganmu',
  'yield.principal': 'Pokok yang ditabung',
  'yield.currentValue': 'Nilai saat ini',
  'yield.earnings': 'Keuntungan',
  'yield.estimate': 'Estimasi',
  'yield.estimateHint':
    'Diperkirakan dari riwayat pembayaranmu, dengan asumsi harga unit 1:1 di setiap setoran.',
  'yield.shares': 'Unit vault',
  'yield.sharePrice': 'Harga per unit',
  'yield.earningsCaption': 'Keuntungan adalah nilai saat ini dikurangi jumlah yang sudah kamu setor.',
  'yield.refresh': 'Segarkan',
  'yield.sourcesTitle': 'Dari mana imbal hasilmu berasal',
  'yield.sourcesCaption':
    'Tabunganmu saat ini disalurkan lewat DeFindex. Sumber lain masih ada di roadmap.',
  'yield.bestYield': 'Imbal hasil terbaik',
  'yield.badgeActive': 'Aktif',
  'yield.badgeSoon': 'Segera hadir',
  'yield.apyLabel': 'APY',
  'yield.tvlLabel': 'TVL',
  'yield.sourceDefindexName': 'Vault USDC DeFindex',
  'yield.sourceDefindexRoute': 'Disalurkan ke pool USDC Blend',
  'yield.sourceBlendName': 'Pool USDC Blend',
  'yield.sourceBlendRoute': 'Pinjamkan USDC langsung di Blend',
  'yield.sourceSoroswapName': 'LP USDC Soroswap',
  'yield.sourceSoroswapRoute': 'Sediakan likuiditas USDC di Soroswap',

  'pay.title': 'Bayar {name}',
  'pay.splitInfo': '{pct}% dari pembayaran ini langsung masuk ke tabungannya',
  'pay.signHint':
    'Dompetmu tanda tangan satu transaksi saja. Pembagian ke dana siap pakai dan tabungan berjalan otomatis di on-chain.',
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
  'settings.currencyVnd': 'Vietnamese Dong (VND)',
  'settings.currencyPhp': 'Philippine Peso (PHP)',
  'settings.preferencesHint':
    'Bahasa dan mata uang cuma mengubah tampilan angkanya. Dompet dan blockchain-mu tidak terpengaruh.',
  'settings.network': 'Jaringan',
  'settings.networkTestnet': 'Stellar Testnet',
  'settings.networkTestnetHint':
    'Aplikasi ini jalan di Stellar testnet. Dana di sini cuma buat uji coba dan tidak bernilai sungguhan.',
  'settings.contract': 'Kontrak',
  'settings.viewExplorer': 'Lihat di explorer',
  'settings.copy': 'Salin',
  'settings.copied': 'Tersalin',
  'settings.about': 'Celengan adalah demo tabungan terprogram di Stellar testnet.',
  'settings.byline': 'Celengan oleh Cyphras Labs',
  'settings.langEn': 'English',
  'settings.langId': 'Bahasa Indonesia',
  'settings.langVi': 'Tiếng Việt',
  'settings.langFil': 'Filipino',

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

const vi = {
  'landing.heroTitle': 'Tiết kiệm một phần từ mỗi khoản thanh toán, hoàn toàn tự động',
  'landing.heroSubtitle':
    'Celengan tự động chia mỗi khoản thanh toán bạn nhận được: một phần luôn sẵn sàng để chi tiêu, phần còn lại vào thẳng kho tiết kiệm sinh lời trên Stellar.',
  'landing.cta': 'Mở ứng dụng',
  'landing.feature1Title': 'Tự động chia khoản thanh toán',
  'landing.feature1Body':
    'Chỉ cần chọn tỷ lệ một lần. Mọi khoản thanh toán đến sẽ được chia giữa chi tiêu và tiết kiệm trước khi bạn kịp đụng vào.',
  'landing.feature2Title': 'Tiết kiệm sinh lời cho bạn',
  'landing.feature2Body':
    'Tiền tiết kiệm của bạn được đưa vào kho DeFindex trên Stellar testnet và bắt đầu sinh lời ngay lập tức.',
  'landing.feature3Title': 'Khóa tiết kiệm lại',
  'landing.feature3Body':
    'Đặt ngày khóa để giữ đúng cam kết với chính mình trong tương lai. Tiền tiết kiệm sẽ đứng yên cho đến ngày bạn chọn.',
  'landing.feature4Title': 'Nhận tiền bằng một đường link',
  'landing.feature4Body':
    'Chia sẻ link thanh toán hoặc mã QR của bạn. Khách hàng thanh toán bằng USDC và một phần mỗi giao dịch sẽ vào thẳng khoản tiết kiệm.',
  'landing.footer': 'Xây dựng trên Stellar testnet. Chỉ là tiền demo, không phải tiền thật.',

  'topbar.connect': 'Kết nối ví',
  'topbar.disconnect': 'Ngắt kết nối',
  'topbar.connected': 'Đã kết nối',
  'topbar.connecting': 'Đang kết nối',
  'topbar.testnet': 'Testnet',

  'dashboard.connectTitle': 'Kết nối ví của bạn',
  'dashboard.connectCaption':
    'Mỗi khoản thanh toán bạn nhận được sẽ vào hai túi: một để chi tiêu, một để tiết kiệm và sinh lời.',
  'dashboard.quickActions': 'Thao tác nhanh',

  'greeting.morning': 'Chào buổi sáng',
  'greeting.afternoon': 'Chào buổi chiều',
  'greeting.evening': 'Chào buổi tối',
  'greeting.night': 'Chào buổi đêm',

  'nav.menu': 'Menu',
  'nav.action': 'Thao tác',
  'nav.protocol': 'Giao thức',
  'nav.dashboard': 'Tổng quan',
  'nav.activity': 'Hoạt động',
  'nav.yield': 'Lợi nhuận',
  'nav.receive': 'Nhận tiền',
  'nav.withdraw': 'Rút tiền',
  'nav.rules': 'Quy tắc',
  'nav.faucet': 'Nhận USDC thử nghiệm',
  'nav.paymentLink': 'Link thanh toán',
  'nav.viewContract': 'Xem hợp đồng',
  'nav.disconnect': 'Ngắt kết nối ví',

  'shell.openMenu': 'Mở menu',
  'shell.theme': 'Đổi giao diện',
  'shell.copyAddress': 'Sao chép địa chỉ',

  'page.receiveCaption': 'Nhận một khoản thanh toán và xem nó được chia ngay khi đến.',
  'page.withdrawCaption': 'Rút tiền từ khoản chi tiêu hoặc tiết kiệm.',
  'page.rulesCaption': 'Tùy chỉnh tỷ lệ tiết kiệm và thời gian khóa.',
  'page.settingsCaption': 'Ngôn ngữ, tiền tệ, giao diện và thông tin mạng.',
  'page.yieldCaption': 'Xem tiền tiết kiệm của bạn sinh lời ở đâu và bao nhiêu.',

  'onboarding.title': 'Bắt đầu chỉ với 3 bước',
  'onboarding.step1Title': 'Kết nối ví',
  'onboarding.step1Caption': 'Dùng Freighter hoặc bất kỳ ví Stellar nào để bắt đầu.',
  'onboarding.step2Title': 'Nhận tiền thử nghiệm',
  'onboarding.step2Caption': 'Nhận miễn phí USDC testnet từ faucet, cùng với XLM để trả phí giao dịch.',
  'onboarding.step3Title': 'Nhận khoản thanh toán đầu tiên',
  'onboarding.step3Caption':
    'Tự gửi cho mình một khoản thanh toán và xem nó được chia vào chi tiêu và tiết kiệm.',
  'onboarding.done': 'Đã hoàn tất',

  'balances.total': 'Tổng số dư',
  'balances.spendable': 'Có thể chi tiêu',
  'balances.savings': 'Tiết kiệm',
  'balances.earningCaption': 'Đang sinh lời trong kho',
  'balances.lockedUntil': 'Khóa đến {date}',
  'balances.rateCaption': 'Ước tính khoảng {amount} cho mỗi USDC',
  'balances.pocketsHint':
    'Khoản chi tiêu có thể rút bất cứ lúc nào, khoản tiết kiệm thì sinh lời trong kho tiền.',
  'balances.emptyHint': 'Chưa có số dư nào.',
  'balances.earningsLine': '+{amount} đã sinh lời tính đến nay',

  'receive.title': 'Nhận thanh toán',
  'receive.caption':
    'Trong bản demo này, ví của bạn đóng vai khách hàng: nó sẽ trả tiền cho bạn, và Celengan sẽ chia khoản tiền đó ngay khi nhận được.',
  'receive.amountPlaceholder': 'Số tiền bằng USDC',
  'receive.preview': '{spend} vào chi tiêu, {save} vào tiết kiệm',
  'receive.button': 'Nhận thanh toán',
  'receive.quickAmounts': 'Số tiền nhanh',
  'receive.realPaymentHint':
    'Đây chỉ là mô phỏng khách hàng trả tiền cho bạn. Để nhận tiền thật, hãy chia sẻ link thanh toán của bạn.',
  'receive.faucetWhy':
    'Bạn cần có USDC testnet trong ví trước khi có thể mô phỏng một khoản thanh toán.',

  'rules.title': 'Quy tắc tiết kiệm của bạn',
  'rules.lockTitle': 'Khóa thời gian',
  'rules.splitLabel': 'Tỷ lệ tiết kiệm',
  'rules.splitSentence': '{pct}% mỗi khoản thanh toán sẽ vào tiết kiệm',
  'rules.saveButton': 'Lưu quy tắc',
  'rules.lockLabel': 'Khóa tiết kiệm đến',
  'rules.lockCaption':
    'Thời gian khóa chỉ có thể kéo dài thêm, không thể rút ngắn, và hợp đồng thông minh giới hạn khoảng thời gian bạn có thể đặt trong tương lai. Hãy chọn ngày thật cẩn thận.',
  'rules.lockButton': 'Khóa tiết kiệm',
  'rules.lockedStatus': 'Đã khóa đến {date}',
  'rules.noLock': 'Khoản tiết kiệm chưa bị khóa. Đặt một ngày để bảo vệ mục tiêu của bạn.',

  'withdraw.title': 'Rút tiền',
  'withdraw.spendTab': 'Chi tiêu',
  'withdraw.saveTab': 'Tiết kiệm',
  'withdraw.max': 'Tối đa',
  'withdraw.sharesPlaceholder': 'Số cổ phần muốn rút',
  'withdraw.button': 'Rút tiền',
  'withdraw.lockedReason': 'Tiết kiệm đang bị khóa đến {date}',
  'withdraw.sharesHint':
    'Khoản tiết kiệm được giữ dưới dạng cổ phần trong kho. Số USDC bạn nhận về đã bao gồm cả phần lợi nhuận sinh ra.',

  'yield.positionTitle': 'Tình trạng tiết kiệm của bạn',
  'yield.principal': 'Vốn gốc đã tiết kiệm',
  'yield.currentValue': 'Giá trị hiện tại',
  'yield.earnings': 'Lợi nhuận',
  'yield.estimate': 'Ước tính',
  'yield.estimateHint':
    'Được ước tính từ lịch sử thanh toán của bạn, giả định giá cổ phần là 1:1 tại mỗi lần gửi tiền.',
  'yield.shares': 'Cổ phần kho',
  'yield.sharePrice': 'Giá cổ phần',
  'yield.earningsCaption': 'Lợi nhuận là giá trị hiện tại trừ đi số tiền bạn đã bỏ vào.',
  'yield.refresh': 'Làm mới',
  'yield.sourcesTitle': 'Lợi nhuận của bạn đến từ đâu',
  'yield.sourcesCaption':
    'Hiện tại, khoản tiết kiệm của bạn được dẫn qua DeFindex. Sẽ có thêm nhiều nguồn khác trong thời gian tới.',
  'yield.bestYield': 'Lợi nhuận tốt nhất',
  'yield.badgeActive': 'Đang hoạt động',
  'yield.badgeSoon': 'Sắp ra mắt',
  'yield.apyLabel': 'APY',
  'yield.tvlLabel': 'TVL',
  'yield.sourceDefindexName': 'Kho USDC của DeFindex',
  'yield.sourceDefindexRoute': 'Dẫn vào pool USDC của Blend',
  'yield.sourceBlendName': 'Pool USDC của Blend',
  'yield.sourceBlendRoute': 'Cho vay USDC trực tiếp trên Blend',
  'yield.sourceSoroswapName': 'LP USDC của Soroswap',
  'yield.sourceSoroswapRoute': 'Cung cấp thanh khoản USDC trên Soroswap',

  'pay.title': 'Thanh toán cho {name}',
  'pay.splitInfo': '{pct}% khoản thanh toán này sẽ vào thẳng khoản tiết kiệm của họ',
  'pay.signHint':
    'Ví của bạn chỉ cần ký một giao dịch duy nhất. Việc chia thành chi tiêu và tiết kiệm diễn ra tự động trên blockchain.',
  'pay.payingFrom': 'Thanh toán từ',
  'pay.button': 'Thanh toán ngay',
  'pay.connectCta': 'Kết nối ví để thanh toán',
  'pay.connectCaption': 'Bạn thanh toán trực tiếp từ ví Stellar của mình. Không cần tạo tài khoản.',
  'pay.successTitle': 'Đã gửi thanh toán',
  'pay.successBody': 'Khoản thanh toán của bạn đến {name} đã thành công.',
  'pay.payAgain': 'Thanh toán lần nữa',
  'pay.createOwn': 'Tạo Celengan của riêng bạn',
  'pay.invalidTitle': 'Link thanh toán này có vẻ không hợp lệ',
  'pay.goHome': 'Đi đến Celengan',

  'paylink.title': 'Link thanh toán của bạn',
  'paylink.caption':
    'Bất kỳ ai có link này đều có thể thanh toán cho bạn. Quy tắc chia tiền của bạn sẽ tự động đưa một phần mỗi khoản thanh toán vào tiết kiệm.',
  'paylink.nameLabel': 'Tên hiển thị',
  'paylink.namePlaceholder': 'Hiển thị cho người trả tiền, không bắt buộc',
  'paylink.amountLabel': 'Số tiền cố định',
  'paylink.amountPlaceholder': 'USDC, không bắt buộc',
  'paylink.copy': 'Sao chép link',
  'paylink.share': 'Chia sẻ link thanh toán của bạn',

  'activity.title': 'Hoạt động',
  'activity.viewAll': 'Xem tất cả',
  'activity.filterAll': 'Tất cả',
  'activity.filterPayments': 'Thanh toán',
  'activity.filterWithdrawals': 'Rút tiền',
  'activity.filterChanges': 'Thay đổi',
  'activity.empty': 'Chưa có gì ở đây cả. Nhận một khoản thanh toán để bắt đầu.',
  'activity.pay': 'Đã nhận {amount}, tiết kiệm {saved}',
  'activity.wdSpend': 'Đã rút {amount} từ khoản chi tiêu',
  'activity.wdSave': 'Đã rút {amount} từ khoản tiết kiệm',
  'activity.split': 'Đã đặt tỷ lệ tiết kiệm thành {pct}%',
  'activity.lock': 'Đã khóa tiết kiệm đến {date}',

  'settings.title': 'Cài đặt',
  'settings.preferences': 'Tùy chọn',
  'settings.language': 'Ngôn ngữ',
  'settings.theme': 'Giao diện',
  'settings.themeLight': 'Sáng',
  'settings.themeDark': 'Tối',
  'settings.themeSystem': 'Theo hệ thống',
  'settings.aboutTitle': 'Giới thiệu',
  'settings.currency': 'Tiền tệ hiển thị',
  'settings.currencyIdr': 'Rupiah (IDR)',
  'settings.currencyUsdc': 'USDC',
  'settings.currencyVnd': 'Vietnamese Dong (VND)',
  'settings.currencyPhp': 'Philippine Peso (PHP)',
  'settings.preferencesHint':
    'Ngôn ngữ và tiền tệ chỉ thay đổi cách hiển thị số tiền. Chúng không ảnh hưởng đến ví hay blockchain của bạn.',
  'settings.network': 'Mạng',
  'settings.networkTestnet': 'Stellar Testnet',
  'settings.networkTestnetHint':
    'Ứng dụng này chạy trên Stellar testnet. Số tiền ở đây chỉ dùng để thử nghiệm và không có giá trị thật.',
  'settings.contract': 'Hợp đồng',
  'settings.viewExplorer': 'Xem trên explorer',
  'settings.copy': 'Sao chép',
  'settings.copied': 'Đã sao chép',
  'settings.about': 'Celengan là bản demo về tiết kiệm có thể lập trình trên Stellar testnet.',
  'settings.byline': 'Celengan bởi Cyphras Labs',
  'settings.langEn': 'English',
  'settings.langId': 'Bahasa Indonesia',
  'settings.langVi': 'Tiếng Việt',
  'settings.langFil': 'Filipino',

  'faucet.button': 'Nhận tiền thử nghiệm',
  'faucet.success': 'Tiền thử nghiệm đang được gửi đến ví của bạn',

  'success.paid': 'Đã nhận và chia thanh toán',
  'success.linkPaid': 'Đã gửi thanh toán',
  'success.withdrewSpend': 'Đã rút về ví của bạn',
  'success.withdrewSavings': 'Đã rút tiền tiết kiệm về ví của bạn',
  'success.splitSaved': 'Đã cập nhật quy tắc tiết kiệm',
  'success.lockSet': 'Đã khóa tiết kiệm',

  'errors.invalidAmount': 'Số tiền này có vẻ không đúng. Hãy nhập một số lớn hơn 0.',
  'errors.invalidSplit': 'Tỷ lệ chia phải nằm trong khoảng từ 0% đến 100%.',
  'errors.insufficientSpendable': 'Số dư chi tiêu không đủ để thực hiện việc này.',
  'errors.insufficientShares': 'Bạn không có đủ số tiền đó trong khoản tiết kiệm.',
  'errors.savingsLocked': 'Khoản tiết kiệm của bạn vẫn đang bị khóa.',
  'errors.lockNotExtended': 'Thời gian khóa chỉ có thể kéo dài thêm, không thể rút ngắn.',
  'errors.emptyWithdrawal': 'Không có gì để rút.',
  'errors.lockTooFar': 'Ngày khóa đó ở quá xa trong tương lai.',
  'errors.paused': 'Hợp đồng hiện đang tạm dừng. Vui lòng thử lại sau.',
  'errors.walletCancelled': 'Yêu cầu đã bị hủy trong ví của bạn.',
  'errors.generic': 'Đã có lỗi xảy ra. Vui lòng thử lại.',
  'errors.faucetUnavailable': 'Faucet hiện không khả dụng. Vui lòng thử lại sau ít phút.',
  'errors.faucetAlreadyFunded': 'Ví này đã có tiền thử nghiệm rồi.',
  'errors.loadFailed': 'Không thể tải tài khoản của bạn. Kiểm tra kết nối và thử lại.',
  'errors.invalidPayAddress': 'Địa chỉ trong link thanh toán này không phải là địa chỉ Stellar hợp lệ.',

  'common.loading': 'Đang tải',
  'common.retry': 'Thử lại',
  'common.close': 'Đóng',
  'common.connectFirst': 'Hãy kết nối ví trước.',
} satisfies Record<MessageKey, string>

const fil = {
  'landing.heroTitle': 'Mag-ipon ng bahagi sa bawat payment, awtomatiko',
  'landing.heroSubtitle':
    'Hinahati ng Celengan ang bawat payment na natatanggap mo: may bahaging pwede mong gastusin agad, at may bahaging diretso sa isang savings vault sa Stellar na kumikita ng yield.',
  'landing.cta': 'Buksan ang app',
  'landing.feature1Title': 'Auto-split na payments',
  'landing.feature1Body':
    'Pumili ng percentage, isang beses lang. Awtomatikong nahahati ang bawat papasok na payment sa spending at savings bago mo pa ito magalaw.',
  'landing.feature2Title': 'Savings na kumikita',
  'landing.feature2Body':
    'Napupunta ang savings mo sa isang DeFindex vault sa Stellar testnet at agad itong kumikita.',
  'landing.feature3Title': 'I-lock mo na',
  'landing.feature3Body':
    'Mag-set ng lock date para hindi ka matukso sa hinaharap. Hindi magagalaw ang savings hangga\'t hindi dumarating ang petsang pinili mo.',
  'landing.feature4Title': 'Tumanggap ng bayad gamit ang link',
  'landing.feature4Body':
    'I-share ang payment link o QR code mo. Magbabayad ang customers gamit ang USDC at diretso sa savings ang bahagi ng bawat benta.',
  'landing.footer': 'Gawa gamit ang Stellar testnet. Demo funds lang, walang totoong pera.',

  'topbar.connect': 'I-connect ang wallet',
  'topbar.disconnect': 'I-disconnect',
  'topbar.connected': 'Naka-connect',
  'topbar.connecting': 'Kumo-connect',
  'topbar.testnet': 'Testnet',

  'dashboard.connectTitle': 'I-connect ang wallet mo',
  'dashboard.connectCaption':
    'Bawat payment na natatanggap mo, napupunta sa dalawang pocket: isa pang-gastos, isa namang lumalaki bilang savings.',
  'dashboard.quickActions': 'Mabilisang Aksyon',

  'greeting.morning': 'Magandang umaga',
  'greeting.afternoon': 'Magandang hapon',
  'greeting.evening': 'Magandang gabi',
  'greeting.night': 'Magandang hatinggabi',

  'nav.menu': 'Menu',
  'nav.action': 'Aksyon',
  'nav.protocol': 'Protocol',
  'nav.dashboard': 'Dashboard',
  'nav.activity': 'Activity',
  'nav.yield': 'Yield',
  'nav.receive': 'Tumanggap',
  'nav.withdraw': 'Withdraw',
  'nav.rules': 'Rules',
  'nav.faucet': 'Kumuha ng test USDC',
  'nav.paymentLink': 'Payment link',
  'nav.viewContract': 'Tingnan ang contract',
  'nav.disconnect': 'I-disconnect ang wallet',

  'shell.openMenu': 'Buksan ang menu',
  'shell.theme': 'Palitan ang theme',
  'shell.copyAddress': 'Kopyahin ang address',

  'page.receiveCaption': 'Tumanggap ng bayad at panoorin itong awtomatikong mahati pagdating.',
  'page.withdrawCaption': 'Maglipat ng pera mula sa spending o savings.',
  'page.rulesCaption': 'I-adjust ang savings split at time lock mo.',
  'page.settingsCaption': 'Wika, currency, theme, at detalye ng network.',
  'page.yieldCaption': 'Tingnan kung saan kumikita ang savings mo, at magkano.',

  'onboarding.title': 'Simulan sa tatlong hakbang lang',
  'onboarding.step1Title': 'I-connect ang wallet mo',
  'onboarding.step1Caption': 'Gamitin ang Freighter o kahit anong Stellar wallet para makapagsimula.',
  'onboarding.step2Title': 'Kumuha ng test funds',
  'onboarding.step2Caption': 'Kumuha ng libreng testnet USDC mula sa faucet, plus XLM para sa fees.',
  'onboarding.step3Title': 'Tumanggap ng unang payment mo',
  'onboarding.step3Caption':
    'Magpadala ka sa sarili mong payment at panoorin itong mahati sa spending at savings.',
  'onboarding.done': 'Tapos na',

  'balances.total': 'Kabuuang balance',
  'balances.spendable': 'Pwedeng Gastusin',
  'balances.savings': 'Savings',
  'balances.earningCaption': 'Kumikita ng yield sa vault',
  'balances.lockedUntil': 'Naka-lock hanggang {date}',
  'balances.rateCaption': 'Tinatayang {amount} kada USDC',
  'balances.pocketsHint':
    'Ang pwedeng gastusin mo, pwede mong i-withdraw anumang oras - ang savings, lumalaki sa isang yield vault.',
  'balances.emptyHint': 'Wala pang balance.',
  'balances.earningsLine': '+{amount} kinita na sa ngayon',

  'receive.title': 'Tumanggap ng bayad',
  'receive.caption':
    'Sa demo na ito, ang wallet mo ang gaganap na customer: sya ang magbabayad sa iyo, at hahatiin agad ng Celengan ang pera sa sandaling dumating ito.',
  'receive.amountPlaceholder': 'Halaga sa USDC',
  'receive.preview': '{spend} sa spending, {save} sa savings',
  'receive.button': 'Tumanggap ng bayad',
  'receive.quickAmounts': 'Mabilisang halaga',
  'receive.realPaymentHint':
    'Simulation lang ito ng customer na nagbabayad sa iyo. Para makatanggap ng totoong bayad, i-share na lang ang payment link mo.',
  'receive.faucetWhy': 'Kailangan mo ng testnet USDC sa wallet mo bago mo ma-simulate ang isang payment.',

  'rules.title': 'Mga Patakaran sa Savings Mo',
  'rules.lockTitle': 'Time Lock',
  'rules.splitLabel': 'Savings split',
  'rules.splitSentence': '{pct}% ng bawat payment ay napupunta sa savings',
  'rules.saveButton': 'I-save ang Patakaran',
  'rules.lockLabel': 'I-lock ang savings hanggang',
  'rules.lockCaption':
    'Ang lock ay pwede lang pahabain, hindi maaaring paikliin, at may limitasyon ang contract kung gaano kalayo sa hinaharap ang pwede mong itakda. Piliin nang mabuti ang petsa mo.',
  'rules.lockButton': 'I-lock ang Savings',
  'rules.lockedStatus': 'Naka-lock hanggang {date}',
  'rules.noLock': 'Naka-unlock ang savings mo. Mag-set ng petsa para maprotektahan ang goal mo.',

  'withdraw.title': 'Withdraw',
  'withdraw.spendTab': 'Pwedeng Gastusin',
  'withdraw.saveTab': 'Savings',
  'withdraw.max': 'Max',
  'withdraw.sharesPlaceholder': 'Shares na i-withdraw',
  'withdraw.button': 'Mag-withdraw',
  'withdraw.lockedReason': 'Naka-lock ang savings hanggang {date}',
  'withdraw.sharesHint':
    'Naka-hold ang savings mo bilang vault shares; kasama na sa USDC na matatanggap mo ang anumang yield na kinita.',

  'yield.positionTitle': 'Savings position mo',
  'yield.principal': 'Naipong Principal',
  'yield.currentValue': 'Kasalukuyang Value',
  'yield.earnings': 'Kinita',
  'yield.estimate': 'Tantya',
  'yield.estimateHint':
    'Tinatantya batay sa payment history mo, sa pag-aakalang 1:1 ang share price sa bawat deposito.',
  'yield.shares': 'Vault shares',
  'yield.sharePrice': 'Share price',
  'yield.earningsCaption': 'Ang earnings ay ang kasalukuyang value mo minus ang inilagay mong halaga.',
  'yield.refresh': 'I-refresh',
  'yield.sourcesTitle': 'Saan galing ang yield mo',
  'yield.sourcesCaption':
    'Sa ngayon, dumadaan ang savings mo sa DeFindex. May karagdagang sources pa sa roadmap.',
  'yield.bestYield': 'Pinakamataas na yield',
  'yield.badgeActive': 'Aktibo',
  'yield.badgeSoon': 'Malapit na',
  'yield.apyLabel': 'APY',
  'yield.tvlLabel': 'TVL',
  'yield.sourceDefindexName': 'DeFindex USDC vault',
  'yield.sourceDefindexRoute': 'Dumadaan sa Blend USDC pool',
  'yield.sourceBlendName': 'Blend USDC pool',
  'yield.sourceBlendRoute': 'Direktang mag-lend ng USDC sa Blend',
  'yield.sourceSoroswapName': 'Soroswap USDC LP',
  'yield.sourceSoroswapRoute': 'Magbigay ng USDC liquidity sa Soroswap',

  'pay.title': 'Bayaran si {name}',
  'pay.splitInfo': '{pct}% ng payment na ito ay diretso sa savings nila',
  'pay.signHint':
    'Isang transaction lang ang pipirmahan ng wallet mo. Awtomatikong nangyayari on-chain ang paghahati sa spending at savings.',
  'pay.payingFrom': 'Nagbabayad mula sa',
  'pay.button': 'Bayaran na',
  'pay.connectCta': 'I-connect ang wallet para makabayad',
  'pay.connectCaption': 'Direktang magbabayad ka mula sa sarili mong Stellar wallet. Hindi na kailangan ng account.',
  'pay.successTitle': 'Naipadala ang bayad',
  'pay.successBody': 'Nakarating na ang bayad mo kay {name}.',
  'pay.payAgain': 'Magbayad ulit',
  'pay.createOwn': 'Gumawa ng sarili mong Celengan',
  'pay.invalidTitle': 'Mukhang sira ang payment link na ito',
  'pay.goHome': 'Pumunta sa Celengan',

  'paylink.title': 'Payment link mo',
  'paylink.caption':
    'Kahit sino na may link na ito ay pwedeng magbayad sa iyo. Awtomatikong inilalagay ng split rule mo ang bahagi ng bawat payment sa savings.',
  'paylink.nameLabel': 'Display name',
  'paylink.namePlaceholder': 'Makikita ng magbabayad, optional',
  'paylink.amountLabel': 'Preset na halaga',
  'paylink.amountPlaceholder': 'USDC, optional',
  'paylink.copy': 'Kopyahin ang link',
  'paylink.share': 'I-share ang payment link mo',

  'activity.title': 'Activity',
  'activity.viewAll': 'Tingnan lahat',
  'activity.filterAll': 'Lahat',
  'activity.filterPayments': 'Mga Payment',
  'activity.filterWithdrawals': 'Mga Withdrawal',
  'activity.filterChanges': 'Mga Pagbabago',
  'activity.empty': 'Wala pa dito. Tumanggap ng payment para magsimula.',
  'activity.pay': 'Natanggap na {amount}, na-save na {saved}',
  'activity.wdSpend': 'Nag-withdraw ng {amount} mula sa spendable',
  'activity.wdSave': 'Nag-withdraw ng {amount} mula sa savings',
  'activity.split': 'Na-set ang savings split sa {pct}%',
  'activity.lock': 'Naka-lock ang savings hanggang {date}',

  'settings.title': 'Settings',
  'settings.preferences': 'Mga Preference',
  'settings.language': 'Wika',
  'settings.theme': 'Theme',
  'settings.themeLight': 'Light',
  'settings.themeDark': 'Dark',
  'settings.themeSystem': 'System',
  'settings.aboutTitle': 'Tungkol Dito',
  'settings.currency': 'Currency na Ipapakita',
  'settings.currencyIdr': 'Rupiah (IDR)',
  'settings.currencyUsdc': 'USDC',
  'settings.currencyVnd': 'Vietnamese Dong (VND)',
  'settings.currencyPhp': 'Philippine Peso (PHP)',
  'settings.preferencesHint':
    'Ang wika at currency ay nagpapalit lang kung paano ipinapakita ang mga halaga. Hindi ito nakakaapekto sa wallet mo o sa blockchain.',
  'settings.network': 'Network',
  'settings.networkTestnet': 'Stellar Testnet',
  'settings.networkTestnetHint':
    'Tumatakbo ang app na ito sa Stellar testnet. Ang mga funds dito ay pantesting lang at walang totoong value.',
  'settings.contract': 'Contract',
  'settings.viewExplorer': 'Tingnan sa explorer',
  'settings.copy': 'Kopyahin',
  'settings.copied': 'Nakopya',
  'settings.about': 'Ang Celengan ay isang demo ng programmable savings sa Stellar testnet.',
  'settings.byline': 'Celengan by Cyphras Labs',
  'settings.langEn': 'English',
  'settings.langId': 'Bahasa Indonesia',
  'settings.langVi': 'Tiếng Việt',
  'settings.langFil': 'Filipino',

  'faucet.button': 'Kumuha ng test funds',
  'faucet.success': 'Padating na ang test funds sa wallet mo',

  'success.paid': 'Natanggap at nahati na ang payment',
  'success.linkPaid': 'Naipadala ang payment',
  'success.withdrewSpend': 'Na-withdraw na sa wallet mo',
  'success.withdrewSavings': 'Na-withdraw na ang savings sa wallet mo',
  'success.splitSaved': 'Na-update ang saving rule',
  'success.lockSet': 'Naka-lock na ang savings',

  'errors.invalidAmount': 'Mukhang mali ang halagang iyon. Maglagay ng numerong higit sa zero.',
  'errors.invalidSplit': 'Dapat nasa pagitan ng 0% at 100% ang split.',
  'errors.insufficientSpendable': 'Hindi sapat ang spendable balance mo para dito.',
  'errors.insufficientShares': 'Wala kang ganoon kalaking halaga sa savings.',
  'errors.savingsLocked': 'Naka-lock pa rin ang savings mo.',
  'errors.lockNotExtended': 'Ang lock ay pwede lang pahabain, hindi maaaring paikliin.',
  'errors.emptyWithdrawal': 'Walang pwedeng i-withdraw.',
  'errors.lockTooFar': 'Masyadong malayo sa hinaharap ang lock date na iyon.',
  'errors.paused': 'Naka-pause muna ang contract ngayon. Subukan ulit mamaya.',
  'errors.walletCancelled': 'Kinansela ang request sa wallet mo.',
  'errors.generic': 'May nagkamali. Subukan ulit.',
  'errors.faucetUnavailable': 'Hindi available ang faucet ngayon. Subukan ulit sandali.',
  'errors.faucetAlreadyFunded': 'May test funds na ang wallet na ito.',
  'errors.loadFailed': 'Hindi na-load ang account mo. I-check ang connection mo at subukan ulit.',
  'errors.invalidPayAddress': 'Ang address sa payment link na ito ay hindi valid na Stellar address.',

  'common.loading': 'Naglo-load',
  'common.retry': 'Subukan ulit',
  'common.close': 'Isara',
  'common.connectFirst': 'I-connect muna ang wallet mo.',
} satisfies Record<MessageKey, string>

const messages: Record<Locale, Record<MessageKey, string>> = { en, id, vi, fil }

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

export function intlLocale(locale: string): string {
  if (locale.startsWith('vi')) return 'vi-VN'
  if (locale.startsWith('fil')) return 'fil-PH'
  if (locale.startsWith('id')) return 'id-ID'
  return 'en-US'
}

type FiatCurrency = 'idr' | 'vnd' | 'php'

const FIAT_DECIMALS: Record<FiatCurrency, number> = { idr: 0, vnd: 0, php: 2 }

export function formatMoney(
  amount: bigint,
  currency: 'usdc' | FiatCurrency,
  rates: FxRates,
  locale: string,
): string {
  const usd = Number(amount) / 1e7
  if (currency === 'usdc') {
    const formatted = new Intl.NumberFormat(intlLocale(locale), {
      maximumFractionDigits: 2,
    }).format(usd)
    return `${formatted} USDC`
  }
  const digits = FIAT_DECIMALS[currency]
  return new Intl.NumberFormat(intlLocale(locale), {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(usd * rates[currency])
}

// where a fiat symbol sits relative to the digits (Rp/PHP are prefixed,
// VND is conventionally suffixed) - detected instead of hardcoded, so it
// stays correct if a locale/currency pairing formats differently than expected
export function currencyAffix(
  currency: FiatCurrency,
  locale: string,
): { symbol: string; position: 'prefix' | 'suffix' } {
  const parts = new Intl.NumberFormat(intlLocale(locale), {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).formatToParts(1)
  const currencyIndex = parts.findIndex((p) => p.type === 'currency')
  const integerIndex = parts.findIndex((p) => p.type === 'integer')
  const symbol = parts[currencyIndex]?.value ?? ''
  return { symbol, position: currencyIndex < integerIndex ? 'prefix' : 'suffix' }
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
