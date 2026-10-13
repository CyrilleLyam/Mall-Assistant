import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/lib/utils'
import type { EventStatus } from '../types'

const STYLES: Record<EventStatus, string> = {
  current:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
  upcoming:
    'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300',
  past: 'text-muted-foreground',
}

const LABEL_KEYS: Record<EventStatus, string> = {
  current: 'events.nowOn',
  upcoming: 'events.comingSoon',
  past: 'events.ended',
}

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const { t } = useTranslation()

  return (
    <Badge variant="outline" className={cn('shrink-0', STYLES[status])}>
      {t(LABEL_KEYS[status])}
    </Badge>
  )
}
