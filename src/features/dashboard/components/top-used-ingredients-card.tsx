import { useTranslation } from 'react-i18next'

import { DashboardSectionCard } from '@/shared/components/dashboard/dashboard-section-card'
import { StatRow } from '@/shared/components/dashboard/stat-row'
import { cn } from '@/shared/lib/utils'

import type { TopUsedIngredient } from '../types/dashboard.types'

interface TopUsedIngredientsCardProps {
  ingredients: TopUsedIngredient[]
}

const RANK_STYLES: Record<number, string> = {
  1: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 ring-amber-500/30',
  2: 'bg-slate-400/15 text-slate-600 dark:text-slate-300 ring-slate-400/30',
  3: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 ring-orange-500/30',
}

function formatUsage(item: TopUsedIngredient): string {
  return `${item.amount} ${item.unit}`
}

export function TopUsedIngredientsCard({ ingredients }: TopUsedIngredientsCardProps) {
  const { t } = useTranslation('dashboard')

  const copyValue = ingredients
    .map((item, idx) => `${idx + 1}. ${item.name} - ${formatUsage(item)}`)
    .join('\n')

  return (
    <DashboardSectionCard
      title={t('topUsed.title')}
      subtitle={t('topUsed.subtitle')}
      copyValue={copyValue}
      contentClassName="pt-2"
    >
      {ingredients.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">{t('stockAlert.noItems')}</p>
      ) : (
        <div className="flex flex-col">
          {ingredients.map((item, idx) => {
            const rank = idx + 1
            const rankStyle = RANK_STYLES[rank]
            return (
              <div key={item.id}>
                <StatRow
                  label={
                    <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                      <span
                        className={cn(
                          'inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ring-1 ring-inset',
                          rankStyle ?? 'bg-muted text-muted-foreground ring-border',
                        )}
                      >
                        {rank}
                      </span>
                      <span className="font-sans text-sm font-medium normal-case tracking-normal text-foreground">
                        {item.name}
                      </span>
                    </span>
                  }
                  value={formatUsage(item)}
                />
                {idx < ingredients.length - 1 ? <div className="h-px w-full bg-border/60" /> : null}
              </div>
            )
          })}
        </div>
      )}
    </DashboardSectionCard>
  )
}
