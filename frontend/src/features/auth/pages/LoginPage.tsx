import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { apiErrorStatus } from '@/shared/api/http-client'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
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
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{t('auth.title')}</CardTitle>
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {errorKey && (
            <Alert variant="destructive">
              <AlertDescription>{t(errorKey)}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {t('auth.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
