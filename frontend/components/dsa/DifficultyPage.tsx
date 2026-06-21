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
            easy: "bg-emerald-500",
            medium: "bg-amber-500",
            hard: "bg-red-500",
          };
          const activeClasses: Record<string, string> = {
            easy: "bg-gradient-to-br from-emerald-50 to-white border-emerald-200 text-emerald-700 shadow-sm",
            medium: "bg-gradient-to-br from-amber-50 to-white border-amber-200 text-amber-700 shadow-sm",
            hard: "bg-gradient-to-br from-red-50 to-white border-red-200 text-red-700 shadow-sm",
          };
          return (
            <Link
              key={d}
              href={`/dsa/${d}`}
              className={`rounded-2xl border px-4 py-3.5 transition-all ${
                active
                  ? activeClasses[d]
                  : "bg-white border-slate-200 hover:border-violet-300 hover:shadow-sm hover:-translate-y-0.5"
              }`}
            >
              <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest ${active ? "opacity-80" : "text-slate-500"}`}>
                <span className={`h-2 w-2 rounded-full ${dot[d]}`} />
                {d}
              </div>
              <div className={`text-lg font-black mt-1 ${active ? "" : "text-slate-900"}`}>
                {count}
                <span className="text-xs font-semibold text-slate-400 ml-1">problems</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Problems grouped by module */}
      <section className="mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
          Grouped by curriculum module
        </p>
        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-5">
          {title.split(" ").slice(0, 2).join(" ")} by module
        </h2>
        {problems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 text-center">
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
                    className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                  >
                    <Link
                      href={`/dsa/module/${m.moduleSlug}`}
                      className="group flex items-center justify-between gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50/70 hover:bg-violet-50/40 transition-colors"
                    >
                      <span className="text-sm font-bold text-slate-900 group-hover:text-violet-700 inline-flex items-center gap-1.5 transition-colors">
                        {m.title}
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-violet-500" />
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
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
