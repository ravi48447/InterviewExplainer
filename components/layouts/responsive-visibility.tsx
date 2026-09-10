import { cn } from "@/lib/utils";

interface ResponsiveVisibilityProps {
  children: React.ReactNode;
  className?: string;
  /** Where this content should be visible. */
  showOn: "mobile" | "desktop" | "both";
}

/**
 * ResponsiveVisibility — canonical breakpoint visibility utility (P01-T117).
 *
 *   - `mobile`   → hidden on desktop (≥768px)
 *   - `desktop`  → hidden on mobile  (<768px)
 *   - `both`     → always visible (no-op, for explicit intent)
 *
 * Use this instead of scattering `hidden md:flex` / `flex md:hidden` pairs,
 * so visibility intent is declarative and greppable.
 */
export function ResponsiveVisibility({
  children,
  className,
  showOn = "both",
}: ResponsiveVisibilityProps) {
  const visibilityClass =
    showOn === "mobile"
      ? "hidden-desktop"
      : showOn === "desktop"
        ? "hidden-mobile"
        : "";
  return <div className={cn(visibilityClass, className)}>{children}</div>;
}
