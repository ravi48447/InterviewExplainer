import { cn } from "@/lib/utils";

interface FullWidthBreakoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * FullWidthBreakout — canonical full-bleed child (P01-T116).
 *
 * Lets a child escape its parent's `max-width` and span the full viewport
 * width, using the `50% - 50vw` margin trick. Useful for full-bleed
 * banners, dividers, or media inside a constrained `PageContainer`.
 *
 * The parent should have `overflow-x: clip` (the global default) so the
 * breakout never causes horizontal scroll.
 */
export function FullWidthBreakout({
  children,
  className,
}: FullWidthBreakoutProps) {
  return <div className={cn("full-width-breakout", className)}>{children}</div>;
}
