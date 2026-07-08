import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Workflow,
  Target,
  Sparkles,
  Layers,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import {
  getDSAByPattern,
  getDSAPatterns,
  getDSAModules,
} from "@/lib/contentV2";
import { DSAPageShell } from "@/components/dsa/DSAPageShell";
import { DSABreadcrumb } from "@/components/dsa/DSABreadcrumb";
import { DSAHero, DSAStatCard } from "@/components/dsa/DSAHero";
import {
  DSAProblemList,
  problemHasAuthoredContent,
} from "@/components/dsa/DSAProblemRow";
import { DSAExploreBar } from "@/components/dsa/DSAExploreBar";
import { DSAContentSections } from "@/components/dsa/DSAContentSections";
import { buildPatternContent } from "@/lib/dsaPageContent";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const revalidate = 3600;

function toDisplayName(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateStaticParams() {
  return getDSAPatterns().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = toDisplayName(slug);
  const problems = getDSAByPattern(slug);
  return {
    title: `${name} Pattern — DSA Interview Problems in Java & Python | InterviewExplainer`,
    description: `${problems.length} problems that use the ${name} pattern, grouped by module with line-by-line walkthroughs in Java and Python.`,
    alternates: { canonical: `${SITE_URL}/dsa/pattern/${slug}` },
  };
}

export default async function DSAPatternPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problems = getDSAByPattern(slug);
  if (problems.length === 0) notFound();

  const name = toDisplayName(slug);
  const authoredCount = problems.filter(problemHasAuthoredContent).length;

  // Group by module so the pattern feels like "how this pattern shows up
  // across the curriculum" rather than a flat bag of problems.
  const modules = getDSAModules();
  const byModule = new Map<string, typeof problems>();
  for (const p of problems) {
    const key = p.moduleSlug ?? "unknown";
    const arr = byModule.get(key) ?? [];
    arr.push(p);
    byModule.set(key, arr);
  }

  // Difficulty split (for the stats strip).
  const easy = problems.filter((p) => p.difficulty === "easy").length;
  const medium = problems.filter((p) => p.difficulty === "medium").length;
  const hard = problems.filter((p) => p.difficulty === "hard").length;

  // Sibling patterns (same first word — "tree-bfs" / "tree-dfs" / "tree-path-sum")
  const root = slug.split("-")[0];
  const siblings = getDSAPatterns()
    .filter((p) => p.slug !== slug && p.slug.split("-")[0] === root)
    .slice(0, 8);

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
            name: `${name} Pattern`,
            item: `${SITE_URL}/dsa/pattern/${slug}`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: `${name} Pattern Problems`,
        url: `${SITE_URL}/dsa/pattern/${slug}`,
        numberOfItems: problems.length,
      },
    ],
  };

  return (
    <DSAPageShell jsonLd={jsonLd}>
      <DSABreadcrumb
        trail={[{ label: "Patterns" }, { label: `${name} Pattern` }]}
      />

      <DSAHero
        eyebrow="DSA Pattern"
        eyebrowIcon={Workflow}
        title={`${name} Pattern`}
        tagline={`Recognise the ${name} pattern once — then solve any problem that uses it. Below are every ${name} problem we index, grouped by the module that teaches them.`}
        stats={
          <>
            <DSAStatCard
              icon={Target}
              label="Problems"
              value={`${problems.length}`}
            />
            <DSAStatCard
              icon={Sparkles}
              label="Walkthroughs ready"
              value={`${authoredCount}`}
            />
            <DSAStatCard
              icon={Layers}
              label="Difficulty mix"
              value={`${easy}E · ${medium}M · ${hard}H`}
            />
            <DSAStatCard
              icon={BookOpen}
              label="Languages"
              value="Java · Python"
            />
          </>
        }
      />

      {/* Problems grouped by curriculum module */}
      <section className="mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-primary mb-1">
          Where this pattern shows up
        </p>
        <h2 className="text-xl font-black text-foreground tracking-tight mb-5">
          {name} problems by module
        </h2>
        <div className="space-y-5">
          {modules
            .filter((m) => (byModule.get(m.moduleSlug) ?? []).length > 0)
            .map((m) => {
              const modProblems = byModule.get(m.moduleSlug) ?? [];
              return (
                <div
                  key={m.moduleSlug}
                  className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden"
                >
                  <Link
                    href={`/dsa/module/${m.moduleSlug}`}
                    className="group flex items-center justify-between gap-3 px-5 py-3 border-b border-slate-100 dark:border-slate-800/60 bg-surface/70 hover:bg-blue-50/40 dark:bg-blue-500/10 transition-colors"
                  >
                    <span className="text-sm font-bold text-foreground group-hover:text-blue-700 dark:text-blue-400 inline-flex items-center gap-1.5 transition-colors">
                      {m.title}
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-blue-500 dark:text-blue-400" />
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {modProblems.length} problem{modProblems.length === 1 ? "" : "s"}
                    </span>
                  </Link>
                  <div className="p-4">
                    <DSAProblemList problems={modProblems} />
                  </div>
                </div>
              );
            })}
          {(byModule.get("unknown") ?? []).length > 0 && (
            <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800/60 bg-surface/70 text-sm font-bold text-foreground">
                Uncategorised
              </div>
              <div className="p-4">
                <DSAProblemList problems={byModule.get("unknown") ?? []} />
              </div>
            </div>
          )}
        </div>
      </section>

      <DSAContentSections
        content={buildPatternContent(name, {
          total: problems.length,
          easy,
          medium,
          hard,
        })}
        kicker="Pattern guide"
        heading={`Mastering the ${name} pattern`}
      />

      {/* Sibling patterns */}
      {siblings.length > 0 && (
        <section className="mb-12">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Related patterns
          </h2>
          <div className="flex flex-wrap gap-2">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                href={`/dsa/pattern/${s.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground hover:border-blue-300 dark:border-blue-500/30 hover:text-blue-700 dark:text-blue-400 transition-colors"
              >
                {toDisplayName(s.slug)}
                <span className="text-[10px] text-muted-foreground">{s.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <DSAExploreBar exclude="patterns" />
    </DSAPageShell>
  );
}
