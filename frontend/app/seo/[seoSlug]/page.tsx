import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Home,
  Clock,
  BookOpen,
  BookOpenCheck,
  Layers,
  ArrowRight,
  Flame,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Zap,
  GraduationCap,
  ListOrdered,
} from "lucide-react";
import {
  getSeoModuleBySlug,
  getCanonicalFromAlt,
  type SeoModuleEntry,
} from "@/lib/seo-slugs";
import { getSubcategoriesWithQuestions, getModuleRevision } from "@/lib/content-reader";
import {
  completeTrackCtaForModule,
  getModulesForPillar,
  getPillarsForModule,
  getPrimaryPillarForModule,
  getRelatedModulesFor,
  type PillarHubEntry,
} from "@/lib/seo-pillars";
import PillarTreeNav from "@/components/PillarTreeNav";
import ModuleQuestionsAccordion from "@/components/ModuleQuestionsAccordion";
import { SmartCrosslinks } from "@/components/seo/smart-crosslinks";
import { ModuleReadingPathGuide } from "@/components/seo/reading-path-guide";

/**
 * SEO "canonical module" landing page — e.g. /spring-boot-interview-questions.
 *
 * Layout (now 3-column on desktop):
 *   ┌──────────────┬──────────────────────────────────┬──────────────┐
 *   │  Pillar tree │  Hero + every Q grouped by topic │  Right rail │
 *   │  (sibling    │  (accordion, expanded by default,│  (TOC, CTA, │
 *   │   modules)   │  collapsible)                    │   pillar)   │
 *   └──────────────┴──────────────────────────────────┴──────────────┘
 *
 * The left tree is *scoped to the module's primary pillar*, NOT to the full
 * Java backend curriculum. So a visitor landing on
 * /spring-boot-interview-questions sees only the Spring modules in the side
 * nav (spring-core, spring-boot, spring-data-jpa …) — never the full JBI
 * curriculum which would dwarf the page they're actually reading.
 */

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

function buildMetadata(entry: SeoModuleEntry, totalQ: number): Metadata {
  const url = `${SITE_URL}/${entry.seoSlug}`;
  const title = `${entry.title} Interview Questions${totalQ ? ` (${totalQ}+ Q&A)` : ""} | InterviewExplainer`;
  const description = `Top ${entry.title} interview questions with detailed, structured answers. Covers core concepts, scenarios, and common pitfalls. Updated for ${new Date().getFullYear()}.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "InterviewExplainer",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ seoSlug: string }>;
}): Promise<Metadata> {
  const { seoSlug } = await params;
  const entry = getSeoModuleBySlug(seoSlug);
  if (!entry) return { title: "Not Found" };

  const subcats = getSubcategoriesWithQuestions(
    entry.domainSlug,
    entry.moduleSlug,
  );
  const totalQ = subcats.reduce((s, sc) => s + sc.questions.length, 0);
  return buildMetadata(entry, totalQ);
}

export default async function SeoModulePage({
  params,
}: {
  params: Promise<{ seoSlug: string }>;
}) {
  const { seoSlug } = await params;

  if (getCanonicalFromAlt(seoSlug)) notFound();

  const entry = getSeoModuleBySlug(seoSlug);
  if (!entry) notFound();

  const subcats = getSubcategoriesWithQuestions(
    entry.domainSlug,
    entry.moduleSlug,
  );
  const moduleRevision = getModuleRevision(entry.domainSlug, entry.moduleSlug);
  const topicsWithQ = subcats.filter((sc) => sc.questions.length > 0);
  const totalQ = topicsWithQ.reduce((s, sc) => s + sc.questions.length, 0);
  const firstQ = topicsWithQ[0]?.questions[0];

  // Flattened [first-question-per-topic × up-to-5] for the "Top-asked"
  // spotlight. Picking the lead Q from different topic groups gives a more
  // representative mix than the first 5 questions of the first group.
  const topAsked = topicsWithQ
    .slice(0, 5)
    .map((sc) => ({ topic: sc.name, question: sc.questions[0] }))
    .filter((x) => Boolean(x.question));

  // Difficulty mix across every question in the module.
  const diffMix = { easy: 0, medium: 0, hard: 0 };
  for (const sc of topicsWithQ) {
    for (const q of sc.questions) {
      if (q.difficulty === "easy") diffMix.easy += 1;
      else if (q.difficulty === "hard") diffMix.hard += 1;
      else diffMix.medium += 1;
    }
  }

  const canonicalUrl = `${SITE_URL}/${entry.seoSlug}`;

  // Resolve the pillar context so the left sidebar shows just this pillar's
  // modules. Falls back to a single-module sidebar if the module isn't
  // currently part of a registered pillar hub.
  const pillar = getPrimaryPillarForModule(entry.moduleSlug);
  const pillarModules = pillar
    ? getModulesForPillar(pillar)
    : [entry];
  const siblingModulesForNav = pillarModules.map((m) => ({
    seoSlug: m.seoSlug,
    moduleSlug: m.moduleSlug,
    domainSlug: m.domainSlug,
    title: m.title,
  }));

  // Pillars this module belongs to (a module can belong to more than one —
  // e.g. spring-security is in both /spring and /security). Rendered as
  // small chips at the top so users see the cross-cutting context without
  // leaving the page.
  const relatedPillarHubs: PillarHubEntry[] = getPillarsForModule(
    entry.moduleSlug,
  );

  // Evergreen FAQ block — also feeds the FAQPage JSON-LD below so Google
  // can surface rich results for generic "{topic} interview questions"
  // searches.
  const faqBlock = [
    {
      q: `How many ${entry.title} interview questions are on this page?`,
      a: `This module bundles ${totalQ}+ ${entry.title} interview questions, grouped by ${topicsWithQ.length} topic${topicsWithQ.length === 1 ? "" : "s"}. Every answer follows the same structure — one-liner summary, structured deep-dive, common pitfalls, and realistic follow-ups an interviewer might ask.`,
    },
    {
      q: `Is this ${entry.title} content up to date for ${new Date().getFullYear()}?`,
      a: `Yes. Every answer is reviewed by senior engineers and updated for current best practices, version-specific APIs, and the scenario questions hiring managers are asking today.`,
    },
    {
      q: `Which difficulty level are these ${entry.title} questions?`,
      a: `The set spans all three levels — ${diffMix.easy} easy, ${diffMix.medium} medium, and ${diffMix.hard} hard questions. Junior candidates should focus on the conceptual questions; senior candidates should drill the scenario and trade-off questions in every topic group.`,
    },
    ...(firstQ
      ? [
          {
            q: `Which question should I read first?`,
            a: `Start with question 1 in the ordered list below ("${firstQ.title}") — it is the recommended entry point. Then use the Next question link at the bottom of each answer page to read straight through to Q${totalQ}.`,
          },
        ]
      : []),
    ...(pillar
      ? [
          {
            q: `What else belongs in a ${pillar.title.replace(/\s+Interview Prep.*$/, "")} prep plan?`,
            a: `${entry.title} is one module inside the broader ${pillar.title.replace(/\s+Interview Prep.*$/, "")} hub — open it to drill the full set of sibling modules with the same structured answer format.`,
          },
        ]
      : []),
  ];

  // ─── JSON-LD: BreadcrumbList + FAQPage ───
  // Mix the question-based FAQ (great for long-tail SEO) with the evergreen
  // FAQ block above — both feed the same FAQPage graph node.
  const questionFaqEntities = topicsWithQ
    .flatMap((sc) => sc.questions.map((q) => ({ sc, q })))
    .slice(0, 8)
    .map(({ q }) => ({
      "@type": "Question",
      name: q.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: `See full structured answer at ${SITE_URL}/${entry.seoSlug}/${q.slug}`,
      },
    }));
  const evergreenFaqEntities = faqBlock.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  }));
  const faqEntities = [...evergreenFaqEntities, ...questionFaqEntities];

  const breadcrumbsJsonLd = pillar
    ? [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: pillar.title,
          item: `${SITE_URL}/${pillar.pillarSlug}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${entry.title} Interview Questions`,
          item: canonicalUrl,
        },
      ]
    : [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: `${entry.title} Interview Questions`,
          item: canonicalUrl,
        },
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: breadcrumbsJsonLd },
      { "@type": "FAQPage", mainEntity: faqEntities },
      {
        "@type": "CollectionPage",
        name: `${entry.title} Interview Questions`,
        url: canonicalUrl,
        isPartOf: {
          "@type": "WebSite",
          url: SITE_URL,
          name: "InterviewExplainer",
        },
        about: { "@type": "Thing", name: entry.title },
      },
    ],
  };

  // Sibling modules within the same pillar (excluding the current one) —
  // still kept available for the left-tree nav, but the in-article
  // cross-links block below now prefers the hand-picked MODULE_RELATED list
  // (which cuts across pillars by interview-round adjacency).
  const siblingModules = pillarModules.filter(
    (m) => m.moduleSlug !== entry.moduleSlug,
  );

  // Hand-picked next-up modules from MODULE_RELATED, decorated with live
  // question counts. Renders as the "Continue your prep" tree block that
  // unifies sibling-modules + related-pillars + complete-track CTAs.
  const relatedRaw = getRelatedModulesFor(entry.moduleSlug);
  const relatedModules = relatedRaw.map((m) => {
    const subs = getSubcategoriesWithQuestions(m.domainSlug, m.moduleSlug);
    const count = subs.reduce((s, sc) => s + sc.questions.length, 0);
    return { ...m, questionCount: count };
  });

  const trackCta = completeTrackCtaForModule(entry.moduleSlug);

  const flatQuestions = topicsWithQ.flatMap((sc) =>
    sc.questions.map((q) => ({
      slug: q.slug,
      title: q.title,
      topicName: sc.name,
    })),
  );
  const readingRail = flatQuestions.slice(0, 20);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgb(224_231_255/0.5),transparent_50%),rgb(248_250_252))] font-sans text-foreground">
        <div className="flex w-full min-h-screen">
          {/* ── LEFT SIDEBAR ── pillar-scoped, NOT the full JBI tree */}
          <aside className="hidden lg:flex flex-col w-[280px] shrink-0 self-start sticky top-0 h-screen bg-background border-r border-border overflow-y-auto custom-scrollbar">
            <PillarTreeNav
              pillarTitle={pillar?.title ?? entry.title}
              pillarSlug={pillar?.pillarSlug ?? entry.seoSlug}
              modules={siblingModulesForNav}
              activeSeoSlug={entry.seoSlug}
              structuredTrackHref={trackCta.href}
              structuredTrackCtaLabel={trackCta.ctaLabel}
            />
          </aside>

          {/* ── MAIN COLUMN ── */}
          <main className="flex-1 min-w-0 pb-24 lg:pb-8">
            <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 flex-wrap">
                <Link
                  href="/"
                  className="hover:text-foreground flex items-center gap-1"
                >
                  <Home className="h-3 w-3" /> Home
                </Link>
                {pillar && (
                  <>
                    <ChevronRight className="h-3 w-3" />
                    <Link
                      href={`/${pillar.pillarSlug}`}
                      className="hover:text-foreground"
                    >
                      {pillar.title.replace(/\s+Interview Prep.*$/, "")}
                    </Link>
                  </>
                )}
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-semibold">
                  {entry.title} Interview Questions
                </span>
              </nav>

              {/* Hero — editorial layout, clear primary action */}
              <header className="relative mb-8 rounded-2xl border border-border/90 bg-background shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)] overflow-hidden ring-1 ring-slate-900/[0.04]">
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-surface border border-default"
                  aria-hidden
                />
                <div className="relative pl-4 sm:pl-5">
                  <div className="px-4 sm:px-6 pt-7 pb-6 sm:pt-8 sm:pb-7 bg-gradient-to-br from-surface-subtle via-surface to-background">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary dark:text-primary">
                        {entry.pillarName}
                      </span>
                      <span className="hidden sm:inline text-muted-foreground">·</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Interview Q&amp;A
                      </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-[2.35rem] font-bold tracking-tight text-foreground mb-3 leading-[1.15]">
                      {entry.title} interview questions
                    </h1>
                    <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
                      {totalQ}+ curated questions with the same answer shape every
                      time: quick recap, deep dive, pitfalls, and follow-ups.
                      Coverage includes{" "}
                      {topicsWithQ
                        .slice(0, 4)
                        .map((sc) => sc.name.toLowerCase())
                        .join(", ")}
                      {topicsWithQ.length > 4 ? ", and more" : ""}.
                    </p>
                  </div>

                  <div className="px-4 sm:px-6 py-4 bg-background/90 border-t border-slate-100 dark:border-slate-800/60 flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary dark:text-primary shrink-0" />
                        <span className="font-bold text-foreground tabular-nums">
                          {totalQ}
                        </span>
                        <span className="text-muted-foreground">questions</span>
                      </div>
                      <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary dark:text-primary shrink-0" />
                        <span className="font-bold text-foreground tabular-nums">
                          {topicsWithQ.length}
                        </span>
                        <span className="text-muted-foreground">topics</span>
                      </div>
                      <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
                      <div
                        className="flex items-center gap-1.5 text-xs"
                        title={`${diffMix.easy} easy · ${diffMix.medium} medium · ${diffMix.hard} hard`}
                      >
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-success/10 text-success font-bold border border-success/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-800" />
                          {diffMix.easy}
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-warning/10 text-warning-foreground font-bold border border-warning/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-800" />
                          {diffMix.medium}
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-destructive/10 text-destructive font-bold border border-destructive/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-800" />
                          {diffMix.hard}
                        </span>
                        <span className="text-muted-foreground ml-1 hidden md:inline text-[11px]">
                          difficulty
                        </span>
                      </div>
                    </div>
                    {firstQ && (
                      <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto w-full sm:w-auto">
                        <Link
                          href={`/${entry.seoSlug}/${firstQ.slug}`}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 dark:bg-blue-800 text-foreground font-bold text-sm shadow-md shadow-sm hover:bg-blue-700 dark:bg-blue-800 transition-colors"
                        >
                          <BookOpenCheck className="h-4 w-4 shrink-0" />
                          Open question 1
                        </Link>
                        <Link
                          href={`/${entry.seoSlug}#reading-path`}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground font-semibold text-sm hover:border-default hover:bg-primary/10 transition-colors"
                        >
                          <ListOrdered className="h-4 w-4 text-muted-foreground shrink-0" />
                          How to read this module
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </header>

              {firstQ && (
                <ModuleReadingPathGuide
                  moduleTitle={entry.title}
                  totalQuestions={totalQ}
                  seoSlug={entry.seoSlug}
                  firstQuestionSlug={firstQ.slug}
                />
              )}

              {/* Domain introduction — hand-tuned per module in _index.json.
                  Explains what this SEO surface is, what it covers, and how it
                  sits next to sibling modules. Renders above every other
                  content block so a Google visitor gets a clear orientation
                  before the Q&A list. */}
              {entry.intro && (
                <section
                  aria-labelledby="domain-intro-heading"
                  className="mb-7 rounded-2xl border border-border bg-background shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary dark:text-primary" />
                    <h2
                      id="domain-intro-heading"
                      className="text-[13px] font-black uppercase tracking-widest text-foreground"
                    >
                      About this page
                    </h2>
                  </div>
                  <div className="px-6 py-5">
                    <p className="text-[15px] leading-7 text-foreground">
                      {entry.intro}
                    </p>
                  </div>
                </section>
              )}

              {/* Trust row */}
              <div className="mb-6 flex items-center gap-3 flex-wrap text-[12px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span>Reviewed by senior engineers</span>
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                  <span>Updated for {new Date().getFullYear()}</span>
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-primary dark:text-primary" />
                  <span>Free · No sign-up required</span>
                </span>
              </div>

              {/* Related pillar chips — shows every pillar this module belongs
                  to, so someone landing via a search for e.g. "spring security
                  interview questions" sees that it's part of both /security and
                  /spring and can cross-navigate */}
              {relatedPillarHubs.length > 0 && (
                <div className="mb-6 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Part of
                  </span>
                  {relatedPillarHubs.map((p) => (
                    <Link
                      key={p.pillarSlug}
                      href={`/${p.pillarSlug}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-primary dark:text-primary text-[12px] font-bold hover:bg-blue-100 dark:bg-blue-950/20 transition-colors"
                    >
                      <Sparkles className="h-3 w-3" />
                      {p.title.replace(/\s+Interview Prep.*$/, "")}
                    </Link>
                  ))}
                </div>
              )}

              {/* Top-asked spotlight — 5 most-representative questions (one
                  per topic) in a scannable card layout. Designed for the
                  visitor who won't scroll — they get tap-friendly hero links
                  before the (long) accordion starts */}
              {topAsked.length > 0 && (
                <section
                  aria-labelledby="top-asked-heading"
                  className="mb-8 rounded-2xl border border-border/90 bg-background shadow-md shadow-slate-200/30 overflow-hidden ring-1 ring-slate-900/[0.03]"
                >
                  <div className="px-5 py-3.5 bg-surface border-b border-default dark:border-default/20 flex items-center gap-2">
                    <Flame className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <h2
                      id="top-asked-heading"
                      className="text-sm font-bold text-foreground tracking-tight"
                    >
                      High-signal {entry.title} questions
                    </h2>
                    <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Top {topAsked.length}
                    </span>
                  </div>
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {topAsked.map((t, idx) => (
                      <li key={t.question.slug}>
                        <Link
                          href={`/${entry.seoSlug}/${t.question.slug}`}
                          className="group flex items-start gap-3 px-5 py-3 hover:bg-primary/10 transition-colors"
                        >
                          <span className="mt-0.5 shrink-0 w-6 h-6 rounded-md dark:bg-surface text-white font-black text-[11px] flex items-center justify-center group-hover:bg-blue-600 dark:bg-blue-800 transition-colors">
                            {idx + 1}
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">
                              {t.topic}
                            </span>
                            <span className="block text-sm font-bold text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors leading-snug">
                              {t.question.title}
                            </span>
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Full question catalog — inline list (no module-level collapse).
                  `#all-questions` is linked from homepage standout cards. */}
              <section id="all-questions" className="mb-10 scroll-mt-28">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary dark:text-primary mb-1.5">
                      Full catalog
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      Every question, in reading order
                    </h2>
                    <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl leading-relaxed">
                      Topics are ordered for learning. Within each topic, rows are numbered{" "}
                      <span className="font-semibold text-foreground">1–{totalQ}</span>{" "}
                      globally so you always know where you are. Collapse topics if you want a
                      lighter view — use Expand all when you need the full list again.
                    </p>
                  </div>
                </div>
                <ModuleQuestionsAccordion
                  variant="inline"
                  seoSlug={entry.seoSlug}
                  moduleTitle={entry.title}
                  groups={topicsWithQ}
                  revision={moduleRevision}
                  totalQuestions={totalQ}
                  defaultOpen={true}
                />
              </section>

              {/* Smart cross-links — authored 3-4 next-up modules +
                  parent-pillar browse + full-roadmap CTA, unified into one
                  tree block so the reader's "what's next" path is a single
                  visual decision, not three disconnected sections. */}
              <SmartCrosslinks
                moduleTitle={entry.title}
                relatedModules={relatedModules}
                pillar={pillar}
                completeTrack={trackCta}
              />

              {/* FAQ — evergreen block, answers also feed FAQPage JSON-LD */}
              {faqBlock.length > 0 && (
                <section
                  aria-labelledby="faq-heading"
                  className="mb-8 rounded-xl border border-border bg-background shadow-sm overflow-hidden"
                >
                  <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background border-b border-border flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary dark:text-primary" />
                    <h2
                      id="faq-heading"
                      className="text-sm font-black text-foreground tracking-tight"
                    >
                      FAQs about {entry.title} interview prep
                    </h2>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {faqBlock.map((f, idx) => (
                      <details
                        key={idx}
                        className="group px-5 py-3"
                        open={idx === 0}
                      >
                        <summary className="flex items-start gap-3 cursor-pointer list-none">
                          <span className="mt-0.5 shrink-0 w-5 h-5 rounded bg-blue-50 dark:bg-blue-500/10 text-primary dark:text-primary font-black text-[10px] flex items-center justify-center group-open:bg-blue-600 group-open:text-white transition-colors">
                            Q
                          </span>
                          <span className="flex-1 text-[13px] font-bold text-foreground leading-snug">
                            {f.q}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground mt-0.5 group-open:rotate-90 transition-transform" />
                        </summary>
                        <div className="mt-2 ml-8 text-[13px] text-muted-foreground leading-relaxed">
                          {f.a}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* NOTE: The old "Related interview prep categories" section
                  and the footer roadmap CTA have both been folded into the
                  `SmartCrosslinks` block rendered higher up on this page.
                  Keeping a single unified "Continue your prep" block is
                  clearer than three separate ones, each with its own heading
                  and empty-state handling. */}
            </div>
          </main>

          {/* ── RIGHT RAIL ── (xl+) — TOC + pillar context */}
          <aside className="hidden xl:flex w-[300px] shrink-0 flex-col gap-4 self-start sticky top-6 px-4 py-6 h-[calc(100vh-1.5rem)] overflow-y-auto custom-scrollbar">
            {readingRail.length > 0 && (
              <div className="rounded-2xl border border-border/90 bg-background shadow-md shadow-slate-200/25 overflow-hidden ring-1 ring-slate-900/[0.03]">
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-r  to-white dark:to-background flex items-center gap-2">
                  <ListOrdered className="h-3.5 w-3.5 text-primary dark:text-primary shrink-0" />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Start here (Q1–Q{Math.min(20, readingRail.length)})
                  </h3>
                </div>
                <ol className="max-h-[min(52vh,28rem)] overflow-y-auto py-2 divide-y divide-slate-100 dark:divide-slate-800/60">
                  {readingRail.map((q, i) => (
                    <li key={q.slug}>
                      <Link
                        href={`/${entry.seoSlug}/${q.slug}`}
                        className="flex items-start gap-2.5 px-4 py-2 text-left hover:bg-primary/10 transition-colors group"
                      >
                        <span className="mt-0.5 flex h-6 min-w-[1.5rem] items-center justify-center rounded-md dark:bg-surface text-[10px] font-bold text-white tabular-nums group-hover:bg-blue-600 dark:bg-blue-800 shrink-0">
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide truncate">
                            {q.topicName}
                          </span>
                          <span className="block text-[12px] font-semibold text-foreground leading-snug group-hover:text-primary dark:group-hover:text-primary line-clamp-2">
                            {q.title}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
                {flatQuestions.length > 20 && (
                  <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/60 bg-surface/60">
                    <a
                      href="#all-questions"
                      className="text-[11px] font-bold text-primary dark:text-primary hover:text-primary dark:text-primary"
                    >
                      + {flatQuestions.length - 20} more in the catalog ↓
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* At-a-glance */}
            <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border bg-surface">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  At a glance
                </h3>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Module</span>
                  <span className="font-bold text-foreground truncate ml-2">
                    {entry.title}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Topics</span>
                  <span className="font-bold text-foreground">
                    {topicsWithQ.length}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Questions</span>
                  <span className="font-bold text-foreground">{totalQ}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Read time</span>
                  <span className="font-bold text-foreground inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {Math.max(3, Math.round(totalQ * 0.5))}m
                  </span>
                </div>
              </div>
            </div>

            {/* Topic TOC */}
            {topicsWithQ.length > 1 && (
              <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
                <div className="px-4 py-2.5 border-b border-border bg-surface">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Topics
                  </h3>
                </div>
                <ul className="py-2 max-h-[40vh] overflow-y-auto">
                  {topicsWithQ.map((sc, idx) => (
                    <li key={sc.slug}>
                      <a
                        href={`#${sc.slug}`}
                        className="flex items-center gap-2 px-4 py-1.5 text-xs text-muted-foreground hover:text-primary dark:text-primary hover:bg-blue-50 dark:bg-blue-500/10 transition-colors"
                      >
                        <span className="text-[10px] font-black text-muted-foreground w-5 shrink-0">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 truncate font-semibold">
                          {sc.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-primary dark:text-primary shrink-0">
                          {sc.questions.length}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pillar context */}
            {pillar && (
              <Link
                href={`/${pillar.pillarSlug}`}
                className="group rounded-xl border border-default dark:border-default/20 bg-surface to-white p-4 hover:border-default dark:border-default transition-colors  "
              >
                <div className="text-[10px] font-black uppercase tracking-widest text-primary dark:text-primary mb-1">
                  Part of
                </div>
                <div className="text-sm font-black text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors leading-snug">
                  {pillar.title.replace(/\s+Interview Prep.*$/, "")}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground leading-snug line-clamp-2">
                  {pillar.tagline}
                </div>
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-primary dark:text-primary">
                  Open category
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
