import { useTranslation } from 'react-i18next'

import { Badge } from '@/shared/components/ui/badge'

import type { Product } from '../types/product.types'

export function StockBadge({ product }: { product: Product }) {
  const { t } = useTranslation(['inventory', 'common'])
  const { stock, minStock } = product

  let variant: 'default' | 'destructive' | 'secondary' | 'outline' = 'secondary'
  let label = t('stockOk')

  if (stock === 0) {
    variant = 'destructive'
    label = t('stockEmpty')
  } else if (stock <= minStock) {
    variant = 'outline'
    label = t('stockLow')
  }

  return (
    <Badge variant={variant} className="font-mono">
      {stock} · {label}
    </Badge>
  )
}
