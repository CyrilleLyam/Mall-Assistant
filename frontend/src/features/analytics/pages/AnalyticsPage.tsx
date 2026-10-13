import { useTranslation } from 'react-i18next'
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/PageState'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { useSearchesPerDay, useTopSearches } from '../hooks/useAnalytics'

export function AnalyticsPage() {
  const { t } = useTranslation()
  const localized = useLocalized()
  const topSearches = useTopSearches()
  const perDay = useSearchesPerDay()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('analytics.title')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.topSearches')}</CardTitle>
        </CardHeader>
        <CardContent>
          {topSearches.isPending && <LoadingState />}
          {topSearches.isError && <ErrorState />}
          {topSearches.data?.length === 0 && <EmptyState message={t('analytics.empty')} />}
          {topSearches.data && topSearches.data.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.name')}</TableHead>
                  <TableHead className="text-right">{t('analytics.searches')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSearches.data.map((row) => (
                  <TableRow key={row.tenantId}>
                    <TableCell>{localized(row.nameEn, row.nameKm)}</TableCell>
                    <TableCell className="text-right">{row.searches}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.perDay')}</CardTitle>
        </CardHeader>
        <CardContent>
          {perDay.isPending && <LoadingState />}
          {perDay.isError && <ErrorState />}
          {perDay.data?.length === 0 && <EmptyState message={t('analytics.empty')} />}
          {perDay.data && perDay.data.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('analytics.date')}</TableHead>
                  <TableHead className="text-right">{t('analytics.searches')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {perDay.data.map((row) => (
                  <TableRow key={row.date}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell className="text-right">{row.searches}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
