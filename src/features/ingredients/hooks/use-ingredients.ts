import { useQuery } from '@tanstack/react-query'

import { ingredientService } from '../services/ingredient.service'
import type { Ingredient, IngredientFilter } from '../types/ingredient.types'

const INGREDIENTS_QUERY_KEY = ['ingredients'] as const

export function useIngredients(filter?: IngredientFilter) {
  return useQuery<Ingredient[]>({
    queryKey: filter ? ([...INGREDIENTS_QUERY_KEY, filter] as const) : INGREDIENTS_QUERY_KEY,
    queryFn: () => ingredientService.list(),
    select: (data) => {
      let result = data
      if (filter?.category && filter.category !== 'all') {
        result = result.filter((p) => p.category === filter.category)
      }
      if (filter?.status && filter.status !== 'all') {
        result = result.filter((p) => p.status === filter.status)
      }
      if (filter?.search) {
        const q = filter.search.toLowerCase()
        result = result.filter((p) => p.name.toLowerCase().includes(q))
      }
      return result
    },
  })
}

export function useIngredient(id: string | undefined) {
  return useQuery({
    queryKey: ['ingredient', id] as const,
    queryFn: () => ingredientService.get(id ?? ''),
    enabled: Boolean(id),
  })
}

export const ingredientsQueryKey = INGREDIENTS_QUERY_KEY
