import { ShoppingBag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function Brand({ to = '/' }: { to?: string }) {
  const { t } = useTranslation()

  return (
    <Link to={to} className="flex items-center gap-2.5" aria-label={t('app.name')}>
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <ShoppingBag className="size-5" />
      </span>
      <span className="hidden text-base font-bold tracking-tight min-[430px]:inline">{t('app.name')}</span>
    </Link>
  )
}
