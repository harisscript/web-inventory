import { ArrowLeft, Package, Store } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

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

import { RegisterForm } from '../components/register-form'

interface RegisterLocationState {
  restaurantId?: string
}

export function RegisterPage() {
  const { t } = useTranslation(['auth', 'common', 'restaurant'])
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as RegisterLocationState | null

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const selectedRestaurantId = useRestaurantSelectionStore((s) => s.selectedRestaurantId)
  const setSelectedRestaurant = useRestaurantSelectionStore((s) => s.setSelectedRestaurant)
  const clearSelection = useRestaurantSelectionStore((s) => s.clearSelection)

  const activeRestaurantId = state?.restaurantId ?? selectedRestaurantId

  useEffect(() => {
    if (state?.restaurantId && state.restaurantId !== selectedRestaurantId) {
      setSelectedRestaurant(state.restaurantId)
    }
  }, [state?.restaurantId, selectedRestaurantId, setSelectedRestaurant])

  const restaurant = activeRestaurantId ? restaurantService.getByIdSync(activeRestaurantId) : null

  if (isAuthenticated) {
    return <Navigate to="/inventory" replace />
  }

  if (!activeRestaurantId) {
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
            <CardTitle className="text-xl">{t('createAccount')}</CardTitle>
            <CardDescription>{t('registerSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {restaurant ? (
              <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3 text-left">
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
            <RegisterForm restaurantId={activeRestaurantId} />
            <p className="text-center text-sm text-muted-foreground">
              {t('haveAccount')}{' '}
              <Link
                to="/login"
                state={{ restaurantId: activeRestaurantId }}
                className="font-medium text-primary hover:underline"
              >
                {t('login')}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
