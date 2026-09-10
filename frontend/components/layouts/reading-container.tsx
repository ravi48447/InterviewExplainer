import { cn } from "@/lib/utils";

interface ReadingContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

/**
 * ReadingContainer — canonical long-form prose measure (P01-T107).
 *
 * Narrows to `--reading-width` (42rem ≈ 672px) for comfortable line length
 * on article/answer pages. Use for the prose column of a question page;
 * pair with a sidebar via `SplitLayout` for the full reading experience.
 */
export function ReadingContainer({
  children,
  className,
  noPadding = false,
}: ReadingContainerProps) {
  return (
    <div className={cn("reading-container", noPadding && "[padding-inline:0]", className)}>
      {children}
    </div>
  );
}
