import { ArrowLeft, Clock, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ErrorState, LoadingState } from '@/shared/components/PageState'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { useCategories, useStore } from '../hooks/useStores'

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

  return (
    <article className="space-y-4">
      <Button asChild variant="ghost" size="sm">
        <Link to="/stores">
          <ArrowLeft />
          {t('stores.back')}
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{localized(store.data.nameEn, store.data.nameKm)}</CardTitle>
          {category && (
            <div>
              <Badge variant="secondary">{localized(category.nameEn, category.nameKm)}</Badge>
            </div>
          )}
          <CardDescription>
            {localized(store.data.descriptionEn, store.data.descriptionKm)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid max-w-sm grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2">
            <dt className="inline-flex items-center gap-1 text-muted-foreground">
              <MapPin className="size-4" />
              {t('stores.floor')}
            </dt>
            <dd>{store.data.floor}</dd>
            <dt className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="size-4" />
              {t('stores.hours')}
            </dt>
            <dd>
              {store.data.openTime}–{store.data.closeTime}
            </dd>
          </dl>
        </CardContent>
      </Card>
    </article>
  )
}
