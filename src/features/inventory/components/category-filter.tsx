import { useTranslation } from 'react-i18next'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { PRODUCT_CATEGORIES } from '../types/product.types'

interface CategoryFilterProps {
  value: string
  onChange: (value: string) => void
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const { t } = useTranslation(['inventory', 'common'])
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full md:w-44">
        <SelectValue placeholder={t('common:filter')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('common:all')}</SelectItem>
        {PRODUCT_CATEGORIES.map((cat) => (
          <SelectItem key={cat} value={cat}>
            {t(`category.${cat}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
