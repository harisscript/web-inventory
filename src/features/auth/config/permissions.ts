import {
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

import type { AccessLevel, Action, Resource, Role, User } from '../types/auth.types'

const ACCESS_RANK: Record<AccessLevel, number> = {
  none: 0,
  view: 1,
  edit: 2,
  full: 3,
}

const ACTION_MIN_LEVEL: Record<Action, AccessLevel> = {
  view: 'view',
  create: 'edit',
  edit: 'edit',
  delete: 'full',
}

export const ROLE_PERMISSIONS: Record<Role, Record<Resource, AccessLevel>> = {
  super_admin: {
    dashboard: 'full',
    outlets: 'full',
    ingredients: 'full',
    menus: 'full',
    recipes: 'full',
    inventory: 'full',
    purchases: 'full',
    stockHistory: 'full',
    reports: 'full',
    settings: 'full',
  },
  owner: {
    dashboard: 'full',
    outlets: 'full',
    ingredients: 'full',
    menus: 'full',
    recipes: 'full',
    inventory: 'full',
    purchases: 'full',
    stockHistory: 'full',
    reports: 'full',
    settings: 'edit',
  },
  outlet_manager: {
    dashboard: 'full',
    outlets: 'view',
    ingredients: 'edit',
    menus: 'edit',
    recipes: 'edit',
    inventory: 'full',
    purchases: 'full',
    stockHistory: 'full',
    reports: 'full',
    settings: 'none',
  },
  inventory_staff: {
    dashboard: 'view',
    outlets: 'none',
    ingredients: 'edit',
    menus: 'view',
    recipes: 'view',
    inventory: 'full',
    purchases: 'full',
    stockHistory: 'view',
    reports: 'view',
    settings: 'none',
  },
  viewer: {
    dashboard: 'view',
    outlets: 'view',
    ingredients: 'view',
    menus: 'view',
    recipes: 'view',
    inventory: 'view',
    purchases: 'view',
    stockHistory: 'view',
    reports: 'full',
    settings: 'none',
  },
}

export function getAccessLevel(role: Role | undefined, resource: Resource): AccessLevel {
  if (!role) return 'none'
  return ROLE_PERMISSIONS[role][resource]
}

export function can(role: Role | undefined, resource: Resource, action: Action = 'view'): boolean {
  const level = getAccessLevel(role, resource)
  return ACCESS_RANK[level] >= ACCESS_RANK[ACTION_MIN_LEVEL[action]]
}

export function canAny(role: Role | undefined, pairs: Array<[Resource, Action]>): boolean {
  return pairs.some(([resource, action]) => can(role, resource, action))
}

export type NavKey = Extract<
  Resource,
  | 'dashboard'
  | 'outlets'
  | 'ingredients'
  | 'menus'
  | 'recipes'
  | 'inventory'
  | 'purchases'
  | 'stockHistory'
  | 'reports'
  | 'settings'
>

export interface NavItemConfig {
  to: string
  key: NavKey
  labelKey: string
  icon: LucideIcon
  enabled: boolean
  accessLevel: AccessLevel
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
  reports: BarChart3,
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
  reports: '/reports',
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
    keys: ['reports'],
  },
  system: {
    labelKey: 'nav.section.system',
    tone: 'slate',
    keys: ['settings'],
  },
}

const PRIMARY_NAV_ORDER: NavKey[] = [
  'dashboard',
  'inventory',
  'purchases',
  'stockHistory',
  'settings',
]

function buildNavSections(role: User['role']): NavSectionConfig[] {
  return (Object.keys(SECTIONS) as NavSectionId[]).map((id) => {
    const { labelKey, tone, keys } = SECTIONS[id]
    const items: NavItemConfig[] = keys
      .map((key) => {
        const accessLevel = getAccessLevel(role, key)
        const enabled = ACCESS_RANK[accessLevel] >= ACCESS_RANK.view
        return {
          to: PATHS[key],
          key,
          labelKey: `nav.${key}`,
          icon: ICONS[key],
          enabled,
          accessLevel,
        }
      })
      .filter((item) => item.enabled)

    return { id, labelKey, tone, items }
  })
}

export const ROLE_NAV_PERMISSIONS: Record<User['role'], NavSectionConfig[]> = {
  super_admin: buildNavSections('super_admin'),
  owner: buildNavSections('owner'),
  outlet_manager: buildNavSections('outlet_manager'),
  inventory_staff: buildNavSections('inventory_staff'),
  viewer: buildNavSections('viewer'),
}

export function getNavItemsForRole(role: User['role'] | undefined): NavSectionConfig[] {
  if (!role) return ROLE_NAV_PERMISSIONS.viewer
  return ROLE_NAV_PERMISSIONS[role]
}

export function getPrimaryNavItemsForRole(role: User['role'] | undefined): NavItemConfig[] {
  const items = getNavItemsForRole(role).flatMap((section) => section.items)
  return PRIMARY_NAV_ORDER.map((key) => items.find((item) => item.key === key)).filter(
    (item): item is NavItemConfig => Boolean(item),
  )
}
