import { NavLink as RouterNavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface NavLinkProps {
  to: string
  children: ReactNode
  icon?: ReactNode
  onClick?: () => void
  variant?: 'sidebar' | 'mobile'
  disabled?: boolean
}

export function NavLink({
  to,
  children,
  icon,
  onClick,
  variant = 'sidebar',
  disabled = false,
}: NavLinkProps) {
  const baseClasses =
    variant === 'sidebar'
      ? 'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      : 'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors'

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
        cn(
          baseClasses,
          isActive
            ? variant === 'sidebar'
              ? 'text-sidebar-accent-foreground bg-sidebar-accent'
              : 'text-primary'
            : 'text-muted-foreground',
        )
      }
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
    </RouterNavLink>
  )
}
