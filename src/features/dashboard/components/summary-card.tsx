import { AlertTriangle, Carrot, ShoppingCart, Store, TrendingDown, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { DashboardSectionCard } from '@/shared/components/dashboard/dashboard-section-card'
import { KpiCard, type KpiTone } from '@/shared/components/dashboard/kpi-card'
import { formatCurrency } from '@/shared/lib/utils'

import type { DashboardSummary } from '../types/dashboard.types'

interface SummaryCardProps {
  summary: DashboardSummary
}

interface KpiConfig {
  label: string
  value: string
  icon: typeof Store
  tone: KpiTone
  description?: string
  copy: string
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const { t } = useTranslation('dashboard')

  const kpis: KpiConfig[] = [
    {
      label: t('summary.totalOutlets'),
      value: summary.totalOutlets.toString(),
      icon: Store,
      tone: 'primary',
      copy: `${t('summary.totalOutlets')}: ${summary.totalOutlets}`,
    },
    {
      label: t('summary.totalIngredients'),
      value: summary.totalIngredients.toString(),
      icon: Carrot,
      tone: 'info',
      copy: `${t('summary.totalIngredients')}: ${summary.totalIngredients}`,
    },
    {
      label: t('summary.lowStock'),
      value: summary.lowStock.toString(),
      icon: AlertTriangle,
      tone: 'warning',
      copy: `${t('summary.lowStock')}: ${summary.lowStock}`,
    },
    {
      label: t('summary.outOfStock'),
      value: summary.outOfStock.toString(),
      icon: XCircle,
      tone: 'destructive',
      copy: `${t('summary.outOfStock')}: ${summary.outOfStock}`,
    },
    {
      label: t('summary.todayPurchase'),
      value: formatCurrency(summary.todayPurchase),
      icon: ShoppingCart,
      tone: 'success',
      copy: `${t('summary.todayPurchase')}: ${formatCurrency(summary.todayPurchase)}`,
    },
    {
      label: t('summary.todayUsage'),
      value: `${summary.todayUsage}`,
      icon: TrendingDown,
      tone: 'primary',
      description: t('summary.ingredientsUnit'),
      copy: `${t('summary.todayUsage')}: ${summary.todayUsage} ${t('summary.ingredientsUnit')}`,
    },
  ]

  const copyValue = kpis.map((k) => k.copy).join('\n')

  return (
    <DashboardSectionCard title={t('summary.title')} copyValue={copyValue} contentClassName="pt-2">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            tone={kpi.tone}
            description={kpi.description}
          />
        ))}
      </div>
    </DashboardSectionCard>
  )
}
