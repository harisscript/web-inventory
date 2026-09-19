export const APP_NAME = 'Web Inventory'
export const APP_SHORT_NAME = 'Inventory'
export const APP_DESCRIPTION = 'Aplikasi inventory PWA yang responsive'

export const SUPPORTED_LANGUAGES = ['id', 'en'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = 'id'

export const STORAGE_KEYS = {
  AUTH: 'inventory.auth',
  PRODUCTS: 'inventory.products',
  THEME: 'inventory.theme',
  LANGUAGE: 'i18nextLng',
} as const
