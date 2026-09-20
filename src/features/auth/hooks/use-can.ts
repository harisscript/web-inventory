import { useAuthStore } from '../store/auth.store'
import type { Action, Resource } from '../types/auth.types'
import { can, getAccessLevel } from '../config/permissions'

export function useCan(resource: Resource, action: Action = 'view'): boolean {
  const role = useAuthStore((s) => s.user?.role)
  return can(role, resource, action)
}

export function useAccessLevel(resource: Resource) {
  const role = useAuthStore((s) => s.user?.role)
  return getAccessLevel(role, resource)
}
