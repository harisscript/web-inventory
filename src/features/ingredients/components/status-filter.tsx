import { useTranslation } from 'react-i18next'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

import { INGREDIENT_STATUSES } from '../types/ingredient.types'

interface StatusFilterProps {
  value: string
  onChange: (value: string) => void
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  const { t } = useTranslation('ingredients')
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full md:w-40">
        <SelectValue placeholder={t('statusAll')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('statusAll')}</SelectItem>
        {INGREDIENT_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {s === 'active' ? t('statusActive') : t('statusInactive')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
