import {
  Activity,
  BarChart3,
  Boxes,
  Carrot,
  History,
  LayoutDashboard,
  ScrollText,
  Settings as SettingsIcon,
  ShoppingCart,
  Store,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'

import type { User } from '../types/auth.types'

export type NavKey =
  | 'dashboard'
  | 'outlets'
  | 'ingredients'
  | 'menus'
  | 'recipes'
  | 'inventory'
  | 'purchases'
  | 'stockHistory'
  | 'stockReport'
  | 'usageReport'
  | 'settings'

export interface NavItemConfig {
  to: string
  key: NavKey
  labelKey: string
  icon: LucideIcon
  enabled: boolean
}

export type NavSectionId = 'main' | 'masterData' | 'operations' | 'reports' | 'system'

export type NavTone = 'primary' | 'amber' | 'emerald' | 'sky' | 'slate'

export interface NavSectionConfig {
  id: NavSectionId
  labelKey: string | null
  tone: NavTone
  items: NavItemConfig[]
}

const ICONS: Record<NavKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  outlets: Store,
  ingredients: Carrot,
  menus: UtensilsCrossed,
  recipes: ScrollText,
  inventory: Boxes,
  purchases: ShoppingCart,
  stockHistory: History,
  stockReport: BarChart3,
  usageReport: Activity,
  settings: SettingsIcon,
}

const PATHS: Record<NavKey, string> = {
  dashboard: '/dashboard',
  outlets: '/outlets',
  ingredients: '/ingredients',
  menus: '/menus',
  recipes: '/recipes',
  inventory: '/inventory',
  purchases: '/purchases',
  stockHistory: '/stock-history',
  stockReport: '/stock-report',
  usageReport: '/usage-report',
  settings: '/settings',
}

const SECTIONS: Record<NavSectionId, { labelKey: string | null; tone: NavTone; keys: NavKey[] }> = {
  main: { labelKey: null, tone: 'primary', keys: ['dashboard'] },
  masterData: {
    labelKey: 'nav.section.masterData',
    tone: 'amber',
    keys: ['outlets', 'ingredients', 'menus', 'recipes'],
  },
  operations: {
    labelKey: 'nav.section.operations',
    tone: 'emerald',
    keys: ['inventory', 'purchases', 'stockHistory'],
  },
  reports: {
    labelKey: 'nav.section.reports',
    tone: 'sky',
    keys: ['stockReport', 'usageReport'],
  },
  system: {
    labelKey: 'nav.section.system',
    tone: 'slate',
    keys: ['settings'],
  },
}

function isAllowed(role: User['role'], key: NavKey): boolean {
  if (role === 'owner' || role === 'manager') return true
  return key === 'dashboard' || key === 'inventory'
}

function buildNavSections(role: User['role']): NavSectionConfig[] {
  return (Object.keys(SECTIONS) as NavSectionId[]).map((id) => {
    const { labelKey, tone, keys } = SECTIONS[id]
    const items: NavItemConfig[] = keys
      .filter((key) => isAllowed(role, key))
      .map((key) => ({
        to: PATHS[key],
        key,
        labelKey: `nav.${key}`,
        icon: ICONS[key],
        enabled: role === 'owner' || role === 'manager' || key === 'dashboard',
      }))
    return { id, labelKey, tone, items }
  })
}

export const ROLE_NAV_PERMISSIONS: Record<User['role'], NavSectionConfig[]> = {
  owner: buildNavSections('owner'),
  manager: buildNavSections('manager'),
  staff: buildNavSections('staff'),
}

export function getNavItemsForRole(role: User['role'] | undefined): NavSectionConfig[] {
  if (!role) return ROLE_NAV_PERMISSIONS.staff
  return ROLE_NAV_PERMISSIONS[role]
}

export function getPrimaryNavItemsForRole(role: User['role'] | undefined): NavItemConfig[] {
  const sections = getNavItemsForRole(role)
  const items = sections.flatMap((section) => section.items)
  const order: NavKey[] = ['dashboard', 'inventory', 'purchases', 'stockHistory', 'settings']
  return order
    .map((key) => items.find((item) => item.key === key))
    .filter((item): item is NavItemConfig => Boolean(item))
}
