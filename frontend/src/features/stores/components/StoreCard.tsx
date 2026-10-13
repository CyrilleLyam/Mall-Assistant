import { Clock, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent } from '@/shared/components/ui/card'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { cn } from '@/shared/lib/utils'
import { categoryTone } from '../lib/category-tone'
import type { Category, Store } from '../types'
import { OpenStatusBadge } from './OpenStatusBadge'
import { StoreAvatar } from './StoreAvatar'

interface StoreCardProps {
  store: Store
  category?: Category
  searchQuery?: string
}

export function StoreCard({ store, category, searchQuery }: StoreCardProps) {
  const { t } = useTranslation()
  const localized = useLocalized()
  const query = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''

  return (
    <Link
      to={`/stores/${store.id}${query}`}
      className="group block rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg">
        <CardContent className="flex gap-4">
          <StoreAvatar name={store.nameEn} categoryId={store.categoryId} />
          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 text-base font-semibold leading-tight">
                {localized(store.nameEn, store.nameKm)}
              </h3>
              <OpenStatusBadge openTime={store.openTime} closeTime={store.closeTime} />
            </div>
            {category && (
              <Badge className={cn('font-medium', categoryTone(store.categoryId).badge)}>
                {localized(category.nameEn, category.nameKm)}
              </Badge>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {t('stores.floor')} {store.floor}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {store.openTime}–{store.closeTime}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
