import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip'

interface CopyButtonProps {
  value: string
  className?: string
}

export function CopyButton({ value, className }: CopyButtonProps) {
  const { t } = useTranslation('dashboard')
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard unavailable; silently no-op.
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={className ?? 'h-7 w-7 text-muted-foreground hover:text-foreground'}
          aria-label={t('actions.copy')}
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-success" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? t('actions.copied') : t('actions.copy')}</TooltipContent>
    </Tooltip>
  )
}
