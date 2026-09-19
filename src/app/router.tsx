import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AppLayout } from '@/shared/components/layout/app-layout'
import { LoginPage, ProtectedRoute, RegisterPage } from '@/features/auth'
import { SelectRestaurantPage } from '@/features/restaurant'
import { InventoryListPage } from '@/features/inventory'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/select-restaurant" replace /> },
  { path: '/select-restaurant', element: <SelectRestaurantPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [{ path: 'inventory', element: <InventoryListPage /> }],
  },
  {
    path: '*',
    element: (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Halaman tidak ditemukan</p>
        <a href="/select-restaurant" className="text-primary hover:underline">
          Kembali ke pemilihan restoran
        </a>
      </div>
    ),
  },
])
