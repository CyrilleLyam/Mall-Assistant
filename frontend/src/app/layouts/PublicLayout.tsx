import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { ChatWidget } from '@/features/chat'
import { LanguageSwitcher } from '@/features/language'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'font-semibold text-foreground'
    : 'text-muted-foreground transition-colors hover:text-foreground'

export function PublicLayout() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="text-lg font-bold text-primary">
            {t('app.name')}
          </Link>
          <nav className="flex items-center gap-4">
            <NavLink to="/stores" className={navLinkClass}>
              {t('nav.stores')}
            </NavLink>
            <NavLink to="/events" className={navLinkClass}>
              {t('nav.events')}
            </NavLink>
            <NavLink to="/admin" className={navLinkClass}>
              {t('nav.staff')}
            </NavLink>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
      <ChatWidget />
    </div>
  )
}
