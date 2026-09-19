import { Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { NavLink } from '@/shared/components/layout/nav-link'
import { APP_NAME } from '@/shared/config/constants'
import { useAuth } from '@/features/auth'
import { getNavItemsForRole } from '@/features/auth/config/permissions'

export function Sidebar() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navItems = getNavItemsForRole(user?.role)

  return (
    <aside className="hidden w-60 shrink-0 border-r bg-sidebar text-sidebar-foreground lg:block">
      <div className="safe-top flex h-14 items-center border-b px-4">
        <span className="flex items-center gap-2 font-semibold">
          <Package className="h-5 w-5 text-primary" />
          {APP_NAME}
        </span>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink key={item.to} to={item.to} disabled={!item.enabled}>
              <Icon className="h-4 w-4" />
              {t(item.labelKey)}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
