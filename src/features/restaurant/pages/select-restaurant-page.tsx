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
import { useRestaurantSelectionStore } from '../store/restaurant.store'
import type { Restaurant } from '../types/restaurant.types'

export function SelectRestaurantPage() {
  const { t } = useTranslation(['restaurant', 'common'])
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setSelectedRestaurant = useRestaurantSelectionStore((s) => s.setSelectedRestaurant)
  const clearSelection = useRestaurantSelectionStore((s) => s.clearSelection)

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      void navigate('/inventory', { replace: true })
      return
    }

    let active = true
    restaurantService
      .list()
      .then((data) => {
        if (!active) return
        setRestaurants(data)
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
  }, [isAuthenticated, navigate, t])

  const handleSelect = (restaurant: Restaurant) => {
    setSubmittingId(restaurant.id)
    setSelectedRestaurant(restaurant.id)
    // Defer navigation so the persisted state has a chance to flush
    setTimeout(() => {
      void navigate('/login', { replace: false })
      setSubmittingId(null)
    }, 50)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex items-center justify-between gap-1 p-3">
        <button
          type="button"
          onClick={() => {
            clearSelection()
            void navigate('/login', { replace: false })
          }}
          className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          {t('restaurant:changeRestaurant')}
        </button>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
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

          {!isLoading && restaurants.length === 0 ? (
            <p className="rounded-md bg-muted/50 p-3 text-center text-sm text-muted-foreground">
              {t('restaurant:emptyState')}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
