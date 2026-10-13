import { httpClient } from '@/shared/api/http-client'
import { unwrapPaged, type ApiResponse, type Paged, type PageParams } from '@/shared/api/api-response'
import type { MallEvent } from '../types'

export interface EventListParams extends PageParams {
  status?: 'current' | 'upcoming'
}

export const eventsApi = {
  list(params: EventListParams): Promise<Paged<MallEvent>> {
    return unwrapPaged(httpClient.get<ApiResponse<MallEvent[]>>('/events', { params }))
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/events/${id}`)
  },
}
