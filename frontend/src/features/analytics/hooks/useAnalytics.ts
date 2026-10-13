import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '../api/analytics.api'

export function useStoreViews() {
  return useQuery({
    queryKey: ['analytics', 'store-views'],
    queryFn: () => analyticsApi.storeViews(),
  })
}

export function useTopTerms() {
  return useQuery({
    queryKey: ['analytics', 'top-terms'],
    queryFn: () => analyticsApi.topTerms(),
  })
}

export function useNoResultTerms() {
  return useQuery({
    queryKey: ['analytics', 'no-result-terms'],
    queryFn: () => analyticsApi.topTerms({ noResultsOnly: true }),
  })
}

export function useSearchesPerDay() {
  return useQuery({
    queryKey: ['analytics', 'searches-per-day'],
    queryFn: () => analyticsApi.searchesPerDay(),
  })
}
