import { Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate } from 'react-router-dom'

import { LanguageSwitcher } from '@/shared/components/language-switcher'
import { ThemeToggle } from '@/shared/components/theme-toggle'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { useAuthStore } from '@/features/auth'

import { LoginForm } from '../components/login-form'

export function LoginPage() {
  const { t } = useTranslation(['auth', 'common'])
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/inventory" replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex items-center justify-end gap-1 p-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">{t('welcomeBack')}</CardTitle>
            <CardDescription>{t('loginSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginForm />
            <p className="text-center text-sm text-muted-foreground">
              {t('noAccount')}{' '}
              <Link to="/register" className="font-medium text-primary hover:underline">
                {t('register')}
              </Link>
            </p>
            <p className="rounded-md bg-muted/50 p-2 text-center text-xs text-muted-foreground">
              {t('demoHint')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
