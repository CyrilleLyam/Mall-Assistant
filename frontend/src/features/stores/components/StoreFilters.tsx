import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { useLocalized } from '@/shared/hooks/useLocalized'
import type { Category } from '../types'

export interface StoreFilterValues {
  search: string
  categoryId: string
  floor: string
}

interface StoreFiltersProps {
  values: StoreFilterValues
  categories: Category[]
  floors: number[]
  onChange: (values: StoreFilterValues) => void
  onClear: () => void
}

const ALL = 'all'

export function StoreFilters({ values, categories, floors, onChange, onClear }: StoreFiltersProps) {
  const { t } = useTranslation()
  const localized = useLocalized()

  return (
    <form
      className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]"
      onSubmit={(event) => event.preventDefault()}
    >
      <Input
        type="search"
        value={values.search}
        placeholder={t('stores.searchPlaceholder')}
        aria-label={t('stores.searchPlaceholder')}
        onChange={(event) => onChange({ ...values, search: event.target.value })}
      />
      <Select
        value={values.categoryId || ALL}
        onValueChange={(value) => onChange({ ...values, categoryId: value === ALL ? '' : value })}
      >
        <SelectTrigger aria-label={t('stores.category')} className="w-full sm:w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t('stores.allCategories')}</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {localized(category.nameEn, category.nameKm)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={values.floor || ALL}
        onValueChange={(value) => onChange({ ...values, floor: value === ALL ? '' : value })}
      >
        <SelectTrigger aria-label={t('stores.floor')} className="w-full sm:w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t('stores.allFloors')}</SelectItem>
          {floors.map((floor) => (
            <SelectItem key={floor} value={String(floor)}>
              {t('stores.floor')} {floor}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="button" variant="ghost" onClick={onClear}>
        <X />
        {t('stores.clearFilters')}
      </Button>
    </form>
  )
}
