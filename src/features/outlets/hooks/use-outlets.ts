import { useQuery } from '@tanstack/react-query'

import { useAuthStore } from '@/features/auth'

import { outletsService } from '../services/outlets.service'
import type { Outlet } from '../types/outlet.types'

const OUTLETS_QUERY_KEY = ['outlets'] as const

export function useOutlets() {
  const restaurantIds = useAuthStore((s) => s.user?.restaurantIds ?? [])
  return useQuery<Outlet[]>({
    queryKey: [...OUTLETS_QUERY_KEY, restaurantIds] as const,
    queryFn: () => outletsService.list({ restaurantIds }),
  })
}

export function useOutlet(id: string | undefined) {
  const restaurantIds = useAuthStore((s) => s.user?.restaurantIds ?? [])
  return useQuery({
    queryKey: ['outlet', id, restaurantIds] as const,
    queryFn: () => outletsService.get(id ?? '', { restaurantIds }),
    enabled: Boolean(id),
  })
}

export const outletsQueryKey = OUTLETS_QUERY_KEY
