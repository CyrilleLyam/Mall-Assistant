import { BarChart3, CalendarDays, Store, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'

interface NavItem {
  to: string
  icon: LucideIcon
  labelKey: string
}

const ITEMS: NavItem[] = [
  { to: '/admin/stores', icon: Store, labelKey: 'nav.stores' },
  { to: '/admin/events', icon: CalendarDays, labelKey: 'nav.events' },
  { to: '/admin/analytics', icon: BarChart3, labelKey: 'nav.analytics' },
]

export function AdminNav({ orientation }: { orientation: 'vertical' | 'horizontal' }) {
  const { t } = useTranslation()

  return (
    <nav
      className={cn(
        'flex gap-1',
        orientation === 'vertical' ? 'flex-col' : 'overflow-x-auto px-4 pb-3',
      )}
    >
      {ITEMS.map(({ to, icon: Icon, labelKey }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )
          }
        >
          <Icon className="size-4.5" />
          {t(labelKey)}
        </NavLink>
      ))}
    </nav>
  )
}
