export interface User {
  id: string
  email: string
  name: string
  role: 'owner' | 'manager' | 'staff'
  createdAt: string
  restaurantIds: string[]
}

export interface AuthCredentials {
  email: string
  password: string
  restaurantId: string
}

export interface RegisterPayload extends AuthCredentials {
  name: string
  confirmPassword: string
  role?: User['role']
}

export interface AuthResponse {
  user: User
  token: string
  activeRestaurantId: string
}

export interface AuthError {
  message: string
  code?: string
}
