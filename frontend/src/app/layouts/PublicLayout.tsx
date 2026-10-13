import { LockKeyhole } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { ChatWidget } from '@/features/chat'
import { LanguageSwitcher } from '@/features/language'
import { Brand } from '@/shared/components/Brand'
import { LinkButton } from '@/shared/components/LinkButton'
import { cn } from '@/shared/lib/utils'

const CURRENT_YEAR = new Date().getFullYear()

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-full px-3 py-1.5 text-sm font-medium transition-colors sm:px-3.5',
    isActive
      ? 'bg-primary/10 text-primary'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
  )

export function PublicLayout() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Brand to="/stores" />
          <nav className="flex items-center gap-0.5 sm:gap-2">
            <NavLink to="/stores" className={navLinkClass}>
              {t('nav.stores')}
            </NavLink>
            <NavLink to="/events" className={navLinkClass}>
              {t('nav.events')}
            </NavLink>
            <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
            <LanguageSwitcher />
            <LinkButton variant="outline" size="sm" className="hidden sm:inline-flex" to="/admin">
              <LockKeyhole />
              {t('nav.staff')}
            </LinkButton>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground">
          <p>{t('footer.rights', { year: CURRENT_YEAR })}</p>
          <Link to="/admin" className="transition-colors hover:text-foreground sm:hidden">
            {t('nav.staff')}
          </Link>
        </div>
      </footer>
      <ChatWidget />
    </div>
  )
}
