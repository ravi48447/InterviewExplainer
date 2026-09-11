import { cn } from '@/lib/utils'

/**
 * BrandLogo — the InterviewExplainer mark.
 *
 * DESIGN
 *   A rounded speech bubble (the interview: you speak, it listens) carrying a
 *   four-point insight sparkle (the explainer: every answer becomes insight).
 *   Blue→violet gradient over the bubble = trust + intelligence; the amber
 *   sparkle = the moment of clarity. Sits on a soft white keyline so it reads
 *   on both light and dark surfaces without a theme switch.
 *
 * USAGE
 *   - <BrandLogo />                 full mark, default size
 *   - <BrandLogo size="md" />       sm | md | lg
 *   - <BrandLogo monochrome />      single-ink version for dense surfaces
 *   Pure SVG — no client JS, no image requests, scales crisp at any size.
 */

const SIZES = {
  sm: 24,
  md: 32,
  lg: 44,
} as const

export type BrandLogoSize = keyof typeof SIZES

export function BrandLogo({
  size = 'md',
  monochrome = false,
  className,
}: {
  size?: BrandLogoSize
  /** Flat current-color version for dense/mono contexts */
  monochrome?: boolean
  className?: string
}) {
  const px = SIZES[size]
  const id = monochrome ? 'ie-mono' : 'ie-grad'

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      role="img"
      aria-label="InterviewExplainer logo"
    >
      <defs>
        <linearGradient id={`${id}-bubble`} x1="8" y1="4" x2="56" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={monochrome ? 'currentColor' : '#3B82F6'} />
          <stop offset="0.55" stopColor={monochrome ? 'currentColor' : '#6D4AE3'} />
          <stop offset="1" stopColor={monochrome ? 'currentColor' : '#4C2FBF'} />
        </linearGradient>
        <linearGradient id={`${id}-spark`} x1="26" y1="18" x2="44" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={monochrome ? '#fff' : '#FCD34D'} />
          <stop offset="1" stopColor={monochrome ? '#fff' : '#F59E0B'} />
        </linearGradient>
        <linearGradient id={`${id}-ring`} x1="4" y1="2" x2="60" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={monochrome ? 'currentColor' : '#60A5FA'} />
          <stop offset="1" stopColor={monochrome ? 'currentColor' : '#7C3AED'} />
        </linearGradient>
      </defs>

      {/* soft outer ring — the keyline that keeps it crisp on any background */}
      <circle cx="32" cy="30" r="27.5" stroke={`url(#${id}-ring)`} strokeWidth="2.5" />

      {/* speech bubble body */}
      <path
        d="M32 13c-11.6 0-21 7.6-21 17 0 5.2 2.9 9.9 7.4 13l-2.2 7.1c-.3 1 .8 1.9 1.7 1.3l7.9-4.9c2 .5 4 .7 6.2.7 11.6 0 21-7.6 21-17S43.6 13 32 13Z"
        fill={`url(#${id}-bubble)`}
      />
      {/* bubble inner highlight — the polish layer */}
      <path
        d="M32 13c-11.6 0-21 7.6-21 17 0 5.2 2.9 9.9 7.4 13l-2.2 7.1c-.3 1 .8 1.9 1.7 1.3l7.9-4.9c2 .5 4 .7 6.2.7 11.6 0 21-7.6 21-17S43.6 13 32 13Z"
        fill="url(#ie-sheen)"
        opacity="0.18"
      />
      <linearGradient id="ie-sheen" x1="20" y1="12" x2="48" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fff" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>

      {/* four-point insight sparkle — the "explainer" moment */}
      <path
        d="M33 19.5c.5 3.6 2.6 6.4 6.1 7.6.9.3.9 1.6 0 1.9-3.5 1.2-5.6 4-6.1 7.6-.1.9-1.5.9-1.6 0-.5-3.6-2.6-6.4-6.1-7.6-.9-.3-.9-1.6 0-1.9 3.5-1.2 5.6-4 6.1-7.6.1-.9 1.5-.9 1.6 0Z"
        fill={`url(#${id}-spark)`}
      />
      {/* small companion spark — depth, motion */}
      <path
        d="M42.6 32.4c.3 1.9 1.3 3.4 3.1 4 .5.2.5.9 0 1.1-1.8.6-2.8 2.1-3.1 4-.1.5-.8.5-.9 0-.3-1.9-1.3-3.4-3.1-4-.5-.2-.5-.9 0-1.1 1.8-.6 2.8-2.1 3.1-4 .1-.5.8-.5.9 0Z"
        fill={`url(#${id}-spark)`}
        opacity="0.85"
      />
      {/* dialogue dots — the conversation inside the interview */}
      <circle cx="22.5" cy="31" r="2" fill="#fff" opacity="0.95" />
      <circle cx="16.5" cy="31" r="2" fill="#fff" opacity="0.7" />
    </svg>
  )
}

export default BrandLogo
