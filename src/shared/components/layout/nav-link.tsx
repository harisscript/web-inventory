import { NavLink as RouterNavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

export type NavTone = 'primary' | 'amber' | 'emerald'

const TONE_ACTIVE_BG: Record<NavTone, string> = {
  primary: 'bg-primary text-primary-foreground',
  amber: 'bg-amber-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  sky: 'bg-sky-500 text-white',
}

const TONE_INACTIVE_BG: Record<NavTone, string> = {
  primary: 'bg-primary/10 text-primary',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
}

const TONE_ACCENT: Record<NavTone, string> = {
  primary: 'bg-primary',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
}

interface NavLinkProps {
  to: string
  children: ReactNode
  icon?: ReactNode
  onClick?: () => void
  variant?: 'sidebar' | 'mobile'
  disabled?: boolean
  tone?: NavTone
}

export function NavLink({
  to,
  children,
  icon,
  onClick,
  variant = 'sidebar',
  disabled = false,
  tone = 'primary',
}: NavLinkProps) {
  if (variant === 'sidebar') {
    if (disabled) {
      return (
        <span
          aria-disabled="true"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium opacity-50',
          )}
          title="Coming soon"
        >
          {icon && (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              {icon}
            </span>
          )}
          <span className="truncate">{children}</span>
        </span>
      )
    }

    return (
      <RouterNavLink
        to={to}
        end={to === '/'}
        onClick={onClick}
        className={({ isActive }) =>
          cn(
            'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-sidebar-accent',
            isActive && 'bg-sidebar-accent font-semibold',
          )
        }
      >
        {({ isActive }) => (
          <>
            <span
              aria-hidden="true"
              className={cn(
                'absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full transition-opacity',
                TONE_ACCENT[tone],
                isActive ? 'opacity-100' : 'opacity-0',
              )}
            />
            {icon && (
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                  isActive ? TONE_ACTIVE_BG[tone] : TONE_INACTIVE_BG[tone],
                )}
              >
                {icon}
              </span>
            )}
            <span className="truncate">{children}</span>
          </>
        )}
      </RouterNavLink>
    )
  }

  const baseClasses =
    'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors'

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={cn(baseClasses, 'cursor-not-allowed opacity-50')}
        title="Coming soon"
      >
        {icon && <span className="flex items-center">{icon}</span>}
        <span>{children}</span>
      </span>
    )
  }

  return (
    <RouterNavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        cn(baseClasses, isActive ? 'text-primary' : 'text-muted-foreground')
      }
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
    </RouterNavLink>
  )
}
