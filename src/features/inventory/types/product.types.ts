import type { ID, Timestamps } from '@/shared/types/common.types'

export type ProductCategory =
  'electronics' | 'fashion' | 'food' | 'books' | 'health' | 'home' | 'other'

export const PRODUCT_CATEGORIES = [
  'electronics',
  'fashion',
  'food',
  'books',
  'health',
  'home',
  'other',
] as const satisfies readonly ProductCategory[]

export interface Product extends Timestamps {
  id: ID
  name: string
  sku: string
  category: ProductCategory
  price: number
  stock: number
  minStock: number
  description?: string
  imageUrl?: string
}

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

export interface ProductFilter {
  category?: ProductCategory | 'all'
  search?: string
}
