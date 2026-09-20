import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/components/ui/button'
import { useCan } from '@/features/auth'

import { DeleteOutletDialog } from '../components/delete-outlet-dialog'
import { OutletFormDialog } from '../components/outlet-form-dialog'
import { OutletListCard } from '../components/outlet-list-card'
import { useOutlets } from '../hooks/use-outlets'
import type { Outlet } from '../types/outlet.types'

export function OutletsPage() {
  const { t } = useTranslation(['outlets', 'common'])
  const { data: outlets = [], isLoading } = useOutlets()

  const canCreate = useCan('outlets', 'create')
  const canEdit = useCan('outlets', 'edit')
  const canDelete = useCan('outlets', 'delete')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Outlet | null>(null)
  const [deleting, setDeleting] = useState<Outlet | null>(null)

  const handleAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleEdit = (outlet: Outlet) => {
    setEditing(outlet)
    setFormOpen(true)
  }

  const handleDelete = (outlet: Outlet) => {
    setDeleting(outlet)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        {canCreate && (
          <Button onClick={handleAdd} className="self-start sm:self-auto">
            <Plus className="mr-2 h-4 w-4" />
            {t('addOutlet')}
          </Button>
        )}
      </div>

      <OutletListCard
        outlets={outlets}
        isLoading={isLoading}
        onEdit={canEdit ? handleEdit : undefined}
        onDelete={canDelete ? handleDelete : undefined}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <OutletFormDialog open={formOpen} onOpenChange={setFormOpen} outlet={editing} />

      <DeleteOutletDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        outlet={deleting}
      />
    </div>
  )
}
