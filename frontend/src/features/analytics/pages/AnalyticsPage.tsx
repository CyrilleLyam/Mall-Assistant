import { BarChart3, Search, SearchX, Store, TrendingUp, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/PageState'
import { PageHeader } from '@/shared/components/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/components/ui/chart'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { formatDayMonth } from '@/shared/lib/dates'
import { RankedList } from '../components/RankedList'
import {
  useNoResultTerms,
  useSearchesPerDay,
  useStoreViews,
  useTopTerms,
} from '../hooks/useAnalytics'

interface StatTileProps {
  icon: LucideIcon
  label: string
  value: string
  hint?: string
}

function StatTile({ icon: Icon, label, value, hint }: StatTileProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-6" />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="truncate text-2xl leading-tight font-bold">{value}</p>
          {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

interface ListCardProps {
  title: string
  description: string
  isPending: boolean
  isError: boolean
  isEmpty: boolean
  emptyIcon: LucideIcon
  children: React.ReactNode
}

function ListCard({ title, description, isPending, isError, isEmpty, emptyIcon, children }: ListCardProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending && <LoadingState />}
        {isError && <ErrorState />}
        {isEmpty && <EmptyState icon={emptyIcon} message={t('analytics.empty')} />}
        {children}
      </CardContent>
    </Card>
  )
}

export function AnalyticsPage() {
  const { t, i18n } = useTranslation()
  const localized = useLocalized()
  const language = i18n.resolvedLanguage ?? 'en'
  const perDay = useSearchesPerDay()
  const topTerms = useTopTerms()
  const noResultTerms = useNoResultTerms()
  const storeViews = useStoreViews()

  const chartConfig = {
    found: { label: t('analytics.found'), color: 'var(--primary)' },
    noResults: { label: t('analytics.noResults'), color: 'var(--destructive)' },
  } satisfies ChartConfig

  const rows = perDay.data ?? []
  const total = rows.reduce((sum, row) => sum + row.searches, 0)
  const noResultTotal = rows.reduce((sum, row) => sum + row.noResultSearches, 0)
  const average = rows.length > 0 ? (total / rows.length).toFixed(1) : '0'
  const noResultShare = total > 0 ? Math.round((noResultTotal / total) * 100) : 0
  const chartData = rows.map((row) => ({
    date: row.date,
    found: row.searches - row.noResultSearches,
    noResults: row.noResultSearches,
  }))

  return (
    <div className="space-y-6">
      <PageHeader title={t('analytics.title')} description={t('analytics.subtitle')} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile icon={Search} label={t('analytics.totalSearches')} value={String(total)} />
        <StatTile icon={TrendingUp} label={t('analytics.averagePerDay')} value={average} />
        <StatTile
          icon={SearchX}
          label={t('analytics.noResultSearches')}
          value={String(noResultTotal)}
          hint={t('analytics.noResultShare', { percent: noResultShare })}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.perDay')}</CardTitle>
          <CardDescription>{t('analytics.perDayHint')}</CardDescription>
        </CardHeader>
        <CardContent>
          {perDay.isPending && <LoadingState />}
          {perDay.isError && <ErrorState />}
          {perDay.data && total === 0 && <EmptyState icon={BarChart3} message={t('analytics.empty')} />}
          {perDay.data && total > 0 && (
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart data={chartData} margin={{ left: 0, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value: string) => formatDayMonth(value, language)}
                />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => formatDayMonth(String(value), language)}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="found" stackId="searches" fill="var(--color-found)" radius={[0, 0, 6, 6]} />
                <Bar
                  dataKey="noResults"
                  stackId="searches"
                  fill="var(--color-noResults)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <ListCard
          title={t('analytics.topTerms')}
          description={t('analytics.topTermsHint')}
          isPending={topTerms.isPending}
          isError={topTerms.isError}
          isEmpty={topTerms.data?.length === 0}
          emptyIcon={Search}
        >
          {topTerms.data && topTerms.data.length > 0 && (
            <RankedList
              rows={topTerms.data.map((row) => ({
                key: row.term,
                label: row.term,
                value: row.searches,
                valueLabel: t('analytics.searchCount', { count: row.searches }),
              }))}
            />
          )}
        </ListCard>

        <ListCard
          title={t('analytics.noResultTerms')}
          description={t('analytics.noResultTermsHint')}
          isPending={noResultTerms.isPending}
          isError={noResultTerms.isError}
          isEmpty={noResultTerms.data?.length === 0}
          emptyIcon={SearchX}
        >
          {noResultTerms.data && noResultTerms.data.length > 0 && (
            <RankedList
              tone="destructive"
              rows={noResultTerms.data.map((row) => ({
                key: row.term,
                label: row.term,
                value: row.searches,
                valueLabel: t('analytics.searchCount', { count: row.searches }),
              }))}
            />
          )}
        </ListCard>
      </div>

      <ListCard
        title={t('analytics.storeViews')}
        description={t('analytics.storeViewsHint')}
        isPending={storeViews.isPending}
        isError={storeViews.isError}
        isEmpty={storeViews.data?.length === 0}
        emptyIcon={Store}
      >
        {storeViews.data && storeViews.data.length > 0 && (
          <RankedList
            rows={storeViews.data.map((row) => ({
              key: row.tenantId,
              label: localized(row.nameEn, row.nameKm),
              value: row.searches,
              valueLabel: t('analytics.viewCount', { count: row.searches }),
            }))}
          />
        )}
      </ListCard>
    </div>
  )
}
