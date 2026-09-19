import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings as SettingsIcon,
  type LucideIcon,
} from 'lucide-react'

import type { User } from '../types/auth.types'

export type NavKey = 'dashboard' | 'inventory' | 'products' | 'settings'

export interface NavItemConfig {
  to: string
  key: NavKey
  labelKey: string
  icon: LucideIcon
  primary: boolean
  enabled: boolean
}

const ICONS: Record<NavKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  inventory: Package,
  products: ShoppingBag,
  settings: SettingsIcon,
}

const PATHS: Record<NavKey, string> = {
  dashboard: '/dashboard',
  inventory: '/inventory',
  products: '/products',
  settings: '/settings',
}

function buildNavItems(role: User['role']): NavItemConfig[] {
  const all: NavKey[] = ['dashboard', 'inventory', 'products', 'settings']

  return all
    .filter((key) => {
      if (role === 'owner') return true
      if (role === 'manager') return key !== 'settings'
      return key === 'inventory'
    })
    .map<NavItemConfig>((key) => ({
      to: PATHS[key],
      key,
      labelKey: `nav.${key}`,
      icon: ICONS[key],
      primary: true,
      enabled: key === 'inventory',
    }))
}

export const ROLE_NAV_PERMISSIONS: Record<User['role'], NavItemConfig[]> = {
  owner: buildNavItems('owner'),
  manager: buildNavItems('manager'),
  staff: buildNavItems('staff'),
}

export function getNavItemsForRole(role: User['role'] | undefined): NavItemConfig[] {
  if (!role) return ROLE_NAV_PERMISSIONS.staff
  return ROLE_NAV_PERMISSIONS[role]
}

export function getPrimaryNavItemsForRole(role: User['role'] | undefined): NavItemConfig[] {
  return getNavItemsForRole(role).filter((item) => item.primary)
}
