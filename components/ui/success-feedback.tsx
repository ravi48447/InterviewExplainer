'use client'

import * as React from 'react'
import { CheckCircle2 } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * SuccessFeedback — transient success message (P01-T194).
 *
 * Use for inline confirmations (saved, copied, sent). Auto-dismisses
 * after `duration` ms when `onDismiss` is provided.
 */
interface SuccessFeedbackProps extends React.HTMLAttributes<HTMLDivElement> {
  message: React.ReactNode
  duration?: number
  onDismiss?: () => void
}

export function SuccessFeedback({
  message,
  duration = 3000,
  onDismiss,
  className,
  ...props
}: SuccessFeedbackProps) {
  React.useEffect(() => {
    if (!onDismiss) return
    const t = setTimeout(onDismiss, duration)
    return () => clearTimeout(t)
  }, [duration, onDismiss])

  return (
    <div
      role="status"
      className={cn(
        'inline-flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success',
        className,
      )}
      {...props}
    >
      <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
      {message}
    </div>
  )
}
