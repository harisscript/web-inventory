import { ArrowRight, MapPin, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

import type { Restaurant } from '../types/restaurant.types'

interface RestaurantCardProps {
  restaurant: Restaurant
  onSelect: (restaurant: Restaurant) => void
  isLoading?: boolean
}

export function RestaurantCard({ restaurant, onSelect, isLoading }: RestaurantCardProps) {
  const { t } = useTranslation('restaurant')

  return (
    <button
      type="button"
      onClick={() => onSelect(restaurant)}
      disabled={isLoading}
      className={cn(
        'group relative flex w-full flex-col overflow-hidden rounded-xl border bg-card text-left shadow-sm transition-all',
        'hover:border-primary hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-60',
      )}
    >
      <div
        className={cn(
          'relative flex h-28 items-center justify-center bg-gradient-to-br text-5xl text-white',
          restaurant.accentColor,
        )}
      >
        <span aria-hidden="true">{restaurant.emoji}</span>
        <Badge className="absolute right-3 top-3 bg-white/90 text-foreground hover:bg-white">
          {restaurant.cuisine}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold leading-tight">{restaurant.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {restaurant.description}
          </p>
        </div>

        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">
              {restaurant.address}, {restaurant.city}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>{restaurant.phone}</span>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          className="mt-auto w-full"
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(restaurant)
          }}
        >
          {t('selectRestaurant')}
          <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </button>
  )
}
