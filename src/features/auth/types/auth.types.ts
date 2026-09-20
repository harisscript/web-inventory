export const ROLES = [
  'super_admin',
  'owner',
  'outlet_manager',
  'inventory_staff',
  'viewer',
] as const

export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  owner: 'Owner / Admin',
  outlet_manager: 'Outlet Manager',
  inventory_staff: 'Inventory Staff',
  viewer: 'Viewer',
}

export const ACCESS_LEVELS = ['none', 'view', 'edit', 'full'] as const
export type AccessLevel = (typeof ACCESS_LEVELS)[number]

export const RESOURCES = [
  'dashboard',
  'outlets',
  'ingredients',
  'menus',
  'recipes',
  'inventory',
  'purchases',
  'stockHistory',
  'reports',
  'settings',
] as const
export type Resource = (typeof RESOURCES)[number]

export const ACTIONS = ['view', 'create', 'edit', 'delete'] as const
export type Action = (typeof ACTIONS)[number]

export interface User {
  id: string
  email: string
  name: string
  role: Role
  createdAt: string
  restaurantIds: string[]
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterPayload extends AuthCredentials {
  name: string
  confirmPassword: string
  restaurantId: string
  role?: Extract<Role, 'owner' | 'outlet_manager' | 'inventory_staff' | 'viewer'>
}

export interface AuthResponse {
  user: User
  token: string
  activeRestaurantId: string | null
}

export interface AuthError {
  message: string
  code?: string
}
