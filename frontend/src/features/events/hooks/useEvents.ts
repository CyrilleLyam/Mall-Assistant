import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { eventsApi, type EventListParams } from '../api/events.api'

export const eventKeys = {
  all: ['events'] as const,
  list: (params: EventListParams) => ['events', 'list', params] as const,
}

export function useEvents(params: EventListParams) {
  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => eventsApi.list(params),
    placeholderData: (previous) => previous,
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: eventsApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.all }),
  })
}
