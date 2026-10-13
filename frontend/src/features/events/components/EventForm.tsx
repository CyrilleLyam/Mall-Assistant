import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormActions } from '@/shared/components/form/FormActions'
import { FormTextareaField } from '@/shared/components/form/FormTextareaField'
import { FormTextField } from '@/shared/components/form/FormTextField'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { eventFormSchema, type EventFormValues } from '../schemas/event.schema'

interface EventFormProps {
  defaultValues: EventFormValues
  isSubmitting: boolean
  serverErrors: string[]
  onSubmit: (values: EventFormValues) => void
  onCancel: () => void
}

export function EventForm({
  defaultValues,
  isSubmitting,
  serverErrors,
  onSubmit,
  onCancel,
}: EventFormProps) {
  const { t } = useTranslation()
  const { control, handleSubmit } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('form.eventDetails')}</CardTitle>
          <CardDescription>{t('form.bilingualHint')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <FormTextField control={control} name="titleEn" label={t('form.titleEn')} />
          <FormTextField control={control} name="titleKm" label={t('form.titleKm')} />
          <FormTextareaField control={control} name="descriptionEn" label={t('form.descriptionEn')} />
          <FormTextareaField control={control} name="descriptionKm" label={t('form.descriptionKm')} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('form.schedule')}</CardTitle>
          <CardDescription>{t('form.scheduleHint')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <FormTextField control={control} name="startDate" type="date" label={t('form.startDate')} />
          <FormTextField control={control} name="endDate" type="date" label={t('form.endDate')} />
        </CardContent>
      </Card>

      <FormActions serverErrors={serverErrors} isSubmitting={isSubmitting} onCancel={onCancel} />
    </form>
  )
}
