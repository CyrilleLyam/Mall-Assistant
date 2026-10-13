import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog'

interface ConfirmDeleteDialogProps {
  onConfirm: () => void
  children: ReactElement
}

export function ConfirmDeleteDialog({ onConfirm, children }: ConfirmDeleteDialogProps) {
  const { t } = useTranslation()

  return (
    <AlertDialog>
      <AlertDialogTrigger render={children} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('admin.confirmDelete')}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            {t('admin.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
