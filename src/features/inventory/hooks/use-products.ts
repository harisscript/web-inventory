import { useQuery } from '@tanstack/react-query'

import { inventoryService } from '../services/inventory.service'
import type { Product, ProductFilter } from '../types/product.types'

const PRODUCTS_QUERY_KEY = ['products'] as const

export function useProducts(filter?: ProductFilter) {
  return useQuery<Product[]>({
    queryKey: filter ? ([...PRODUCTS_QUERY_KEY, filter] as const) : PRODUCTS_QUERY_KEY,
    queryFn: () => inventoryService.list(),
    select: (data) => {
      let result = data
      if (filter?.category && filter.category !== 'all') {
        result = result.filter((p) => p.category === filter.category)
      }
      if (filter?.search) {
        const q = filter.search.toLowerCase()
        result = result.filter(
          (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
        )
      }
      return result
    },
  })
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id] as const,
    queryFn: () => inventoryService.get(id ?? ''),
    enabled: Boolean(id),
  })
}

export const productsQueryKey = PRODUCTS_QUERY_KEY
