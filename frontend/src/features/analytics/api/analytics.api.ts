import { httpClient } from '@/shared/api/http-client'
import { unwrap, type ApiResponse } from '@/shared/api/api-response'

export interface StoreView {
  tenantId: string
  nameEn: string
  nameKm: string
  searches: number
}

export interface TopTerm {
  term: string
  searches: number
  noResultSearches: number
}

export interface DailySearchCount {
  date: string
  searches: number
  noResultSearches: number
}

interface TopTermsParams {
  limit?: number
  days?: number
  noResultsOnly?: boolean
}

export const analyticsApi = {
  storeViews(limit = 10, days = 30): Promise<StoreView[]> {
    return unwrap(
      httpClient.get<ApiResponse<StoreView[]>>('/analytics/top-searches', {
        params: { limit, days },
      }),
    )
  },

  topTerms({ limit = 10, days = 30, noResultsOnly = false }: TopTermsParams = {}): Promise<TopTerm[]> {
    return unwrap(
      httpClient.get<ApiResponse<TopTerm[]>>('/analytics/top-terms', {
        params: { limit, days, noResultsOnly },
      }),
    )
  },

  searchesPerDay(days = 14): Promise<DailySearchCount[]> {
    return unwrap(
      httpClient.get<ApiResponse<DailySearchCount[]>>('/analytics/searches-per-day', {
        params: { days },
      }),
    )
  },
}
