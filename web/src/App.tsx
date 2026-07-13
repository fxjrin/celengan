import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AppStateProvider } from '@/lib/app-state'
import { SettingsProvider } from '@/lib/settings'
import { WalletProvider } from '@/lib/wallet'
import { Dashboard } from '@/pages/dashboard'
import { Landing } from '@/pages/landing'

export function App() {
  return (
    <SettingsProvider>
      <WalletProvider>
        <AppStateProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/app" element={<Dashboard />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AppStateProvider>
      </WalletProvider>
    </SettingsProvider>
  )
}
