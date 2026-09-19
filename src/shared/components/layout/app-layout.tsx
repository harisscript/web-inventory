import { Outlet } from 'react-router-dom'

import { Header } from '@/shared/components/layout/header'
import { MobileNav } from '@/shared/components/layout/mobile-nav'
import { Sidebar } from '@/shared/components/layout/sidebar'
import { InstallPWA } from '@/shared/components/install-pwa'

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 lg:pb-6">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
        <MobileNav />
      </div>
      <InstallPWA />
    </div>
  )
}
