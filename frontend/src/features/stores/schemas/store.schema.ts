import { z } from 'zod'
import type { Store, StoreInput } from '../types'

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

export const storeFormSchema = z
  .object({
    nameEn: z.string().trim().min(1, 'validation.required').max(255, 'validation.tooLong'),
    nameKm: z.string().trim().min(1, 'validation.required').max(255, 'validation.tooLong'),
    descriptionEn: z.string().max(2000, 'validation.tooLong'),
    descriptionKm: z.string().max(2000, 'validation.tooLong'),
    floor: z.string().trim().regex(/^-?\d+$/, 'validation.wholeNumber'),
    categoryId: z.string().min(1, 'validation.required'),
    openTime: z.string().regex(TIME_PATTERN, 'validation.time'),
    closeTime: z.string().regex(TIME_PATTERN, 'validation.time'),
  })
  .refine(
    (values) =>
      !TIME_PATTERN.test(values.openTime) ||
      !TIME_PATTERN.test(values.closeTime) ||
      values.closeTime > values.openTime,
    { path: ['closeTime'], message: 'validation.closeAfterOpen' },
  )

export type StoreFormValues = z.infer<typeof storeFormSchema>

export const EMPTY_STORE_FORM: StoreFormValues = {
  nameEn: '',
  nameKm: '',
  descriptionEn: '',
  descriptionKm: '',
  floor: '',
  categoryId: '',
  openTime: '09:00',
  closeTime: '21:00',
}

export const storeToFormValues = (store: Store): StoreFormValues => ({
  nameEn: store.nameEn,
  nameKm: store.nameKm,
  descriptionEn: store.descriptionEn,
  descriptionKm: store.descriptionKm,
  floor: String(store.floor),
  categoryId: store.categoryId,
  openTime: store.openTime,
  closeTime: store.closeTime,
})

export const toStoreInput = (values: StoreFormValues): StoreInput => ({
  nameEn: values.nameEn.trim(),
  nameKm: values.nameKm.trim(),
  descriptionEn: values.descriptionEn.trim(),
  descriptionKm: values.descriptionKm.trim(),
  floor: Number(values.floor),
  categoryId: values.categoryId,
  openTime: values.openTime,
  closeTime: values.closeTime,
})
