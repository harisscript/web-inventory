import { Navigate } from 'react-router-dom'

import { useAuthStore } from '@/features/auth'

export function RootRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const activeRestaurantId = useAuthStore((s) => s.activeRestaurantId)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (!activeRestaurantId) {
    return <Navigate to="/select-restaurant" replace />
  }
  return <Navigate to="/inventory" replace />
}
