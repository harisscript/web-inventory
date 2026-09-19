import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useDebounce } from '@/shared/hooks/use-debounce'
import { useMediaQuery } from '@/shared/hooks/use-media-query'

import { CategoryFilter } from '../components/category-filter'
import { DeleteProductDialog } from '../components/delete-product-dialog'
import { ProductCard } from '../components/product-card'
import { ProductFormDialog } from '../components/product-form-dialog'
import { ProductSearch } from '../components/product-search'
import { ProductTable } from '../components/product-table'
import { useProducts } from '../hooks/use-products'
import type { Product } from '../types/product.types'

export function InventoryListPage() {
  const { t } = useTranslation(['inventory', 'common'])
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  const debouncedSearch = useDebounce(search, 300)
  const { data: products = [], isLoading } = useProducts({
    search: debouncedSearch || undefined,
    category: category as 'all',
  })

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormOpen(true)
  }

  const handleDelete = (product: Product) => {
    setDeletingProduct(product)
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setFormOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
          <ProductSearch value={search} onChange={setSearch} />
          <CategoryFilter value={category} onChange={setCategory} />
        </div>
        <Button onClick={handleAdd} className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          {t('addProduct')}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isDesktop ? (
        <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
          {products.length === 0 && (
            <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
              {t('common:noData')}
            </div>
          )}
        </div>
      )}

      <ProductFormDialog open={formOpen} onOpenChange={setFormOpen} product={editingProduct} />

      <DeleteProductDialog
        open={Boolean(deletingProduct)}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
        product={deletingProduct}
      />
    </div>
  )
}
