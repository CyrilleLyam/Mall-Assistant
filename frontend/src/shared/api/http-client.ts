import axios, { AxiosError } from 'axios'
import { env } from '../config/env'
import { camelizeKeys, snakeizeKeys } from '../lib/case-conversion'
import { tokenStorage } from '../lib/token-storage'

type UnauthorizedHandler = () => void

let onUnauthorized: UnauthorizedHandler | null = null

export const setUnauthorizedHandler = (handler: UnauthorizedHandler | null): void => {
  onUnauthorized = handler
}

export const httpClient = axios.create({ baseURL: env.apiUrl })

httpClient.interceptors.request.use((config) => {
  config.data = snakeizeKeys(config.data)
  config.params = snakeizeKeys(config.params)

  const token = tokenStorage.get()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => {
    response.data = camelizeKeys(response.data)
    return response
  },
  (error: AxiosError) => {
    if (error.response) {
      error.response.data = camelizeKeys(error.response.data)
      const hadToken = Boolean(tokenStorage.get())
      if (error.response.status === 401 && hadToken) {
        onUnauthorized?.()
      }
    }
    return Promise.reject(error)
  },
)

export const apiErrorStatus = (error: unknown): number | null =>
  axios.isAxiosError(error) ? (error.response?.status ?? null) : null
