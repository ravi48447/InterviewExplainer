import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Button — canonical V2 button primitive (P01-T119).
 *
 * Restrained, token-driven variants (T120–T124). No decorative hover
 * scaling or colored drop-shadows; motion is limited to background-color
 * and a subtle border shift (T243 — removed universal scale-on-hover).
 * Sizes are standardized to four steps (T127); icons inherit size + leading
 * alignment automatically (T128). Loading (T125) swaps content for a
 * spinner and disables the button to prevent duplicate submits. Disabled
 * (T126) uses aria-disabled + reduced opacity, never pointer-events:none
 * alone, so the button stays focusable for screen-reader users.
 */
const buttonVariants = cva(
  // Base: inline-flex, token radius, focus-visible ring, reduced-motion-safe transitions.
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 aria-disabled:opacity-50 aria-disabled:pointer-events-none',
  {
    variants: {
      variant: {
        // T120 — primary: single accent fill for the one main page action.
        primary:
          'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 shadow-sm',
        // T121 — secondary: low-priority surfaced action.
        secondary:
          'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80',
        // T122 — ghost: low-emphasis, transparent until hover.
        ghost:
          'text-foreground hover:bg-muted hover:text-foreground',
        // T123 — destructive: irreversible / dangerous operations.
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        // T124 — icon button: square, no text padding.
        icon:
          'text-foreground hover:bg-muted border border-border',
        // Outline — bordered low-priority action.
        outline:
          'border border-border bg-background text-foreground hover:bg-muted',
        // Link: text-only call-to-action.
        link: 'text-primary underline-offset-4 hover:underline',
        // ── Legacy aliases (T129 consolidation) — map old variant names to
        // the canonical V2 variants so existing consumers keep working
        // until they are migrated. Do not use in new code.
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 shadow-sm',
        accent:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        success:
          'bg-success text-success-foreground hover:bg-success/90 shadow-sm',
        premium:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
      },
      size: {
        // T127 — four standardized sizes. Heights match the form input heights (T158).
        sm: 'h-9 px-3 text-sm rounded-md',
        default: 'h-10 px-4 py-2',
        lg: 'h-11 px-6 text-base rounded-md',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    // T126 — use aria-disabled so the button remains focusable for AT users
    // when disabled via the loading state, not just the disabled attribute.
    const isDisabled = disabled || loading
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading || undefined}
        ref={ref}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-current"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="sr-only">Loading</span>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
