import { Construction } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'

interface ComingSoonPageProps {
  titleKey: string
  descriptionKey?: string
  icon?: ReactNode
}

export function ComingSoonPage({
  titleKey,
  descriptionKey = 'common:nav.comingSoon',
  icon,
}: ComingSoonPageProps) {
  const { t } = useTranslation(['common'])

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md border-dashed">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon ?? <Construction className="h-6 w-6" />}
          </div>
          <CardTitle className="text-xl">{t(titleKey)}</CardTitle>
          <CardDescription>{t(descriptionKey)}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pt-0">
          <Button asChild variant="outline" size="sm">
            <Link to="/inventory">{t('nav.inventory')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
