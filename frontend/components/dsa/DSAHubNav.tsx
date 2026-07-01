"use client";

import { useEffect, useState } from "react";
import { ListChecks, Map, LayoutGrid, Boxes, HelpCircle } from "lucide-react";

export interface HubNavItem {
  id: string;
  label: string;
}

const ICONS: Record<string, React.ElementType> = {
  plans: ListChecks,
  roadmap: Map,
  problems: LayoutGrid,
  topics: Boxes,
  faq: HelpCircle,
};

/**
 * Sticky in-page section navigation for the DSA hub.
 *
 * The hub is long (study plans → roadmap → problems → topics → FAQ). Without a
 * persistent nav the only way to move between sections is to scroll the whole
 * page, which was the core "can't get to the next part" complaint. This bar
 * pins under the global header (top-16) and scroll-spies the active section so
 * the reader always knows where they are and can jump anywhere in one click.
 */
export function DSAHubNav({ items }: { items: HubNavItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that is visible.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      // Trigger when a section crosses the band just below the sticky nav.
      { rootMargin: "-120px 0px -65% 0px", threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: "smooth" });
    setActive(id);
  };

  return (
    <div className="sticky top-16 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-12">
        <nav className="flex items-center gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const Icon = ICONS[item.id] ?? ListChecks;
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={handleClick(item.id)}
                className={`group inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-violet-600 dark:bg-violet-800 text-primary-foreground dark:text-foreground"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
