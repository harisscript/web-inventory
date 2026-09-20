export { LoginForm } from './components/login-form'
export { RegisterForm } from './components/register-form'
export { ProtectedRoute } from './components/protected-route'
export { Can } from './components/can'
export { LoginPage } from './pages/login-page'
export { RegisterPage } from './pages/register-page'
export { useAuth } from './hooks/use-auth'
export { useCan, useAccessLevel } from './hooks/use-can'
export { useAuthStore } from './store/auth.store'
export { authService } from './services/auth.service'
export { loginSchema, registerSchema } from './schemas/auth.schema'
export type { LoginInput, RegisterInput } from './schemas/auth.schema'
export {
  ROLE_PERMISSIONS,
  can,
  canAny,
  getAccessLevel,
  getNavItemsForRole,
  getPrimaryNavItemsForRole,
} from './config/permissions'
export type {
  NavKey,
  NavItemConfig,
  NavSectionConfig,
  NavSectionId,
  NavTone,
} from './config/permissions'
export { ROLES, ACCESS_LEVELS, RESOURCES, ACTIONS, ROLE_LABELS } from './types/auth.types'
export type { Role, AccessLevel, Resource, Action } from './types/auth.types'
export type { User, AuthCredentials, RegisterPayload, AuthResponse } from './types/auth.types'
