import { ArrowLeft, Package, Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { LanguageSwitcher } from '@/shared/components/language-switcher'
import { ThemeToggle } from '@/shared/components/theme-toggle'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'
import { restaurantService, useRestaurantSelectionStore } from '@/features/restaurant'
import { useAuthStore } from '@/features/auth'

import { LoginForm } from '../components/login-form'

export function LoginPage() {
  const { t } = useTranslation(['auth', 'common', 'restaurant'])
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const selectedRestaurantId = useRestaurantSelectionStore((s) => s.selectedRestaurantId)
  const clearSelection = useRestaurantSelectionStore((s) => s.clearSelection)

  const restaurant = selectedRestaurantId
    ? restaurantService.getByIdSync(selectedRestaurantId)
    : null

  if (isAuthenticated) {
    return <Navigate to="/inventory" replace />
  }

  if (!selectedRestaurantId) {
    return <Navigate to="/select-restaurant" replace />
  }

  const handleChangeRestaurant = () => {
    clearSelection()
    void navigate('/select-restaurant', { replace: false })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex items-center justify-between gap-1 p-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleChangeRestaurant}
          className="gap-1 px-2 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t('restaurant:changeRestaurant')}
        </Button>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">{t('welcomeBack')}</CardTitle>
            <CardDescription>{t('loginSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {restaurant ? (
              <div
                className={cn(
                  'flex items-center gap-3 rounded-lg border bg-muted/40 p-3 text-left',
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-lg text-white',
                    restaurant.accentColor,
                  )}
                  aria-hidden="true"
                >
                  {restaurant.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Store className="h-3 w-3" />
                    {t('restaurant:loggedInTo')}
                  </p>
                  <p className="truncate text-sm font-medium">{restaurant.name}</p>
                </div>
              </div>
            ) : null}
            <LoginForm restaurantId={selectedRestaurantId} />
            <p className="text-center text-sm text-muted-foreground">
              {t('noAccount')}{' '}
              <Link
                to="/register"
                state={{ restaurantId: selectedRestaurantId }}
                className="font-medium text-primary hover:underline"
              >
                {t('register')}
              </Link>
            </p>
            <div className="rounded-md bg-muted/50 p-2 text-center text-xs text-muted-foreground">
              <p className="mb-1 font-semibold">Demo Akun</p>
              <p>owner@kopikita.com / password123 (akses 2 restoran)</p>
              <p>manager.warung@kopikita.com / password123 (Warung)</p>
              <p>staff.sakura@kopikita.com / password123 (Sakura)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
