import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Skip the responsive page gutters (for full-bleed children). */
  noPadding?: boolean;
  /** Render at the wide (hub/desktop) measure instead of the standard content width. */
  wide?: boolean;
  /** Render at the narrow reading measure (long-form prose). */
  reading?: boolean;
}

/**
 * PageContainer — canonical page-level width container (P01-T106).
 *
 * Centers content at one of three width tiers with a responsive page gutter:
 *   - default  → `--content-width` (72rem) — standard hub / page
 *   - `wide`   → `--wide-width`    (90rem) — wide desktop layout
 *   - `reading`→ `--reading-width` (42rem) — long-form prose
 *
 * Prefer this over re-deriving `max-w-… mx-auto px-…` on every route so the
 * width contract lives in one place (06_DESIGN_SYSTEM §28).
 */
export function PageContainer({
  children,
  className,
  noPadding = false,
  wide = false,
  reading = false,
}: PageContainerProps) {
  const widthClass = reading
    ? "reading-container"
    : wide
      ? "wide-container"
      : "page-container";
  return (
    <div className={cn(widthClass, noPadding && "[padding-inline:0]", className)}>
      {children}
    </div>
  );
}
