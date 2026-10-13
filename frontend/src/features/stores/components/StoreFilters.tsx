import { Search, X } from 'lucide-react'
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
  onSearchSubmit?: () => void
}

const ALL = 'all'

export function StoreFilters({
  values,
  categories,
  floors,
  onChange,
  onClear,
  onSearchSubmit,
}: StoreFiltersProps) {
  const { t } = useTranslation()
  const localized = useLocalized()
  const categoryItems = [
    { value: ALL, label: t('stores.allCategories') },
    ...categories.map((category) => ({
      value: category.id,
      label: localized(category.nameEn, category.nameKm),
    })),
  ]
  const floorItems = [
    { value: ALL, label: t('stores.allFloors') },
    ...floors.map((floor) => ({ value: String(floor), label: `${t('stores.floor')} ${floor}` })),
  ]
  const hasFilters = values.search !== '' || values.categoryId !== '' || values.floor !== ''

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault()
        onSearchSubmit?.()
      }}
    >
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={values.search}
          placeholder={t('stores.searchPlaceholder')}
          aria-label={t('stores.searchPlaceholder')}
          className="h-12 rounded-xl bg-background pl-12 text-base shadow-sm"
          onChange={(event) => onChange({ ...values, search: event.target.value })}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={values.categoryId || ALL}
          items={categoryItems}
          onValueChange={(value) =>
            onChange({ ...values, categoryId: !value || value === ALL ? '' : value })
          }
        >
          <SelectTrigger aria-label={t('stores.category')} className="h-9 w-auto min-w-40 bg-background">
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
          items={floorItems}
          onValueChange={(value) => onChange({ ...values, floor: !value || value === ALL ? '' : value })}
        >
          <SelectTrigger aria-label={t('stores.floor')} className="h-9 w-auto min-w-36 bg-background">
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
        {hasFilters && (
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            <X />
            {t('stores.clearFilters')}
          </Button>
        )}
      </div>
    </form>
  )
}
