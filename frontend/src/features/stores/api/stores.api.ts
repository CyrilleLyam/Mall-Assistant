import { httpClient } from '@/shared/api/http-client'
import {
  unwrap,
  unwrapPaged,
  type ApiResponse,
  type Paged,
  type PageParams,
} from '@/shared/api/api-response'
import type { Category, Store, StoreInput, StoreSearchParams } from '../types'

export const storesApi = {
  search(params: StoreSearchParams & PageParams): Promise<Paged<Store>> {
    return unwrapPaged(httpClient.get<ApiResponse<Store[]>>('/tenants', { params }))
  },

  get(id: string, searchQuery?: string): Promise<Store> {
    return unwrap(
      httpClient.get<ApiResponse<Store>>(`/tenants/${id}`, { params: { q: searchQuery } }),
    )
  },

  create(input: StoreInput): Promise<Store> {
    return unwrap(httpClient.post<ApiResponse<Store>>('/tenants', input))
  },

  update(id: string, input: StoreInput): Promise<Store> {
    return unwrap(httpClient.patch<ApiResponse<Store>>(`/tenants/${id}`, input))
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/tenants/${id}`)
  },

  async trackSearch(query: string): Promise<void> {
    await httpClient.post('/tenants/searches', { query })
  },

  listCategories(): Promise<Category[]> {
    return unwrap(httpClient.get<ApiResponse<Category[]>>('/categories'))
  },

  listFloors(): Promise<number[]> {
    return unwrap(httpClient.get<ApiResponse<number[]>>('/tenants/floors'))
  },
}
