import type { ReactNode } from 'react'

import { Card, CardContent } from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'

import { CopyButton } from './copy-button'

interface DashboardSectionCardProps {
  title: string
  subtitle?: string
  copyValue?: string
  className?: string
  contentClassName?: string
  children: ReactNode
}

export function DashboardSectionCard({
  title,
  subtitle,
  copyValue,
  className,
  contentClassName,
  children,
}: DashboardSectionCardProps) {
  return (
    <Card className={cn('overflow-hidden border-border/60 bg-muted/30 shadow-none', className)}>
      <div className="flex items-start justify-between gap-2 px-5 pt-5">
        <div className="min-w-0">
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </h3>
          {subtitle ? <p className="mt-1 text-sm font-medium text-foreground">{subtitle}</p> : null}
        </div>
        {copyValue ? <CopyButton value={copyValue} /> : null}
      </div>
      <CardContent className={cn('px-5 pb-5 pt-4', contentClassName)}>{children}</CardContent>
    </Card>
  )
}
