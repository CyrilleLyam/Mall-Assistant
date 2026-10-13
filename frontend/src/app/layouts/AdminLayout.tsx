import { LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { LanguageSwitcher } from '@/features/language'
import { Button } from '@/shared/components/ui/button'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'font-semibold text-foreground'
    : 'text-muted-foreground transition-colors hover:text-foreground'

export function AdminLayout() {
  const { t } = useTranslation()
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/stores" className="text-lg font-bold text-primary">
            {t('app.name')}
          </Link>
          <nav className="flex flex-wrap items-center gap-4">
            <NavLink to="/admin/stores" className={navLinkClass}>
              {t('admin.stores')}
            </NavLink>
            <NavLink to="/admin/events" className={navLinkClass}>
              {t('admin.events')}
            </NavLink>
            <NavLink to="/admin/analytics" className={navLinkClass}>
              {t('nav.analytics')}
            </NavLink>
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut />
              {t('nav.logout')}
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
