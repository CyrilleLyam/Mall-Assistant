import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ConfirmDeleteDialog } from '@/shared/components/ConfirmDeleteDialog'
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/PageState'
import { PaginationControls } from '@/shared/components/PaginationControls'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { useClampPage } from '@/shared/hooks/useClampPage'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { useDeleteEvent, useEvents } from '../../events'

const PAGE_SIZE = 10

export function AdminEventsPage() {
  const { t } = useTranslation()
  const localized = useLocalized()
  const [page, setPage] = useState(1)
  const events = useEvents({ page, pageSize: PAGE_SIZE })
  const deleteEvent = useDeleteEvent()
  useClampPage(page, events.data?.pagination.totalPages, setPage)

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">{t('admin.events')}</h1>
      {events.isPending && <LoadingState />}
      {events.isError && <ErrorState />}
      {events.data?.items.length === 0 && <EmptyState message={t('events.empty')} />}
      {events.data && events.data.items.length > 0 && (
        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.name')}</TableHead>
                <TableHead>{t('admin.dates')}</TableHead>
                <TableHead className="text-right">{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.data.items.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{localized(event.titleEn, event.titleKm)}</TableCell>
                  <TableCell>
                    {t('events.dates', { start: event.startDate, end: event.endDate })}
                  </TableCell>
                  <TableCell className="text-right">
                    <ConfirmDeleteDialog onConfirm={() => deleteEvent.mutate(event.id)}>
                      <Button variant="destructive" size="sm">
                        <Trash2 />
                        {t('admin.delete')}
                      </Button>
                    </ConfirmDeleteDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      {events.data && (
        <PaginationControls pagination={events.data.pagination} onPageChange={setPage} />
      )}
    </section>
  )
}
