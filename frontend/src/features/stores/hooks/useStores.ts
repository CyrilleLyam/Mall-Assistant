import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PageParams } from '@/shared/api/api-response'
import { storesApi } from '../api/stores.api'
import type { StoreSearchParams } from '../types'

export const storeKeys = {
  all: ['stores'] as const,
  search: (params: StoreSearchParams & PageParams) => ['stores', 'search', params] as const,
  detail: (id: string, searchQuery?: string) => ['stores', 'detail', id, searchQuery] as const,
  categories: ['stores', 'categories'] as const,
  floors: ['stores', 'floors'] as const,
}

export function useStoreSearch(params: StoreSearchParams & PageParams) {
  return useQuery({
    queryKey: storeKeys.search(params),
    queryFn: () => storesApi.search(params),
    placeholderData: (previous) => previous,
  })
}

export function useStore(id: string, searchQuery?: string) {
  return useQuery({
    queryKey: storeKeys.detail(id, searchQuery),
    queryFn: () => storesApi.get(id, searchQuery),
  })
}

export function useCategories() {
  return useQuery({
    queryKey: storeKeys.categories,
    queryFn: storesApi.listCategories,
    staleTime: Infinity,
  })
}

export function useFloors() {
  return useQuery({
    queryKey: storeKeys.floors,
    queryFn: storesApi.listFloors,
  })
}

export function useDeleteStore() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: storesApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: storeKeys.all }),
  })
}
