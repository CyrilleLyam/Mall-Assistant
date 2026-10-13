import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { eventsApi, type EventListParams } from '../api/events.api'
import type { EventInput } from '../types'

export const eventKeys = {
  all: ['events'] as const,
  list: (params: EventListParams) => ['events', 'list', params] as const,
  detail: (id: string) => ['events', 'detail', id] as const,
}

export function useEvents(params: EventListParams) {
  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => eventsApi.list(params),
    placeholderData: (previous) => previous,
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsApi.get(id),
    enabled: id !== '',
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: EventInput) => eventsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.all }),
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: EventInput }) => eventsApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.all }),
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: eventsApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.all }),
  })
}
