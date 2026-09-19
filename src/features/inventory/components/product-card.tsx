import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { formatCurrency } from '@/shared/lib/utils'

import { StockBadge } from './stock-badge'
import type { Product } from '../types/product.types'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const { t } = useTranslation(['inventory', 'common'])
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold">{product.name}</h3>
            <p className="font-mono text-xs text-muted-foreground">{product.sku}</p>
          </div>
          <StockBadge product={product} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t(`category.${product.category}`)}</span>
          <span className="font-semibold">{formatCurrency(product.price)}</span>
        </div>
        {product.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
        )}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(product)}>
            <Pencil className="mr-1 h-3 w-3" />
            {t('common:edit')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
