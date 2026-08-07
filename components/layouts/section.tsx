import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  /** Vertical rhythm preset. `md` (default) = space-8 gap between sections. */
  spacing?: "sm" | "md" | "lg" | "xl" | "none";
  /** Render as a different element (default `<section>`). */
  as?: React.ElementType;
}

const spacingMap = {
  none: "",
  sm: "py-6",
  md: "py-8",
  lg: "py-12",
  xl: "py-16",
} as const;

/**
 * Section — canonical page-section wrapper (P01-T109).
 *
 * Applies consistent vertical rhythm between major page sections so routes
 * stop hand-picking `py-10` / `py-12` / `mt-16` arbitrarily. The default
 * `md` gives a 2rem top+bottom gap; bump to `lg`/`xl` for hero-adjacent
 * breathing room.
 */
export function Section({
  children,
  className,
  spacing = "md",
  as: Component = "section",
}: SectionProps) {
  return (
    <Component className={cn(spacingMap[spacing], className)}>{children}</Component>
  );
}
