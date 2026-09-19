import { Store } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { LanguageSwitcher } from '@/shared/components/language-switcher'
import { ThemeToggle } from '@/shared/components/theme-toggle'
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useAuthStore } from '@/features/auth'

import { RestaurantCard } from '../components/restaurant-card'
import { restaurantService } from '../services/restaurant.service'
import type { Restaurant } from '../types/restaurant.types'

export function SelectRestaurantPage() {
  const { t } = useTranslation(['restaurant', 'common'])
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const setActiveRestaurant = useAuthStore((s) => s.setActiveRestaurant)

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      void navigate('/login', { replace: true })
      return
    }

    const accessibleIds = user.restaurantIds
    if (accessibleIds.length === 1) {
      setActiveRestaurant(accessibleIds[0])
      void navigate('/inventory', { replace: true })
      return
    }

    let active = true
    restaurantService
      .list()
      .then((all) => {
        if (!active) return
        const accessible = all.filter((r) => accessibleIds.includes(r.id))
        setRestaurants(accessible)
        if (accessible.length === 0) {
          setError(t('restaurant:emptyState'))
        }
      })
      .catch(() => {
        if (!active) return
        setError(t('restaurant:errorLoading'))
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [user, navigate, setActiveRestaurant, t])

  const handleSelect = (restaurant: Restaurant) => {
    setSubmittingId(restaurant.id)
    setActiveRestaurant(restaurant.id)
    setTimeout(() => {
      void navigate('/inventory', { replace: false })
      setSubmittingId(null)
    }, 50)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex items-center justify-end gap-1 p-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-3xl space-y-6">
          <Card className="border-dashed">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{t('restaurant:selectRestaurantTitle')}</CardTitle>
              <CardDescription>{t('restaurant:selectRestaurantSubtitle')}</CardDescription>
            </CardHeader>
          </Card>

          {error ? (
            <p className="rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {isLoading
              ? Array.from({ length: 2 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-72 animate-pulse rounded-xl border bg-muted/40"
                    aria-hidden="true"
                  />
                ))
              : restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onSelect={handleSelect}
                    isLoading={submittingId === restaurant.id}
                  />
                ))}
          </div>

          {!isLoading && restaurants.length === 0 && !error ? (
            <p className="rounded-md bg-muted/50 p-3 text-center text-sm text-muted-foreground">
              {t('restaurant:emptyState')}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
