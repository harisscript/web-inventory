import { ImagePlus, X } from 'lucide-react'
import { useRef, useState } from 'react'

import { cn } from '@/shared/lib/utils'

import { Button } from './button'

export interface ImageUploadProps {
  value?: string | null
  onChange: (value: string | null) => void
  maxSizeMb?: number
  accept?: string
  disabled?: boolean
  className?: string
  placeholder?: string
  hint?: string
}

const DEFAULT_MAX_MB = 2

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export function ImageUpload({
  value,
  onChange,
  maxSizeMb = DEFAULT_MAX_MB,
  accept = 'image/*',
  disabled,
  className,
  placeholder,
  hint,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePick = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('invalidType')
      return
    }
    const maxBytes = maxSizeMb * 1024 * 1024
    if (file.size > maxBytes) {
      setError('tooLarge')
      return
    }
    try {
      const dataUrl = await readFileAsDataUrl(file)
      setError(null)
      onChange(dataUrl)
    } catch {
      setError('readFailed')
    }
  }

  const handleRemove = () => {
    if (disabled) return
    setError(null)
    onChange(null)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className={cn(
          'group relative flex aspect-square w-full max-w-44 items-center justify-center overflow-hidden rounded-md border border-dashed bg-muted/30',
          disabled && 'opacity-60',
        )}
      >
        {value ? (
          <>
            <img src={value} alt="preview" className="h-full w-full object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={handleRemove}
              disabled={disabled}
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </>
        ) : (
          <button
            type="button"
            onClick={handlePick}
            disabled={disabled}
            className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed"
          >
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs">{placeholder ?? 'Upload'}</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
      </div>
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p className="text-xs text-destructive" data-error={error}>
          {error === 'invalidType' && 'File must be an image'}
          {error === 'tooLarge' && `Max file size is ${maxSizeMb}MB`}
          {error === 'readFailed' && 'Failed to read file'}
        </p>
      )}
      {value && (
        <Button type="button" variant="outline" size="sm" onClick={handlePick} disabled={disabled}>
          Replace
        </Button>
      )}
    </div>
  )
}
