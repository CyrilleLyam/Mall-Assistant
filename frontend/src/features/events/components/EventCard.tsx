import { CalendarDays } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { useLocalized } from '@/shared/hooks/useLocalized'
import type { MallEvent } from '../types'

export function EventCard({ event }: { event: MallEvent }) {
  const { t } = useTranslation()
  const localized = useLocalized()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{localized(event.titleEn, event.titleKm)}</CardTitle>
        <div>
          <Badge variant="outline" className="gap-1">
            <CalendarDays className="size-3" />
            {t('events.dates', { start: event.startDate, end: event.endDate })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{localized(event.descriptionEn, event.descriptionKm)}</CardDescription>
      </CardContent>
    </Card>
  )
}
