import { ChevronDown, Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { NavLink, type NavTone } from '@/shared/components/layout/nav-link'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { APP_DESCRIPTION, APP_NAME } from '@/shared/config/constants'
import { cn } from '@/shared/lib/utils'
import { useAuth, useAuthStore, ROLE_LABELS } from '@/features/auth'
import { getNavItemsForRole } from '@/features/auth/config/permissions'
import { restaurantService } from '@/features/restaurant'

const TONE_DOT: Record<NavTone, string> = {
  primary: 'bg-primary',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
  slate: 'bg-slate-500',
}

function getInitials(name: string | undefined): string {
  if (!name) return '?'
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function Sidebar() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const activeRestaurantId = useAuthStore((s) => s.activeRestaurantId)
  const restaurant = activeRestaurantId ? restaurantService.getByIdSync(activeRestaurantId) : null
  const navSections = getNavItemsForRole(user?.role)
  const userInitials = getInitials(user?.name)

  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
      <div className="safe-top flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm"
        >
          <Package className="h-5 w-5" />
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-sm font-semibold text-sidebar-foreground">{APP_NAME}</span>
          <span className="truncate text-[11px] text-muted-foreground">{APP_DESCRIPTION}</span>
        </div>
      </div>

      {restaurant ? (
        <div className="mx-3 mt-3 flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-2.5 py-2">
          <span
            aria-hidden="true"
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-sm text-white',
              restaurant.accentColor,
            )}
          >
            {restaurant.emoji}
          </span>
          <span className="flex-1 truncate text-xs font-medium text-sidebar-foreground">
            {restaurant.name}
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </div>
      ) : null}

      <nav className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-5">
          {navSections.map((section) => (
            <div key={section.id} className="flex flex-col gap-1">
              {section.labelKey ? (
                <div className="flex items-center gap-2 px-3 pb-1">
                  <span
                    aria-hidden="true"
                    className={cn('h-1.5 w-1.5 rounded-full', TONE_DOT[section.tone])}
                  />
                  <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {t(section.labelKey)}
                  </h2>
                </div>
              ) : null}
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    disabled={!item.enabled}
                    tone={section.tone}
                    icon={<Icon className="h-4 w-4" />}
                  >
                    {t(item.labelKey)}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <Avatar className="h-9 w-9 border border-sidebar-border">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-[11px] font-semibold text-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.name ?? 'Guest'}
            </span>
            <span className="truncate text-[11px] text-muted-foreground">{user?.email}</span>
          </div>
          {user?.role ? (
            <span className="inline-flex shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
              {ROLE_LABELS[user.role]}
            </span>
          ) : null}
        </div>
      </div>
    </aside>
  )
}
