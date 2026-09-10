import { cn } from "@/lib/utils";

interface StackProps {
  children: React.ReactNode;
  className?: string;
  /** Gap between stacked children. `md` (default) = space-4 (1rem). */
  gap?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  /** Align children along the cross axis. */
  align?: "start" | "center" | "end" | "stretch";
}

const gapMap = {
  xs: "stack-sm",   /* 0.5rem */
  sm: "stack-sm",   /* 0.5rem */
  md: "stack-md",   /* 1rem */
  lg: "stack-lg",   /* 1.5rem */
  xl: "stack-xl",   /* 2rem */
  "2xl": "stack-xl",
} as const;

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;

/**
 * Stack — canonical vertical-flow primitive (P01-T110).
 *
 * Lays children out in a column with a shared gap. Use this instead of
 * `flex flex-col gap-3` everywhere so the gap scale is token-driven and
 * consistent across the app.
 */
export function Stack({
  children,
  className,
  gap = "md",
  align = "stretch",
}: StackProps) {
  return (
    <div className={cn("stack", gapMap[gap], alignMap[align], className)}>
      {children}
    </div>
  );
}
