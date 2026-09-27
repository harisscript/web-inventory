import { useTranslation } from 'react-i18next'

import { Badge } from '@/shared/components/ui/badge'

import type { IngredientStatus } from '../types/ingredient.types'

interface StatusBadgeProps {
  status: IngredientStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation('ingredients')
  const isActive = status === 'active'
  return (
    <Badge variant={isActive ? 'default' : 'secondary'} className="font-medium">
      {isActive ? t('statusActive') : t('statusInactive')}
    </Badge>
  )
}
