import { createContext } from 'react'
import type { LoginRequest } from '../api/auth.api'

export interface AuthContextValue {
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
