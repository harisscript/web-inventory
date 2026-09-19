import { Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { NavLink } from '@/shared/components/layout/nav-link'

const navItems = [
  { to: '/inventory', key: 'inventory' as const, icon: <Package className="h-5 w-5" /> },
] as const

export function MobileNav() {
  const { t } = useTranslation()

  return (
    <nav className="safe-bottom sticky bottom-0 z-40 flex h-16 items-center justify-around border-t bg-background lg:hidden">
      {navItems.map((item) => (
        <NavLink key={item.to} to={item.to} icon={item.icon} variant="mobile">
          {t(`nav.${item.key}`)}
        </NavLink>
      ))}
    </nav>
  )
}
