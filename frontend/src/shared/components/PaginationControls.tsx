import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Pagination } from '@/shared/api/api-response'
import { Button } from '@/shared/components/ui/button'

interface PaginationControlsProps {
  pagination: Pagination
  onPageChange: (page: number) => void
}

export function PaginationControls({ pagination, onPageChange }: PaginationControlsProps) {
  const { t } = useTranslation()
  const { page, totalPages } = pagination

  if (totalPages <= 1) {
    return null
  }

  return (
    <nav aria-label={t('pagination.label')} className="flex items-center justify-between gap-3">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft />
        {t('pagination.previous')}
      </Button>
      <span className="text-sm text-muted-foreground">
        {t('pagination.pageOf', { page, total: totalPages })}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {t('pagination.next')}
        <ChevronRight />
      </Button>
    </nav>
  )
}
