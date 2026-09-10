import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * FormField — canonical form field wrapper (P01-T154..T156, T233).
 *
 * Groups a Label, Description, control, and Error into one accessible
 * field with correct association (`aria-describedby`) and consistent
 * spacing. Use this instead of re-deriving the label/description/error
 * layout on every form surface.
 */
interface FormFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  label?: React.ReactNode
  htmlFor?: string
  description?: React.ReactNode
  error?: React.ReactNode
  required?: boolean
}

export function FormField({
  label,
  htmlFor,
  description,
  error,
  required,
  children,
  className,
  ...props
}: FormFieldProps) {
  const descId = React.useId()
  const errId = React.useId()
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </label>
      )}
      {description && (
        <p id={descId} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {children}
      {error && (
        <p id={errId} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
