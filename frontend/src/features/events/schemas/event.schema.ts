import { z } from 'zod'
import type { EventInput, MallEvent } from '../types'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export const eventFormSchema = z
  .object({
    titleEn: z.string().trim().min(1, 'validation.required').max(255, 'validation.tooLong'),
    titleKm: z.string().trim().min(1, 'validation.required').max(255, 'validation.tooLong'),
    descriptionEn: z.string().max(4000, 'validation.tooLong'),
    descriptionKm: z.string().max(4000, 'validation.tooLong'),
    startDate: z.string().regex(DATE_PATTERN, 'validation.date'),
    endDate: z.string().regex(DATE_PATTERN, 'validation.date'),
  })
  .refine(
    (values) =>
      !DATE_PATTERN.test(values.startDate) ||
      !DATE_PATTERN.test(values.endDate) ||
      values.endDate >= values.startDate,
    { path: ['endDate'], message: 'validation.endAfterStart' },
  )

export type EventFormValues = z.infer<typeof eventFormSchema>

export const EMPTY_EVENT_FORM: EventFormValues = {
  titleEn: '',
  titleKm: '',
  descriptionEn: '',
  descriptionKm: '',
  startDate: '',
  endDate: '',
}

export const eventToFormValues = (event: MallEvent): EventFormValues => ({
  titleEn: event.titleEn,
  titleKm: event.titleKm,
  descriptionEn: event.descriptionEn,
  descriptionKm: event.descriptionKm,
  startDate: event.startDate,
  endDate: event.endDate,
})

export const toEventInput = (values: EventFormValues): EventInput => ({
  titleEn: values.titleEn.trim(),
  titleKm: values.titleKm.trim(),
  descriptionEn: values.descriptionEn.trim(),
  descriptionKm: values.descriptionKm.trim(),
  startDate: values.startDate,
  endDate: values.endDate,
})
