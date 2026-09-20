import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useAuthStore } from '@/features/auth'
import { restaurantService } from '@/features/restaurant'
import { Button } from '@/shared/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { useMediaQuery } from '@/shared/hooks/use-media-query'

import { outletSchema, type OutletFormValues } from '../schemas/outlet.schema'
import type { Outlet } from '../types/outlet.types'

interface OutletFormProps {
  outlet?: Outlet | null
  onSubmit: (values: OutletFormValues) => void
  onCancel?: () => void
  isSubmitting?: boolean
}

const DEFAULT_ACCENTS = [
  { value: 'from-amber-500 to-orange-600', label: 'Amber' },
  { value: 'from-emerald-500 to-teal-600', label: 'Emerald' },
  { value: 'from-sky-500 to-blue-600', label: 'Sky' },
  { value: 'from-rose-500 to-pink-600', label: 'Rose' },
  { value: 'from-violet-500 to-purple-600', label: 'Violet' },
  { value: 'from-slate-500 to-slate-700', label: 'Slate' },
]

const DEFAULT_EMOJIS = ['🏪', '🏬', '🌿', '🍽️', '🍜', '☕', '🥖', '🍕']

export function OutletForm({ outlet, onSubmit, onCancel, isSubmitting }: OutletFormProps) {
  const { t } = useTranslation(['outlets', 'common'])
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const accessibleRestaurantIds = useAuthStore((s) => s.user?.restaurantIds ?? [])
  const activeRestaurantId = useAuthStore((s) => s.activeRestaurantId)
  const accessibleRestaurants = useMemo(
    () => restaurantService.listSync().filter((r) => accessibleRestaurantIds.includes(r.id)),
    [accessibleRestaurantIds],
  )

  const form = useForm<OutletFormValues>({
    resolver: zodResolver(outletSchema),
    defaultValues: {
      restaurantId: outlet?.restaurantId ?? activeRestaurantId ?? accessibleRestaurantIds[0] ?? '',
      name: '',
      status: 'active',
      address: '',
      city: '',
      contactPerson: '',
      contactPhone: '',
      defaultWarehouseId: '',
      emoji: '🏪',
      accentColor: DEFAULT_ACCENTS[0].value,
    },
  })

  useEffect(() => {
    if (outlet) {
      form.reset({
        restaurantId: outlet.restaurantId,
        name: outlet.name,
        status: outlet.status,
        address: outlet.address,
        city: outlet.city,
        contactPerson: outlet.contactPerson,
        contactPhone: outlet.contactPhone,
        defaultWarehouseId: outlet.defaultWarehouseId ?? '',
        emoji: outlet.emoji,
        accentColor: outlet.accentColor,
      })
    }
  }, [outlet, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="restaurantId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.restaurant')}</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={accessibleRestaurants.length <= 1}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('form.restaurant')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accessibleRestaurants.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={isDesktop ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.name')}</FormLabel>
                <FormControl>
                  <Input placeholder="Cabang Bandung" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.status')}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.status')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">{t('status.active')}</SelectItem>
                    <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.address')}</FormLabel>
              <FormControl>
                <Input placeholder="Jl. Kemang Raya No. 25" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={isDesktop ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.city')}</FormLabel>
                <FormControl>
                  <Input placeholder="Jakarta Selatan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.contactPerson')}</FormLabel>
                <FormControl>
                  <Input placeholder="Budi Santoso" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className={isDesktop ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.contactPhone')}</FormLabel>
                <FormControl>
                  <Input placeholder="+62 21 720 1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="defaultWarehouseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.defaultWarehouse')}</FormLabel>
                <FormControl>
                  <Input placeholder="wh_jaksel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className={isDesktop ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
          <FormField
            control={form.control}
            name="emoji"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.emoji')}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? '🏪'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="🏪" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DEFAULT_EMOJIS.map((emoji) => (
                      <SelectItem key={emoji} value={emoji}>
                        <span className="text-base">{emoji}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accentColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.accentColor')}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? DEFAULT_ACCENTS[0].value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.accentColor')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DEFAULT_ACCENTS.map((accent) => (
                      <SelectItem key={accent.value} value={accent.value}>
                        {accent.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              {t('common:cancel')}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('common:loading') : outlet ? t('common:update') : t('common:create')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
