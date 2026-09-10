import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Spinner — standardized loading indicator (P01-T191).
 *
 * Use inside buttons (with `aria-busy`), within inline status, or as a
 * standalone loading element. Always paired with an sr-only "Loading" for
 * screen readers unless it is purely decorative next to visible loading text.
 */
const spinnerVariants = {
  sm: 'h-4 w-4',
  default: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
} as const

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: keyof typeof spinnerVariants
  label?: string
}

export function Spinner({ size = 'default', label = 'Loading', className, ...props }: SpinnerProps) {
  return (
    <svg
      role="status"
      aria-label={label}
      className={cn('animate-spin text-muted-foreground', spinnerVariants[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}
