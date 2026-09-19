import { delay } from '@/shared/lib/api'
import { storage } from '@/shared/lib/storage'

import type { AuthCredentials, AuthResponse, RegisterPayload, User } from '../types/auth.types'

const STORAGE_KEY = 'inventory.auth.users'
const SESSION_KEY = 'inventory.auth.session'

interface StoredUser extends User {
  password: string
}

function loadUsers(): StoredUser[] {
  return storage.get<StoredUser[]>(STORAGE_KEY, [])
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

    const { password: _password, ...safeUser } = user
    const response: AuthResponse = {
      user: safeUser,
      token: generateToken(),
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
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    saveUsers(users)

    const { password: _password, ...safeUser } = newUser
    const response: AuthResponse = {
      user: safeUser,
      token: generateToken(),
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
