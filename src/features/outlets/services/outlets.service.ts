import { delay } from '@/shared/lib/api'
import { storage } from '@/shared/lib/storage'
import type { ID } from '@/shared/types/common.types'
import { restaurantService } from '@/features/restaurant'

import type { Outlet, OutletInput } from '../types/outlet.types'

const STORAGE_KEY = 'inventory.outlets'

function generateId(): string {
  return `out_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

function buildSeedOutlet(restaurantId: ID, name: string, overrides: Partial<Outlet> = {}): Outlet {
  const now = new Date().toISOString()
  return {
    id: `out_main_${restaurantId.replace(/[^a-z0-9]/gi, '').toLowerCase()}`,
    restaurantId,
    name,
    status: 'active',
    address: '',
    city: '',
    contactPerson: '',
    contactPhone: '',
    ingredientCount: 0,
    emoji: '🏪',
    accentColor: 'from-amber-500 to-orange-600',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

function seedOutlets(): Outlet[] {
  const restaurants = restaurantService.listSync()
  return restaurants.map((r) =>
    buildSeedOutlet(r.id, r.name, {
      address: r.address,
      city: r.city,
      contactPerson: r.ownerName,
      contactPhone: r.phone,
      emoji: r.emoji,
      accentColor: r.accentColor,
      ingredientCount: ingredientCountFor(r.id),
    }),
  )
}

function ingredientCountFor(restaurantId: ID): number {
  const KNOWN: Record<string, number> = {
    rst_warung_nusantara: 85,
    rst_sakura_ramen: 72,
  }
  return KNOWN[restaurantId] ?? 60
}

function loadAll(): Outlet[] {
  const stored = storage.get<Outlet[] | null>(STORAGE_KEY, null)
  if (stored && Array.isArray(stored)) {
    const restaurants = restaurantService.listSync()
    const restaurantIds = new Set(restaurants.map((r) => r.id))
    const filtered = stored.filter((o) => restaurantIds.has(o.restaurantId))

    if (filtered.length === 0 && restaurants.length > 0) {
      const fresh = seedOutlets()
      storage.set(STORAGE_KEY, fresh)
      return fresh
    }

    if (filtered.length !== stored.length) {
      storage.set(STORAGE_KEY, filtered)
    }
    return filtered
  }

  const fresh = seedOutlets()
  storage.set(STORAGE_KEY, fresh)
  return fresh
}

function load(): Outlet[] {
  return loadAll()
}

function save(outlets: Outlet[]): void {
  storage.set(STORAGE_KEY, outlets)
}

export interface ListOptions {
  restaurantIds?: ID[]
}

export const outletsService = {
  async list(options: ListOptions = {}): Promise<Outlet[]> {
    await delay(180)
    const all = load()
    if (!options.restaurantIds || options.restaurantIds.length === 0) {
      return all
    }
    const allowed = new Set(options.restaurantIds)
    return all.filter((o) => allowed.has(o.restaurantId))
  },

  async get(id: string, options: ListOptions = {}): Promise<Outlet | null> {
    await delay(120)
    const all = load()
    const found = all.find((o) => o.id === id) ?? null
    if (!found) return null
    if (options.restaurantIds && options.restaurantIds.length > 0) {
      if (!options.restaurantIds.includes(found.restaurantId)) return null
    }
    return found
  },

  async create(input: OutletInput): Promise<Outlet> {
    await delay(280)
    const outlets = load()
    const now = new Date().toISOString()
    const newOutlet: Outlet = {
      ...input,
      id: generateId(),
      ingredientCount: 0,
      createdAt: now,
      updatedAt: now,
    }
    save([...outlets, newOutlet])
    return newOutlet
  },

  async update(id: string, input: Partial<OutletInput>): Promise<Outlet> {
    await delay(280)
    const outlets = load()
    const idx = outlets.findIndex((o) => o.id === id)
    if (idx === -1) throw new Error('Outlet tidak ditemukan')
    const updated: Outlet = {
      ...outlets[idx],
      ...input,
      updatedAt: new Date().toISOString(),
    }
    outlets[idx] = updated
    save(outlets)
    return updated
  },

  async remove(id: string): Promise<void> {
    await delay(220)
    save(load().filter((o) => o.id !== id))
  },

  async resetSeed(): Promise<Outlet[]> {
    const seed = seedOutlets()
    save(seed)
    return seed
  },
}

export { seedOutlets }
