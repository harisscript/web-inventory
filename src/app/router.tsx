import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AppLayout } from '@/shared/components/layout/app-layout'
import { LoginPage, ProtectedRoute, RegisterPage } from '@/features/auth'
import { InventoryListPage } from '@/features/inventory'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/inventory" replace /> },
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
        <a href="/inventory" className="text-primary hover:underline">
          Kembali ke Inventaris
        </a>
      </div>
    ),
  },
])
