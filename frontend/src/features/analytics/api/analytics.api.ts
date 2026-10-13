import { httpClient } from '@/shared/api/http-client'
import { unwrap, type ApiResponse } from '@/shared/api/api-response'

export interface TopSearch {
  tenantId: string
  nameEn: string
  nameKm: string
  searches: number
}

export interface DailySearchCount {
  date: string
  searches: number
}

export const analyticsApi = {
  topSearches(limit = 10, days = 30): Promise<TopSearch[]> {
    return unwrap(
      httpClient.get<ApiResponse<TopSearch[]>>('/analytics/top-searches', {
        params: { limit, days },
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
