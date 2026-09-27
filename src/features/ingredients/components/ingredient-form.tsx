import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { ImageUpload } from '@/shared/components/ui/image-upload'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { useMediaQuery } from '@/shared/hooks/use-media-query'

import { useSuggestCode } from '../hooks/use-suggest-code'
import { describeConversion, getUnitLabel } from '../lib/format-uom'
import { ingredientSchema, type IngredientFormValues } from '../schemas/ingredient.schema'
import { INGREDIENT_CATEGORIES, INGREDIENT_UNITS, type Ingredient } from '../types/ingredient.types'

interface IngredientFormProps {
  ingredient?: Ingredient | null
  onSubmit: (values: IngredientFormValues) => void
  onCancel?: () => void
  isSubmitting?: boolean
}

export function IngredientForm({
  ingredient,
  onSubmit,
  onCancel,
  isSubmitting,
}: IngredientFormProps) {
  const { t } = useTranslation(['ingredients', 'common'])
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isEdit = Boolean(ingredient)
  const { data: suggestedCode = '' } = useSuggestCode()

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      code: '',
      name: '',
      category: 'other',
      baseUnit: 'gram',
      largeUnit: '',
      conversionQty: undefined,
      minStock: 0,
      status: 'active',
      description: '',
      imageUrl: '',
    },
  })

  useEffect(() => {
    if (ingredient) {
      form.reset({
        code: ingredient.code,
        name: ingredient.name,
        category: ingredient.category,
        baseUnit: ingredient.baseUnit,
        largeUnit: ingredient.largeUnit ?? '',
        conversionQty: ingredient.conversionQty ?? undefined,
        minStock: ingredient.minStock,
        status: ingredient.status,
        description: ingredient.description ?? '',
        imageUrl: ingredient.imageUrl ?? '',
      })
    } else if (suggestedCode) {
      form.setValue('code', suggestedCode)
    }
  }, [ingredient, suggestedCode, form])

  const baseUnit = useWatch({ control: form.control, name: 'baseUnit' })
  const largeUnit = useWatch({ control: form.control, name: 'largeUnit' })
  const conversionQty = useWatch({ control: form.control, name: 'conversionQty' })
  const previewLine =
    largeUnit && conversionQty ? describeConversion(baseUnit, largeUnit, conversionQty) : ''

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className={isDesktop ? 'grid grid-cols-[auto_1fr] gap-6' : 'space-y-4'}>
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('ingredients:image')}</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value || null}
                    onChange={(v) => field.onChange(v ?? '')}
                    hint={t('ingredients:imageHint')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('ingredients:code')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="BHN-001"
                      className="font-mono uppercase"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      onBlur={(e) => field.onChange(e.target.value.trim().toUpperCase())}
                    />
                  </FormControl>
                  <FormDescription>
                    {isEdit ? t('ingredients:codeEditHint') : t('ingredients:codeCreateHint')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('ingredients:title')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Daging" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>{t('ingredients:categoryFilterPlaceholder')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common:filter')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INGREDIENT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {t(`ingredients:category.${cat}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className={isDesktop ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
          <FormField
            control={form.control}
            name="baseUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('ingredients:baseUnit')}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('ingredients:baseUnit')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INGREDIENT_UNITS.map((unit) => (
                      <SelectItem key={unit.code} value={unit.code}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>{t('ingredients:purchaseHint')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('ingredients:minStock')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('ingredients:status')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">{t('ingredients:statusActive')}</SelectItem>
                  <SelectItem value="inactive">{t('ingredients:statusInactive')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common:description')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('ingredients:descriptionPlaceholder')}
                  className="min-h-20 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3 rounded-md border bg-muted/20 p-4">
          <div>
            <h4 className="text-sm font-semibold">{t('ingredients:largeUnit')}</h4>
            <p className="text-xs text-muted-foreground">{t('ingredients:purchaseHint')}</p>
          </div>
          <div className={isDesktop ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
            <FormField
              control={form.control}
              name="largeUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('ingredients:largeUnit')}</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(v === '__none__' ? '' : v)}
                    value={field.value && field.value !== '' ? field.value : '__none__'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('ingredients:noLargeUnit')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__none__">{t('ingredients:noLargeUnit')}</SelectItem>
                      {INGREDIENT_UNITS.filter((u) => u.code !== baseUnit).map((unit) => (
                        <SelectItem key={unit.code} value={unit.code}>
                          {unit.label}
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
              name="conversionQty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {largeUnit && largeUnit !== ''
                      ? `1 ${getUnitLabel(largeUnit)} = … ${t('ingredients:baseUnit')}`
                      : t('ingredients:conversionQty')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      disabled={!largeUnit || largeUnit === ''}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  {previewLine && (
                    <FormDescription className="font-mono">{previewLine}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              {t('common:cancel')}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? t('common:loading')
              : ingredient
                ? t('common:update')
                : t('common:create')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
