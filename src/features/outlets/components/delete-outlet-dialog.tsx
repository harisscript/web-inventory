import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'

import { useDeleteOutlet } from '../hooks/use-outlet-mutations'
import type { Outlet } from '../types/outlet.types'

interface DeleteOutletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  outlet: Outlet | null
}

export function DeleteOutletDialog({ open, onOpenChange, outlet }: DeleteOutletDialogProps) {
  const { t } = useTranslation(['outlets', 'common'])
  const remove = useDeleteOutlet()

  const handleDelete = async () => {
    if (!outlet) return
    try {
      await remove.mutateAsync(outlet.id)
      toast.success(t('deleteSuccess'))
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : t('errors.generic')
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('deleteConfirmTitle')}</DialogTitle>
          <DialogDescription>
            {t('deleteConfirmDescription', { name: outlet?.name ?? '' })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={remove.isPending}
          >
            {t('common:cancel')}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={remove.isPending}
          >
            {remove.isPending ? t('common:loading') : t('common:delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
