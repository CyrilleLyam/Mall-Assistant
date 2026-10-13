import { Clock, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import type { Category, Store } from '../types'

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
      className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-base">{localized(store.nameEn, store.nameKm)}</CardTitle>
          {category && (
            <div>
              <Badge variant="secondary">{localized(category.nameEn, category.nameKm)}</Badge>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {t('stores.floor')} {store.floor}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {store.openTime}–{store.closeTime}
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}
