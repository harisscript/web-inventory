import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/utils'

interface StatRowProps {
  label: ReactNode
  value: ReactNode
  trailing?: ReactNode
  className?: string
  valueClassName?: string
}

export function StatRow({ label, value, trailing, className, valueClassName }: StatRowProps) {
  return (
    <div className={cn('flex items-center justify-between gap-3 py-1.5 text-sm', className)}>
      <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className={cn('font-medium tabular-nums text-foreground', valueClassName)}>
          {value}
        </span>
        {trailing}
      </div>
    </div>
  )
}
