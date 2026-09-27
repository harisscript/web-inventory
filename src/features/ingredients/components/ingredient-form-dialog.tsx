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

import { IngredientForm } from './ingredient-form'
import { useCreateIngredient, useUpdateIngredient } from '../hooks/use-ingredient-mutations'
import { type IngredientFormValues } from '../schemas/ingredient.schema'
import type { Ingredient } from '../types/ingredient.types'

interface IngredientFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ingredient?: Ingredient | null
}

export function IngredientFormDialog({
  open,
  onOpenChange,
  ingredient,
}: IngredientFormDialogProps) {
  const { t } = useTranslation(['ingredients', 'common'])
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const create = useCreateIngredient()
  const update = useUpdateIngredient()

  const isEdit = Boolean(ingredient)
  const isSubmitting = create.isPending || update.isPending

  const handleSubmit = async (values: IngredientFormValues) => {
    const payload = {
      code: values.code,
      name: values.name,
      category: values.category,
      baseUnit: values.baseUnit,
      largeUnit: values.largeUnit && values.largeUnit !== '' ? values.largeUnit : null,
      conversionQty: values.conversionQty ?? null,
      minStock: values.minStock,
      status: values.status,
      description: values.description || undefined,
      imageUrl: values.imageUrl && values.imageUrl !== '' ? values.imageUrl : undefined,
    }
    try {
      if (isEdit && ingredient) {
        await update.mutateAsync({ id: ingredient.id, input: payload })
        toast.success(t('ingredients:updateSuccess'))
      } else {
        await create.mutateAsync(payload)
        toast.success(t('ingredients:createSuccess'))
      }
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : t('common:errors.generic')
      toast.error(message)
    }
  }

  const title = isEdit ? t('ingredients:editIngredient') : t('ingredients:addIngredient')
  const description = isEdit
    ? t('ingredients:editIngredientDescription')
    : t('ingredients:addIngredientDescription')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <IngredientForm
            ingredient={ingredient}
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
        <IngredientForm
          ingredient={ingredient}
          onSubmit={(values) => void handleSubmit(values)}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </SheetContent>
    </Sheet>
  )
}
