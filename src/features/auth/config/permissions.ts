import {
  Activity,
  ArrowLeftRight,
  BarChart3,
  BellRing,
  Boxes,
  Calculator,
  Carrot,
  ClipboardList,
  LayoutDashboard,
  ScrollText,
  Settings as SettingsIcon,
  ShoppingCart,
  Trash2,
  Truck,
  type LucideIcon,
} from 'lucide-react'

import type { User } from '../types/auth.types'

export type NavKey =
  | 'dashboard'
  | 'ingredients'
  | 'recipes'
  | 'suppliers'
  | 'stock'
  | 'stockOpname'
  | 'stockMovement'
  | 'waste'
  | 'purchaseOrders'
  | 'stockReport'
  | 'usageReport'
  | 'recipeCost'
  | 'lowStockAlerts'
  | 'settings'

export interface NavItemConfig {
  to: string
  key: NavKey
  labelKey: string
  icon: LucideIcon
  enabled: boolean
}

export type NavSectionId = 'main' | 'masterData' | 'operasional' | 'laporan'

export type NavTone = 'primary' | 'amber' | 'emerald' | 'sky'

export interface NavSectionConfig {
  id: NavSectionId
  labelKey: string | null
  tone: NavTone
  items: NavItemConfig[]
}

const ICONS: Record<NavKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  ingredients: Carrot,
  recipes: ScrollText,
  suppliers: Truck,
  stock: Boxes,
  stockOpname: ClipboardList,
  stockMovement: ArrowLeftRight,
  waste: Trash2,
  purchaseOrders: ShoppingCart,
  stockReport: BarChart3,
  usageReport: Activity,
  recipeCost: Calculator,
  lowStockAlerts: BellRing,
  settings: SettingsIcon,
}

const PATHS: Record<NavKey, string> = {
  dashboard: '/dashboard',
  ingredients: '/ingredients',
  recipes: '/recipes',
  suppliers: '/suppliers',
  stock: '/stock',
  stockOpname: '/stock-opname',
  stockMovement: '/stock-movement',
  waste: '/waste',
  purchaseOrders: '/purchase-orders',
  stockReport: '/stock-report',
  usageReport: '/usage-report',
  recipeCost: '/recipe-cost',
  lowStockAlerts: '/low-stock-alerts',
  settings: '/settings',
}

const SECTIONS: Record<NavSectionId, { labelKey: string | null; tone: NavTone; keys: NavKey[] }> = {
  main: { labelKey: null, tone: 'primary', keys: ['dashboard'] },
  masterData: {
    labelKey: 'nav.section.masterData',
    tone: 'amber',
    keys: ['ingredients', 'recipes', 'suppliers'],
  },
  operasional: {
    labelKey: 'nav.section.operasional',
    tone: 'emerald',
    keys: ['stock', 'stockOpname', 'stockMovement', 'waste', 'purchaseOrders'],
  },
  laporan: {
    labelKey: 'nav.section.laporan',
    tone: 'sky',
    keys: ['stockReport', 'usageReport', 'recipeCost', 'lowStockAlerts'],
  },
}

function isAllowed(role: User['role'], key: NavKey): boolean {
  if (role === 'owner' || role === 'manager') return true
  return key === 'dashboard' || key === 'stock'
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
  const order: NavKey[] = ['dashboard', 'stock', 'stockOpname', 'stockMovement', 'lowStockAlerts']
  return order
    .map((key) => items.find((item) => item.key === key))
    .filter((item): item is NavItemConfig => Boolean(item))
}
