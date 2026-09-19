import { Download, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRegisterSW } from 'virtual:pwa-register/react'

import { Button } from '@/shared/components/ui/button'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPWA() {
  const { t } = useTranslation()
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useRegisterSW({
    immediate: true,
    onRegisteredSW(swUrl) {
      console.info('[PWA] Service worker registered:', swUrl)
    },
    onRegisterError(error) {
      console.error('[PWA] Registration failed:', error)
    },
  })

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallEvent(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!installEvent || dismissed) return null

  const handleInstall = async () => {
    if (!installEvent) return
    await installEvent.prompt()
    const { outcome } = await installEvent.userChoice
    if (outcome === 'accepted') {
      setInstallEvent(null)
    }
    setDismissed(true)
  }

  return (
    <div className="fixed bottom-20 left-3 right-3 z-50 flex items-center gap-3 rounded-lg border bg-card p-3 text-card-foreground shadow-lg md:bottom-4 md:left-auto md:right-4 md:w-96">
      <div className="flex-1">
        <p className="text-sm font-medium">{t('install.title')}</p>
        <p className="text-xs text-muted-foreground">{t('install.description')}</p>
      </div>
      <Button size="sm" onClick={() => void handleInstall()}>
        <Download className="mr-1 h-4 w-4" />
        {t('install.install')}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setDismissed(true)}
        aria-label={t('install.dismiss')}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
