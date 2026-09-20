import { useMutation, useQueryClient } from '@tanstack/react-query'

import { outletsService } from '../services/outlets.service'
import type { Outlet, OutletInput } from '../types/outlet.types'
import { outletsQueryKey } from './use-outlets'

export function useCreateOutlet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: OutletInput) => outletsService.create(input),
    onSuccess: (outlet: Outlet) => {
      queryClient.setQueryData<Outlet[]>(outletsQueryKey, (prev) =>
        prev ? [...prev, outlet] : [outlet],
      )
      void queryClient.invalidateQueries({ queryKey: outletsQueryKey })
    },
  })
}

export function useUpdateOutlet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<OutletInput> }) =>
      outletsService.update(id, input),
    onSuccess: (outlet: Outlet) => {
      queryClient.setQueryData<Outlet[]>(outletsQueryKey, (prev) =>
        prev ? prev.map((o) => (o.id === outlet.id ? outlet : o)) : prev,
      )
      queryClient.setQueryData(['outlet', outlet.id], outlet)
    },
  })
}

export function useDeleteOutlet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => outletsService.remove(id),
    onSuccess: (_void, id) => {
      queryClient.setQueryData<Outlet[]>(outletsQueryKey, (prev) =>
        prev ? prev.filter((o) => o.id !== id) : prev,
      )
    },
  })
}
