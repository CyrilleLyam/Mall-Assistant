import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ConfirmDeleteDialog } from '@/shared/components/ConfirmDeleteDialog'
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/PageState'
import { PaginationControls } from '@/shared/components/PaginationControls'
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
import { useDeleteStore, useStoreSearch } from '../../stores'

const PAGE_SIZE = 10

export function AdminStoresPage() {
  const { t } = useTranslation()
  const localized = useLocalized()
  const [page, setPage] = useState(1)
  const stores = useStoreSearch({ page, pageSize: PAGE_SIZE })
  const deleteStore = useDeleteStore()
  useClampPage(page, stores.data?.pagination.totalPages, setPage)

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">{t('admin.stores')}</h1>
      {stores.isPending && <LoadingState />}
      {stores.isError && <ErrorState />}
      {stores.data?.items.length === 0 && <EmptyState message={t('stores.empty')} />}
      {stores.data && stores.data.items.length > 0 && (
        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.name')}</TableHead>
                <TableHead>{t('stores.floor')}</TableHead>
                <TableHead className="text-right">{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.data.items.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>{localized(store.nameEn, store.nameKm)}</TableCell>
                  <TableCell>{store.floor}</TableCell>
                  <TableCell className="text-right">
                    <ConfirmDeleteDialog onConfirm={() => deleteStore.mutate(store.id)}>
                      <Button variant="destructive" size="sm">
                        <Trash2 />
                        {t('admin.delete')}
                      </Button>
                    </ConfirmDeleteDialog>
                  </TableCell>
                </TableRow>
              ))}
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
