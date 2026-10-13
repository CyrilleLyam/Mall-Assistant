import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { apiErrorMessages } from '@/shared/api/http-client'
import { ErrorState, LoadingState } from '@/shared/components/PageState'
import { LinkButton } from '@/shared/components/LinkButton'
import { useCategories, useStore } from '../../stores'
import {
  EMPTY_STORE_FORM,
  StoreForm,
  storeToFormValues,
  toStoreInput,
  useCreateStore,
  useUpdateStore,
  type StoreFormValues,
} from '../../stores/admin'
import { PageHeader } from '@/shared/components/PageHeader'

export function AdminStoreFormPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = id !== undefined
  const store = useStore(id ?? '')
  const categories = useCategories()
  const createStore = useCreateStore()
  const updateStore = useUpdateStore()
  const [serverErrors, setServerErrors] = useState<string[]>([])

  const goBack = () => navigate('/admin/stores')

  const submit = (values: StoreFormValues) => {
    setServerErrors([])
    const input = toStoreInput(values)
    const handlers = {
      onSuccess: () => {
        toast.success(t('form.saved'))
        goBack()
      },
      onError: (error: unknown) => {
        const messages = apiErrorMessages(error)
        setServerErrors(messages.length > 0 ? messages : [t('common.error')])
      },
    }
    if (id) {
      updateStore.mutate({ id, input }, handlers)
    } else {
      createStore.mutate(input, handlers)
    }
  }

  const isLoading = categories.isPending || (isEdit && store.isPending)
  const hasError = categories.isError || (isEdit && store.isError)

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <LinkButton variant="ghost" size="sm" to="/admin/stores">
        <ArrowLeft />
        {t('admin.backToStores')}
      </LinkButton>
      <PageHeader
        title={isEdit ? t('admin.editStore') : t('admin.addStore')}
        description={isEdit ? t('admin.editStoreHint') : t('admin.addStoreHint')}
      />
      {isLoading && <LoadingState />}
      {hasError && <ErrorState />}
      {!isLoading && !hasError && categories.data && (
        <StoreForm
          key={id ?? 'new'}
          defaultValues={store.data ? storeToFormValues(store.data) : EMPTY_STORE_FORM}
          categories={categories.data}
          isSubmitting={createStore.isPending || updateStore.isPending}
          serverErrors={serverErrors}
          onSubmit={submit}
          onCancel={goBack}
        />
      )}
    </section>
  )
}
