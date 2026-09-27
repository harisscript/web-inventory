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

import { useDeleteIngredient } from '../hooks/use-ingredient-mutations'
import type { Ingredient } from '../types/ingredient.types'

interface DeleteIngredientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ingredient: Ingredient | null
}

export function DeleteIngredientDialog({
  open,
  onOpenChange,
  ingredient,
}: DeleteIngredientDialogProps) {
  const { t } = useTranslation(['ingredients', 'common'])
  const deleteIngredient = useDeleteIngredient()

  const handleDelete = async () => {
    if (!ingredient) return
    try {
      await deleteIngredient.mutateAsync(ingredient.id)
      toast.success(t('ingredients:deleteSuccess'))
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
          <DialogTitle>{t('ingredients:deleteConfirmTitle')}</DialogTitle>
          <DialogDescription>
            {t('ingredients:deleteConfirmDescription', { name: ingredient?.name ?? '' })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteIngredient.isPending}
          >
            {t('common:cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={deleteIngredient.isPending}
          >
            {deleteIngredient.isPending ? t('common:loading') : t('common:delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
