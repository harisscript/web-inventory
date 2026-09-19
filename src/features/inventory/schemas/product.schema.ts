import i18n from '@/i18n/config'
import { z } from 'zod'

import { PRODUCT_CATEGORIES } from '../types/product.types'

const t = (key: string): string => {
  const stripped = key.replace(/^inventory:/, '')
  return i18n.t(stripped, { ns: 'inventory' }) as string
}

export const productSchema = z.object({
  name: z
    .string()
    .min(2, { error: () => ({ message: t('inventory:nameMin') }) })
    .max(100, { error: () => ({ message: t('inventory:nameMax') }) }),
  sku: z
    .string()
    .min(3, { error: () => ({ message: t('inventory:skuMin') }) })
    .max(20, { error: () => ({ message: t('inventory:skuMax') }) })
    .regex(/^[A-Z0-9-]+$/i, { error: () => ({ message: t('inventory:skuInvalid') }) }),
  category: z.enum(PRODUCT_CATEGORIES),
  price: z.number().min(0, { error: () => ({ message: t('inventory:priceNegative') }) }),
  stock: z
    .number()
    .int({ error: () => ({ message: t('inventory:stockInt') }) })
    .min(0, { error: () => ({ message: t('inventory:stockNegative') }) }),
  minStock: z
    .number()
    .int({ error: () => ({ message: t('inventory:minStockInt') }) })
    .min(0),
  description: z
    .string()
    .max(500, { error: () => ({ message: t('inventory:descriptionMax') }) })
    .optional()
    .or(z.literal('')),
  imageUrl: z
    .string()
    .url({ error: () => ({ message: t('inventory:imageUrlInvalid') }) })
    .optional()
    .or(z.literal('')),
})

export type ProductFormValues = z.infer<typeof productSchema>
