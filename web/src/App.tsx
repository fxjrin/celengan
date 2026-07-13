import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { WalletProvider } from '@/lib/wallet'
import { Dashboard } from '@/pages/dashboard'
import { Landing } from '@/pages/landing'

export function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </WalletProvider>
  )
}
