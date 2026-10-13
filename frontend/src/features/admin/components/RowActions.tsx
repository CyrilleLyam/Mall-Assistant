import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ConfirmDeleteDialog } from '@/shared/components/ConfirmDeleteDialog'
import { LinkButton } from '@/shared/components/LinkButton'
import { Button } from '@/shared/components/ui/button'

interface RowActionsProps {
  editTo: string
  onDelete: () => void
}

export function RowActions({ editTo, onDelete }: RowActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="flex justify-end gap-1">
      <LinkButton variant="ghost" size="icon-sm" to={editTo} aria-label={t('admin.edit')} title={t('admin.edit')}>
        <Pencil />
      </LinkButton>
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
