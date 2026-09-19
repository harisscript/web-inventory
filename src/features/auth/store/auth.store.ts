import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { storage } from '@/shared/lib/storage'

import { authService } from '../services/auth.service'
import type { AuthCredentials, AuthResponse, RegisterPayload, User } from '../types/auth.types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (credentials: AuthCredentials) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => void
  clearError: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      async login(credentials) {
        set({ isLoading: true, error: null })
        try {
          const response: AuthResponse = await authService.login(credentials)
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          })
          return response.user
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Login gagal'
          set({ isLoading: false, error: message })
          throw err
        }
      },

      async register(payload) {
        set({ isLoading: true, error: null })
        try {
          const response: AuthResponse = await authService.register(payload)
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          })
          return response.user
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Registrasi gagal'
          set({ isLoading: false, error: message })
          throw err
        }
      },

      logout() {
        void authService.logout()
        set({ user: null, token: null, isAuthenticated: false, error: null })
        storage.remove('inventory.auth')
      },

      clearError() {
        set({ error: null })
      },

      hydrate() {
        const session = authService.getSession()
        if (session) {
          set({
            user: session.user,
            token: session.token,
            isAuthenticated: true,
          })
        }
      },
    }),
    {
      name: 'inventory.auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
