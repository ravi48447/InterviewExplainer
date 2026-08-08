import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import {
  getDSAModules,
  getDSAModule,
  getDSALearnPage,
  getDSAProblemsByModule,
  getDSAModulesWithLearnPages,
} from "@/lib/contentV2";
import { buildDSAModuleMetadata, listModuleParams } from "@/lib/dsa";
import type {
  DSALearnCallout,
  DSALearnCodeExample,
  DSALearnSection,
  DSAProblemIndex,
  DSAModule,
} from "@/lib/contentV2-types";
import {
  Home,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  Info,
  BookOpen,
  Target,
  GraduationCap,
  Flag,
  Zap,
  Clock,
  Compass,
  XCircle,
} from "lucide-react";

import CodeHighlighter from "@/components/CodeHighlighter";
import CodeLanguageTabs from "@/components/CodeLanguageTabs";
import MarkdownContent from "@/components/MarkdownContent";
import { ContentThemeProvider } from "@/components/question/ThemeContext";
import { DSACurriculumNav } from "@/components/dsa/DSACurriculumNav";
import { DSAModuleTOC } from "@/components/dsa/DSAModuleTOC";
import { DSAProblemList } from "@/components/dsa/DSAProblemRow";
import { DSAContentSections } from "@/components/dsa/DSAContentSections";
import { buildModuleContent } from "@/lib/dsaPageContent";

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";
const DSA_ROOT = path.join(process.cwd(), "..", "content", "dsa");

const LEVEL_PILL: Record<string, string> = {
  beginner: "bg-success/10 text-success border-success/30",
  intermediate: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30",
  advanced: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/30",
};

const FOCUS_PILL: Record<string, { label: string; className: string }> = {
  theory: { label: "Theory", className: "bg-primary/5 text-primary border-primary/30" },
  practice: { label: "Practice", className: "bg-primary/5 text-primary border-primary/30" },
  mixed: { label: "Mixed", className: "bg-surface text-foreground border-border" },
};

const CALLOUT_STYLE: Record<
  DSALearnCallout["type"],
  { icon: typeof Info; className: string; label: string }
> = {
  tip: {
    icon: Lightbulb,
    className: "border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-400",
    label: "Tip",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 text-rose-900 dark:text-rose-400",
    label: "Watch out",
  },
  note: {
    icon: Info,
    className: "border-primary/30 bg-primary/5 text-primary",
    label: "Note",
  },
};

function problemHasAuthoredContent(category: string, slug: string): boolean {
  try {
    return fs.existsSync(path.join(DSA_ROOT, category, `${slug}.json`));
  } catch {
    return false;
  }
}

function orderProblems(
  problems: DSAProblemIndex[],
  problemOrder?: string[],
): DSAProblemIndex[] {
  if (!problemOrder || problemOrder.length === 0) return problems;
  const bySlug = new Map(problems.map((p) => [p.slug, p]));
  const ordered: DSAProblemIndex[] = [];
  for (const slug of problemOrder) {
    const p = bySlug.get(slug);
    if (p) {
      ordered.push(p);
      bySlug.delete(slug);
    }
  }
  for (const p of bySlug.values()) ordered.push(p);
  return ordered;
}

function findNextModule(current: DSAModule): DSAModule | null {
  const modules = getDSAModules();
  const idx = modules.findIndex((m) => m.moduleSlug === current.moduleSlug);
  if (idx < 0 || idx === modules.length - 1) return null;
  return modules[idx + 1];
}

function findPrevModule(current: DSAModule): DSAModule | null {
  const modules = getDSAModules();
  const idx = modules.findIndex((m) => m.moduleSlug === current.moduleSlug);
  if (idx <= 0) return null;
  return modules[idx - 1];
}

function resolveModuleRefs(slugs: string[] = []): DSAModule[] {
  const modules = getDSAModules();
  const bySlug = new Map(modules.map((m) => [m.moduleSlug, m]));
  return slugs.map((s) => bySlug.get(s)).filter((m): m is DSAModule => !!m);
}

// ─── Next.js hooks ───────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return listModuleParams()
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const mod = getDSAModule(slug);
  if (!mod) return { title: "Module not found — InterviewExplainer" };

  const learn = getDSALearnPage(slug);
  const title =
    learn?.seo?.title ??
    `${mod.title} — Interview Questions, Theory & Java/Python Solutions`;
  const description =
    learn?.seo?.description ??
    `${mod.tagline} Module ${mod.moduleNumber} of the DSA curriculum: ${mod.shortDescription}`;

  // Canonical builder (RouteFamily dsa-module) with the learn-page SEO override.
  return {
    ...buildDSAModuleMetadata({
      moduleSlug: mod.moduleSlug,
      moduleName: mod.title,
      title,
      description,
      breadcrumbs: [],
      heroStats: [],
      problems: [],
      editorial: { overview: [], studyTips: [], pitfalls: [], faqs: [] },
      explore: [],
    }),
    title: `${title} | InterviewExplainer`,
    description,
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/**
 * Group a section's codeExamples[] into a language-switchable block.
 *
 * If the section supplies several languages for the same concept (the usual
 * case — Java + Python), collapse them into ONE tabbed widget so the reader
 * picks their language instead of scrolling past the other one.
 *
 * Edge case: the same language can appear twice in a section (e.g. Java
 * "pattern" + Java "one-liner"). We break the run on a repeat so the second
 * pass becomes its own tabbed block with its own label — otherwise the
 * later sample would silently overwrite the earlier one.
 */
function SectionCodeBlocks({ examples }: { examples: DSALearnCodeExample[] }) {
  // Split examples into runs where each language appears at most once. Each
  // run becomes one CodeLanguageTabs widget. Preserves author order.
  const groups: DSALearnCodeExample[][] = [];
  let current: DSALearnCodeExample[] = [];
  const seen = new Set<string>();
  for (const ex of examples) {
    if (seen.has(ex.language)) {
      groups.push(current);
      current = [ex];
      seen.clear();
      seen.add(ex.language);
    } else {
      current.push(ex);
      seen.add(ex.language);
    }
  }
  if (current.length) groups.push(current);

  return (
    <div className="mt-5 space-y-3">
      {groups.map((group, gi) => {
        const code: Record<string, string> = {};
        const labels: Record<string, string> = {};
        for (const ex of group) {
          code[ex.language] = ex.code;
          if (ex.label) labels[ex.language] = ex.label;
        }
        // Show the first label of the group as the widget title — keeps
        // the header informative when only one language carries a label.
        const title = group.find((g) => !!g.label)?.label;
        return (
          <CodeLanguageTabs
            key={gi}
            code={code}
            labels={labels}
            title={title}
          />
        );
      })}
    </div>
  );
}

function CalloutBox({ callout }: { callout: DSALearnCallout }) {
  const style = CALLOUT_STYLE[callout.type];
  const Icon = style.icon;
  return (
    <div className={`rounded-lg border p-4 flex items-start gap-3 ${style.className}`}>
      <Icon className="h-4 w-4 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">
          {style.label}
        </div>
        <div className="text-sm leading-relaxed">
          <MarkdownContent content={callout.text} inline />
        </div>
      </div>
    </div>
  );
}

function TheorySection({ section }: { section: DSALearnSection }) {
  return (
    <article
      id={section.id}
      className="rounded-xl border border-border bg-background p-6 mb-4 scroll-mt-24"
    >
      <h3 className="text-xl font-black text-foreground mb-4 leading-snug">
        {section.heading}
      </h3>

      <div className="max-w-none">
        <MarkdownContent content={section.body} />
      </div>

      {section.codeExamples && section.codeExamples.length > 0 && (
        <SectionCodeBlocks examples={section.codeExamples} />
      )}

      {section.callouts && section.callouts.length > 0 && (
        <div className="mt-5 space-y-3">
          {section.callouts.map((c, i) => (
            <CalloutBox key={i} callout={c} />
          ))}
        </div>
      )}
    </article>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function DSAModulePage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const mod = getDSAModule(slug);
  if (!mod) notFound();

  const learn = getDSALearnPage(slug);
  const allProblems = getDSAProblemsByModule(slug);
  const problems = orderProblems(allProblems, learn?.problemOrder);

  const nextMod = findNextModule(mod);
  const prevMod = findPrevModule(mod);
  const prereqs = resolveModuleRefs(mod.prerequisites);

  const focus = FOCUS_PILL[mod.focus] ?? FOCUS_PILL.practice;
  const levelPill = LEVEL_PILL[mod.level] ?? LEVEL_PILL.intermediate;

  const firstAuthored = problems.find((p) =>
    problemHasAuthoredContent(p.category, p.slug),
  );

  const heroTitle = learn?.title ?? mod.title;
  const heroTagline = learn?.tagline ?? mod.tagline;

  // For the left nav — curriculum + theory badges.
  const allModules = getDSAModules();
  const learnSlugs = getDSAModulesWithLearnPages();

  // Build the right-rail TOC from headings the page will actually render.
  // Keeping this in the page (not inside the TOC component) ensures the
  // anchors stay in sync with the JSX below even when the content shape
  // varies per module.
  const tocItems: { id: string; label: string }[] = [];
  if (learn) {
    tocItems.push({ id: "overview", label: "Overview" });
    if (learn.objectives?.length > 0) {
      tocItems.push({ id: "what-youll-learn", label: "What you'll learn" });
    }
    tocItems.push({ id: "when-to-use", label: "When to reach for this" });
    tocItems.push({ id: "theory", label: "Theory & deep dive" });
    for (const s of learn.sections) {
      tocItems.push({ id: s.id, label: s.heading });
    }
    if (learn.interviewTalking || learn.commonMistakes) {
      tocItems.push({ id: "interview-voice", label: "Interview talking" });
    }
    if (learn.complexityNotes) {
      tocItems.push({ id: "complexity", label: "Complexity summary" });
    }
  }
  tocItems.push({ id: "practice", label: "Practice problems" });

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
            name: heroTitle,
            item: `${SITE_URL}/dsa/module/${slug}`,
          },
        ],
      },
      {
        "@type": "LearningResource",
        name: heroTitle,
        description: heroTagline,
        url: `${SITE_URL}/dsa/module/${slug}`,
        educationalLevel: mod.level,
        learningResourceType: mod.focus === "theory" ? "Concept" : "Tutorial",
        ...(learn && {
          teaches: learn.objectives,
        }),
      },
    ],
  };

  return (
    // Light-only DSA surface — pin the content theme so theme-aware children
    // (MarkdownContent, revision panel) render the light palette rather than
    // the provider's "dark" default on these white panes.
    <ContentThemeProvider>
    <div className="min-h-screen bg-background font-sans text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Client-side syntax highlighter — colours every `<code class="hljs
          language-*">` block mounted on this page, including the ones inside
          MarkdownContent and the Java/Python tab widgets. */}
      <CodeHighlighter />

      <div className="w-full min-w-0 min-h-screen flex gap-5 px-4 py-5">

        {/* ─── LEFT SIDEBAR — DSA curriculum ─── */}
        <div className="hidden lg:block w-[280px] shrink-0 self-start sticky top-5 h-[calc(100vh-1.25rem)] overflow-y-auto custom-scrollbar">
          <DSACurriculumNav
            modules={allModules}
            learnSlugs={learnSlugs}
            activeModuleSlug={slug}
          />
        </div>

        {/* ─── MAIN COLUMN ─── */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 flex-wrap">
            <Link href="/" className="hover:text-foreground flex items-center gap-1">
              <Home className="h-3 w-3" /> Home
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <Link href="/dsa" className="hover:text-foreground">DSA</Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Module {mod.moduleNumber}</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-foreground font-medium">{mod.title}</span>
          </nav>

          {/* ─── HERO ─────────────────────────────────────────────────────── */}
          <header id="overview" className="mb-8 rounded-xl overflow-hidden scroll-mt-24 border border-border/60 bg-surface">
            <div className="px-6 sm:px-8 py-7">
              {/* Kicker */}
              <div className="flex items-center gap-2 mb-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Module {mod.moduleNumber} · DSA Curriculum
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3 leading-[1.1]">
                {heroTitle}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl mb-5">
                {heroTagline}
              </p>

              {/* Pills */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${levelPill}`}>
                  {mod.level}
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${focus.className}`}>
                  {focus.label}
                </span>
                {learn && (
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-primary/30 bg-primary/5 text-primary inline-flex items-center gap-1.5">
                    <BookOpen className="h-3 w-3" /> Full theory
                  </span>
                )}
                {prereqs.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground ml-1">
                    <Flag className="h-3 w-3" />
                    Prereq:
                    {prereqs.map((p, i) => (
                      <span key={p.moduleSlug}>
                        <Link
                          href={`/dsa/module/${p.moduleSlug}`}
                          className="font-semibold text-muted-foreground hover:text-primary hover:underline transition-colors"
                        >
                          {p.title}
                        </Link>
                        {i < prereqs.length - 1 && ", "}
                      </span>
                    ))}
                  </span>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-2.5">
                {firstAuthored && (
                  <Link
                    href={`/dsa/problem/${firstAuthored.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-colors text-sm"
                  >
                    Start practice
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                {learn && (
                  <a
                    href="#theory"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-card hover:bg-hover border border-border/60 text-foreground font-medium rounded-xl transition-colors text-sm"
                  >
                    Read the theory
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                )}
                <a
                  href="#practice"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-card hover:bg-hover border border-border/60 text-foreground font-medium rounded-xl transition-colors text-sm"
                >
                  See all problems
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </header>

          {/* ─── WHAT YOU'LL LEARN ─────────────────────────────────────────── */}
          {learn && learn.objectives.length > 0 && (
            <section id="what-youll-learn" className="mb-10 scroll-mt-24">
              <div className="rounded-xl border border-border/60 bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-black text-foreground">
                    What you&apos;ll learn
                  </h2>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  {learn.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* ─── WHEN TO USE ───────────────────────────────────────────────── */}
          {learn && (
            <section id="when-to-use" className="mb-10 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <Compass className="h-5 w-5 text-success" />
                <h2 className="text-xl font-black text-foreground">When to reach for this</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-success/30 bg-success/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-success">
                      Signals (use it)
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {learn.whenToUse.signals.map((s, i) => (
                      <li key={i} className="text-sm text-foreground leading-relaxed flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-rose-700 dark:text-rose-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                      Anti-signals (don&apos;t)
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {learn.whenToUse.antiSignals.map((s, i) => (
                      <li key={i} className="text-sm text-foreground leading-relaxed flex items-start gap-2">
                        <XCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* ─── THEORY SECTIONS ───────────────────────────────────────────── */}
          {learn ? (
            <section id="theory" className="mb-10 scroll-mt-24">
              <div className="flex items-center gap-2 mb-5">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-black text-foreground">Theory &amp; deep dive</h2>
              </div>

              {/* Intro — rendered through MarkdownContent so authors can use
                  bold, inline code, lists, etc. without changing the JSON
                  schema. */}
              <div className="rounded-xl border border-border bg-background p-6 mb-4">
                <MarkdownContent content={learn.intro} />
              </div>

              {learn.sections.map((section) => (
                <TheorySection key={section.id} section={section} />
              ))}
            </section>
          ) : (
            <section id="theory" className="mb-10 scroll-mt-24">
              <DSAContentSections
                content={buildModuleContent(
                  mod.title,
                  mod.moduleSlug,
                  {
                    total: problems.length,
                    easy: problems.filter((p) => p.difficulty === "easy").length,
                    medium: problems.filter((p) => p.difficulty === "medium").length,
                    hard: problems.filter((p) => p.difficulty === "hard").length,
                  },
                  mod.tagline,
                )}
                kicker={`${mod.title} guide`}
                heading={`How to master ${mod.title}`}
                id="theory-guide"
              />
              <div className="rounded-xl border border-dashed border-border bg-background p-5 flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  A full interactive theory walk-through for this module is on the
                  way. In the meantime, the study guide above plus the practice
                  problems below — each with multiple approaches, a line-by-line
                  walkthrough, and interview talking points — cover everything you
                  need to start.
                </p>
              </div>
            </section>
          )}

          {/* ─── INTERVIEW VOICE + COMMON MISTAKES ─────────────────────────── */}
          {learn && (learn.interviewTalking || learn.commonMistakes) && (
            <section id="interview-voice" className="mb-10 scroll-mt-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {learn.interviewTalking && (
                  <div className="rounded-xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        How to talk about this in the interview
                      </h3>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed italic">
                      &ldquo;{learn.interviewTalking}&rdquo;
                    </p>
                  </div>
                )}
                {learn.commonMistakes && learn.commonMistakes.length > 0 && (
                  <div className="rounded-xl border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-rose-700 dark:text-rose-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                        Common mistakes
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {learn.commonMistakes.map((m, i) => (
                        <li key={i} className="text-sm text-foreground leading-relaxed flex items-start gap-2">
                          <span className="text-rose-600 dark:text-rose-400 mt-0.5 shrink-0">–</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ─── COMPLEXITY NOTES ──────────────────────────────────────────── */}
          {learn?.complexityNotes && (
            <section id="complexity" className="mb-10 scroll-mt-24">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 flex items-start gap-3">
                <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">
                    Complexity summary
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {learn.complexityNotes}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ─── PRACTICE PROBLEMS ─────────────────────────────────────────── */}
          <section id="practice" className="mb-10 scroll-mt-24">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-black text-foreground">
                Practice problems
              </h2>
              <span className="ml-auto text-[11px] font-bold text-muted-foreground tabular-nums">
                {problems.length} total
              </span>
            </div>

            <DSAProblemList problems={problems} />
          </section>

          {/* ─── PREV / NEXT NAV ───────────────────────────────────────────── */}
          <section className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prevMod ? (
                <Link
                  href={`/dsa/module/${prevMod.moduleSlug}`}
                  className="group rounded-xl border border-border/60 bg-card p-5 hover:border-primary/40 hover:bg-hover transition-colors"
                >
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    <ArrowLeft className="h-3 w-3" /> Previous module
                  </div>
                  <div className="text-[14px] font-bold text-foreground group-hover:text-primary">
                    {prevMod.moduleNumber} · {prevMod.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {prevMod.tagline}
                  </div>
                </Link>
              ) : (
                <Link
                  href="/dsa"
                  className="group rounded-xl border border-border/60 bg-card p-5 hover:border-primary/40 hover:bg-hover transition-colors"
                >
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    <ArrowLeft className="h-3 w-3" /> Back to
                  </div>
                  <div className="text-[14px] font-bold text-foreground group-hover:text-primary">
                    DSA curriculum
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    See all {allModules.length} modules
                  </div>
                </Link>
              )}
              {nextMod ? (
                <Link
                  href={`/dsa/module/${nextMod.moduleSlug}`}
                  className="group rounded-xl border border-border/60 bg-card p-5 hover:border-primary/40 hover:bg-hover transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Next module <ArrowRight className="h-3 w-3" />
                  </div>
                  <div className="text-[14px] font-bold text-foreground group-hover:text-primary">
                    {nextMod.moduleNumber} · {nextMod.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {nextMod.tagline}
                  </div>
                </Link>
              ) : (
                <Link
                  href="/dsa"
                  className="group rounded-xl border border-border/60 bg-card p-5 hover:border-primary/40 hover:bg-hover transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Curriculum complete <ArrowRight className="h-3 w-3" />
                  </div>
                  <div className="text-[14px] font-bold text-foreground group-hover:text-primary">
                    Back to DSA hub
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Pick any module to revise
                  </div>
                </Link>
              )}
            </div>
          </section>
        </main>

        {/* ─── RIGHT SIDEBAR — On this page + meta ─── */}
        <aside className="hidden xl:flex w-[260px] shrink-0 flex-col self-start sticky top-5 h-[calc(100vh-1.25rem)] overflow-y-auto custom-scrollbar">
          <DSAModuleTOC
            items={tocItems}
            meta={{
              level: mod.level,
              focus: mod.focus,
              problemCount: problems.length,
              theoryCount: learn?.sections.length ?? 0,
            }}
          />
        </aside>
      </div>
    </div>
    </ContentThemeProvider>
  );
}
