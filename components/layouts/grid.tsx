import { cn } from "@/lib/utils";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  /** Gap between grid cells. `md` (default) = space-4 (1rem). */
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Fixed column count, OR `auto` for a responsive auto-fit grid. */
  cols?: 1 | 2 | 3 | 4 | "auto";
  /** For `cols="auto"`: the minimum column width before wrapping. */
  minItemWidth?: string;
}

const gapMap = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
} as const;

/**
 * Grid — canonical grid primitive (P01-T112).
 *
 * Two modes:
 *   - fixed `cols` (1–4) → equal-width columns that collapse to 1 on mobile.
 *   - `cols="auto"`   → responsive `auto-fit minmax(min(100%, minItemWidth), 1fr)`
 *     so the column count emerges from the available width. `minItemWidth`
 *     defaults to `16rem` (256px) — a comfortable card minimum.
 */
export function Grid({
  children,
  className,
  gap = "md",
  cols = "auto",
  minItemWidth = "16rem",
}: GridProps) {
  if (cols === "auto") {
    return (
      <div
        className={cn("grid-auto", gapMap[gap], className)}
        style={{ "--grid-min": minItemWidth } as React.CSSProperties}
      >
        {children}
      </div>
    );
  }
  const colsClass = cols === 1 ? "grid-2" : cols === 2 ? "grid-2" : cols === 3 ? "grid-3" : "grid-4";
  return (
    <div className={cn(colsClass, gapMap[gap], className)} style={{ "--grid-gap": undefined } as React.CSSProperties}>
      {children}
    </div>
  );
}
