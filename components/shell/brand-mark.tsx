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
  sm: { box: 'h-8 w-8', word: 'text-[13px]' },
  md: { box: 'h-11 w-11', word: 'text-[16px]' },
  lg: { box: 'h-11 w-11', word: 'text-[17px]' },
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
          'relative flex shrink-0 items-center justify-center rounded-[11px] border border-[#9FC5F8]',
          'bg-white text-primary shadow-[0_3px_10px_rgba(30,122,242,.08)] dark:bg-surface',
          s.box,
        )}
        aria-hidden="true"
      >
        <span className="text-[14px] font-bold tracking-[-0.08em]">IE</span>
      </span>
      {withWordmark && (
        <span
          className={cn(
            'inline-flex whitespace-nowrap font-semibold leading-none tracking-[-0.035em] text-foreground',
            'group-hover:text-primary transition-colors',
            s.word,
          )}
        >
          <span>Interview</span><span className="text-primary">Explainer</span>
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
