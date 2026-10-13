import { SearchX, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Skeleton } from '@/shared/components/ui/skeleton'

export function LoadingState() {
  const { t } = useTranslation()

  return (
    <div role="status" aria-label={t('common.loading')} className="space-y-3">
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-16 w-full rounded-xl" />
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

interface EmptyStateProps {
  message: string
  icon?: LucideIcon
  action?: ReactNode
}

export function EmptyState({ message, icon: Icon = SearchX, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed bg-muted/30 px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="size-7" />
      </span>
      <p className="max-w-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  )
}
