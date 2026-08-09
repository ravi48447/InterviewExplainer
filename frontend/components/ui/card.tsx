import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Card — canonical V2 card primitive (P01-T131).
 *
 * Restrained: surface + hairline border + minimal shadow. Three variants
 * cover the real needs without decorative chrome (T132–T134):
 *   - default  → static information card (no hover cue) (T133)
 *   - interactive → subtle hover for clickable surfaces (T132)
 *   - minimal  → borderless grouping surface (T134)
 *
 * The universal scale-on-hover and colored drop-shadow behavior from V1 is
 * removed (T137/T138); interactive cards get only a border + shadow lift.
 * Padding uses the token spacing scale (T087 — component internal padding).
 */
const cardVariants = cva(
  'rounded-lg border text-card-foreground transition-colors',
  {
    variants: {
      variant: {
        // T133 — static information: no hover effect, no misleading cue.
        default: 'bg-card border-border shadow-sm',
        // T132 — interactive: clear but subtle hover (border + shadow only).
        interactive:
          'bg-card border-border shadow-sm hover:shadow-md hover:border-border-strong cursor-pointer',
        // T134 — minimal: borderless, low-chrome grouping.
        minimal: 'bg-surface border-transparent shadow-none',
      },
      padding: {
        none: '',
        default: 'p-6',
        compact: 'p-4',
        comfortable: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  },
)

export interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
