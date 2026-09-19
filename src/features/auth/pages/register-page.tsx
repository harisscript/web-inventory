import { Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'

import { LanguageSwitcher } from '@/shared/components/language-switcher'
import { ThemeToggle } from '@/shared/components/theme-toggle'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { useAuthStore } from '@/features/auth'

import { RegisterForm } from '../components/register-form'

export function RegisterPage() {
  const { t } = useTranslation(['auth', 'common'])
  const activeRestaurantId = useAuthStore((s) => s.activeRestaurantId)
  const user = useAuthStore((s) => s.user)

  if (!activeRestaurantId) {
    return <Navigate to="/select-restaurant" replace />
  }

  const derivedRestaurantId = activeRestaurantId ?? user?.restaurantIds[0] ?? ''

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex items-center justify-end gap-1 p-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">{t('createAccount')}</CardTitle>
            <CardDescription>{t('registerSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RegisterForm restaurantId={derivedRestaurantId} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
