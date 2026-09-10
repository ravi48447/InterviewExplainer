import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Consistent breadcrumb for all DSA pages.
 *
 * Always starts with Home → DSA. Additional crumbs are passed in `trail`.
 * The last entry always renders as current-page (no link), regardless of
 * whether an href is provided.
 */
export function DSABreadcrumb({ trail }: { trail: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4 flex-wrap">
      <Link
        href="/"
        className="hover:text-foreground flex items-center gap-1 transition-colors"
      >
        <Home className="h-3 w-3" /> Home
      </Link>
      <ChevronRight className="h-3 w-3 text-muted-foreground" />
      <Link href="/dsa" className="hover:text-foreground transition-colors">
        DSA
      </Link>
      {trail.map((item, i) => {
        const isLast = i === trail.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            {isLast || !item.href ? (
              <span className="text-muted-foreground font-medium truncate max-w-[240px]">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
