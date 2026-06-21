import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FolderTree,
  Target,
  Sparkles,
  Layers,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import {
  getDSAByCategory,
  getDSACategories,
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
import { buildCategoryContent } from "@/lib/dsaPageContent";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const revalidate = 3600;

function toDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateStaticParams() {
  return getDSACategories().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const name = toDisplayName(category);
  const problems = getDSAByCategory(category);
  return {
    title: `${name} — DSA Interview Problems in Java & Python | InterviewExplainer`,
    description: `${problems.length} ${name.toLowerCase()} interview problems with multiple approaches, complexity analysis, and line-by-line walkthroughs.`,
    alternates: { canonical: `${SITE_URL}/dsa/${category}` },
  };
}

function CategorySidebar({
  categories,
  current,
}: {
  categories: string[];
  current: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200">
        <Link
          href="/dsa"
          className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-violet-600 hover:text-violet-800"
        >
          <FolderTree className="h-3.5 w-3.5" />
          All categories
        </Link>
      </div>
      <div className="p-2">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/dsa/${cat}`}
            className={`block px-3 py-1.5 text-xs rounded-md transition-colors ${
              cat === current
                ? "bg-violet-50 text-violet-700 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
            }`}
          >
            {toDisplayName(cat)}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function DSACategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const problems = getDSAByCategory(category);
  if (problems.length === 0) notFound();

  const name = toDisplayName(category);
  const categories = getDSACategories();
  const authoredCount = problems.filter(problemHasAuthoredContent).length;

  const easy = problems.filter((p) => p.difficulty === "easy").length;
  const medium = problems.filter((p) => p.difficulty === "medium").length;
  const hard = problems.filter((p) => p.difficulty === "hard").length;

  // Group by module so the list isn't a giant flat scroll.
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
            name,
            item: `${SITE_URL}/dsa/${category}`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: `${name} DSA Problems`,
        url: `${SITE_URL}/dsa/${category}`,
        numberOfItems: problems.length,
      },
    ],
  };

  return (
    <DSAPageShell
      jsonLd={jsonLd}
      maxWidth="1280px"
      sidebar={<CategorySidebar categories={categories} current={category} />}
    >
      <DSABreadcrumb trail={[{ label: "Categories" }, { label: name }]} />

      <DSAHero
        eyebrow={`Category · ${name}`}
        eyebrowIcon={FolderTree}
        title={`${name} — DSA Interview Problems`}
        tagline={`Every ${name.toLowerCase()} problem we index, grouped by the curriculum module that teaches its pattern. Each problem ships with multiple approaches, complexity analysis, and a line-by-line walkthrough in Java and Python.`}
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

      {/* Grouped by module */}
      <section className="mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
          Grouped by curriculum module
        </p>
        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-5">
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
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/70 text-sm font-bold text-slate-900">
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
        content={buildCategoryContent(name, category, {
          total: problems.length,
          easy,
          medium,
          hard,
        })}
        kicker={`${name} guide`}
        heading={`How to master ${name}`}
      />

      <DSAExploreBar />
    </DSAPageShell>
  );
}
