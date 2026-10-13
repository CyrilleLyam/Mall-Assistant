import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormActions } from '@/shared/components/form/FormActions'
import { FormSelectField } from '@/shared/components/form/FormSelectField'
import { FormTextareaField } from '@/shared/components/form/FormTextareaField'
import { FormTextField } from '@/shared/components/form/FormTextField'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { storeFormSchema, type StoreFormValues } from '../schemas/store.schema'
import type { Category } from '../types'

interface StoreFormProps {
  defaultValues: StoreFormValues
  categories: Category[]
  isSubmitting: boolean
  serverErrors: string[]
  onSubmit: (values: StoreFormValues) => void
  onCancel: () => void
}

export function StoreForm({
  defaultValues,
  categories,
  isSubmitting,
  serverErrors,
  onSubmit,
  onCancel,
}: StoreFormProps) {
  const { t } = useTranslation()
  const localized = useLocalized()
  const { control, handleSubmit } = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues,
  })

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: localized(category.nameEn, category.nameKm),
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('form.basicInfo')}</CardTitle>
          <CardDescription>{t('form.bilingualHint')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <FormTextField control={control} name="nameEn" label={t('form.nameEn')} />
          <FormTextField control={control} name="nameKm" label={t('form.nameKm')} />
          <FormTextareaField control={control} name="descriptionEn" label={t('form.descriptionEn')} />
          <FormTextareaField control={control} name="descriptionKm" label={t('form.descriptionKm')} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('form.locationHours')}</CardTitle>
          <CardDescription>{t('form.locationHoursHint')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <FormSelectField
            control={control}
            name="categoryId"
            label={t('stores.category')}
            placeholder={t('form.selectCategory')}
            options={categoryOptions}
          />
          <FormTextField control={control} name="floor" type="number" label={t('stores.floor')} />
          <FormTextField control={control} name="openTime" type="time" label={t('form.openTime')} />
          <FormTextField control={control} name="closeTime" type="time" label={t('form.closeTime')} />
        </CardContent>
      </Card>

      <FormActions serverErrors={serverErrors} isSubmitting={isSubmitting} onCancel={onCancel} />
    </form>
  )
}
