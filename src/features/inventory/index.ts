export { InventoryListPage } from './pages/inventory-list-page'
export { ProductTable } from './components/product-table'
export { ProductCard } from './components/product-card'
export { ProductForm } from './components/product-form'
export { ProductFormDialog } from './components/product-form-dialog'
export { ProductSearch } from './components/product-search'
export { CategoryFilter } from './components/category-filter'
export { StockBadge } from './components/stock-badge'
export { DeleteProductDialog } from './components/delete-product-dialog'
export { useProducts, useProduct, productsQueryKey } from './hooks/use-products'
export { useCreateProduct, useUpdateProduct, useDeleteProduct } from './hooks/use-product-mutations'
export { inventoryService } from './services/inventory.service'
export { productSchema } from './schemas/product.schema'
export type { ProductFormValues } from './schemas/product.schema'
export {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductInput,
  type ProductCategory,
  type ProductFilter,
} from './types/product.types'
