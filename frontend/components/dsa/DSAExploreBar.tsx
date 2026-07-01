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
 */
export function DSAExploreBar({ exclude }: { exclude?: string }) {
  const links: Array<{
    href: string;
    label: string;
    blurb: string;
    key: string;
    icon: LucideIcon;
    accent: string;
  }> = [
    {
      key: "curriculum",
      href: "/dsa",
      label: "Curriculum",
      blurb: "18 modules · theory + practice",
      icon: BookOpen,
      accent: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20",
    },
    {
      key: "sheets",
      href: "/dsa#plans",
      label: "Curated sheets",
      blurb: "Blind 75, NeetCode 150, Grind 75",
      icon: ListChecks,
      accent: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20",
    },
    {
      key: "difficulty",
      href: "/dsa/medium",
      label: "By difficulty",
      blurb: "Easy · Medium · Hard",
      icon: Gauge,
      accent: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20",
    },
    {
      key: "patterns",
      href: "/dsa#problems",
      label: "By pattern",
      blurb: "Sliding window, DFS, DP, greedy…",
      icon: Workflow,
      accent: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-100 dark:border-violet-500/20",
    },
    {
      key: "companies",
      href: "/dsa/company/amazon",
      label: "By company",
      blurb: "FAANG + top tech",
      icon: Building2,
      accent: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20",
    },
  ];
  const filtered = exclude ? links.filter((l) => l.key !== exclude) : links;
  return (
    <section className="mt-12 pt-8 border-t border-border mb-10">
      <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-1 flex items-center gap-1.5">
        <Compass className="h-3.5 w-3.5" />
        Keep exploring
      </p>
      <h2 className="text-xl font-black text-foreground tracking-tight mb-4">
        Browse DSA another way
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {filtered.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.key}
              href={l.href}
              className="group flex flex-col rounded-2xl border border-border bg-background hover:border-violet-300 dark:border-violet-500/30 hover:shadow-md hover:-translate-y-0.5 transition-all p-4"
            >
              <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${l.accent}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-sm font-bold text-foreground group-hover:text-violet-700 dark:text-violet-400 transition-colors">
                {l.label}
              </div>
              <div className="text-[11px] text-slate-400 dark:text-slate-300 mt-0.5 leading-snug">{l.blurb}</div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-violet-600 dark:text-violet-400">
                Explore <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
