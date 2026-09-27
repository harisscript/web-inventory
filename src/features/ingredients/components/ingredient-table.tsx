import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'

import { StatusBadge } from './status-badge'
import { describeConversion, formatNumber, getUnitLabel } from '../lib/format-uom'
import type { Ingredient } from '../types/ingredient.types'

interface IngredientTableProps {
  ingredients: Ingredient[]
  onEdit: (ingredient: Ingredient) => void
  onDelete: (ingredient: Ingredient) => void
}

export function IngredientTable({ ingredients, onEdit, onDelete }: IngredientTableProps) {
  const { t } = useTranslation(['ingredients', 'common'])

  if (ingredients.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
        {t('common:noData')}
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('ingredients:code')}</TableHead>
            <TableHead>{t('ingredients:title')}</TableHead>
            <TableHead>{t('ingredients:unit')}</TableHead>
            <TableHead className="text-right">{t('ingredients:minStock')}</TableHead>
            <TableHead className="text-center">{t('ingredients:status')}</TableHead>
            <TableHead className="text-right">{t('common:actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients.map((ingredient) => (
            <TableRow key={ingredient.id}>
              <TableCell className="font-mono text-xs">{ingredient.code}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  {ingredient.imageUrl ? (
                    <img
                      src={ingredient.imageUrl}
                      alt={ingredient.name}
                      className="h-10 w-10 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                      {ingredient.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium">{ingredient.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t(`ingredients:category.${ingredient.category}`)}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{getUnitLabel(ingredient.baseUnit)}</span>
                  {ingredient.largeUnit && ingredient.conversionQty != null && (
                    <span className="font-mono text-xs text-muted-foreground">
                      {describeConversion(
                        ingredient.baseUnit,
                        ingredient.largeUnit,
                        ingredient.conversionQty,
                      )}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatNumber(ingredient.minStock)}
              </TableCell>
              <TableCell className="text-center">
                <StatusBadge status={ingredient.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(ingredient)}
                    aria-label={t('common:edit')}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(ingredient)}
                    aria-label={t('common:delete')}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
