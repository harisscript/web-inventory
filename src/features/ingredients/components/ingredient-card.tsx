import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'

import { StatusBadge } from './status-badge'
import { describeConversion, formatNumber, getUnitLabel } from '../lib/format-uom'
import type { Ingredient } from '../types/ingredient.types'

interface IngredientCardProps {
  ingredient: Ingredient
  onEdit: (ingredient: Ingredient) => void
  onDelete: (ingredient: Ingredient) => void
}

export function IngredientCard({ ingredient, onEdit, onDelete }: IngredientCardProps) {
  const { t } = useTranslation('ingredients')
  return (
    <Card>
      {ingredient.imageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={ingredient.imageUrl}
            alt={ingredient.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold">{ingredient.name}</h3>
            <p className="font-mono text-xs text-muted-foreground">{ingredient.code}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t(`category.${ingredient.category}`)}
            </p>
          </div>
          <StatusBadge status={ingredient.status} />
        </div>
        <div className="rounded-md border bg-muted/30 p-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('baseUnit')}</span>
            <span className="font-medium">{getUnitLabel(ingredient.baseUnit)}</span>
          </div>
          {ingredient.largeUnit && ingredient.conversionQty != null && (
            <>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-muted-foreground">{t('largeUnit')}</span>
                <span className="font-medium">{getUnitLabel(ingredient.largeUnit)}</span>
              </div>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {describeConversion(
                  ingredient.baseUnit,
                  ingredient.largeUnit,
                  ingredient.conversionQty,
                )}
              </p>
            </>
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('minStock')}</span>
          <span className="font-mono font-semibold">{formatNumber(ingredient.minStock)}</span>
        </div>
        {ingredient.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{ingredient.description}</p>
        )}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(ingredient)}>
            <Pencil className="mr-1 h-3 w-3" />
            {t('common:edit')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(ingredient)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
