import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Prose — typographic container for rendered markdown/rich text (P01-T199).
 *
 * Applies consistent heading, paragraph, list, and link styles to
 * arbitrary child content using a scoped `.prose-v2` class. Keeps visual
 * rhythm aligned with the V2 token system without polluting global prose.
 */
interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg'
}

const sizeClasses = {
  sm: 'prose-v2-sm',
  default: 'prose-v2',
  lg: 'prose-v2-lg',
} as const

export function Prose({ size = 'default', className, ...props }: ProseProps) {
  return <div className={cn(sizeClasses[size], className)} {...props} />
}
