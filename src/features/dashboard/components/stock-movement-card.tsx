import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { DashboardSectionCard } from '@/shared/components/dashboard/dashboard-section-card'
import { cn } from '@/shared/lib/utils'

import type { StockMovementPoint, StockMovementType } from '../types/dashboard.types'

interface StockMovementCardProps {
  data: StockMovementPoint[]
}

const SERIES: Array<{ key: StockMovementType; labelKey: string; color: string }> = [
  { key: 'stockIn', labelKey: 'stockMovement.stockIn', color: 'hsl(var(--success))' },
  { key: 'stockOut', labelKey: 'stockMovement.stockOut', color: 'hsl(var(--destructive))' },
  { key: 'adjustment', labelKey: 'stockMovement.adjustment', color: 'hsl(var(--warning))' },
]

interface SummaryStatProps {
  label: string
  value: number
  tone: 'success' | 'destructive' | 'warning'
}

function SummaryStat({ label, value, tone }: SummaryStatProps) {
  const toneClass = {
    success: 'text-success',
    destructive: 'text-destructive',
    warning: 'text-warning',
  }[tone]
  return (
    <div className="rounded-md border border-border/60 bg-background/60 px-3 py-2">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={cn('mt-1 text-lg font-semibold tabular-nums', toneClass)}>{value}</p>
    </div>
  )
}

interface LegendPayload {
  value: string
  color: string
}

function CustomLegend({ payload }: { payload?: LegendPayload[] }) {
  const { t } = useTranslation('dashboard')
  if (!payload) return null
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-2 text-xs">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5 text-muted-foreground">
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span>{t(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

interface ChartTooltipPayloadEntry {
  dataKey?: string | number
  value?: number | string
  color?: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: ChartTooltipPayloadEntry[]
  label?: string | number
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  const { t } = useTranslation('dashboard')
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="rounded-md border border-border/60 bg-background px-3 py-2 text-xs shadow-md">
      <p className="mb-1.5 font-semibold text-foreground">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, idx) => {
          const seriesKey = entry.dataKey as StockMovementType | undefined
          const labelKey =
            SERIES.find((s) => s.key === seriesKey)?.labelKey ?? 'stockMovement.stockIn'
          return (
            <div
              key={`${entry.dataKey}-${idx}`}
              className="flex items-center justify-between gap-4"
            >
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  aria-hidden="true"
                  className="inline-block h-2 w-2 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                {t(labelKey)}
              </span>
              <span className="font-medium tabular-nums text-foreground">{entry.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function StockMovementCard({ data }: StockMovementCardProps) {
  const { t } = useTranslation('dashboard')

  const totals = useMemo(() => {
    return data.reduce(
      (acc, point) => {
        acc.stockIn += point.stockIn
        acc.stockOut += point.stockOut
        acc.adjustment += point.adjustment
        acc.net += point.stockIn - point.stockOut
        return acc
      },
      { stockIn: 0, stockOut: 0, adjustment: 0, net: 0 },
    )
  }, [data])

  const copyValue = [
    `${t('stockMovement.title')} - ${t('stockMovement.subtitle')}`,
    ...data.map(
      (p) =>
        `${p.day}: ${t('stockMovement.stockIn')} ${p.stockIn}, ${t('stockMovement.stockOut')} ${p.stockOut}, ${t('stockMovement.adjustment')} ${p.adjustment}`,
    ),
    '',
    `${t('stockMovement.totalIn')}: ${totals.stockIn}`,
    `${t('stockMovement.totalOut')}: ${totals.stockOut}`,
    `${t('stockMovement.netChange')}: ${totals.net}`,
  ].join('\n')

  const legendPayload: LegendPayload[] = SERIES.map((s) => ({
    value: s.labelKey,
    color: s.color,
  }))

  return (
    <DashboardSectionCard
      title={t('stockMovement.title')}
      subtitle={t('stockMovement.subtitle')}
      copyValue={copyValue}
      contentClassName="pt-3"
    >
      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.4}
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              width={32}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
              content={<ChartTooltip />}
            />
            <Legend content={<CustomLegend payload={legendPayload} />} />
            {SERIES.map((series) => (
              <Bar
                key={series.key}
                dataKey={series.key}
                fill={series.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              >
                {data.map((_, idx) => (
                  <Cell key={`${series.key}-${idx}`} />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <SummaryStat label={t('stockMovement.totalIn')} value={totals.stockIn} tone="success" />
        <SummaryStat
          label={t('stockMovement.totalOut')}
          value={totals.stockOut}
          tone="destructive"
        />
        <SummaryStat
          label={t('stockMovement.netChange')}
          value={totals.net}
          tone={totals.net >= 0 ? 'success' : 'destructive'}
        />
      </div>
    </DashboardSectionCard>
  )
}
