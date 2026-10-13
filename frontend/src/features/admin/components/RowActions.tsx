import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ConfirmDeleteDialog } from '@/shared/components/ConfirmDeleteDialog'
import { Button } from '@/shared/components/ui/button'

interface RowActionsProps {
  editTo: string
  onDelete: () => void
}

export function RowActions({ editTo, onDelete }: RowActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="flex justify-end gap-1">
      <Button asChild variant="ghost" size="icon-sm">
        <Link to={editTo} aria-label={t('admin.edit')} title={t('admin.edit')}>
          <Pencil />
        </Link>
      </Button>
      <ConfirmDeleteDialog onConfirm={onDelete}>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          aria-label={t('admin.delete')}
          title={t('admin.delete')}
        >
          <Trash2 />
        </Button>
      </ConfirmDeleteDialog>
    </div>
  )
}
