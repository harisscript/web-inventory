import { useQuery } from '@tanstack/react-query'

import { ingredientService } from '../services/ingredient.service'

export function useSuggestCode() {
  return useQuery({
    queryKey: ['ingredients', 'suggest-code'] as const,
    queryFn: () => ingredientService.suggestCode(),
    staleTime: 0,
  })
}
