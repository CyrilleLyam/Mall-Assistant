import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/lib/utils'
import { isOpenNow } from '../lib/opening-hours'

interface OpenStatusBadgeProps {
  openTime: string
  closeTime: string
}

export function OpenStatusBadge({ openTime, closeTime }: OpenStatusBadgeProps) {
  const { t } = useTranslation()
  const isOpen = isOpenNow(openTime, closeTime)

  return (
    <Badge
      variant="outline"
      className={cn(
        'shrink-0 gap-1.5',
        isOpen
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
          : 'text-muted-foreground',
      )}
    >
      <span className={cn('size-1.5 rounded-full', isOpen ? 'bg-emerald-500' : 'bg-muted-foreground/60')} />
      {isOpen ? t('stores.openNow') : t('stores.closed')}
    </Badge>
  )
}
