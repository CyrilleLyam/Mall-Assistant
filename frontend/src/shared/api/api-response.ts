import type { AxiosResponse } from 'axios'

export interface Pagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PageParams {
  page: number
  pageSize: number
}

export interface ApiResponse<T> {
  error: boolean
  data: T
  pagination: Pagination | null
}

export interface ApiErrorResponse {
  error: true
  statusCode: number
  code: string
  message: string | string[]
  data: null
  pagination: null
}

export interface Paged<T> {
  items: T[]
  pagination: Pagination
}

export async function unwrap<T>(request: Promise<AxiosResponse<ApiResponse<T>>>): Promise<T> {
  const { data } = await request
  return data.data
}

export async function unwrapPaged<T>(
  request: Promise<AxiosResponse<ApiResponse<T[]>>>,
): Promise<Paged<T>> {
  const { data } = await request
  if (!data.pagination) {
    throw new Error('Expected a paginated response')
  }
  return { items: data.data, pagination: data.pagination }
}
