import { httpClient } from '@/shared/api/http-client'
import {
  unwrap,
  unwrapPaged,
  type ApiResponse,
  type Paged,
  type PageParams,
} from '@/shared/api/api-response'
import type { EventInput, MallEvent } from '../types'

export interface EventListParams extends PageParams {
  status?: 'current' | 'upcoming'
}

export const eventsApi = {
  list(params: EventListParams): Promise<Paged<MallEvent>> {
    return unwrapPaged(httpClient.get<ApiResponse<MallEvent[]>>('/events', { params }))
  },

  get(id: string): Promise<MallEvent> {
    return unwrap(httpClient.get<ApiResponse<MallEvent>>(`/events/${id}`))
  },

  create(input: EventInput): Promise<MallEvent> {
    return unwrap(httpClient.post<ApiResponse<MallEvent>>('/events', input))
  },

  update(id: string, input: EventInput): Promise<MallEvent> {
    return unwrap(httpClient.patch<ApiResponse<MallEvent>>(`/events/${id}`, input))
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/events/${id}`)
  },
}
