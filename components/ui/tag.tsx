import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Tag — canonical content tag (P01-T145).
 *
 * Separates content tags (keyword, topic, tech labels) from status badges.
 * A tag is deliberately lower-emphasis than a badge: no border, no fill,
 * just a muted surface pill. Use for the category/topic metadata on a
 * question or course page; reserve Badge for actual status semantics.
 *
 * Tags are not clickable by default; pass `asChild` with a `<Link>` for
 * navigable topic tags.
 */
const tagVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-muted hover:bg-muted/80',
        outline: 'border border-border text-foreground hover:bg-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface TagProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  asChild?: boolean
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'span'
    return (
      <Comp ref={ref} className={cn(tagVariants({ variant, className }))} {...props} />
    )
  },
)
Tag.displayName = 'Tag'

export { Tag, tagVariants }
