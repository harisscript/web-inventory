import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Input } from '@/shared/components/ui/input'

interface IngredientSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function IngredientSearch({ value, onChange, placeholder }: IngredientSearchProps) {
  const { t } = useTranslation('ingredients')
  return (
    <div className="relative w-full md:max-w-xs">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t('searchPlaceholder')}
        className="pl-9"
        type="search"
      />
    </div>
  )
}
