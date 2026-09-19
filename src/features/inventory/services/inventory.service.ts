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
      name: 'Beras Premium 5kg',
      sku: 'BHN-RS-001',
      category: 'food',
      price: 75_000,
      stock: 24,
      minStock: 30,
      description: 'Beras putih premium untuk nasi harian di kedua restoran.',
    },
    {
      name: 'Minyak Goreng 2L',
      sku: 'BHN-MG-002',
      category: 'food',
      price: 38_000,
      stock: 60,
      minStock: 20,
      description: 'Minyak goreng sawit untuk menggoreng dan menumis.',
    },
    {
      name: 'Tepung Terigu 1kg',
      sku: 'BHN-TP-003',
      category: 'food',
      price: 15_000,
      stock: 45,
      minStock: 15,
      description: 'Tepung terigu protein sedang, untuk batter dan adonan.',
    },
    {
      name: 'Bawang Merah 1kg',
      sku: 'BHN-BR-004',
      category: 'food',
      price: 28_000,
      stock: 22,
      minStock: 8,
      description: 'Bawang merah segar sebagai bumbu dasar.',
    },
    {
      name: 'Bawang Putih 1kg',
      sku: 'BHN-BP-005',
      category: 'food',
      price: 32_000,
      stock: 20,
      minStock: 8,
    },
    {
      name: 'Kecap Manis 500ml',
      sku: 'BMB-KM-006',
      category: 'food',
      price: 25_000,
      stock: 40,
      minStock: 12,
      description: 'Kecap manis kental untuk masakan nusantara dan topping ramen.',
    },
    {
      name: 'Kaldu Sapi Instan 1kg',
      sku: 'BMB-KS-007',
      category: 'food',
      price: 65_000,
      stock: 18,
      minStock: 6,
      description: 'Bubuk kaldu sapi untuk kuah ramen dan sup.',
    },
    {
      name: 'Telur Ayam Negeri 1kg',
      sku: 'PRT-TL-008',
      category: 'food',
      price: 28_000,
      stock: 70,
      minStock: 24,
      description: 'Telur ayam segar ±16 butir untuk topping dan lauk.',
    },
    {
      name: 'Daging Ayam Fillet 1kg',
      sku: 'PRT-AY-009',
      category: 'food',
      price: 48_000,
      stock: 22,
      minStock: 8,
      description: 'Fillet daging ayam untuk ayam goreng dan topping ramen.',
    },
    {
      name: 'Daging Sapi Slice 500g',
      sku: 'PRT-SP-010',
      category: 'food',
      price: 78_000,
      stock: 3,
      minStock: 6,
      description: 'Daging sapi iris tipis untuk dendeng, rendang, dan gyudon.',
    },
    {
      name: 'Mie Telur 500g',
      sku: 'BHN-MT-011',
      category: 'food',
      price: 18_000,
      stock: 55,
      minStock: 20,
      description: 'Mie telur kuning untuk mie goreng dan ramen.',
    },
    {
      name: 'Wortel Segar 1kg',
      sku: 'SYN-WT-012',
      category: 'food',
      price: 18_000,
      stock: 18,
      minStock: 8,
    },
    {
      name: 'Daun Bawang 500g',
      sku: 'SYN-DB-013',
      category: 'food',
      price: 12_000,
      stock: 16,
      minStock: 6,
      description: 'Daun bawang untuk garnish kedua menu restoran.',
    },
    {
      name: 'Air Mineral Galon 19L',
      sku: 'MNM-AM-014',
      category: 'food',
      price: 22_000,
      stock: 35,
      minStock: 12,
      description: 'Air mineral galon untuk kebutuhan dapur dan minum tamu.',
    },
    {
      name: 'Teh Celup Premium (box)',
      sku: 'MNM-TH-015',
      category: 'food',
      price: 28_000,
      stock: 32,
      minStock: 10,
    },
    {
      name: 'Piring Keramik Datar',
      sku: 'PLK-PR-016',
      category: 'home',
      price: 18_000,
      stock: 120,
      minStock: 40,
      description: 'Piring keramik untuk saji makanan utama.',
    },
    {
      name: 'Mangkuk Keramik',
      sku: 'PLK-MK-017',
      category: 'home',
      price: 16_000,
      stock: 100,
      minStock: 40,
      description: 'Mangkuk untuk ramen dan soto.',
    },
    {
      name: 'Sumpit Kayu (pasang)',
      sku: 'PLK-SK-018',
      category: 'home',
      price: 8_000,
      stock: 140,
      minStock: 50,
    },
    {
      name: 'Sendok Stainless Steel',
      sku: 'PLK-SD-019',
      category: 'home',
      price: 12_000,
      stock: 130,
      minStock: 50,
    },
    {
      name: 'Gas LPG 12kg',
      sku: 'OPR-GL-020',
      category: 'home',
      price: 220_000,
      stock: 6,
      minStock: 4,
      description: 'Tabung gas LPG 12kg untuk kompor dapur.',
    },
    {
      name: 'Sabun Cuci Piring 800ml',
      sku: 'OPR-SP-021',
      category: 'health',
      price: 25_000,
      stock: 24,
      minStock: 8,
    },
    {
      name: 'Tisu Dapur (roll)',
      sku: 'OPR-TD-022',
      category: 'home',
      price: 18_000,
      stock: 36,
      minStock: 12,
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
