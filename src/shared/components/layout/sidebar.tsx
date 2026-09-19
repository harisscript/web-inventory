import { Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { NavLink } from '@/shared/components/layout/nav-link'
import { APP_NAME } from '@/shared/config/constants'

const navItems = [{ to: '/inventory', key: 'inventory' as const }] as const

export function Sidebar() {
  const { t } = useTranslation()

  return (
    <aside className="hidden w-60 shrink-0 border-r bg-sidebar text-sidebar-foreground lg:block">
      <div className="safe-top flex h-14 items-center border-b px-4">
        <span className="flex items-center gap-2 font-semibold">
          <Package className="h-5 w-5 text-primary" />
          {APP_NAME}
        </span>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {t(`nav.${item.key}`)}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
