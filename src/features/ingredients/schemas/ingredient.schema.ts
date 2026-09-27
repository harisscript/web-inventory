import i18n from '@/i18n/config'
import { z } from 'zod'

import {
  INGREDIENT_CATEGORIES,
  INGREDIENT_STATUSES,
  INGREDIENT_UNITS,
} from '../types/ingredient.types'

const t = (key: string): string => {
  const stripped = key.replace(/^ingredients:/, '')
  return i18n.t(stripped, { ns: 'ingredients' }) as string
}

const unitCodes = INGREDIENT_UNITS.map((u) => u.code) as [string, ...string[]]

export const ingredientSchema = z
  .object({
    code: z
      .string()
      .min(3, { error: () => ({ message: t('ingredients:codeMin') }) })
      .max(20, { error: () => ({ message: t('ingredients:codeMax') }) })
      .regex(/^[A-Z0-9-]+$/i, { error: () => ({ message: t('ingredients:codeInvalid') }) }),
    name: z
      .string()
      .min(2, { error: () => ({ message: t('ingredients:nameMin') }) })
      .max(100, { error: () => ({ message: t('ingredients:nameMax') }) }),
    category: z.enum(INGREDIENT_CATEGORIES),
    baseUnit: z.enum(unitCodes, {
      error: () => ({ message: t('ingredients:baseUnitRequired') }),
    }),
    largeUnit: z.enum(unitCodes).optional().or(z.literal('')),
    conversionQty: z
      .number()
      .positive({ error: () => ({ message: t('ingredients:conversionPositive') }) })
      .optional(),
    minStock: z.number().min(0, { error: () => ({ message: t('ingredients:minStockNegative') }) }),
    status: z.enum(INGREDIENT_STATUSES),
    description: z
      .string()
      .max(500, { error: () => ({ message: t('ingredients:descriptionMax') }) })
      .optional()
      .or(z.literal('')),
    imageUrl: z
      .string()
      .max(2_000_000, { error: () => ({ message: t('ingredients:imageTooLarge') }) })
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    const hasLarge = data.largeUnit && data.largeUnit !== ''
    const hasConversion = data.conversionQty !== undefined && data.conversionQty !== null

    if (hasLarge && data.largeUnit === data.baseUnit) {
      ctx.addIssue({
        code: 'custom',
        path: ['largeUnit'],
        message: t('ingredients:largeUnitSameAsBase'),
      })
    }
    if (hasLarge && !hasConversion) {
      ctx.addIssue({
        code: 'custom',
        path: ['conversionQty'],
        message: t('ingredients:conversionRequiredWhenLarge'),
      })
    }
    if (!hasLarge && hasConversion) {
      ctx.addIssue({
        code: 'custom',
        path: ['largeUnit'],
        message: t('ingredients:largeUnitRequiredWhenConversion'),
      })
    }
  })

export type IngredientFormValues = z.infer<typeof ingredientSchema>
