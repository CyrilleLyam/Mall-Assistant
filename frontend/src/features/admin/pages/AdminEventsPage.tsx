import { CalendarDays, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/PageState'
import { PaginationControls } from '@/shared/components/PaginationControls'
import { LinkButton } from '@/shared/components/LinkButton'
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
import { formatDate } from '@/shared/lib/dates'
import { EventStatusBadge, useEvents } from '../../events'
import { useDeleteEvent } from '../../events/admin'
import { PageHeader } from '@/shared/components/PageHeader'
import { RowActions } from '../components/RowActions'

const PAGE_SIZE = 10

export function AdminEventsPage() {
  const { t, i18n } = useTranslation()
  const localized = useLocalized()
  const language = i18n.resolvedLanguage ?? 'en'
  const [page, setPage] = useState(1)
  const events = useEvents({ page, pageSize: PAGE_SIZE })
  const deleteEvent = useDeleteEvent()
  useClampPage(page, events.data?.pagination.totalPages, setPage)

  const addButton = (
    <LinkButton to="/admin/events/new">
      <Plus />
      {t('admin.addEvent')}
    </LinkButton>
  )

  return (
    <section className="space-y-6">
      <PageHeader
        title={t('admin.events')}
        description={
          events.data ? t('admin.eventsCount', { count: events.data.pagination.totalItems }) : undefined
        }
        actions={addButton}
      />
      {events.isPending && <LoadingState />}
      {events.isError && <ErrorState />}
      {events.data?.items.length === 0 && (
        <EmptyState icon={CalendarDays} message={t('admin.noEvents')} action={addButton} />
      )}
      {events.data && events.data.items.length > 0 && (
        <Card className="gap-0 overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-5">{t('admin.event')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('admin.dates')}</TableHead>
                <TableHead>{t('admin.status')}</TableHead>
                <TableHead className="pr-5 text-right">{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.data.items.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="py-3 pl-5 whitespace-normal">
                    <p className="font-medium">{localized(event.titleEn, event.titleKm)}</p>
                    <p className="line-clamp-1 hidden text-sm text-muted-foreground sm:block">
                      {localized(event.descriptionEn, event.descriptionKm)}
                    </p>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap text-muted-foreground md:table-cell">
                    {formatDate(event.startDate, language)} – {formatDate(event.endDate, language)}
                  </TableCell>
                  <TableCell>
                    <EventStatusBadge status={event.status} />
                  </TableCell>
                  <TableCell className="pr-5">
                    <RowActions
                      editTo={`/admin/events/${event.id}/edit`}
                      onDelete={() =>
                        deleteEvent.mutate(event.id, {
                          onSuccess: () => toast.success(t('admin.deleted')),
                          onError: () => toast.error(t('common.error')),
                        })
                      }
                    />
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
