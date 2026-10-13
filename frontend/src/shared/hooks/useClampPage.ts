import { useEffect } from 'react'

export function useClampPage(
  page: number,
  totalPages: number | undefined,
  setPage: (page: number) => void,
): void {
  useEffect(() => {
    if (totalPages !== undefined && totalPages > 0 && page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages, setPage])
}
