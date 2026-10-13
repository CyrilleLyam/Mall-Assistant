import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/PageState'
import { PaginationControls } from '@/shared/components/PaginationControls'
import { useClampPage } from '@/shared/hooks/useClampPage'
import { EventCard } from '../components/EventCard'
import { useEvents } from '../hooks/useEvents'

const PAGE_SIZE = 6

function EventSection({ status, title }: { status: 'current' | 'upcoming'; title: string }) {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const events = useEvents({ status, page, pageSize: PAGE_SIZE })
  useClampPage(page, events.data?.pagination.totalPages, setPage)

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      {events.isPending && <LoadingState />}
      {events.isError && <ErrorState />}
      {events.data?.items.length === 0 && <EmptyState message={t('events.empty')} />}
      <div className="grid gap-4 sm:grid-cols-2">
        {events.data?.items.map((event) => <EventCard key={event.id} event={event} />)}
      </div>
      {events.data && (
        <PaginationControls pagination={events.data.pagination} onPageChange={setPage} />
      )}
    </section>
  )
}

export function EventsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{t('events.title')}</h1>
      <EventSection status="current" title={t('events.nowOn')} />
      <EventSection status="upcoming" title={t('events.comingSoon')} />
    </div>
  )
}
