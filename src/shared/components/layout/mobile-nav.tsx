import { useTranslation } from 'react-i18next'

import { NavLink } from '@/shared/components/layout/nav-link'
import { useAuth } from '@/features/auth'
import { getPrimaryNavItemsForRole } from '@/features/auth/config/permissions'

export function MobileNav() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navItems = getPrimaryNavItemsForRole(user?.role)

  return (
    <nav className="safe-bottom sticky bottom-0 z-40 flex h-16 items-center justify-around border-t bg-background lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            icon={<Icon className="h-5 w-5" />}
            variant="mobile"
            disabled={!item.enabled}
          >
            {t(item.labelKey)}
          </NavLink>
        )
      })}
    </nav>
  )
}
