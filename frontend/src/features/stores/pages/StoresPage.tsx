import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/PageState'
import { PaginationControls } from '@/shared/components/PaginationControls'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { StoreCard } from '../components/StoreCard'
import { StoreFilters, type StoreFilterValues } from '../components/StoreFilters'
import { useCategories, useFloors, useStoreSearch } from '../hooks/useStores'

const EMPTY_FILTERS: StoreFilterValues = { search: '', categoryId: '', floor: '' }
const PAGE_SIZE = 12

export function StoresPage() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<StoreFilterValues>(EMPTY_FILTERS)
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(filters.search.trim())

  const stores = useStoreSearch({
    search: debouncedSearch || undefined,
    categoryId: filters.categoryId || undefined,
    floor: filters.floor === '' ? undefined : Number(filters.floor),
    page,
    pageSize: PAGE_SIZE,
  })
  const categories = useCategories()
  const floors = useFloors()

  const categoryById = useMemo(
    () => new Map((categories.data ?? []).map((category) => [category.id, category])),
    [categories.data],
  )

  const changeFilters = (values: StoreFilterValues) => {
    setFilters(values)
    setPage(1)
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">{t('stores.title')}</h1>
      <StoreFilters
        values={filters}
        categories={categories.data ?? []}
        floors={floors.data ?? []}
        onChange={changeFilters}
        onClear={() => changeFilters(EMPTY_FILTERS)}
      />

      {stores.isPending && <LoadingState />}
      {stores.isError && <ErrorState />}
      {stores.data?.items.length === 0 && <EmptyState message={t('stores.empty')} />}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stores.data?.items.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            category={categoryById.get(store.categoryId)}
            searchQuery={debouncedSearch}
          />
        ))}
      </div>
      {stores.data && (
        <PaginationControls pagination={stores.data.pagination} onPageChange={setPage} />
      )}
    </section>
  )
}
