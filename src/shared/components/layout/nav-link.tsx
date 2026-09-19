import { NavLink as RouterNavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface NavLinkProps {
  to: string
  children: ReactNode
  icon?: ReactNode
  onClick?: () => void
  variant?: 'sidebar' | 'mobile'
}

export function NavLink({ to, children, icon, onClick, variant = 'sidebar' }: NavLinkProps) {
  const baseClasses =
    variant === 'sidebar'
      ? 'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      : 'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors'

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
