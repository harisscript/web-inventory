import { delay } from '@/shared/lib/api'
import { storage } from '@/shared/lib/storage'

import type { Ingredient, IngredientInput } from '../types/ingredient.types'

const STORAGE_KEY = 'ingredients.list'

function generateId(): string {
  return `ing_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

function seedIngredients(): Ingredient[] {
  const now = new Date().toISOString()
  const seed: Array<Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }> = [
    {
      code: 'BHN-DG-001',
      name: 'Daging Sapi',
      category: 'meat',
      baseUnit: 'gram',
      largeUnit: 'kg',
      conversionQty: 1000,
      minStock: 10_000,
      status: 'active',
      description: 'Daging sapi segar untuk bakso, rendang, dan gyudon.',
    },
    {
      code: 'BHN-AY-002',
      name: 'Daging Ayam',
      category: 'meat',
      baseUnit: 'gram',
      largeUnit: 'kg',
      conversionQty: 1000,
      minStock: 8_000,
      status: 'active',
      description: 'Fillet daging ayam untuk menu goreng dan topping ramen.',
    },
    {
      code: 'BHN-TL-003',
      name: 'Telur Ayam',
      category: 'egg',
      baseUnit: 'pcs',
      largeUnit: 'pack',
      conversionQty: 10,
      minStock: 50,
      status: 'active',
    },
    {
      code: 'BHN-KJ-004',
      name: 'Keju Mozzarella',
      category: 'dairy',
      baseUnit: 'gram',
      largeUnit: 'kg',
      conversionQty: 1000,
      minStock: 5_000,
      status: 'active',
      description: 'Keju mozzarella untuk topping ramen dan pizza.',
    },
    {
      code: 'BHN-BM-005',
      name: 'Bawang Merah',
      category: 'vegetable',
      baseUnit: 'gram',
      largeUnit: 'kg',
      conversionQty: 1000,
      minStock: 5_000,
      status: 'active',
    },
    {
      code: 'BHN-BP-006',
      name: 'Bawang Putih',
      category: 'vegetable',
      baseUnit: 'gram',
      largeUnit: 'kg',
      conversionQty: 1000,
      minStock: 3_000,
      status: 'active',
    },
    {
      code: 'BHN-TP-007',
      name: 'Tepung Terigu',
      category: 'flour',
      baseUnit: 'gram',
      largeUnit: 'kg',
      conversionQty: 1000,
      minStock: 10_000,
      status: 'active',
    },
    {
      code: 'BHN-MT-008',
      name: 'Mie Telur',
      category: 'noodle',
      baseUnit: 'gram',
      largeUnit: 'pack',
      conversionQty: 500,
      minStock: 5_000,
      status: 'active',
    },
    {
      code: 'BMB-KS-009',
      name: 'Kaldu Sapi Instan',
      category: 'spice',
      baseUnit: 'pcs',
      largeUnit: 'box',
      conversionQty: 24,
      minStock: 30,
      status: 'active',
    },
    {
      code: 'BHN-MG-010',
      name: 'Minyak Goreng',
      category: 'other',
      baseUnit: 'ml',
      largeUnit: 'liter',
      conversionQty: 1000,
      minStock: 10_000,
      status: 'active',
    },
    {
      code: 'BMB-KM-011',
      name: 'Kecap Manis',
      category: 'sauce',
      baseUnit: 'ml',
      largeUnit: 'liter',
      conversionQty: 1000,
      minStock: 5_000,
      status: 'inactive',
    },
  ]

  return seed.map((item) => ({
    ...item,
    id: item.id ?? generateId(),
    createdAt: now,
    updatedAt: now,
  }))
}

function ensureCodes(ingredients: Ingredient[]): Ingredient[] {
  let changed = false
  const result = ingredients.map((ing, idx) => {
    if (!ing.code) {
      changed = true
      return {
        ...ing,
        code: `BHN-${String(idx + 1).padStart(3, '0')}`,
      }
    }
    return ing
  })
  if (changed) save(result)
  return result
}

function nextSuggestedCode(existing: Ingredient[]): string {
  const usedNumbers = existing
    .map((ing) => ing.code.match(/(\d+)$/)?.[1])
    .filter((n): n is string => Boolean(n))
    .map((n) => parseInt(n, 10))
    .filter((n) => !Number.isNaN(n))
  const max = usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0
  return `BHN-${String(max + 1).padStart(3, '0')}`
}

function load(): Ingredient[] {
  const stored = storage.get<Ingredient[] | null>(STORAGE_KEY, null)
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return ensureCodes(stored)
  }
  const fresh = seedIngredients()
  storage.set(STORAGE_KEY, fresh)
  return fresh
}

function save(ingredients: Ingredient[]): void {
  storage.set(STORAGE_KEY, ingredients)
}

export const ingredientService = {
  async list(): Promise<Ingredient[]> {
    await delay(200)
    return load()
  },

  async get(id: string): Promise<Ingredient | null> {
    await delay(150)
    return load().find((p) => p.id === id) ?? null
  },

  async create(input: IngredientInput): Promise<Ingredient> {
    await delay(300)
    const ingredients = load()
    if (ingredients.some((p) => p.code === input.code)) {
      throw new Error('Kode bahan sudah digunakan')
    }
    const now = new Date().toISOString()
    const newIngredient: Ingredient = {
      ...input,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    save([...ingredients, newIngredient])
    return newIngredient
  },

  async update(id: string, input: Partial<IngredientInput>): Promise<Ingredient> {
    await delay(300)
    const ingredients = load()
    const idx = ingredients.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error('Bahan tidak ditemukan')
    if (input.code && ingredients.some((p) => p.id !== id && p.code === input.code)) {
      throw new Error('Kode bahan sudah digunakan')
    }
    const updated: Ingredient = {
      ...ingredients[idx],
      ...input,
      updatedAt: new Date().toISOString(),
    }
    ingredients[idx] = updated
    save(ingredients)
    return updated
  },

  async remove(id: string): Promise<void> {
    await delay(250)
    const ingredients = load().filter((p) => p.id !== id)
    save(ingredients)
  },

  async resetSeed(): Promise<Ingredient[]> {
    const seed = seedIngredients()
    save(seed)
    return seed
  },

  async suggestCode(): Promise<string> {
    await delay(50)
    return nextSuggestedCode(load())
  },
}
