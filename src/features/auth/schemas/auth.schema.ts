import i18n from '@/i18n/config'
import { z } from 'zod'

const t = (key: string): string => i18n.t(key.replace(/^auth:/, ''), { ns: 'auth' }) as string

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { error: () => ({ message: t('auth:emailRequired') }) })
    .email({ error: () => ({ message: t('auth:emailInvalid') }) }),
  password: z.string().min(6, { error: () => ({ message: t('auth:passwordMin') }) }),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: z.string().min(2, { error: () => ({ message: t('auth:nameMin') }) }),
    email: z
      .string()
      .min(1, { error: () => ({ message: t('auth:emailRequired') }) })
      .email({ error: () => ({ message: t('auth:emailInvalid') }) }),
    password: z.string().min(6, { error: () => ({ message: t('auth:passwordMin') }) }),
    confirmPassword: z
      .string()
      .min(6, { error: () => ({ message: t('auth:confirmPasswordMin') }) }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: () => ({ message: t('auth:passwordMismatch') }),
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>
