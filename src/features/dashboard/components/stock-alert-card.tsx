import { useTranslation } from 'react-i18next'

import { Badge } from '@/shared/components/ui/badge'
import { DashboardSectionCard } from '@/shared/components/dashboard/dashboard-section-card'
import { cn } from '@/shared/lib/utils'

import type { StockAlertItem, StockAlertSeverity } from '../types/dashboard.types'

interface StockAlertCardProps {
  items: StockAlertItem[]
}

const SEVERITY_STYLES: Record<StockAlertSeverity, string> = {
  low: 'bg-warning/15 text-warning ring-warning/30',
  out: 'bg-destructive/15 text-destructive ring-destructive/30',
}

function formatStockValue(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toString()
}

export function StockAlertCard({ items }: StockAlertCardProps) {
  const { t } = useTranslation('dashboard')

  const sortedItems = [...items].sort((a, b) => {
    if (a.severity !== b.severity) {
      return a.severity === 'out' ? -1 : 1
    }
    return a.currentStock - b.currentStock
  })

  const copyValue = sortedItems
    .map(
      (item) =>
        `${item.name}: ${formatStockValue(item.currentStock)} ${item.unit} / min ${formatStockValue(item.minStock)} ${item.unit} — ${t(`stockAlert.status.${item.severity}`)}`,
    )
    .join('\n')

  return (
    <DashboardSectionCard
      title={t('stockAlert.title')}
      subtitle={t('stockAlert.subtitle')}
      copyValue={copyValue}
      contentClassName="pt-2"
    >
      {sortedItems.length === 0 ? (
        <p className="py-4 text-sm text-muted-foreground">{t('stockAlert.noItems')}</p>
      ) : (
        <div className="overflow-hidden rounded-md border border-border/60 bg-background/60">
          <div
            role="row"
            className="grid grid-cols-[minmax(0,1fr)_72px_72px_64px_72px] items-center gap-2 border-b border-border/60 bg-muted/40 px-3 py-2.5"
          >
            <span
              role="columnheader"
              className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {t('stockAlert.columns.ingredient')}
            </span>
            <span
              role="columnheader"
              className="text-right font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {t('stockAlert.columns.current')}
            </span>
            <span
              role="columnheader"
              className="text-right font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {t('stockAlert.columns.minStock')}
            </span>
            <span
              role="columnheader"
              className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {t('stockAlert.columns.unit')}
            </span>
            <span
              role="columnheader"
              className="text-right font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {t('stockAlert.columns.status')}
            </span>
          </div>
          <div role="rowgroup">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                role="row"
                className="grid grid-cols-[minmax(0,1fr)_72px_72px_64px_72px] items-center gap-2 border-b border-border/40 px-3 py-2.5 text-sm transition-colors last:border-b-0 hover:bg-muted/30"
              >
                <span role="cell" className="truncate font-medium text-foreground">
                  {item.name}
                </span>
                <span
                  role="cell"
                  className={cn(
                    'text-right tabular-nums',
                    item.severity === 'out' ? 'text-destructive' : 'text-foreground',
                  )}
                >
                  {formatStockValue(item.currentStock)}
                </span>
                <span role="cell" className="text-right tabular-nums text-muted-foreground">
                  {formatStockValue(item.minStock)}
                </span>
                <span role="cell" className="text-muted-foreground">
                  {item.unit}
                </span>
                <span role="cell" className="flex justify-end">
                  <Badge
                    variant="outline"
                    className={cn(
                      'border-transparent px-2 py-0 text-[11px] font-medium ring-1 ring-inset',
                      SEVERITY_STYLES[item.severity],
                    )}
                  >
                    {t(`stockAlert.status.${item.severity}`)}
                  </Badge>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardSectionCard>
  )
}
