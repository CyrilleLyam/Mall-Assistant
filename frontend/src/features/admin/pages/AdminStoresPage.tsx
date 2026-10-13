import { Plus, Store as StoreIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/PageState'
import { PaginationControls } from '@/shared/components/PaginationControls'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { useClampPage } from '@/shared/hooks/useClampPage'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { cn } from '@/shared/lib/utils'
import { StoreAvatar, categoryTone, useCategories, useStoreSearch } from '../../stores'
import { useDeleteStore } from '../../stores/admin'
import { PageHeader } from '@/shared/components/PageHeader'
import { RowActions } from '../components/RowActions'

const PAGE_SIZE = 10

export function AdminStoresPage() {
  const { t } = useTranslation()
  const localized = useLocalized()
  const [page, setPage] = useState(1)
  const stores = useStoreSearch({ page, pageSize: PAGE_SIZE })
  const categories = useCategories()
  const deleteStore = useDeleteStore()
  useClampPage(page, stores.data?.pagination.totalPages, setPage)

  const categoryById = useMemo(
    () => new Map((categories.data ?? []).map((category) => [category.id, category])),
    [categories.data],
  )

  const addButton = (
    <Button asChild>
      <Link to="/admin/stores/new">
        <Plus />
        {t('admin.addStore')}
      </Link>
    </Button>
  )

  return (
    <section className="space-y-6">
      <PageHeader
        title={t('admin.stores')}
        description={
          stores.data ? t('admin.storesCount', { count: stores.data.pagination.totalItems }) : undefined
        }
        actions={addButton}
      />
      {stores.isPending && <LoadingState />}
      {stores.isError && <ErrorState />}
      {stores.data?.items.length === 0 && (
        <EmptyState icon={StoreIcon} message={t('admin.noStores')} action={addButton} />
      )}
      {stores.data && stores.data.items.length > 0 && (
        <Card className="gap-0 overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-5">{t('admin.store')}</TableHead>
                <TableHead>{t('stores.floor')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('stores.hours')}</TableHead>
                <TableHead className="pr-5 text-right">{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.data.items.map((store) => {
                const category = categoryById.get(store.categoryId)
                return (
                  <TableRow key={store.id}>
                    <TableCell className="py-3 pl-5 whitespace-normal">
                      <div className="flex items-center gap-3">
                        <StoreAvatar name={store.nameEn} categoryId={store.categoryId} size="sm" />
                        <div className="min-w-0 space-y-1">
                          <p className="truncate font-medium">{localized(store.nameEn, store.nameKm)}</p>
                          {category && (
                            <Badge className={cn('font-medium', categoryTone(store.categoryId).badge)}>
                              {localized(category.nameEn, category.nameKm)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{store.floor}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {store.openTime}–{store.closeTime}
                    </TableCell>
                    <TableCell className="pr-5">
                      <RowActions
                        editTo={`/admin/stores/${store.id}/edit`}
                        onDelete={() =>
                          deleteStore.mutate(store.id, {
                            onSuccess: () => toast.success(t('admin.deleted')),
                            onError: () => toast.error(t('common.error')),
                          })
                        }
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
      {stores.data && (
        <PaginationControls pagination={stores.data.pagination} onPageChange={setPage} />
      )}
    </section>
  )
}
