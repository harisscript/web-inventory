import { LogOut, Menu, Package, Store, User } from 'lucide-react'
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
import { useAuthStore } from '@/features/auth'
import { restaurantService, useRestaurantSelectionStore } from '@/features/restaurant'

export function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const activeRestaurantId = useAuthStore((s) => s.activeRestaurantId)
  const clearSelection = useRestaurantSelectionStore((s) => s.clearSelection)
  const logout = useAuthStore((s) => s.logout)

  const restaurant = activeRestaurantId ? restaurantService.getByIdSync(activeRestaurantId) : null

  const handleLogout = () => {
    logout()
    clearSelection()
    void navigate('/select-restaurant', { replace: true })
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
            <nav className="flex flex-col gap-1 p-3">{/* Mobile sheet links */}</nav>
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
        {restaurant ? (
          <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-2 py-1 text-xs">
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
        ) : null}
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
