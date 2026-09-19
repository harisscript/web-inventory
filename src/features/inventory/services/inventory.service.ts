import { delay } from '@/shared/lib/api'
import { storage } from '@/shared/lib/storage'

import type { Product, ProductCategory, ProductInput } from '../types/product.types'

const STORAGE_KEY = 'inventory.products'

function generateId(): string {
  return `prd_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

function seedProducts(): Product[] {
  const now = new Date().toISOString()
  const seed: Array<Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }> = [
    {
      name: 'Laptop Pro 14"',
      sku: 'LP-14-001',
      category: 'electronics',
      price: 18_500_000,
      stock: 12,
      minStock: 5,
      description: 'Laptop ringan dengan performa tinggi untuk profesional.',
    },
    {
      name: 'Wireless Mouse',
      sku: 'ACC-MS-002',
      category: 'electronics',
      price: 250_000,
      stock: 48,
      minStock: 20,
      description: 'Mouse nirkabel ergonomis dengan baterai tahan lama.',
    },
    {
      name: 'Kopi Arabica 250g',
      sku: 'FOD-KP-003',
      category: 'food',
      price: 75_000,
      stock: 100,
      minStock: 30,
      description: 'Biji kopi Arabica premium single origin dari Aceh.',
    },
    {
      name: 'Kaos Polos Hitam',
      sku: 'FSH-KS-004',
      category: 'fashion',
      price: 120_000,
      stock: 60,
      minStock: 25,
      description: 'Kaos polos katun combed 30s, nyaman dipakai sehari-hari.',
    },
    {
      name: 'Novel "Laskar Pelangi"',
      sku: 'BKS-NV-005',
      category: 'books',
      price: 95_000,
      stock: 25,
      minStock: 10,
    },
    {
      name: 'Vitamin C 500mg',
      sku: 'HLT-VC-006',
      category: 'health',
      price: 45_000,
      stock: 4,
      minStock: 20,
      description: 'Suplemen vitamin C 500mg, isi 30 tablet.',
    },
    {
      name: 'Lampu LED 12W',
      sku: 'HOM-LD-007',
      category: 'home',
      price: 55_000,
      stock: 75,
      minStock: 30,
    },
    {
      name: 'Headphone Bluetooth',
      sku: 'ELC-HP-008',
      category: 'electronics',
      price: 650_000,
      stock: 18,
      minStock: 10,
      description: 'Headphone over-ear dengan active noise cancellation.',
    },
    {
      name: 'Tas Selempang Kanvas',
      sku: 'FSH-TS-009',
      category: 'fashion',
      price: 280_000,
      stock: 22,
      minStock: 10,
    },
    {
      name: 'Buku Resep Nusantara',
      sku: 'BKS-RS-010',
      category: 'books',
      price: 145_000,
      stock: 2,
      minStock: 8,
      description: 'Kumpulan resep tradisional dari berbagai daerah di Indonesia.',
    },
  ]

  return seed.map((item) => ({
    ...item,
    id: item.id ?? generateId(),
    createdAt: now,
    updatedAt: now,
  }))
}

function load(): Product[] {
  const stored = storage.get<Product[] | null>(STORAGE_KEY, null)
  if (stored && Array.isArray(stored) && stored.length > 0) return stored
  const fresh = seedProducts()
  storage.set(STORAGE_KEY, fresh)
  return fresh
}

function save(products: Product[]): void {
  storage.set(STORAGE_KEY, products)
}

export const inventoryService = {
  async list(): Promise<Product[]> {
    await delay(200)
    return load()
  },

  async get(id: string): Promise<Product | null> {
    await delay(150)
    return load().find((p) => p.id === id) ?? null
  },

  async create(input: ProductInput): Promise<Product> {
    await delay(300)
    const products = load()
    const now = new Date().toISOString()
    const newProduct: Product = {
      ...input,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    save([...products, newProduct])
    return newProduct
  },

  async update(id: string, input: Partial<ProductInput>): Promise<Product> {
    await delay(300)
    const products = load()
    const idx = products.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error('Produk tidak ditemukan')
    const updated: Product = {
      ...products[idx],
      ...input,
      updatedAt: new Date().toISOString(),
    }
    products[idx] = updated
    save(products)
    return updated
  },

  async remove(id: string): Promise<void> {
    await delay(250)
    const products = load().filter((p) => p.id !== id)
    save(products)
  },

  async resetSeed(): Promise<Product[]> {
    const seed = seedProducts()
    save(seed)
    return seed
  },
}

export type { ProductCategory }
