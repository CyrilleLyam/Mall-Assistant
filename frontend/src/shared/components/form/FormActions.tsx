import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Button } from '@/shared/components/ui/button'

interface FormActionsProps {
  serverErrors: string[]
  isSubmitting: boolean
  onCancel: () => void
}

export function FormActions({ serverErrors, isSubmitting, onCancel }: FormActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      {serverErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            {serverErrors.length === 1 ? (
              serverErrors[0]
            ) : (
              <ul className="list-disc space-y-1 pl-4">
                {serverErrors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            )}
          </AlertDescription>
        </Alert>
      )}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t('admin.cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? t('form.saving') : t('form.save')}
        </Button>
      </div>
    </div>
  )
}
