import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import enCommon from './locales/en/common.json'
import idCommon from './locales/id/common.json'
import enAuth from '@/features/auth/locales/en.json'
import idAuth from '@/features/auth/locales/id.json'
import enInventory from '@/features/inventory/locales/en.json'
import idInventory from '@/features/inventory/locales/id.json'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/shared/config/constants'

export const i18nResources = {
  en: {
    common: enCommon,
    auth: enAuth,
    inventory: enInventory,
  },
  id: {
    common: idCommon,
    auth: idAuth,
    inventory: idInventory,
  },
} as const

export const NAMESPACES = ['common', 'auth', 'inventory'] as const

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
