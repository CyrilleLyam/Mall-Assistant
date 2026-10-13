import { ExternalLink, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { LanguageSwitcher } from '@/features/language'
import { Brand } from '@/shared/components/Brand'
import { Button } from '@/shared/components/ui/button'
import { AdminNav } from './AdminNav'

export function AdminLayout() {
  const { t } = useTranslation()
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-muted/30 md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col gap-6 border-r bg-background p-4 md:flex">
        <div className="px-2 pt-2">
          <Brand to="/stores" />
        </div>
        <AdminNav orientation="vertical" />
        <div className="mt-auto space-y-2 border-t pt-4">
          <div className="px-1 pb-1">
            <LanguageSwitcher />
          </div>
          <Button asChild variant="ghost" size="sm" className="w-full justify-start">
            <Link to="/stores">
              <ExternalLink />
              {t('admin.viewSite')}
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
            <LogOut />
            {t('nav.logout')}
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="border-b bg-background md:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <Brand to="/stores" />
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Button variant="ghost" size="icon-sm" aria-label={t('nav.logout')} onClick={logout}>
                <LogOut />
              </Button>
            </div>
          </div>
          <AdminNav orientation="horizontal" />
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
