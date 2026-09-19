import { useMutation, useQueryClient } from '@tanstack/react-query'

import { inventoryService } from '../services/inventory.service'
import type { Product, ProductInput } from '../types/product.types'
import { productsQueryKey } from './use-products'

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProductInput) => inventoryService.create(input),
    onSuccess: (product: Product) => {
      queryClient.setQueryData<Product[]>(productsQueryKey, (prev) =>
        prev ? [...prev, product] : [product],
      )
      void queryClient.invalidateQueries({ queryKey: productsQueryKey })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ProductInput> }) =>
      inventoryService.update(id, input),
    onSuccess: (product: Product) => {
      queryClient.setQueryData<Product[]>(productsQueryKey, (prev) =>
        prev ? prev.map((p) => (p.id === product.id ? product : p)) : [product],
      )
      queryClient.setQueryData(['product', product.id], product)
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => inventoryService.remove(id),
    onSuccess: (_void, id) => {
      queryClient.setQueryData<Product[]>(productsQueryKey, (prev) =>
        prev ? prev.filter((p) => p.id !== id) : prev,
      )
    },
  })
}
