import { delay } from '@/shared/lib/api'
import { storage } from '@/shared/lib/storage'

import type { AuthCredentials, AuthResponse, RegisterPayload, User } from '../types/auth.types'

const STORAGE_KEY = 'inventory.auth.users'
const SESSION_KEY = 'inventory.auth.session'
const SEED_FLAG_KEY = 'inventory.auth.seeded'

interface StoredUser extends User {
  password: string
}

const SEED_PASSWORD = 'password123'

function buildSeedUsers(): StoredUser[] {
  const warung = 'rst_warung_nusantara'
  const sakura = 'rst_sakura_ramen'
  const now = new Date().toISOString()

  return [
    {
      id: 'usr_seed_super_admin',
      email: 'superadmin@kopikita.com',
      name: 'Budi Hartono',
      password: SEED_PASSWORD,
      role: 'super_admin',
      createdAt: now,
      restaurantIds: [warung, sakura],
    },
    {
      id: 'usr_seed_owner',
      email: 'owner@kopikita.com',
      name: 'Andi Wijaya',
      password: SEED_PASSWORD,
      role: 'owner',
      createdAt: now,
      restaurantIds: [warung, sakura],
    },
    {
      id: 'usr_seed_manager_warung',
      email: 'manager.warung@kopikita.com',
      name: 'Siti Aminah',
      password: SEED_PASSWORD,
      role: 'outlet_manager',
      createdAt: now,
      restaurantIds: [warung],
    },
    {
      id: 'usr_seed_manager_sakura',
      email: 'manager.sakura@kopikita.com',
      name: 'Hiroshi Tanaka',
      password: SEED_PASSWORD,
      role: 'outlet_manager',
      createdAt: now,
      restaurantIds: [sakura],
    },
    {
      id: 'usr_seed_staff_warung',
      email: 'staff.warung@kopikita.com',
      name: 'Joko Susilo',
      password: SEED_PASSWORD,
      role: 'inventory_staff',
      createdAt: now,
      restaurantIds: [warung],
    },
    {
      id: 'usr_seed_staff_sakura',
      email: 'staff.sakura@kopikita.com',
      name: 'Yuki Sato',
      password: SEED_PASSWORD,
      role: 'inventory_staff',
      createdAt: now,
      restaurantIds: [sakura],
    },
    {
      id: 'usr_seed_viewer',
      email: 'viewer@kopikita.com',
      name: 'Dewi Lestari',
      password: SEED_PASSWORD,
      role: 'viewer',
      createdAt: now,
      restaurantIds: [warung, sakura],
    },
  ]
}

function ensureSeed(users: StoredUser[]): StoredUser[] {
  const alreadySeeded = storage.get<boolean>(SEED_FLAG_KEY, false)
  if (alreadySeeded) return users
  storage.set(SEED_FLAG_KEY, true)
  const seed = buildSeedUsers()
  storage.set(STORAGE_KEY, seed)
  return seed
}

function loadUsers(): StoredUser[] {
  const stored = storage.get<StoredUser[] | null>(STORAGE_KEY, null)
  const users = stored && Array.isArray(stored) ? stored : []
  if (users.length === 0) return ensureSeed(users)
  if (!storage.get<boolean>(SEED_FLAG_KEY, false)) {
    storage.set(SEED_FLAG_KEY, true)
  }
  return users
}

function saveUsers(users: StoredUser[]): void {
  storage.set(STORAGE_KEY, users)
}

function generateId(): string {
  return `usr_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

function generateToken(): string {
  return `tok_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

function toSafeUser(user: StoredUser): User {
  const { password: _password, ...safe } = user
  return safe
}

export const authService = {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    await delay(400)
    const users = loadUsers()
    const user = users.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase())

    if (!user) {
      throw new Error('Email tidak terdaftar')
    }
    if (user.password !== credentials.password) {
      throw new Error('Password salah')
    }

    const response: AuthResponse = {
      user: toSafeUser(user),
      token: generateToken(),
      activeRestaurantId: user.restaurantIds[0] ?? null,
    }
    storage.set(SESSION_KEY, response)
    return response
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    await delay(500)
    const users = loadUsers()
    if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      throw new Error('Email sudah terdaftar')
    }
    const newUser: StoredUser = {
      id: generateId(),
      email: payload.email,
      name: payload.name,
      password: payload.password,
      role: payload.role ?? 'inventory_staff',
      createdAt: new Date().toISOString(),
      restaurantIds: [payload.restaurantId],
    }
    users.push(newUser)
    saveUsers(users)

    const response: AuthResponse = {
      user: toSafeUser(newUser),
      token: generateToken(),
      activeRestaurantId: payload.restaurantId,
    }
    storage.set(SESSION_KEY, response)
    return response
  },

  async logout(): Promise<void> {
    await delay(100)
    storage.remove(SESSION_KEY)
  },

  getSession(): AuthResponse | null {
    return storage.get<AuthResponse | null>(SESSION_KEY, null)
  },
}

export const SEED_DEMO_PASSWORD = SEED_PASSWORD
