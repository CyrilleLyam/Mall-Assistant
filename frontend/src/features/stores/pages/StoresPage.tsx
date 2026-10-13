import { Store as StoreIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState, ErrorState } from '@/shared/components/PageState'
import { PaginationControls } from '@/shared/components/PaginationControls'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { StoreCard } from '../components/StoreCard'
import { StoreFilters, type StoreFilterValues } from '../components/StoreFilters'
import { StoreGridSkeleton } from '../components/StoreGridSkeleton'
import { useSearchTracking } from '../hooks/useSearchTracking'
import { useCategories, useFloors, useStoreSearch } from '../hooks/useStores'

const EMPTY_FILTERS: StoreFilterValues = { search: '', categoryId: '', floor: '' }
const PAGE_SIZE = 12

export function StoresPage() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<StoreFilterValues>(EMPTY_FILTERS)
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(filters.search.trim())
  const trackSearchNow = useSearchTracking(filters.search)

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
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/15 via-primary/5 to-background p-6 sm:p-10">
        <div className="pointer-events-none absolute -top-20 -right-16 size-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative max-w-2xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('stores.title')}</h1>
            <p className="text-muted-foreground sm:text-lg">{t('stores.subtitle')}</p>
          </div>
          <StoreFilters
            values={filters}
            categories={categories.data ?? []}
            floors={floors.data ?? []}
            onChange={changeFilters}
            onClear={() => changeFilters(EMPTY_FILTERS)}
            onSearchSubmit={() => trackSearchNow(filters.search)}
          />
        </div>
      </section>

      <section className="space-y-5">
        {stores.data && stores.data.items.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {t('stores.resultCount', { count: stores.data.pagination.totalItems })}
          </p>
        )}
        {stores.isPending && <StoreGridSkeleton />}
        {stores.isError && <ErrorState />}
        {stores.data?.items.length === 0 && (
          <EmptyState icon={StoreIcon} message={t('stores.empty')} />
        )}
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
    </div>
  )
}
