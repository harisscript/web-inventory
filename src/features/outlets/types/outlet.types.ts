import type { ID, Timestamps } from '@/shared/types/common.types'

export type OutletStatus = 'active' | 'inactive'

export interface Outlet extends Timestamps {
  id: ID
  restaurantId: ID
  name: string
  status: OutletStatus
  address: string
  city: string
  contactPerson: string
  contactPhone: string
  defaultWarehouseId?: string
  ingredientCount: number
  emoji: string
  accentColor: string
}

export type OutletInput = Omit<Outlet, 'id' | 'createdAt' | 'updatedAt' | 'ingredientCount'>

export type OutletFormInput = Omit<OutletInput, 'accentColor' | 'emoji'> & {
  accentColor?: string
  emoji?: string
}

export interface OutletSummary {
  id: ID
  restaurantId: ID
  name: string
  status: OutletStatus
  city: string
  emoji: string
  accentColor: string
  ingredientCount: number
}
