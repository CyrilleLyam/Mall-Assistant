import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { setUnauthorizedHandler } from '../../../shared/api/http-client'
import { tokenStorage } from '../../../shared/lib/token-storage'
import { authApi, type LoginRequest } from '../api/auth.api'
import { AuthContext, type AuthContextValue } from '../context/auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(() => tokenStorage.get())

  const login = useCallback(async (credentials: LoginRequest) => {
    const { accessToken, expiresIn } = await authApi.login(credentials)
    tokenStorage.set(accessToken, expiresIn)
    setToken(accessToken)
  }, [])

  const logout = useCallback(() => {
    tokenStorage.clear()
    setToken(null)
    queryClient.removeQueries({ queryKey: ['analytics'] })
  }, [queryClient])

  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated: token !== null, login, logout }),
    [token, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
