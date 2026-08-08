import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ListChecks,
  Gauge,
  Workflow,
  Building2,
  Compass,
  type LucideIcon,
} from "lucide-react";

/**
 * "Explore DSA another way" — standard cross-link strip appearing at the
 * bottom of every DSA listing page. Helps users pivot between browse
 * dimensions (by module, pattern, difficulty, company, sheet).
 *
 * V2 learning-site treatment: the cross-links now read as a quiet in-page
 * nav rather than a row of competing colour tiles. A single indigo accent
 * (icon tile) carries the visual identity; borders are softened to
 * `border-border/60` with a `hover:border-primary/30` lift. No translate/scale
 * motion — the card signals interactivity through border + arrow alone, the
 * same vocabulary the rest of the learning surface uses.
 */
export function DSAExploreBar({ exclude }: { exclude?: string }) {
  const links: Array<{
    href: string;
    label: string;
    blurb: string;
    key: string;
    icon: LucideIcon;
  }> = [
    {
      key: "curriculum",
      href: "/dsa",
      label: "Curriculum",
      blurb: "18 modules · theory + practice",
      icon: BookOpen,
    },
    {
      key: "sheets",
      href: "/dsa#sheets",
      label: "Curated sheets",
      blurb: "Blind 75, NeetCode 150, Grind 75",
      icon: ListChecks,
    },
    {
      key: "difficulty",
      href: "/dsa/medium",
      label: "By difficulty",
      blurb: "Easy · Medium · Hard",
      icon: Gauge,
    },
    {
      key: "patterns",
      href: "/dsa#patterns",
      label: "By pattern",
      blurb: "Sliding window, DFS, DP, greedy…",
      icon: Workflow,
    },
    {
      key: "companies",
      href: "/dsa#companies",
      label: "By company",
      blurb: "FAANG + top tech",
      icon: Building2,
    },
  ];
  const filtered = exclude ? links.filter((l) => l.key !== exclude) : links;
  return (
    <section className="mt-12 border-t border-border/60 pt-10">
      <p className="type-label mb-1 flex items-center gap-1.5 text-primary">
        <Compass className="h-3.5 w-3.5" />
        Keep exploring
      </p>
      <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
        Browse DSA another way
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {filtered.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.key}
              href={l.href}
              className="group flex flex-col rounded-lg border border-border/60 bg-card p-5 transition-colors duration-200 ease-out hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface">
                <Icon className="h-4 w-4 text-primary" />
              </span>
              <div className="mt-3 text-sm font-semibold text-foreground transition-colors duration-200 ease-out group-hover:text-primary">
                {l.label}
              </div>
              <div className="mt-1 text-xs leading-snug text-muted-foreground">{l.blurb}</div>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary">
                Explore
                <ArrowRight className="h-3 w-3 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
