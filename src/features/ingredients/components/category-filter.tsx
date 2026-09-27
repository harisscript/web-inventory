import { useTranslation } from 'react-i18next'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

import { INGREDIENT_CATEGORIES } from '../types/ingredient.types'

interface CategoryFilterProps {
  value: string
  onChange: (value: string) => void
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const { t } = useTranslation(['ingredients', 'common'])
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full md:w-44">
        <SelectValue placeholder={t('ingredients:categoryFilterPlaceholder')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('common:all')}</SelectItem>
        {INGREDIENT_CATEGORIES.map((cat) => (
          <SelectItem key={cat} value={cat}>
            {t(`ingredients:category.${cat}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
