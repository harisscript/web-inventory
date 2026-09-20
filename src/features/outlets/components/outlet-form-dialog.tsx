import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet'
import { useMediaQuery } from '@/shared/hooks/use-media-query'

import { OutletForm } from './outlet-form'
import { useCreateOutlet, useUpdateOutlet } from '../hooks/use-outlet-mutations'
import type { OutletFormValues } from '../schemas/outlet.schema'
import type { Outlet } from '../types/outlet.types'

interface OutletFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  outlet?: Outlet | null
}

export function OutletFormDialog({ open, onOpenChange, outlet }: OutletFormDialogProps) {
  const { t } = useTranslation(['outlets', 'common'])
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const create = useCreateOutlet()
  const update = useUpdateOutlet()

  const isEdit = Boolean(outlet)
  const isSubmitting = create.isPending || update.isPending

  const handleSubmit = async (values: OutletFormValues) => {
    try {
      const payload = {
        restaurantId: values.restaurantId,
        name: values.name,
        status: values.status,
        address: values.address,
        city: values.city,
        contactPerson: values.contactPerson,
        contactPhone: values.contactPhone,
        defaultWarehouseId: values.defaultWarehouseId || undefined,
        emoji: values.emoji ?? '🏪',
        accentColor: values.accentColor ?? 'from-amber-500 to-orange-600',
      }
      if (isEdit && outlet) {
        await update.mutateAsync({ id: outlet.id, input: payload })
        toast.success(t('updateSuccess'))
      } else {
        await create.mutateAsync(payload)
        toast.success(t('createSuccess'))
      }
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : t('errors.generic')
      toast.error(message)
    }
  }

  const title = isEdit ? t('editOutlet') : t('addOutlet')
  const description = isEdit ? t('editOutletDescription') : t('addOutletDescription')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <OutletForm
            outlet={outlet}
            onSubmit={(values) => void handleSubmit(values)}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <OutletForm
          outlet={outlet}
          onSubmit={(values) => void handleSubmit(values)}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </SheetContent>
    </Sheet>
  )
}
