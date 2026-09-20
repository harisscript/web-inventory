import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/shared/components/dashboard/copy-button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'

import { OutletInfoCard } from './outlet-info-card'
import type { Outlet } from '../types/outlet.types'

interface OutletListCardProps {
  outlets: Outlet[]
  isLoading?: boolean
  onEdit?: (outlet: Outlet) => void
  onDelete?: (outlet: Outlet) => void
  canEdit?: boolean
  canDelete?: boolean
}

function formatOutletForCopy(outlet: Outlet): string {
  return [outlet.name, `Status: ${outlet.status}`, `Ingredients: ${outlet.ingredientCount}`].join(
    ' · ',
  )
}

export function OutletListCard({
  outlets,
  isLoading,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: OutletListCardProps) {
  const { t } = useTranslation(['outlets', 'common'])

  const copyValue = outlets.map(formatOutletForCopy).join('\n')

  return (
    <Card className="overflow-hidden border-border/60 bg-muted/30 shadow-none">
      <div className="flex items-start justify-between gap-2 px-5 pt-5">
        <div className="min-w-0">
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t('title')}
          </h3>
          <p className="mt-1 text-sm font-medium text-foreground">{t('cardSubtitle')}</p>
        </div>
        {outlets.length > 0 ? <CopyButton value={copyValue} /> : null}
      </div>
      <CardContent className="px-5 pb-5 pt-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : outlets.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            {t('common:noData')}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {outlets.map((outlet) => (
              <OutletInfoCard
                key={outlet.id}
                outlet={outlet}
                onEdit={onEdit}
                onDelete={onDelete}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
