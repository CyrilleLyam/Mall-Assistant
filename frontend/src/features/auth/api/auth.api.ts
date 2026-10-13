import { httpClient } from '@/shared/api/http-client'
import { unwrap, type ApiResponse } from '@/shared/api/api-response'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  expiresIn: number
}

export const authApi = {
  login(credentials: LoginRequest): Promise<LoginResponse> {
    return unwrap(httpClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials))
  },
}
