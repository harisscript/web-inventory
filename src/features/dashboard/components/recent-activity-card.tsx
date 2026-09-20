import { ArrowDownLeft, ArrowUpRight, ClipboardEdit, PackagePlus, Truck } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { DashboardSectionCard } from '@/shared/components/dashboard/dashboard-section-card'
import { cn } from '@/shared/lib/utils'

import type { RecentActivityItem, RecentActivityType } from '../types/dashboard.types'

interface RecentActivityCardProps {
  activities: RecentActivityItem[]
}

const TYPE_STYLES: Record<
  RecentActivityType,
  { icon: typeof ArrowDownLeft; tone: string; ring: string }
> = {
  stockIn: {
    icon: ArrowDownLeft,
    tone: 'bg-success/15 text-success',
    ring: 'ring-success/30',
  },
  stockOut: {
    icon: ArrowUpRight,
    tone: 'bg-destructive/15 text-destructive',
    ring: 'ring-destructive/30',
  },
  adjustment: {
    icon: ClipboardEdit,
    tone: 'bg-warning/15 text-warning',
    ring: 'ring-warning/30',
  },
  transfer: {
    icon: Truck,
    tone: 'bg-info/15 text-info',
    ring: 'ring-info/30',
  },
  purchase: {
    icon: PackagePlus,
    tone: 'bg-primary/15 text-primary',
    ring: 'ring-primary/30',
  },
}

function relativeTime(iso: string, locale: string): string {
  const target = new Date(iso).getTime()
  const now = Date.now()
  const diffSeconds = Math.max(0, Math.round((now - target) / 1000))

  if (diffSeconds < 60) return locale === 'id' ? 'baru saja' : 'just now'
  const diffMinutes = Math.round(diffSeconds / 60)
  if (diffMinutes < 60) {
    return locale === 'id' ? `${diffMinutes} menit lalu` : `${diffMinutes}m ago`
  }
  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) {
    return locale === 'id' ? `${diffHours} jam lalu` : `${diffHours}h ago`
  }
  const diffDays = Math.round(diffHours / 24)
  return locale === 'id' ? `${diffDays} hari lalu` : `${diffDays}d ago`
}

export function RecentActivityCard({ activities }: RecentActivityCardProps) {
  const { t, i18n } = useTranslation('dashboard')

  const sorted = useMemo(
    () =>
      [...activities].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      ),
    [activities],
  )

  const copyValue = sorted
    .map((a) => {
      const outlet = a.outlet ? ` — ${a.outlet}` : ''
      const amount = a.amount ? ` (${a.amount})` : ''
      return `[${relativeTime(a.timestamp, i18n.language)}] ${a.title}${outlet}${amount}: ${a.description}`
    })
    .join('\n')

  return (
    <DashboardSectionCard
      title={t('recentActivity.title')}
      subtitle={t('recentActivity.subtitle')}
      copyValue={copyValue}
      contentClassName="pt-2"
    >
      {sorted.length === 0 ? (
        <p className="py-4 text-sm text-muted-foreground">{t('recentActivity.empty')}</p>
      ) : (
        <ol className="flex flex-col">
          {sorted.map((activity, idx) => {
            const style = TYPE_STYLES[activity.type]
            const Icon = style.icon
            return (
              <li
                key={activity.id}
                className={cn(
                  'flex items-start gap-3 py-3',
                  idx < sorted.length - 1 && 'border-b border-border/40',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-inset',
                    style.tone,
                    style.ring,
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {relativeTime(activity.timestamp, i18n.language)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{activity.description}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                    {activity.outlet ? (
                      <span className="text-muted-foreground">
                        <span className="font-mono text-[10px] uppercase tracking-wider">
                          Outlet:
                        </span>{' '}
                        <span className="font-medium text-foreground/80">{activity.outlet}</span>
                      </span>
                    ) : null}
                    {activity.amount ? (
                      <span className="font-medium tabular-nums text-foreground/80">
                        {activity.amount}
                      </span>
                    ) : null}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </DashboardSectionCard>
  )
}
