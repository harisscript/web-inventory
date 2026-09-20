import { Carrot, MapPin, Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

import type { Outlet } from '../types/outlet.types'

interface OutletInfoCardProps {
  outlet: Outlet
  onEdit?: (outlet: Outlet) => void
  onDelete?: (outlet: Outlet) => void
  canEdit?: boolean
  canDelete?: boolean
}

const STATUS_TONE: Record<Outlet['status'], string> = {
  active:
    'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  inactive: 'border-transparent bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
}

export function OutletInfoCard({
  outlet,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: OutletInfoCardProps) {
  const { t } = useTranslation(['outlets', 'common'])

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-lg text-white',
              outlet.accentColor,
            )}
          >
            {outlet.emoji}
          </span>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold leading-tight">{outlet.name}</h4>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="line-clamp-1">{outlet.city}</span>
            </div>
          </div>
        </div>
        <Badge className={cn('shrink-0', STATUS_TONE[outlet.status])}>
          {t(`status.${outlet.status}`)}
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-dashed border-border pt-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Carrot className="h-3.5 w-3.5" />
          <span className="font-mono">{outlet.ingredientCount}</span>
          <span>{t('ingredients')}</span>
        </div>
        {(canEdit || canDelete) && (
          <div className="flex items-center gap-1">
            {canEdit && onEdit && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(outlet)}
                aria-label={t('common:edit')}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            {canDelete && onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => onDelete(outlet)}
                aria-label={t('common:delete')}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
