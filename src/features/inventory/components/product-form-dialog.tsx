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

import { ProductForm } from './product-form'
import { useCreateProduct, useUpdateProduct } from '../hooks/use-product-mutations'
import { type ProductFormValues } from '../schemas/product.schema'
import type { Product } from '../types/product.types'

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
}

export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const { t } = useTranslation(['inventory', 'common'])
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const create = useCreateProduct()
  const update = useUpdateProduct()

  const isEdit = Boolean(product)
  const isSubmitting = create.isPending || update.isPending

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      const payload = {
        name: values.name,
        sku: values.sku.toUpperCase(),
        category: values.category,
        price: values.price,
        stock: values.stock,
        minStock: values.minStock,
        description: values.description || undefined,
        imageUrl: values.imageUrl || undefined,
      }
      if (isEdit && product) {
        await update.mutateAsync({ id: product.id, input: payload })
        toast.success(t('updateSuccess'))
      } else {
        await create.mutateAsync(payload)
        toast.success(t('createSuccess'))
      }
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : t('common:errors.generic')
      toast.error(message)
    }
  }

  const title = isEdit ? t('editProduct') : t('addProduct')
  const description = isEdit ? t('editProductDescription') : t('addProductDescription')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <ProductForm
            product={product}
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
        <ProductForm
          product={product}
          onSubmit={(values) => void handleSubmit(values)}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </SheetContent>
    </Sheet>
  )
}
