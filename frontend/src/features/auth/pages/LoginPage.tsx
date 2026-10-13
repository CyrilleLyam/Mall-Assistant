import { Loader2, LockKeyhole } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { apiErrorStatus } from '@/shared/api/http-client'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { t } = useTranslation()
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorKey, setErrorKey] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const destination = (location.state as { from?: string } | null)?.from ?? '/admin'

  if (isAuthenticated) {
    return <Navigate to={destination} replace />
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorKey(null)
    try {
      await login({ email, password })
      navigate(destination, { replace: true })
    } catch (error) {
      const status = apiErrorStatus(error)
      setErrorKey(
        status === 401 ? 'auth.invalid' : status === 429 ? 'auth.tooManyAttempts' : 'common.error',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative mx-auto max-w-md pt-6">
      <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 mx-auto h-64 max-w-sm rounded-full bg-primary/15 blur-3xl" />
      <Card className="shadow-xl">
        <CardHeader className="justify-items-center gap-3 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <LockKeyhole className="size-7" />
          </span>
          <CardTitle className="text-2xl">{t('auth.title')}</CardTitle>
          <CardDescription>{t('auth.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="username"
                className="h-10"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                className="h-10"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            {errorKey && (
              <Alert variant="destructive">
                <AlertDescription>{t(errorKey)}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" size="lg" disabled={isSubmitting} className="h-10 w-full">
              {isSubmitting && <Loader2 className="animate-spin" />}
              {t('auth.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
