import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '../api/analytics.api'

export function useTopSearches() {
  return useQuery({
    queryKey: ['analytics', 'top-searches'],
    queryFn: () => analyticsApi.topSearches(),
  })
}

export function useSearchesPerDay() {
  return useQuery({
    queryKey: ['analytics', 'searches-per-day'],
    queryFn: () => analyticsApi.searchesPerDay(),
  })
}
