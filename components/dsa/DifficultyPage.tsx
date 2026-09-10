import Link from "next/link";
import {
  Gauge,
  Target,
  Sparkles,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import type { Difficulty } from "@/lib/contentV2-types";
import { getDSAIndex, getDSAModules } from "@/lib/contentV2";
import { DSAPageShell } from "./DSAPageShell";
import { DSABreadcrumb } from "./DSABreadcrumb";
import { DSAHero, DSAStatCard } from "./DSAHero";
import { DSAProblemList, problemHasAuthoredContent } from "./DSAProblemRow";
import { DSAExploreBar } from "./DSAExploreBar";
import { DSAContentSections } from "./DSAContentSections";
import { getDifficultyContent } from "@/lib/dsaPageContent";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

/**
 * Shared renderer for /dsa/easy, /dsa/medium, /dsa/hard.
 *
 * All three are structurally identical — only the filtered difficulty
 * and copy change. This helper owns the data loading + layout so the
 * page files stay declarative.
 */
export function DSADifficultyPage({
  difficulty,
  title,
  tagline,
}: {
  difficulty: Difficulty;
  title: string;
  tagline: string;
}) {
  const index = getDSAIndex();
  const allProblems = index?.problems ?? [];
  const problems = allProblems.filter((p) => p.difficulty === difficulty);
  const authoredCount = problems.filter(problemHasAuthoredContent).length;

  const modules = getDSAModules();
  const byModule = new Map<string, typeof problems>();
  for (const p of problems) {
    const key = p.moduleSlug ?? "unknown";
    const arr = byModule.get(key) ?? [];
    arr.push(p);
    byModule.set(key, arr);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "DSA", item: `${SITE_URL}/dsa` },
          {
            "@type": "ListItem",
            position: 3,
            name: title,
            item: `${SITE_URL}/dsa/${difficulty}`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: title,
        description: tagline,
        url: `${SITE_URL}/dsa/${difficulty}`,
      },
    ],
  };

  return (
    <DSAPageShell jsonLd={jsonLd}>
      <DSABreadcrumb
        trail={[
          { label: "Difficulty" },
          { label: difficulty.charAt(0).toUpperCase() + difficulty.slice(1) },
        ]}
      />

      <DSAHero
        eyebrow={`Difficulty · ${difficulty}`}
        eyebrowIcon={Gauge}
        title={title}
        tagline={tagline}
        stats={
          <>
            <DSAStatCard icon={Target} label="Problems indexed" value={`${problems.length}`} />
            <DSAStatCard
              icon={Sparkles}
              label="Walkthroughs ready"
              value={`${authoredCount}`}
            />
            <DSAStatCard
              icon={BookOpen}
              label="Modules represented"
              value={`${byModule.size}`}
            />
            <DSAStatCard icon={Gauge} label="Languages" value="Java · Python" />
          </>
        }
      />

      {/* Difficulty siblings */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
          const count = allProblems.filter((p) => p.difficulty === d).length;
          const active = d === difficulty;
          const dot: Record<string, string> = {
            easy: "bg-success",
            medium: "bg-amber-500",
            hard: "bg-rose-500",
          };
          const activeClasses: Record<string, string> = {
            easy: "bg-surface border-success/30 text-success",
            medium: "bg-surface border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400",
            hard: "bg-surface border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-400",
          };
          return (
            <Link
              key={d}
              href={`/dsa/${d}`}
              className={`rounded-2xl border px-4 py-3.5 transition-colors ${
                active
                  ? activeClasses[d]
                  : "bg-background border-border/60 text-muted-foreground hover:border-primary/40 hover:bg-hover"
              }`}
            >
              <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest ${active ? "opacity-80" : "text-muted-foreground"}`}>
                <span className={`h-2 w-2 rounded-full ${dot[d]}`} />
                {d}
              </div>
              <div className={`text-lg font-black mt-1 ${active ? "" : "text-foreground"}`}>
                {count}
                <span className="text-xs font-semibold text-muted-foreground ml-1">problems</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Problems grouped by module */}
      <section className="mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
          Grouped by curriculum module
        </p>
        <h2 className="text-xl font-black text-foreground tracking-tight mb-5">
          {title.split(" ").slice(0, 2).join(" ")} by module
        </h2>
        {problems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-muted-foreground text-center">
            No problems indexed at this difficulty yet.
          </div>
        ) : (
          <div className="space-y-5">
            {modules
              .filter((m) => (byModule.get(m.moduleSlug) ?? []).length > 0)
              .map((m) => {
                const modProblems = byModule.get(m.moduleSlug) ?? [];
                return (
                  <div
                    key={m.moduleSlug}
                    className="rounded-2xl border border-border/60 bg-card overflow-hidden"
                  >
                    <Link
                      href={`/dsa/module/${m.moduleSlug}`}
                      className="group flex items-center justify-between gap-3 px-5 py-3 border-b border-border/60 bg-surface hover:bg-hover transition-colors"
                    >
                      <span className="text-sm font-bold text-foreground group-hover:text-primary inline-flex items-center gap-1.5 transition-colors">
                        {m.title}
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                      </span>
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        {modProblems.length} problem
                        {modProblems.length === 1 ? "" : "s"}
                      </span>
                    </Link>
                    <div className="p-4">
                      <DSAProblemList problems={modProblems} />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </section>

      <DSAContentSections
        content={getDifficultyContent(difficulty, {
          total: problems.length,
          easy: difficulty === "easy" ? problems.length : 0,
          medium: difficulty === "medium" ? problems.length : 0,
          hard: difficulty === "hard" ? problems.length : 0,
        })}
        kicker="Study guide"
        heading={`How to crack ${difficulty} problems`}
      />

      <DSAExploreBar exclude="difficulty" />
    </DSAPageShell>
  );
}
