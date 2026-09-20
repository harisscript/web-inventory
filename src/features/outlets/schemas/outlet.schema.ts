import i18n from '@/i18n/config'
import { z } from 'zod'

const t = (key: string): string => {
  const stripped = key.replace(/^outlets:/, '')
  return i18n.t(stripped, { ns: 'outlets' }) as string
}

export const outletSchema = z.object({
  restaurantId: z.string().min(1, { error: () => ({ message: t('outlets:restaurantRequired') }) }),
  name: z
    .string()
    .min(2, { error: () => ({ message: t('outlets:nameMin') }) })
    .max(100, { error: () => ({ message: t('outlets:nameMax') }) }),
  status: z.enum(['active', 'inactive']),
  address: z
    .string()
    .min(5, { error: () => ({ message: t('outlets:addressMin') }) })
    .max(200, { error: () => ({ message: t('outlets:addressMax') }) }),
  city: z
    .string()
    .min(2, { error: () => ({ message: t('outlets:cityMin') }) })
    .max(60, { error: () => ({ message: t('outlets:cityMax') }) }),
  contactPerson: z
    .string()
    .min(2, { error: () => ({ message: t('outlets:contactPersonMin') }) })
    .max(100, { error: () => ({ message: t('outlets:contactPersonMax') }) }),
  contactPhone: z
    .string()
    .min(6, { error: () => ({ message: t('outlets:contactPhoneMin') }) })
    .max(30, { error: () => ({ message: t('outlets:contactPhoneMax') }) }),
  defaultWarehouseId: z.string().optional().or(z.literal('')),
  emoji: z.string().max(8).optional(),
  accentColor: z.string().max(80).optional(),
})

export type OutletFormValues = z.infer<typeof outletSchema>
