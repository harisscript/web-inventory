import { RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/components/ui/button'

import { RecentActivityCard } from '../components/recent-activity-card'
import { StockAlertCard } from '../components/stock-alert-card'
import { StockMovementCard } from '../components/stock-movement-card'
import { SummaryCard } from '../components/summary-card'
import { TopUsedIngredientsCard } from '../components/top-used-ingredients-card'
import {
  dashboardSummaryMock,
  recentActivityMock,
  stockAlertMock,
  stockMovementMock,
  topUsedIngredientsMock,
} from '../data/dashboard-mock'

export function DashboardPage() {
  const { t } = useTranslation('dashboard')
  const [refreshKey] = useState(0)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="self-start sm:self-auto"
        >
          <RefreshCcw className="mr-2 h-3.5 w-3.5" />
          {t('actions.refresh')}
        </Button>
      </div>

      <div className="space-y-4">
        <SummaryCard summary={dashboardSummaryMock} />
        <StockMovementCard data={stockMovementMock} key={refreshKey} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <StockAlertCard items={stockAlertMock} />
          <TopUsedIngredientsCard ingredients={topUsedIngredientsMock} />
        </div>
        <RecentActivityCard activities={recentActivityMock} />
      </div>
    </div>
  )
}
