import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Skeleton } from '@/shared/components/ui/skeleton'

export function LoadingState() {
  const { t } = useTranslation()

  return (
    <div role="status" aria-label={t('common.loading')} className="space-y-3">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}

export function ErrorState() {
  const { t } = useTranslation()

  return (
    <Alert variant="destructive">
      <AlertDescription>{t('common.error')}</AlertDescription>
    </Alert>
  )
}

export function EmptyState({ message }: { message: string }) {
  return <p className="py-8 text-center text-muted-foreground">{message}</p>
}
