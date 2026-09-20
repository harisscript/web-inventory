import { createBrowserRouter } from 'react-router-dom'

import { RootRedirect } from '@/app/root-redirect'
import { AppLayout } from '@/shared/components/layout/app-layout'
import { ComingSoonPage } from '@/shared/components/coming-soon-page'
import { LoginPage, ProtectedRoute, RegisterPage } from '@/features/auth'
import { DashboardPage } from '@/features/dashboard'
import { InventoryListPage } from '@/features/inventory'
import { SelectRestaurantPage } from '@/features/restaurant'

export const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/select-restaurant', element: <SelectRestaurantPage /> },
  {
    path: '/register',
    element: (
      <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
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
      {
        path: 'inventory',
        element: (
          <ProtectedRoute resource="inventory" action="view">
            <InventoryListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute resource="dashboard" action="view">
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'outlets',
        element: (
          <ProtectedRoute resource="outlets" action="view">
            <ComingSoonPage titleKey="nav.outlets" />
          </ProtectedRoute>
        ),
      },
      {
        path: 'ingredients',
        element: (
          <ProtectedRoute resource="ingredients" action="view">
            <ComingSoonPage titleKey="nav.ingredients" />
          </ProtectedRoute>
        ),
      },
      {
        path: 'menus',
        element: (
          <ProtectedRoute resource="menus" action="view">
            <ComingSoonPage titleKey="nav.menus" />
          </ProtectedRoute>
        ),
      },
      {
        path: 'recipes',
        element: (
          <ProtectedRoute resource="recipes" action="view">
            <ComingSoonPage titleKey="nav.recipes" />
          </ProtectedRoute>
        ),
      },
      {
        path: 'purchases',
        element: (
          <ProtectedRoute resource="purchases" action="view">
            <ComingSoonPage titleKey="nav.purchases" />
          </ProtectedRoute>
        ),
      },
      {
        path: 'stock-history',
        element: (
          <ProtectedRoute resource="stockHistory" action="view">
            <ComingSoonPage titleKey="nav.stockHistory" />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reports',
        element: (
          <ProtectedRoute resource="reports" action="view">
            <ComingSoonPage titleKey="nav.reports" />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute resource="settings" action="view">
            <ComingSoonPage titleKey="nav.settings" />
          </ProtectedRoute>
        ),
      },
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
