import { ThemeProvider } from 'next-themes'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/app-shell'
import { Toaster } from '@/components/ui/sonner'
import { AppStateProvider } from '@/lib/app-state'
import { SettingsProvider } from '@/lib/settings'
import { WalletProvider } from '@/lib/wallet'
import { ActivityPage } from '@/pages/activity'
import { Dashboard } from '@/pages/dashboard'
import { Landing } from '@/pages/landing'
import { PayPage } from '@/pages/pay'

export function App() {
  return (
    <ThemeProvider
      attribute="class"
      storageKey="celengan:theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SettingsProvider>
        <WalletProvider>
          <AppStateProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/pay/:address" element={<PayPage />} />
                <Route path="/app" element={<AppShell />}>
                  <Route index element={<Dashboard />} />
                  <Route path="activity" element={<ActivityPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
            <Toaster />
          </AppStateProvider>
        </WalletProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}
