import type { ID, Timestamps } from '@/shared/types/common.types'

export type IngredientCategory =
  | 'meat'
  | 'seafood'
  | 'egg'
  | 'dairy'
  | 'vegetable'
  | 'fruit'
  | 'spice'
  | 'flour'
  | 'noodle'
  | 'sauce'
  | 'beverage'
  | 'other'

export const INGREDIENT_CATEGORIES = [
  'meat',
  'seafood',
  'egg',
  'dairy',
  'vegetable',
  'fruit',
  'spice',
  'flour',
  'noodle',
  'sauce',
  'beverage',
  'other',
] as const satisfies readonly IngredientCategory[]

export type UnitType = 'mass' | 'volume' | 'count'

export interface UnitDefinition {
  code: string
  label: string
  type: UnitType
}

export const INGREDIENT_UNITS: readonly UnitDefinition[] = [
  { code: 'gram', label: 'Gram', type: 'mass' },
  { code: 'kg', label: 'Kilogram', type: 'mass' },
  { code: 'ml', label: 'Mililiter', type: 'volume' },
  { code: 'liter', label: 'Liter', type: 'volume' },
  { code: 'pcs', label: 'Pcs', type: 'count' },
  { code: 'pack', label: 'Pack', type: 'count' },
  { code: 'box', label: 'Box', type: 'count' },
  { code: 'sack', label: 'Sack', type: 'count' },
] as const

export type IngredientStatus = 'active' | 'inactive'

export const INGREDIENT_STATUSES = [
  'active',
  'inactive',
] as const satisfies readonly IngredientStatus[]

export interface Ingredient extends Timestamps {
  id: ID
  code: string
  name: string
  category: IngredientCategory
  baseUnit: string
  largeUnit: string | null
  conversionQty: number | null
  minStock: number
  status: IngredientStatus
  imageUrl?: string
  description?: string
}

export type IngredientInput = Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>

export interface IngredientFilter {
  category?: IngredientCategory | 'all'
  status?: IngredientStatus | 'all'
  search?: string
}
