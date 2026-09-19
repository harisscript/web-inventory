import { delay } from '@/shared/lib/api'
import { storage } from '@/shared/lib/storage'

import type { Restaurant } from '../types/restaurant.types'

const STORAGE_KEY = 'inventory.restaurants'

function seedRestaurants(): Restaurant[] {
  return [
    {
      id: 'rst_warung_nusantara',
      slug: 'warung-nusantara',
      name: 'Warung Nusantara',
      cuisine: 'Masakan Indonesia',
      description:
        'Restoran keluarga yang menyajikan hidangan nusantara otentik dengan cita rasa rumahan.',
      address: 'Jl. Merdeka No. 45',
      city: 'Jakarta Pusat',
      phone: '+62 21 1234 5678',
      ownerName: 'Andi Wijaya',
      accentColor: 'from-orange-500 to-red-600',
      emoji: '🍛',
    },
    {
      id: 'rst_sakura_ramen',
      slug: 'sakura-ramen-house',
      name: 'Sakura Ramen House',
      cuisine: 'Japanese Cuisine',
      description:
        'Restoran ramen autentik Jepang dengan kuah kaldu yang dimasak selama 12 jam setiap hari.',
      address: 'Jl. Asia Afrika No. 100',
      city: 'Bandung',
      phone: '+62 22 8765 4321',
      ownerName: 'Andi Wijaya',
      accentColor: 'from-rose-500 to-pink-600',
      emoji: '🍜',
    },
  ]
}

function load(): Restaurant[] {
  const stored = storage.get<Restaurant[] | null>(STORAGE_KEY, null)
  if (stored && Array.isArray(stored) && stored.length > 0) return stored
  const fresh = seedRestaurants()
  storage.set(STORAGE_KEY, fresh)
  return fresh
}

export const restaurantService = {
  async list(): Promise<Restaurant[]> {
    await delay(150)
    return load()
  },

  async get(id: string): Promise<Restaurant | null> {
    await delay(100)
    return load().find((r) => r.id === id) ?? null
  },

  getByIdSync(id: string): Restaurant | null {
    return load().find((r) => r.id === id) ?? null
  },
}

export { seedRestaurants }
