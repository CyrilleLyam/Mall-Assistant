import { CalendarX2, type LucideIcon, PartyPopper, Hourglass } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/PageState'
import { PaginationControls } from '@/shared/components/PaginationControls'
import { useClampPage } from '@/shared/hooks/useClampPage'
import { EventCard } from '../components/EventCard'
import { useEvents } from '../hooks/useEvents'

const PAGE_SIZE = 6

interface EventSectionProps {
  status: 'current' | 'upcoming'
  title: string
  icon: LucideIcon
}

function EventSection({ status, title, icon: Icon }: EventSectionProps) {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const events = useEvents({ status, page, pageSize: PAGE_SIZE })
  useClampPage(page, events.data?.pagination.totalPages, setPage)

  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2.5 text-xl font-semibold">
        <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        {title}
      </h2>
      {events.isPending && <LoadingState />}
      {events.isError && <ErrorState />}
      {events.data?.items.length === 0 && (
        <EmptyState icon={CalendarX2} message={t('events.empty')} />
      )}
      <div className="grid gap-4 md:grid-cols-2">
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
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/15 via-primary/5 to-background p-6 sm:p-10">
        <div className="pointer-events-none absolute -top-20 -right-16 size-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative max-w-2xl space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('events.title')}</h1>
          <p className="text-muted-foreground sm:text-lg">{t('events.subtitle')}</p>
        </div>
      </section>
      <EventSection status="current" title={t('events.nowOn')} icon={PartyPopper} />
      <EventSection status="upcoming" title={t('events.comingSoon')} icon={Hourglass} />
    </div>
  )
}
