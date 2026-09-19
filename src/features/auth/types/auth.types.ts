export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterPayload extends AuthCredentials {
  name: string
  confirmPassword: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface AuthError {
  message: string
  code?: string
}
