import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import enCommon from './locales/en/common.json'
import idCommon from './locales/id/common.json'
import enAuth from '@/features/auth/locales/en.json'
import idAuth from '@/features/auth/locales/id.json'
import enInventory from '@/features/inventory/locales/en.json'
import idInventory from '@/features/inventory/locales/id.json'
import enRestaurant from '@/features/restaurant/locales/en.json'
import idRestaurant from '@/features/restaurant/locales/id.json'
import enDashboard from '@/features/dashboard/locales/en.json'
import idDashboard from '@/features/dashboard/locales/id.json'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/shared/config/constants'

export const i18nResources = {
  en: {
    common: enCommon,
    auth: enAuth,
    inventory: enInventory,
    restaurant: enRestaurant,
    dashboard: enDashboard,
  },
  id: {
    common: idCommon,
    auth: idAuth,
    inventory: idInventory,
    restaurant: idRestaurant,
    dashboard: idDashboard,
  },
} as const

export const NAMESPACES = ['common', 'auth', 'inventory', 'restaurant', 'dashboard'] as const

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: i18nResources,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    ns: [...NAMESPACES],
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    returnNull: false,
  })

export default i18n
