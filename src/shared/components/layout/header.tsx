import { ChevronDown, LogOut, Menu, Package, Store, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { LanguageSwitcher } from '@/shared/components/language-switcher'
import { ThemeToggle } from '@/shared/components/theme-toggle'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/components/ui/sheet'
import { APP_NAME } from '@/shared/config/constants'
import { cn } from '@/shared/lib/utils'
import { useAuth, useAuthStore } from '@/features/auth'
import { getNavItemsForRole } from '@/features/auth/config/permissions'
import { restaurantService } from '@/features/restaurant'

import { NavLink } from './nav-link'

export function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout, setActiveRestaurant } = useAuth()
  const activeRestaurantId = useAuthStore((s) => s.activeRestaurantId)

  const restaurant = activeRestaurantId ? restaurantService.getByIdSync(activeRestaurantId) : null
  const accessibleRestaurants = (user?.restaurantIds ?? [])
    .map((id) => restaurantService.getByIdSync(id))
    .filter((r): r is NonNullable<typeof r> => r !== null)
  const showSwitcher = accessibleRestaurants.length > 1

  const handleLogout = () => {
    logout()
    void navigate('/login', { replace: true })
  }

  const handleSwitchRestaurant = (id: string) => {
    setActiveRestaurant(id)
    void navigate('/inventory', { replace: true })
  }

  const renderRestaurantBadge = (extraClass?: string) => {
    if (!restaurant) return null
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-md border bg-muted/40 px-2 py-1 text-xs',
          extraClass,
        )}
      >
        <span
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br text-xs text-white',
            restaurant.accentColor,
          )}
          aria-hidden="true"
        >
          {restaurant.emoji}
        </span>
        <Store className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium">{restaurant.name}</span>
      </div>
    )
  }

  return (
    <header className="safe-top sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background px-3 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('nav.menu')}>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-14 items-center border-b px-4">
              <span className="flex items-center gap-2 font-semibold">
                <Package className="h-5 w-5 text-primary" />
                {APP_NAME}
              </span>
            </div>
            <nav className="flex flex-col gap-1 p-3">
              {getNavItemsForRole(user?.role).map((item) => {
                const Icon = item.icon
                return (
                  <NavLink key={item.to} to={item.to} disabled={!item.enabled}>
                    <Icon className="h-4 w-4" />
                    {t(item.labelKey)}
                  </NavLink>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <Package className="h-5 w-5 text-primary" />
        <span className="font-semibold">{APP_NAME}</span>
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <Package className="h-5 w-5 text-primary" />
        <span className="font-semibold">{APP_NAME}</span>
        {showSwitcher && restaurant ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 px-2 text-xs font-normal"
                aria-label={t('nav.menu')}
              >
                {renderRestaurantBadge('border-0 bg-transparent p-0')}
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>{t('nav.menu')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {accessibleRestaurants.map((r) => (
                <DropdownMenuItem
                  key={r.id}
                  onClick={() => handleSwitchRestaurant(r.id)}
                  className={cn(r.id === activeRestaurantId && 'bg-muted')}
                >
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br text-sm text-white',
                      r.accentColor,
                    )}
                    aria-hidden="true"
                  >
                    {r.emoji}
                  </span>
                  <span className="flex-1 truncate">{r.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          renderRestaurantBadge()
        )}
      </div>

      <div className="ml-auto flex items-center gap-1">
        {restaurant ? (
          <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-2 py-1 text-xs md:hidden">
            <span
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br text-xs text-white',
                restaurant.accentColor,
              )}
              aria-hidden="true"
            >
              {restaurant.emoji}
            </span>
            <span className="font-medium">{restaurant.name}</span>
          </div>
        ) : null}
        <LanguageSwitcher />
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="User menu">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name ?? 'Guest'}</p>
                <p className="text-xs text-muted-foreground">{user?.email ?? ''}</p>
                {user?.role ? (
                  <p className="mt-1 inline-flex w-fit rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium uppercase text-primary">
                    {user.role}
                  </p>
                ) : null}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t('nav.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
