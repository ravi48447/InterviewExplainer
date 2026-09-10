import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * BrandMark — canonical logo + wordmark (P03-T049..T056).
 *
 * ONE visual implementation consumed by the header, footer, and auth shell.
 * Server-rendered (no client JS). Scales via the `size` prop; the wordmark is
 * opt-in so the footer / auth shell can render the mark alone.
 *
 * Design tokens (Phase 01):
 *  - primary accent for the hex fill
 *  - `--text-foreground` for the wordmark so it tracks theme
 *  - stable 1:1 box (h-9 w-9 / h-10 w-10) to prevent layout shift (T051)
 *  - restrained presence — no oversized brand (T055)
 */

const SIZES = {
  sm: { box: 'h-8 w-8', glyph: 'w-4 h-4', word: 'text-base' },
  md: { box: 'h-9 w-9', glyph: 'w-5 h-5', word: 'text-lg' },
  lg: { box: 'h-10 w-10', glyph: 'w-5 h-5', word: 'text-xl' },
} as const

export type BrandMarkSize = keyof typeof SIZES

interface BrandMarkProps {
  /** Include the "InterviewExplainer" wordmark. Default true. */
  withWordmark?: boolean
  size?: BrandMarkSize
  className?: string
  /** Where the brand links to. Always `/` (T052). */
  href?: string
}

export function BrandMark({
  withWordmark = true,
  size = 'md',
  className,
  href = '/',
}: BrandMarkProps) {
  const s = SIZES[size]

  const mark = (
    <span className="flex items-center gap-2.5 group">
      <span
        className={cn(
          'relative flex shrink-0 items-center justify-center rounded-xl',
          'bg-primary text-primary-foreground',
          'shadow-sm',
          s.box,
        )}
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" className={cn('h-full w-full p-1.5', s.glyph)}>
          <polygon
            points="50,8 86,30 86,70 50,92 14,70 14,30"
            fill="currentColor"
            className="opacity-90"
          />
        </svg>
        <svg
          viewBox="0 0 24 24"
          className="absolute inset-0 m-auto h-1/2 w-1/2 text-primary-foreground"
          fill="none"
        >
          <path
            d="M8 4L2 12L8 20M16 4L22 12L16 20M14 2L10 22"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {withWordmark && (
        <span
          className={cn(
            'font-bold tracking-tight text-foreground',
            'group-hover:text-primary transition-colors',
            s.word,
          )}
        >
          InterviewExplainer
        </span>
      )}
    </span>
  )

  if (!href) return mark

  return (
    <Link
      href={href}
      className={cn('inline-flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className)}
      aria-label="InterviewExplainer home"
    >
      {mark}
    </Link>
  )
}
