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

import { useDeleteProduct } from '../hooks/use-product-mutations'
import type { Product } from '../types/product.types'

interface DeleteProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
}

export function DeleteProductDialog({ open, onOpenChange, product }: DeleteProductDialogProps) {
  const { t } = useTranslation(['inventory', 'common'])
  const deleteProduct = useDeleteProduct()

  const handleDelete = async () => {
    if (!product) return
    try {
      await deleteProduct.mutateAsync(product.id)
      toast.success(t('deleteSuccess'))
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : t('common:errors.generic')
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('deleteConfirmTitle')}</DialogTitle>
          <DialogDescription>
            {t('deleteConfirmDescription', { name: product?.name ?? '' })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteProduct.isPending}
          >
            {t('common:cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={deleteProduct.isPending}
          >
            {deleteProduct.isPending ? t('common:loading') : t('common:delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
