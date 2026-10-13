import { CalendarDays } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/shared/components/ui/card'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { dayAndMonth, formatDate, formatDayMonth } from '@/shared/lib/dates'
import type { MallEvent } from '../types'
import { EventStatusBadge } from './EventStatusBadge'

export function EventCard({ event }: { event: MallEvent }) {
  const { t, i18n } = useTranslation()
  const localized = useLocalized()
  const language = i18n.resolvedLanguage ?? 'en'
  const { day, month } = dayAndMonth(event.startDate, language)
  const description = localized(event.descriptionEn, event.descriptionKm)

  return (
    <Card className="transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="flex gap-4">
        <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <span className="text-xs font-semibold uppercase">{month}</span>
          <span className="text-2xl leading-none font-bold">{day}</span>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base leading-tight font-semibold">
              {localized(event.titleEn, event.titleKm)}
            </h3>
            <EventStatusBadge status={event.status} />
          </div>
          <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {t('events.dates', {
              start: formatDayMonth(event.startDate, language),
              end: formatDate(event.endDate, language),
            })}
          </p>
          {description && <p className="line-clamp-3 text-sm text-muted-foreground">{description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
