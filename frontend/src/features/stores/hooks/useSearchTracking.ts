import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { storesApi } from '../api/stores.api'

const SETTLE_MS = 1000
const MIN_TERM_LENGTH = 2

export function useSearchTracking(search: string): (rawTerm: string) => void {
  const { mutate } = useMutation({
    mutationFn: (term: string) => storesApi.trackSearch(term),
    onError: () => undefined,
  })
  const lastTracked = useRef<string | null>(null)
  const settled = useDebouncedValue(search.trim(), SETTLE_MS)

  const trackNow = useCallback(
    (rawTerm: string) => {
      const term = rawTerm.trim()
      if (term.length < MIN_TERM_LENGTH || term === lastTracked.current) {
        return
      }
      lastTracked.current = term
      mutate(term)
    },
    [mutate],
  )

  useEffect(() => {
    if (settled.length < MIN_TERM_LENGTH) {
      lastTracked.current = null
      return
    }
    trackNow(settled)
  }, [settled, trackNow])

  return trackNow
}
