import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ingredientService } from '../services/ingredient.service'
import type { Ingredient, IngredientInput } from '../types/ingredient.types'
import { ingredientsQueryKey } from './use-ingredients'

export function useCreateIngredient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: IngredientInput) => ingredientService.create(input),
    onSuccess: (ingredient: Ingredient) => {
      queryClient.setQueryData<Ingredient[]>(ingredientsQueryKey, (prev) =>
        prev ? [...prev, ingredient] : [ingredient],
      )
      void queryClient.invalidateQueries({ queryKey: ingredientsQueryKey })
    },
  })
}

export function useUpdateIngredient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<IngredientInput> }) =>
      ingredientService.update(id, input),
    onSuccess: (ingredient: Ingredient) => {
      queryClient.setQueryData<Ingredient[]>(ingredientsQueryKey, (prev) =>
        prev ? prev.map((p) => (p.id === ingredient.id ? ingredient : p)) : [ingredient],
      )
      queryClient.setQueryData(['ingredient', ingredient.id], ingredient)
    },
  })
}

export function useDeleteIngredient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ingredientService.remove(id),
    onSuccess: (_void, id) => {
      queryClient.setQueryData<Ingredient[]>(ingredientsQueryKey, (prev) =>
        prev ? prev.filter((p) => p.id !== id) : prev,
      )
    },
  })
}
