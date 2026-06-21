import type { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Layers,
  Sparkles,
  Zap,
  Compass,
} from "lucide-react";
import {
  PILLAR_HUBS,
  COMPLETE_TRACK_CTA,
  type PillarHubEntry,
} from "@/lib/seo-pillars";
import { SEO_MODULES, type SeoModuleEntry } from "@/lib/seo-slugs";
import { getSubcategoriesWithQuestions } from "@/lib/content-reader";
import { PrepTrackSurfaces } from "@/components/landing/prep-track-surfaces";
import { isSystemArchitecturePillarSlug } from "@/lib/prep-tracks";

/**
 * /prep — interview prep hub: independent tracks (system design, Java, Python,
 * frontend) plus pillar hubs and every SEO module, grouped for scanability.
 */

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const metadata: Metadata = {
  title:
    "Interview Prep Hub — System Design, Java, Python & Frontend | InterviewExplainer",
  description:
    "Choose a prep surface: system design & architecture (language-agnostic), Java backend, Python tracks, or frontend/fullstack. Then open topic hubs, SEO modules, or a full roadmap — 1200+ structured questions.",
  alternates: { canonical: `${SITE_URL}/prep` },
  openGraph: {
    title: "Interview Prep Hub — System Design, Java, Python & Frontend",
    description:
      "Independent tracks and topic hubs. System design stands alone from Java; Python and React have their own entry points.",
    url: `${SITE_URL}/prep`,
    type: "website",
    siteName: "InterviewExplainer",
  },
  robots: { index: true, follow: true },
};

interface ModuleCount {
  entry: SeoModuleEntry;
  questionCount: number;
}

interface PillarWithStats {
  pillar: PillarHubEntry;
  moduleCount: number;
  questionCount: number;
}

type ModulePillarGroup = { pillarName: string; modules: ModuleCount[] };

const _g = globalThis as typeof globalThis & {
  _ie_prepGroupModules?: ModulePillarGroup[];
  _ie_prepPillarStats?: PillarWithStats[];
};

function groupModulesByPillar(): ModulePillarGroup[] {
  if (_g._ie_prepGroupModules) return _g._ie_prepGroupModules;

  const order: string[] = [];
  const groups: Record<string, ModuleCount[]> = {};
  for (const entry of SEO_MODULES) {
    if (!groups[entry.pillarName]) {
      groups[entry.pillarName] = [];
      order.push(entry.pillarName);
    }
    const subcats = getSubcategoriesWithQuestions(
      entry.domainSlug,
      entry.moduleSlug,
    );
    const questionCount = subcats.reduce(
      (s, sc) => s + sc.questions.length,
      0,
    );
    groups[entry.pillarName].push({ entry, questionCount });
  }
  const result = order.map((pillarName) => ({
    pillarName,
    modules: groups[pillarName],
  }));
  _g._ie_prepGroupModules = result;
  return result;
}

function enrichPillars(): PillarWithStats[] {
  if (_g._ie_prepPillarStats) return _g._ie_prepPillarStats;

  const result = PILLAR_HUBS.map((pillar) => {
    let questionCount = 0;
    let moduleCount = 0;
    for (const moduleSlug of pillar.moduleSlugs) {
      const entry = SEO_MODULES.find((m) => m.moduleSlug === moduleSlug);
      if (!entry) continue;
      moduleCount += 1;
      const subcats = getSubcategoriesWithQuestions(
        entry.domainSlug,
        entry.moduleSlug,
      );
      questionCount += subcats.reduce((s, sc) => s + sc.questions.length, 0);
    }
    return { pillar, moduleCount, questionCount };
  });
  _g._ie_prepPillarStats = result;
  return result;
}

function partitionModuleGroups(groups: ModulePillarGroup[]): {
  jfiGroups: ModulePillarGroup[];
  jbiGroups: ModulePillarGroup[];
} {
  const jfi: ModulePillarGroup[] = [];
  const jbi: ModulePillarGroup[] = [];
  for (const g of groups) {
    const domains = new Set(g.modules.map((m) => m.entry.domainSlug));
    const onlyJfi =
      domains.size === 1 && domains.has("java-fullstack-intermediate");
    if (onlyJfi) jfi.push(g);
    else jbi.push(g);
  }
  return { jfiGroups: jfi, jbiGroups: jbi };
}

function PillarHubCards({ stats }: { stats: PillarWithStats[] }) {
  if (stats.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {stats.map(({ pillar, moduleCount, questionCount }) => (
        <Link
          key={pillar.pillarSlug}
          href={`/${pillar.pillarSlug}`}
          className="group block rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-300 transition-all overflow-hidden"
        >
          <div className="px-5 py-4">
            <div className="flex items-start gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 leading-snug transition-colors">
                  {pillar.title}
                </h3>
                <div className="mt-1 text-xs text-slate-500 leading-snug line-clamp-2">
                  {pillar.tagline}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span className="font-bold text-slate-700">{questionCount}</span>
                <span>questions</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Layers className="h-3 w-3" />
                <span className="font-bold text-slate-700">{moduleCount}</span>
                <span>modules</span>
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ModulePillarSections({ groups }: { groups: ModulePillarGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div
          key={group.pillarName}
          className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex items-baseline gap-2">
            <Zap className="h-3.5 w-3.5 text-amber-500 self-center" />
            <h3 className="text-sm font-black text-slate-900">{group.pillarName}</h3>
            <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
              {group.modules.length}
            </span>
          </div>
          <ul className="divide-y divide-slate-100">
            {group.modules.map(({ entry, questionCount }) => (
              <li key={entry.seoSlug}>
                <Link
                  href={`/${entry.seoSlug}`}
                  className="group flex items-center gap-4 px-5 py-3 hover:bg-blue-50/60 transition-colors"
                >
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {entry.title} Interview Questions
                    </span>
                    {entry.altSlugs.length > 0 && (
                      <span className="mt-1 block text-[11px] text-slate-500 leading-snug">
                        Also covers:{" "}
                        {entry.altSlugs
                          .map((s) =>
                            s
                              .replace(/-interview-questions$/, "")
                              .replace(/-/g, " "),
                          )
                          .join(", ")}
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-slate-500 shrink-0">
                    <span className="font-bold text-slate-700">{questionCount}</span>{" "}
                    Q&A
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function PrepIndexPage() {
  const pillarStats = enrichPillars();
  const moduleGroups = groupModulesByPillar();
  const { jfiGroups, jbiGroups } = partitionModuleGroups(moduleGroups);

  const architecturePillars = pillarStats.filter((s) =>
    isSystemArchitecturePillarSlug(s.pillar.pillarSlug),
  );
  const javaPlatformPillars = pillarStats.filter(
    (s) => !isSystemArchitecturePillarSlug(s.pillar.pillarSlug),
  );

  const totalModules = SEO_MODULES.length;
  const totalQuestions = moduleGroups.reduce(
    (s, g) => s + g.modules.reduce((ss, m) => ss + m.questionCount, 0),
    0,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Interview Prep",
            item: `${SITE_URL}/prep`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: "Interview Prep Hub — System Design, Java, Python & Frontend",
        url: `${SITE_URL}/prep`,
        isPartOf: {
          "@type": "WebSite",
          url: SITE_URL,
          name: "InterviewExplainer",
        },
      },
      {
        "@type": "ItemList",
        name: "Interview prep topic hubs",
        numberOfItems: PILLAR_HUBS.length,
        itemListElement: PILLAR_HUBS.map((p, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: p.title,
          url: `${SITE_URL}/${p.pillarSlug}`,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 font-sans text-slate-800">
        <div className="w-full min-w-0 px-4 py-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-slate-500 mb-5"
          >
            <Link
              href="/"
              className="hover:text-slate-700 flex items-center gap-1"
            >
              <Home className="h-3 w-3" /> Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-700 font-semibold">Interview Prep</span>
          </nav>

          <header className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-7 py-7 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
              <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-2">
                Interview prep hub
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-3 leading-tight">
                System design, Java, Python &amp; frontend — pick a surface
              </h1>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-3xl">
                This index lists every topic hub and SEO module we publish, but they are not all
                &quot;the same as Java prep&quot;: system design and architecture hubs are
                language-agnostic; Python and frontend have their own roadmaps and domains. Use the
                cards below to enter the right track first, then drill modules.
              </p>
            </div>

            <div className="px-7 py-3 bg-white border-t border-slate-200 flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="font-bold text-slate-900">{totalQuestions}+</span>
                <span className="text-slate-500">questions</span>
              </div>
              <div className="h-5 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-sm">
                <Layers className="h-4 w-4 text-indigo-600" />
                <span className="font-bold text-slate-900">{totalModules}</span>
                <span className="text-slate-500">modules</span>
              </div>
              <div className="h-5 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-sm">
                <Compass className="h-4 w-4 text-emerald-600" />
                <span className="font-bold text-slate-900">{PILLAR_HUBS.length}</span>
                <span className="text-slate-500">topic hubs</span>
              </div>
            </div>
          </header>

          <PrepTrackSurfaces variant="prep" />

          <aside
            aria-label="Java backend full roadmap"
            className="mb-8 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
          >
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Optional — Java only
                </p>
                <p className="text-sm text-slate-700 leading-snug">
                  {COMPLETE_TRACK_CTA.tagline}{" "}
                  <span className="text-slate-500">
                    Use this when you want the full Java-backend sequence, not SD/Python/React
                    first.
                  </span>
                </p>
              </div>
              <Link
                href={COMPLETE_TRACK_CTA.href}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-800 font-semibold text-sm hover:bg-indigo-100 transition-colors shrink-0"
              >
                Java roadmap
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>

          <section
            id="track-architecture"
            className="mb-10 scroll-mt-24 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 p-5 sm:p-6"
          >
            <div className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 mb-1">
                Language-agnostic
              </p>
              <h2 className="text-xl font-black text-slate-900">
                System design &amp; architecture topic hubs
              </h2>
              <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                These hubs are framed for interview rounds that are not tied to a single language.
                Open any card — content may use examples in several stacks, but the trade-offs are
                universal.
              </p>
            </div>
            <PillarHubCards stats={architecturePillars} />
          </section>

          <section id="track-java" className="mb-10 scroll-mt-24">
            <div className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                Java &amp; platform stack
              </p>
              <h2 className="text-xl font-black text-slate-900">
                Java backend &amp; ecosystem topic hubs
              </h2>
              <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                Spring, JVM, data, security, DevOps, cloud, SRE, and more — the pillars that sit
                under a typical Java backend hiring loop.
              </p>
            </div>
            <PillarHubCards stats={javaPlatformPillars} />
          </section>

          <section id="track-frontend" className="mb-10 scroll-mt-24 rounded-2xl border border-violet-200/80 bg-violet-50/20 p-5 sm:p-6">
            <h2 className="text-xl font-black text-slate-900">
              Frontend &amp; fullstack modules (JavaScript, TypeScript, React…)
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl mb-4">
              These SEO modules live on the{" "}
              <Link
                href="/java-fullstack-intermediate"
                className="font-semibold text-indigo-700 hover:underline"
              >
                Java fullstack intermediate
              </Link>{" "}
              roadmap — grouped by curriculum pillar below so they stay separate from the Java
              backend list.
            </p>
            <ModulePillarSections groups={jfiGroups} />
          </section>

          <section aria-labelledby="java-backend-modules-heading" className="mb-10 scroll-mt-24">
            <div className="flex items-baseline justify-between mb-4 gap-2 flex-wrap">
              <h2
                id="java-backend-modules-heading"
                className="text-xl font-black text-slate-900"
              >
                Java backend curriculum — every SEO module
              </h2>
              <span className="text-xs text-slate-500">
                Grouped by pillar from the backend index
              </span>
            </div>
            <ModulePillarSections groups={jbiGroups} />
          </section>

          <footer className="mt-10 pt-6 border-t border-slate-200 text-xs text-slate-500 leading-relaxed">
            <p>
              Question sets share one answer template and cross-links for follow-up prep. Start from
              a track at the top of this page; use topic hubs for breadth, individual modules for
              depth, or the{" "}
              <Link href={COMPLETE_TRACK_CTA.href} className="font-bold text-slate-700 hover:underline">
                Java backend roadmap
              </Link>{" "}
              when you want an ordered Java-only path.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
