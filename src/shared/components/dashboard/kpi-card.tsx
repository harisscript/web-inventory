import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/utils'

export type KpiTone = 'primary' | 'success' | 'warning' | 'destructive' | 'info'

interface KpiCardProps {
  label: string
  value: ReactNode
  icon: LucideIcon
  tone?: KpiTone
  description?: string
  className?: string
}

const TONE_STYLES: Record<KpiTone, { iconWrap: string; iconColor: string; valueColor?: string }> = {
  primary: {
    iconWrap: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  success: {
    iconWrap: 'bg-success/10',
    iconColor: 'text-success',
  },
  warning: {
    iconWrap: 'bg-warning/15',
    iconColor: 'text-warning',
  },
  destructive: {
    iconWrap: 'bg-destructive/10',
    iconColor: 'text-destructive',
  },
  info: {
    iconWrap: 'bg-sky-500/10',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  tone = 'primary',
  description,
  className,
}: KpiCardProps) {
  const toneStyle = TONE_STYLES[tone]

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-colors hover:border-border',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          aria-hidden="true"
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg',
            toneStyle.iconWrap,
            toneStyle.iconColor,
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            'text-2xl font-semibold tabular-nums leading-tight tracking-tight text-foreground',
            toneStyle.valueColor,
          )}
        >
          {value}
        </span>
        {description ? <span className="text-xs text-muted-foreground">{description}</span> : null}
      </div>
    </div>
  )
}
