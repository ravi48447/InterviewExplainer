import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  Target,
  Sparkles,
  Layers,
  BookOpen,
  ArrowRight,
  Workflow,
} from "lucide-react";
import {
  getDSAByCompany,
  getDSACompanies,
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
import { buildCompanyContent } from "@/lib/dsaPageContent";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const revalidate = 3600;

/**
 * Human-readable company names. Anything not in here falls back to the
 * Title-cased slug. Keep this list small — we only override where casing
 * matters (e.g. "LinkedIn" not "Linkedin").
 */
const COMPANY_DISPLAY: Record<string, string> = {
  amazon: "Amazon",
  google: "Google",
  microsoft: "Microsoft",
  meta: "Meta",
  apple: "Apple",
  netflix: "Netflix",
  uber: "Uber",
  bloomberg: "Bloomberg",
  linkedin: "LinkedIn",
  salesforce: "Salesforce",
  adobe: "Adobe",
  oracle: "Oracle",
  tiktok: "TikTok",
  stripe: "Stripe",
  airbnb: "Airbnb",
};

/**
 * Short editorial note per company. Purely for SEO / user context on the
 * landing page — the problem list itself is generated from `company_tags`.
 */
const COMPANY_NOTES: Record<string, string> = {
  amazon:
    "Amazon interviews lean medium-heavy with 2–3 problems per round. Clean code and edge cases matter more than exotic algorithms — always narrate your approach before typing.",
  google:
    "Google rounds skew hard. Expect to analyse complexity unprompted, handle every edge case, and write without autocomplete on a shared doc.",
  microsoft:
    "Microsoft interviews are more collaborative — they hint if you stall. Communication is weighted as heavily as the final solution.",
  meta:
    "Meta values clean, production-quality code. Move fast, know your Big-O, and expect systems-flavoured framings on classic DSA.",
  apple:
    "Apple tailors DSA to the team. Expect strong fundamentals plus a Swift- or C++-shaped twist in platform roles.",
  netflix:
    "Netflix screens are senior-only; problems are medium-hard and focused on pragmatic engineering trade-offs more than raw algorithmic trickery.",
  uber:
    "Uber loves graph, map, and rate-limiting flavoured problems. Always clarify scale before committing to an approach.",
  bloomberg:
    "Bloomberg rounds emphasise strings, linked lists, and stack problems — the ability to reason about mutation and state is heavily tested.",
};

function toDisplayName(slug: string) {
  return (
    COMPANY_DISPLAY[slug] ??
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

export async function generateStaticParams() {
  return getDSACompanies().map((c) => ({ company: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ company: string }>;
}): Promise<Metadata> {
  const { company } = await params;
  const name = toDisplayName(company);
  const problems = getDSAByCompany(company);
  return {
    title: `${name} DSA Interview Questions — Patterns & Problems | InterviewExplainer`,
    description: `${problems.length} real DSA problems tagged with ${name}, grouped by pattern. Java and Python walkthroughs with the talking points interviewers expect.`,
    alternates: { canonical: `${SITE_URL}/dsa/company/${company}` },
  };
}

export default async function DSACompanyPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const problems = getDSAByCompany(company);
  if (problems.length === 0) notFound();

  const name = toDisplayName(company);
  const authoredCount = problems.filter(problemHasAuthoredContent).length;
  const note = COMPANY_NOTES[company];

  // Difficulty split
  const easy = problems.filter((p) => p.difficulty === "easy").length;
  const medium = problems.filter((p) => p.difficulty === "medium").length;
  const hard = problems.filter((p) => p.difficulty === "hard").length;

  // Top patterns this company tests
  const patternCounts = new Map<string, number>();
  for (const p of problems) {
    for (const pat of p.patterns ?? []) {
      patternCounts.set(pat, (patternCounts.get(pat) ?? 0) + 1);
    }
  }
  const topPatterns = [...patternCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Group problems by module for the list
  const modules = getDSAModules();
  const byModule = new Map<string, typeof problems>();
  for (const p of problems) {
    const key = p.moduleSlug ?? "unknown";
    const arr = byModule.get(key) ?? [];
    arr.push(p);
    byModule.set(key, arr);
  }

  // Other top companies (sidebar-style pivot)
  const otherCompanies = getDSACompanies()
    .filter((c) => c.slug !== company)
    .slice(0, 10);

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
            name: `${name} DSA`,
            item: `${SITE_URL}/dsa/company/${company}`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: `${name} DSA Interview Problems`,
        url: `${SITE_URL}/dsa/company/${company}`,
        numberOfItems: problems.length,
      },
    ],
  };

  return (
    <DSAPageShell jsonLd={jsonLd}>
      <DSABreadcrumb
        trail={[{ label: "Companies" }, { label: `${name} DSA` }]}
      />

      <DSAHero
        eyebrow={`Company · ${name}`}
        eyebrowIcon={Building2}
        title={`${name} DSA Interview Questions`}
        tagline={`${problems.length} real DSA problems reported in ${name} interviews, grouped by the curriculum module that teaches them. Prioritise the patterns below — they map cleanly to what actually gets asked.`}
        body={note ? <p>{note}</p> : undefined}
        stats={
          <>
            <DSAStatCard icon={Target} label="Problems" value={`${problems.length}`} />
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
            <DSAStatCard icon={BookOpen} label="Languages" value="Java · Python" />
          </>
        }
      />

      {/* Patterns this company tests */}
      {topPatterns.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-1.5 mb-3">
            <Workflow className="h-3 w-3 text-slate-400" />
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Patterns {name} actually tests
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {topPatterns.map(([slug, count]) => (
              <Link
                key={slug}
                href={`/dsa/pattern/${slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground hover:border-violet-300 hover:text-violet-700 transition-colors"
              >
                {slug
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
                <span className="text-[10px] text-slate-400">{count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Problem list grouped by module */}
      <section className="mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
          Grouped by curriculum module
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
                    className="group flex items-center justify-between gap-3 px-5 py-3 border-b border-slate-100 bg-surface/70 hover:bg-violet-50/40 transition-colors"
                  >
                    <span className="text-sm font-bold text-foreground group-hover:text-violet-700 inline-flex items-center gap-1.5 transition-colors">
                      {m.title}
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-violet-500" />
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
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
              <div className="px-5 py-3 border-b border-slate-100 bg-surface/70 text-sm font-bold text-foreground">
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
        content={buildCompanyContent(name, {
          total: problems.length,
          easy,
          medium,
          hard,
        })}
        kicker={`${name} guide`}
        heading={`How to prepare for ${name} coding interviews`}
      />

      {/* Other companies */}
      {otherCompanies.length > 0 && (
        <section className="mb-10">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
            Other companies
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherCompanies.map((c) => (
              <Link
                key={c.slug}
                href={`/dsa/company/${c.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground hover:border-violet-300 hover:text-violet-700 transition-colors"
              >
                {toDisplayName(c.slug)}
                <span className="text-[10px] text-slate-400">{c.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <DSAExploreBar exclude="companies" />
    </DSAPageShell>
  );
}
