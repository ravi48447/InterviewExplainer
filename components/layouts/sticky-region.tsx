import { cn } from "@/lib/utils";

interface StickyRegionProps {
  children: React.ReactNode;
  className?: string;
  /** Offset from the top of the viewport when stuck. Default `1rem`. */
  top?: string;
  /** Max height before internal scroll. Default fills viewport minus 2rem. */
  maxHeight?: string;
}

/**
 * StickyRegion — canonical sticky content region (P01-T115).
 *
 * Pins content below the viewport top on scroll. Use for table-of-contents
 * sidebars and "on this page" navigation in the reading experience. The
 * region scrolls internally if it exceeds `maxHeight`.
 */
export function StickyRegion({
  children,
  className,
  top = "1rem",
  maxHeight,
}: StickyRegionProps) {
  const style = {
    "--sticky-top": top,
    ...(maxHeight ? { "--sticky-max": maxHeight } : {}),
  } as React.CSSProperties;
  return (
    <div className={cn("sticky-region", className)} style={style}>
      {children}
    </div>
  );
}
