import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { apiErrorMessages } from '@/shared/api/http-client'
import { ErrorState, LoadingState } from '@/shared/components/PageState'
import { LinkButton } from '@/shared/components/LinkButton'
import {
  EMPTY_EVENT_FORM,
  EventForm,
  eventToFormValues,
  toEventInput,
  useCreateEvent,
  useEvent,
  useUpdateEvent,
  type EventFormValues,
} from '../../events/admin'
import { PageHeader } from '@/shared/components/PageHeader'

export function AdminEventFormPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = id !== undefined
  const event = useEvent(id ?? '')
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const [serverErrors, setServerErrors] = useState<string[]>([])

  const goBack = () => navigate('/admin/events')

  const submit = (values: EventFormValues) => {
    setServerErrors([])
    const input = toEventInput(values)
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
      updateEvent.mutate({ id, input }, handlers)
    } else {
      createEvent.mutate(input, handlers)
    }
  }

  const isLoading = isEdit && event.isPending
  const hasError = isEdit && event.isError

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <LinkButton variant="ghost" size="sm" to="/admin/events">
        <ArrowLeft />
        {t('admin.backToEvents')}
      </LinkButton>
      <PageHeader
        title={isEdit ? t('admin.editEvent') : t('admin.addEvent')}
        description={isEdit ? t('admin.editEventHint') : t('admin.addEventHint')}
      />
      {isLoading && <LoadingState />}
      {hasError && <ErrorState />}
      {!isLoading && !hasError && (
        <EventForm
          key={id ?? 'new'}
          defaultValues={event.data ? eventToFormValues(event.data) : EMPTY_EVENT_FORM}
          isSubmitting={createEvent.isPending || updateEvent.isPending}
          serverErrors={serverErrors}
          onSubmit={submit}
          onCancel={goBack}
        />
      )}
    </section>
  )
}
