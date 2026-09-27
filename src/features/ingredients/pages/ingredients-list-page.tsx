import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/components/ui/button'
import { Pagination } from '@/shared/components/ui/pagination'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useDebounce } from '@/shared/hooks/use-debounce'
import { useMediaQuery } from '@/shared/hooks/use-media-query'

import { CategoryFilter } from '../components/category-filter'
import { DeleteIngredientDialog } from '../components/delete-ingredient-dialog'
import { IngredientCard } from '../components/ingredient-card'
import { IngredientFormDialog } from '../components/ingredient-form-dialog'
import { IngredientSearch } from '../components/ingredient-search'
import { IngredientTable } from '../components/ingredient-table'
import { StatusFilter } from '../components/status-filter'
import { useIngredients } from '../hooks/use-ingredients'
import type { Ingredient } from '../types/ingredient.types'

const PAGE_SIZE = 8

export function IngredientsListPage() {
  const { t } = useTranslation(['ingredients', 'common'])
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)
  const [deletingIngredient, setDeletingIngredient] = useState<Ingredient | null>(null)

  const debouncedSearch = useDebounce(search, 300)
  const { data: ingredients = [], isLoading } = useIngredients({
    search: debouncedSearch || undefined,
    category: category as 'all',
    status: status as 'all',
  })

  const totalPages = Math.max(1, Math.ceil(ingredients.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = useMemo(
    () => ingredients.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [ingredients, safePage],
  )

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }
  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setPage(1)
  }
  const handleStatusChange = (value: string) => {
    setStatus(value)
    setPage(1)
  }

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient)
    setFormOpen(true)
  }

  const handleDelete = (ingredient: Ingredient) => {
    setDeletingIngredient(ingredient)
  }

  const handleAdd = () => {
    setEditingIngredient(null)
    setFormOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t('ingredients:title')}</h1>
        <p className="text-sm text-muted-foreground">{t('ingredients:subtitle')}</p>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
          <IngredientSearch value={search} onChange={handleSearchChange} />
          <CategoryFilter value={category} onChange={handleCategoryChange} />
          <StatusFilter value={status} onChange={handleStatusChange} />
        </div>
        <Button onClick={handleAdd} className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          {t('ingredients:addIngredient')}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : ingredients.length === 0 ? (
        <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
          {t('common:noData')}
        </div>
      ) : isDesktop ? (
        <IngredientTable ingredients={paginated} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <div className="space-y-2">
          {paginated.map((ingredient) => (
            <IngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {!isLoading && ingredients.length > 0 && (
        <div className="flex flex-col items-center gap-2 pt-2">
          <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
          <p className="text-xs text-muted-foreground">
            {t('ingredients:paginationSummary', {
              from: (safePage - 1) * PAGE_SIZE + 1,
              to: Math.min(safePage * PAGE_SIZE, ingredients.length),
              total: ingredients.length,
            })}
          </p>
        </div>
      )}

      <IngredientFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        ingredient={editingIngredient}
      />

      <DeleteIngredientDialog
        open={Boolean(deletingIngredient)}
        onOpenChange={(open) => !open && setDeletingIngredient(null)}
        ingredient={deletingIngredient}
      />
    </div>
  )
}
