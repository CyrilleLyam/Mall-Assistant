import { ArrowLeft, Clock, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router-dom'
import { ErrorState, LoadingState } from '@/shared/components/PageState'
import { Badge } from '@/shared/components/ui/badge'
import { LinkButton } from '@/shared/components/LinkButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { cn } from '@/shared/lib/utils'
import { OpenStatusBadge } from '../components/OpenStatusBadge'
import { StoreAvatar } from '../components/StoreAvatar'
import { useCategories, useStore } from '../hooks/useStores'
import { categoryTone } from '../lib/category-tone'

export function StoreDetailPage() {
  const { t } = useTranslation()
  const localized = useLocalized()
  const { id = '' } = useParams()
  const [searchParams] = useSearchParams()
  const store = useStore(id, searchParams.get('q') ?? undefined)
  const categories = useCategories()

  if (store.isPending) return <LoadingState />
  if (store.isError) return <ErrorState />

  const category = categories.data?.find((item) => item.id === store.data.categoryId)
  const description = localized(store.data.descriptionEn, store.data.descriptionKm)

  return (
    <article className="space-y-6">
      <LinkButton variant="ghost" size="sm" to="/stores">
        <ArrowLeft />
        {t('stores.back')}
      </LinkButton>

      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/15 via-primary/5 to-background p-6 sm:p-10">
        <div className="pointer-events-none absolute -top-20 -right-16 size-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <StoreAvatar name={store.data.nameEn} categoryId={store.data.categoryId} size="lg" />
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {localized(store.data.nameEn, store.data.nameKm)}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <Badge className={cn('font-medium', categoryTone(store.data.categoryId).badge)}>
                  {localized(category.nameEn, category.nameKm)}
                </Badge>
              )}
              <OpenStatusBadge openTime={store.data.openTime} closeTime={store.data.closeTime} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4">
            <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="size-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">{t('stores.floor')}</p>
              <p className="text-lg font-semibold">{store.data.floor}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Clock className="size-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">{t('stores.hours')}</p>
              <p className="text-lg font-semibold">
                {store.data.openTime}–{store.data.closeTime}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {description && (
        <Card>
          <CardHeader>
            <CardTitle>{t('stores.about')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      )}
    </article>
  )
}
