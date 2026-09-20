import type { ReactNode } from 'react'

import { useAuthStore } from '../store/auth.store'
import { can } from '../config/permissions'
import type { Action, Resource } from '../types/auth.types'

interface CanProps {
  resource: Resource
  action?: Action
  fallback?: ReactNode
  children: ReactNode
}

export function Can({ resource, action = 'view', fallback = null, children }: CanProps) {
  const role = useAuthStore((s) => s.user?.role)
  if (!can(role, resource, action)) return <>{fallback}</>
  return <>{children}</>
}
