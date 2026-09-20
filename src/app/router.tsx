import { createBrowserRouter } from 'react-router-dom'

import { RootRedirect } from '@/app/root-redirect'
import { AppLayout } from '@/shared/components/layout/app-layout'
import { ComingSoonPage } from '@/shared/components/coming-soon-page'
import { LoginPage, ProtectedRoute, RegisterPage } from '@/features/auth'
import { InventoryListPage } from '@/features/inventory'
import { SelectRestaurantPage } from '@/features/restaurant'

export const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/select-restaurant', element: <SelectRestaurantPage /> },
  {
    path: '/register',
    element: (
      <ProtectedRoute allowedRoles={['owner', 'manager']}>
        <RegisterPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'inventory', element: <InventoryListPage /> },
      { path: 'dashboard', element: <ComingSoonPage titleKey="nav.dashboard" /> },
      { path: 'outlets', element: <ComingSoonPage titleKey="nav.outlets" /> },
      { path: 'ingredients', element: <ComingSoonPage titleKey="nav.ingredients" /> },
      { path: 'menus', element: <ComingSoonPage titleKey="nav.menus" /> },
      { path: 'recipes', element: <ComingSoonPage titleKey="nav.recipes" /> },
      { path: 'purchases', element: <ComingSoonPage titleKey="nav.purchases" /> },
      { path: 'stock-history', element: <ComingSoonPage titleKey="nav.stockHistory" /> },
      { path: 'stock-report', element: <ComingSoonPage titleKey="nav.stockReport" /> },
      { path: 'usage-report', element: <ComingSoonPage titleKey="nav.usageReport" /> },
      { path: 'settings', element: <ComingSoonPage titleKey="nav.settings" /> },
    ],
  },
  {
    path: '*',
    element: (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Halaman tidak ditemukan</p>
        <a href="/inventory" className="text-primary hover:underline">
          Kembali ke beranda
        </a>
      </div>
    ),
  },
])
