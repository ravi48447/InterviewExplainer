import * as React from 'react'
import { AlertCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * InlineError — compact inline error message (P01-T193).
 *
 * Use within forms, small regions, or next to a control. Pairs with
 * FormField's error text but can stand alone when the error is not tied
 * to a single field.
 */
interface InlineErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  id?: string
}

export function InlineError({ className, children, id, ...props }: InlineErrorProps) {
  if (!children) return null
  return (
    <p
      id={id}
      role="alert"
      className={cn('flex items-center gap-1.5 text-xs font-medium text-destructive', className)}
      {...props}
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  )
}
