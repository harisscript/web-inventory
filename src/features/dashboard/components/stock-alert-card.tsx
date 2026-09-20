import { AlertTriangle, Circle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { DashboardSectionCard } from '@/shared/components/dashboard/dashboard-section-card'
import { StatRow } from '@/shared/components/dashboard/stat-row'
import { cn } from '@/shared/lib/utils'

import type { StockAlertItem } from '../types/dashboard.types'

interface StockAlertCardProps {
  items: StockAlertItem[]
}

function formatAmount(item: StockAlertItem): string {
  const formatted = Number.isInteger(item.amount) ? item.amount.toString() : item.amount.toString()
  return `${formatted} ${item.unit}`
}

interface AlertGroupProps {
  title: string
  items: StockAlertItem[]
  emptyText: string
  icon: 'triangle' | 'circle'
}

function AlertGroup({ title, items, emptyText, icon }: AlertGroupProps) {
  return (
    <div className="space-y-1.5">
      <h4 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      {items.length === 0 ? (
        <p className="py-2 text-xs text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="flex flex-col">
          {items.map((item, idx) => (
            <div key={item.id}>
              <StatRow
                label={item.name}
                value={formatAmount(item)}
                trailing={
                  icon === 'triangle' ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
                  ) : (
                    <Circle
                      className={cn('h-3 w-3 fill-destructive text-destructive')}
                      aria-hidden="true"
                    />
                  )
                }
              />
              {idx < items.length - 1 ? <div className="h-px w-full bg-border/60" /> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function StockAlertCard({ items }: StockAlertCardProps) {
  const { t } = useTranslation('dashboard')

  const lowItems = items.filter((item) => item.severity === 'low')
  const outItems = items.filter((item) => item.severity === 'out')

  const copyValue = [
    `${t('stockAlert.lowStock')}:`,
    ...lowItems.map((i) => `- ${i.name} ${formatAmount(i)}`),
    '',
    `${t('stockAlert.outOfStock')}:`,
    ...outItems.map((i) => `- ${i.name} ${formatAmount(i)}`),
  ].join('\n')

  return (
    <DashboardSectionCard
      title={t('stockAlert.title')}
      copyValue={copyValue}
      contentClassName="space-y-4 pt-2"
    >
      <AlertGroup
        title={t('stockAlert.lowStock')}
        items={lowItems}
        emptyText={t('stockAlert.noItems')}
        icon="triangle"
      />
      <AlertGroup
        title={t('stockAlert.outOfStock')}
        items={outItems}
        emptyText={t('stockAlert.noItems')}
        icon="circle"
      />
    </DashboardSectionCard>
  )
}
