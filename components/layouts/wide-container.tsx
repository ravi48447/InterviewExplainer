import { cn } from "@/lib/utils";

interface WideContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

/**
 * WideContainer — canonical wide (hub/desktop) measure (P01-T108).
 *
 * Expands to `--wide-width` (90rem ≈ 1440px) for dashboards, hub grids, and
 * other surfaces that benefit from the full desktop canvas. Gutters scale
 * up at the lg breakpoint.
 */
export function WideContainer({
  children,
  className,
  noPadding = false,
}: WideContainerProps) {
  return (
    <div className={cn("wide-container", noPadding && "[padding-inline:0]", className)}>
      {children}
    </div>
  );
}
