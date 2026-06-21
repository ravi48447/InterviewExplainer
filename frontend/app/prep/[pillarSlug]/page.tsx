import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Home,
  BookOpen,
  Layers,
  ArrowRight,
  Target,
  Library,
  Compass,
  Hash,
  Sparkles,
  Flame,
  HelpCircle,
  GraduationCap,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  getPillarBySlug,
  getModulesForPillar,
  PILLAR_HUBS,
  completeTrackCtaForPillar,
  isLanguageAgnosticPillarHub,
  type PillarHubEntry,
} from "@/lib/seo-pillars";
import { getSubcategoriesWithQuestions, getModuleRevision } from "@/lib/content-reader";
import type { SeoModuleEntry } from "@/lib/seo-slugs";
import type { StackSubcategory, QuestionSummary, ModuleRevision } from "@/lib/api";
import PillarTreeNav from "@/components/PillarTreeNav";
import ModuleQuestionsAccordion from "@/components/ModuleQuestionsAccordion";
import { PillarReadingPathGuide } from "@/components/seo/reading-path-guide";

/**
 * Pillar-hub SEO landing — e.g. /cloud, /devops, /spring, /security.
 *
 * Internally routed as /prep/{pillarSlug}, surfaced at the root by proxy.ts.
 *
 * Layout (now 3-column on desktop):
 *   ┌──────────────┬──────────────────────────────────┬──────────────┐
 *   │  Pillar tree │  Hero + module question accordion │  Right rail │
 *   │  (modules +  │  (every module's full Q catalog,  │  (TOC, CTA, │
 *   │   questions) │  expanded by default)             │   related)  │
 *   └──────────────┴──────────────────────────────────┴──────────────┘
 *
 * The hub is fully standalone — it does not assume a parent track. The
 * "full Java backend roadmap" link is moved to the footer rail so each
 * pillar reads as an independent topic landing page.
 */

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

interface ModuleWithQuestions {
  entry: SeoModuleEntry;
  groups: StackSubcategory[];
  revision: ModuleRevision | null;
  totalQuestions: number;
  topicCount: number;
  firstQuestion: QuestionSummary | null;
}

function collectModuleData(modules: SeoModuleEntry[]): ModuleWithQuestions[] {
  return modules.map((entry) => {
    const subcats = getSubcategoriesWithQuestions(
      entry.domainSlug,
      entry.moduleSlug,
    );
    const nonEmpty = subcats.filter((sc) => sc.questions.length > 0);
    const firstQuestion = nonEmpty[0]?.questions[0] ?? null;
    const revision = getModuleRevision(entry.domainSlug, entry.moduleSlug);
    return {
      entry,
      groups: nonEmpty,
      revision,
      totalQuestions: nonEmpty.reduce((s, sc) => s + sc.questions.length, 0),
      topicCount: nonEmpty.length,
      firstQuestion,
    };
  });
}

interface DifficultyMix {
  easy: number;
  medium: number;
  hard: number;
}

function collectDifficultyMix(data: ModuleWithQuestions[]): DifficultyMix {
  const mix: DifficultyMix = { easy: 0, medium: 0, hard: 0 };
  for (const m of data) {
    for (const g of m.groups) {
      for (const q of g.questions) {
        if (q.difficulty === "easy") mix.easy += 1;
        else if (q.difficulty === "hard") mix.hard += 1;
        else mix.medium += 1;
      }
    }
  }
  return mix;
}

/**
 * Picks the N most representative topic names across every module in the
 * pillar, preserving module order and de-duplicating on display name so the
 * chip strip stays diverse. Used for the "popular topics" row near the hero.
 */
function collectPopularTopics(
  data: ModuleWithQuestions[],
  max = 10,
): { name: string; seoSlug: string; anchor: string; count: number }[] {
  const seen = new Set<string>();
  const out: {
    name: string;
    seoSlug: string;
    anchor: string;
    count: number;
  }[] = [];
  for (const m of data) {
    for (const g of m.groups) {
      const key = g.name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        name: g.name,
        seoSlug: m.entry.seoSlug,
        anchor: `mod-${m.entry.seoSlug}`,
        count: g.questions.length,
      });
      if (out.length >= max) return out;
    }
  }
  return out;
}

/**
 * Start-here spotlight — first question from each of up to 3 lead modules,
 * presented as big, tap-friendly cards at the top of the page so arriving
 * visitors immediately see a sample Q to click through to.
 */
function collectStartHere(
  data: ModuleWithQuestions[],
  max = 3,
): {
  moduleTitle: string;
  seoSlug: string;
  question: QuestionSummary;
}[] {
  const out: {
    moduleTitle: string;
    seoSlug: string;
    question: QuestionSummary;
  }[] = [];
  for (const m of data) {
    if (!m.firstQuestion) continue;
    out.push({
      moduleTitle: m.entry.title,
      seoSlug: m.entry.seoSlug,
      question: m.firstQuestion,
    });
    if (out.length >= max) break;
  }
  return out;
}

function buildMetadata(
  pillar: PillarHubEntry,
  totalQuestions: number,
  moduleCount: number,
): Metadata {
  const url = `${SITE_URL}/${pillar.pillarSlug}`;
  const title = `${pillar.title} — ${totalQuestions}+ Q&A across ${moduleCount} Modules | InterviewExplainer`;
  return {
    title,
    description: pillar.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: pillar.metaDescription,
      url,
      type: "website",
      siteName: "InterviewExplainer",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: pillar.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillarSlug: string }>;
}): Promise<Metadata> {
  const { pillarSlug } = await params;
  const pillar = getPillarBySlug(pillarSlug);
  if (!pillar) return { title: "Not Found" };

  const modules = getModulesForPillar(pillar);
  const data = collectModuleData(modules);
  const totalQ = data.reduce((s, m) => s + m.totalQuestions, 0);
  return buildMetadata(pillar, totalQ, modules.length);
}

export function generateStaticParams() {
  return PILLAR_HUBS.map((p) => ({ pillarSlug: p.pillarSlug }));
}

export default async function PillarHubPage({
  params,
}: {
  params: Promise<{ pillarSlug: string }>;
}) {
  const { pillarSlug } = await params;
  const pillar = getPillarBySlug(pillarSlug);
  if (!pillar) notFound();

  const modules = getModulesForPillar(pillar);
  const data = collectModuleData(modules);
  const totalQ = data.reduce((s, m) => s + m.totalQuestions, 0);
  const totalTopics = data.reduce((s, m) => s + m.topicCount, 0);
  const diffMix = collectDifficultyMix(data);
  const popularTopics = collectPopularTopics(data, 10);
  const startHere = collectStartHere(data, 3);

  // FAQ block — evergreen SEO-friendly Q&A about the topic itself, derived
  // from the pillar's metadata. Answers are short and pitch-perfect so they
  // also feed the FAQPage JSON-LD below.
  const topicNoun = pillar.title
    .replace(/\s+Interview Prep.*$/, "")
    .trim();
  const faq = [
    {
      q: `How many ${topicNoun} interview questions are on this page?`,
      a: `This hub covers ${totalQ}+ ${topicNoun.toLowerCase()} interview questions across ${modules.length} modules and ${totalTopics} topics — all with structured answers (one-liner summary, deep-dive, pitfalls, follow-ups).`,
    },
    {
      q: `Which topics should I focus on first?`,
      a: `Start with the lead module and its first topic group — every module is ordered from foundational concepts to advanced scenarios. ${startHere
        .slice(0, 2)
        .map((s) => `"${s.question.title}"`)
        .join(" and ")} are strong kick-off questions.`,
    },
    {
      q: `Are the answers updated for ${new Date().getFullYear()}?`,
      a: `Yes — every answer is reviewed regularly by senior engineers and includes current best practices, version-specific notes, and the trade-offs interviewers ask about in senior-engineer rounds.`,
    },
    {
      q: `Can I use these for companies like Google, Amazon, or Meta?`,
      a: `The hub is framework-agnostic for conceptual topics and version-specific for implementation detail. The scenario-based questions (design, trade-offs, debugging) map directly to the behavioural + technical rounds at top-tier companies.`,
    },
    {
      q: `Is this prep suitable for junior or senior roles?`,
      a: `Each question is tagged easy / medium / hard (${diffMix.easy} easy · ${diffMix.medium} medium · ${diffMix.hard} hard in this category) so you can drill the right depth for your level. Senior candidates should focus on the scenario and trade-off questions in every topic group.`,
    },
  ];

  const canonicalUrl = `${SITE_URL}/${pillar.pillarSlug}`;

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
          {
            "@type": "ListItem",
            position: 3,
            name: pillar.title,
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: pillar.title,
        description: pillar.metaDescription,
        url: canonicalUrl,
        isPartOf: {
          "@type": "WebSite",
          url: SITE_URL,
          name: "InterviewExplainer",
        },
        hasPart: data.map((m) => ({
          "@type": "CreativeWork",
          name: `${m.entry.title} Interview Questions`,
          url: `${SITE_URL}/${m.entry.seoSlug}`,
        })),
      },
      {
        "@type": "ItemList",
        name: `${pillar.title} modules`,
        numberOfItems: data.length,
        itemListElement: data.map((m, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: m.entry.title,
          url: `${SITE_URL}/${m.entry.seoSlug}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  const relatedHubs = pillar.relatedPillars
    .map((slug) => PILLAR_HUBS.find((p) => p.pillarSlug === slug))
    .filter((p): p is PillarHubEntry => Boolean(p));

  const trackCta = completeTrackCtaForPillar(pillar.pillarSlug);
  const hubEyebrow = isLanguageAgnosticPillarHub(pillar.pillarSlug)
    ? "Topic hub"
    : "Prep category";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgb(224_231_255/0.45),transparent_50%),rgb(248_250_252))] font-sans text-slate-800">
        <div className="flex w-full min-h-screen">
          {/* ── LEFT SIDEBAR ── pillar-scoped tree (no JBI overlap) */}
          <aside className="hidden lg:flex flex-col w-[280px] shrink-0 self-start sticky top-0 h-screen bg-white border-r border-slate-200">
            <PillarTreeNav
              pillarTitle={pillar.title}
              pillarSlug={pillar.pillarSlug}
              modules={data.map((m) => ({
                seoSlug: m.entry.seoSlug,
                moduleSlug: m.entry.moduleSlug,
                domainSlug: m.entry.domainSlug,
                title: m.entry.title,
              }))}
              structuredTrackHref={trackCta.href}
              structuredTrackCtaLabel={trackCta.ctaLabel}
            />
          </aside>

          {/* ── MAIN COLUMN ── */}
          <main className="flex-1 min-w-0 pb-24 lg:pb-8">
            <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {/* Breadcrumbs */}
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-1.5 text-xs text-slate-500 mb-4"
              >
                <Link
                  href="/"
                  className="hover:text-slate-700 flex items-center gap-1"
                >
                  <Home className="h-3 w-3" /> Home
                </Link>
                <ChevronRight className="h-3 w-3" />
                <Link href="/prep" className="hover:text-slate-700">
                  Interview Prep
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-slate-700 font-semibold">
                  {pillar.title}
                </span>
              </nav>

              {/* Hero */}
              <header className="relative mb-8 rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)] overflow-hidden ring-1 ring-slate-900/[0.04]">
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-indigo-600 to-violet-600"
                  aria-hidden
                />
                <div className="relative pl-4 sm:pl-5">
                <div className="px-4 sm:px-6 pt-7 pb-6 sm:pt-8 sm:pb-7 bg-gradient-to-br from-slate-50/90 via-white to-indigo-50/35">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2">
                    {hubEyebrow}
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-[2.35rem] font-bold tracking-tight text-slate-900 mb-3 leading-[1.15]">
                    {pillar.title}
                  </h1>
                  <p className="text-base md:text-lg font-semibold text-slate-700 mb-4 leading-snug">
                    {pillar.tagline}
                  </p>
                  <p className="text-[15px] md:text-base text-slate-600 leading-relaxed max-w-3xl">
                    {pillar.heroBlurb}
                  </p>
                </div>

                <div className="px-4 sm:px-6 py-4 bg-white/90 border-t border-slate-100 flex items-center gap-5 flex-wrap">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-slate-900">{totalQ}+</span>
                    <span className="text-slate-500">curated questions</span>
                  </div>
                  <div className="h-5 w-px bg-slate-200" />
                  <div className="flex items-center gap-2 text-sm">
                    <Layers className="h-4 w-4 text-indigo-600" />
                    <span className="font-bold text-slate-900">
                      {modules.length}
                    </span>
                    <span className="text-slate-500">modules</span>
                  </div>
                  <div className="h-5 w-px bg-slate-200" />
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-amber-600" />
                    <span className="font-bold text-slate-900">
                      {totalTopics}
                    </span>
                    <span className="text-slate-500">topics</span>
                  </div>
                  <div className="h-5 w-px bg-slate-200" />
                  <div
                    className="flex items-center gap-1.5 text-xs"
                    title={`${diffMix.easy} easy · ${diffMix.medium} medium · ${diffMix.hard} hard`}
                  >
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {diffMix.easy}
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {diffMix.medium}
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      {diffMix.hard}
                    </span>
                    <span className="text-slate-500 ml-1 hidden sm:inline text-[11px]">
                      difficulty mix
                    </span>
                  </div>
                </div>
                </div>
              </header>

              {startHere.length > 0 && startHere[0] && (
                <PillarReadingPathGuide
                  topicNoun={topicNoun}
                  firstModuleSeoSlug={startHere[0].seoSlug}
                  firstQuestionSlug={startHere[0].question.slug}
                  moduleCount={modules.length}
                />
              )}

              {/* Trust row — tiny, keeps page feeling credible without screaming */}
              <div className="mb-6 flex items-center gap-3 flex-wrap text-[12px] text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Reviewed by senior engineers</span>
                </span>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span>Updated for {new Date().getFullYear()}</span>
                </span>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
                  <span>Free · No sign-up required</span>
                </span>
              </div>

              {/* Start here — 3 kick-off questions to remove the "where do I
                  click?" paralysis that a big hub naturally creates */}
              {startHere.length > 0 && (
                <section
                  aria-labelledby="start-here-heading"
                  className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                >
                  <div className="px-5 py-3 bg-gradient-to-r from-amber-50 via-orange-50 to-white border-b border-slate-200 flex items-center gap-2">
                    <Flame className="h-4 w-4 text-amber-500" />
                    <h2
                      id="start-here-heading"
                      className="text-sm font-black text-slate-900 tracking-tight"
                    >
                      Start here — kick-off questions
                    </h2>
                    <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Most-asked
                    </span>
                  </div>
                  <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {startHere.map((s, idx) => (
                      <Link
                        key={s.question.slug}
                        href={`/${s.seoSlug}/${s.question.slug}`}
                        className="group flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/40 p-4 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-black text-[11px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">
                            {s.moduleTitle}
                          </span>
                        </div>
                        <span className="text-[14px] font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug line-clamp-3">
                          {s.question.title}
                        </span>
                        <span className="mt-auto inline-flex items-center gap-1 text-[11px] font-bold text-blue-600">
                          Read answer
                          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Popular topic chips — quick skimmable overview of the
                  coverage breadth; each chip anchors into its module's
                  expanded accordion below */}
              {popularTopics.length > 0 && (
                <section
                  aria-labelledby="topics-heading"
                  className="mb-6 rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    <h2
                      id="topics-heading"
                      className="text-sm font-black text-slate-900 tracking-tight"
                    >
                      Popular topics in this category
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {popularTopics.map((t) => (
                      <a
                        key={`${t.seoSlug}::${t.name}`}
                        href={`#${t.anchor}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[12px] font-bold hover:bg-blue-100 hover:text-blue-700 transition-colors"
                      >
                        {t.name}
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-white text-blue-600">
                          {t.count}
                        </span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* Modules table-of-contents anchor strip */}
              {data.length > 1 && (
                <nav
                  aria-label="Modules"
                  className="mb-6 rounded-xl border border-slate-200 bg-white p-3 flex flex-wrap gap-2"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 self-center mr-1">
                    Jump to
                  </span>
                  {data.map((m, idx) => (
                    <a
                      key={m.entry.seoSlug}
                      href={`#mod-${m.entry.seoSlug}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-[12px] font-bold text-slate-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      <Hash className="h-3 w-3 text-slate-400" />
                      <span>
                        {String(idx + 1).padStart(2, "0")} · {m.entry.title}
                      </span>
                      <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-blue-700 border border-blue-100">
                        {m.totalQuestions}
                      </span>
                    </a>
                  ))}
                </nav>
              )}

              {/* Modules — questions accordion (expanded by default).
                  `#all-modules` is linked from homepage → system design card. */}
              <section
                id="all-modules"
                aria-labelledby="modules-heading"
                className="mb-8 space-y-4 scroll-mt-24"
              >
                <div className="flex items-baseline justify-between">
                  <h2
                    id="modules-heading"
                    className="text-xl font-black text-slate-900"
                  >
                    Modules &amp; questions in this category
                  </h2>
                  <span className="text-xs text-slate-500">
                    Click any topic header to collapse it
                  </span>
                </div>

                {data.map((m, idx) => (
                  <div
                    key={m.entry.seoSlug}
                    id={`mod-${m.entry.seoSlug}`}
                    className="scroll-mt-6"
                  >
                    <ModuleQuestionsAccordion
                      seoSlug={m.entry.seoSlug}
                      moduleTitle={m.entry.title}
                      pillarLabel={m.entry.pillarName}
                      groups={m.groups}
                      revision={m.revision}
                      totalQuestions={m.totalQuestions}
                      accentIndex={idx}
                      defaultOpen={true}
                    />
                  </div>
                ))}

                {data.length === 0 && (
                  <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
                    <p className="text-sm">
                      No questions are wired up to this pillar yet.
                    </p>
                  </div>
                )}
              </section>

              {/* Related pillars */}
              {relatedHubs.length > 0 && (
                <section
                  aria-labelledby="related-heading"
                  className="mb-8 rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Library className="h-4 w-4 text-slate-500" />
                    <h2
                      id="related-heading"
                      className="text-base font-black text-slate-900"
                    >
                      Related interview prep categories
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {relatedHubs.map((rp) => (
                      <Link
                        key={rp.pillarSlug}
                        href={`/${rp.pillarSlug}`}
                        className="group block rounded-lg border border-slate-200 bg-slate-50/40 px-4 py-3 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-sm transition-all"
                      >
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                          Prep category
                        </div>
                        <div className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                          {rp.title.replace(/\s+Interview Prep.*$/, "")}
                        </div>
                        <div className="mt-1 text-xs text-slate-500 leading-snug line-clamp-2">
                          {rp.tagline}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* FAQ — evergreen, reads well and fuels FAQPage JSON-LD */}
              <section
                aria-labelledby="faq-heading"
                className="mb-8 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
              >
                <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-500" />
                  <h2
                    id="faq-heading"
                    className="text-sm font-black text-slate-900 tracking-tight"
                  >
                    FAQs about this prep category
                  </h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {faq.map((f, idx) => (
                    <details
                      key={idx}
                      className="group px-5 py-3"
                      open={idx === 0}
                    >
                      <summary className="flex items-start gap-3 cursor-pointer list-none">
                        <span className="mt-0.5 shrink-0 w-5 h-5 rounded bg-blue-50 text-blue-600 font-black text-[10px] flex items-center justify-center group-open:bg-blue-600 group-open:text-white transition-colors">
                          Q
                        </span>
                        <span className="flex-1 text-[13px] font-bold text-slate-900 leading-snug">
                          {f.q}
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-400 mt-0.5 group-open:rotate-90 transition-transform" />
                      </summary>
                      <div className="mt-2 ml-8 text-[13px] text-slate-600 leading-relaxed">
                        {f.a}
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              {/* Footer cross-link to the structured roadmap (kept low-key) */}
              <footer className="mt-10 rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-start gap-4 flex-wrap">
                  <Compass className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-[220px]">
                    <div className="text-sm font-black text-slate-900 mb-1">
                      {trackCta.title}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {trackCta.tagline}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <Link
                      href={trackCta.href}
                      className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                    >
                      {trackCta.ctaLabel}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href={trackCta.secondaryHref}
                      className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                    >
                      {trackCta.secondaryLabel}
                    </Link>
                  </div>
                </div>
                <p className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed">
                  Answers maintained by senior engineers · Free to read ·
                  Updated for {new Date().getFullYear()}.
                </p>
              </footer>
            </div>
          </main>

          {/* ── RIGHT RAIL ── (xl+) — quick stats + pillar contents */}
          <aside className="hidden xl:flex w-[280px] shrink-0 flex-col gap-4 self-start sticky top-6 px-4 py-6">
            {/* At-a-glance */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  At a glance
                </h3>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Modules</span>
                  <span className="font-bold text-slate-900">
                    {modules.length}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Topics</span>
                  <span className="font-bold text-slate-900">
                    {totalTopics}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Questions</span>
                  <span className="font-bold text-slate-900">{totalQ}+</span>
                </div>
              </div>
            </div>

            {/* On this page */}
            {data.length > 1 && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    On this page
                  </h3>
                </div>
                <ul className="py-2">
                  {data.map((m, idx) => (
                    <li key={m.entry.seoSlug}>
                      <a
                        href={`#mod-${m.entry.seoSlug}`}
                        className="flex items-center gap-2 px-4 py-1.5 text-xs text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                      >
                        <span className="text-[10px] font-black text-slate-400 w-5 shrink-0">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 truncate font-semibold">
                          {m.entry.title}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 shrink-0">
                          {m.totalQuestions}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* How to use */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  How to use
                </h3>
              </div>
              <ol className="px-4 py-3 space-y-2 text-xs text-slate-600 leading-relaxed list-decimal list-inside">
                <li>Pick a module that matches your weakest area.</li>
                <li>
                  Skim the topic headers — each one is a self-contained
                  drill.
                </li>
                <li>
                  Open any question for the structured answer (one-liner →
                  deep dive → pitfalls).
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
