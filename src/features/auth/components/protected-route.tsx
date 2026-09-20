import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuthStore } from '../store/auth.store'
import { can } from '../config/permissions'
import type { Action, Resource, Role } from '../types/auth.types'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: Role[]
  resource?: Resource
  action?: Action
}

export function ProtectedRoute({ children, allowedRoles, resource, action }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const role = user?.role
  const rolesAllowed = !allowedRoles || (role !== undefined && allowedRoles.includes(role))
  const resourceAllowed = !resource || can(role, resource, action)

  if (!rolesAllowed || !resourceAllowed) {
    return <Navigate to="/inventory" replace />
  }

  return <>{children}</>
}
