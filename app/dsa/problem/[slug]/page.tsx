import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import {
  ArrowRight,
  BookOpen,
  Brain,
  BrainCircuit,
  Code2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  Flame,
  HelpCircle,
  Lightbulb,
  ListChecks,
  Scale,
  ShieldAlert,
  Sparkles,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import {
  getDSAIndex,
  getDSAProblemBySlug,
  getDSAProblemsByModule,
  getDSAModule,
  getDSAByPattern,
  getBasic100Slugs,
} from "@/lib/contentV2";
import type { DSAApproach, DSADiagram as DSADiagramType, DSARevision } from "@/lib/contentV2-types";
import MarkdownContent from "@/components/MarkdownContent";
import { CodeWalkthrough } from "@/components/dsa/CodeWalkthrough";
import { CodePlayground } from "@/components/dsa/CodePlayground";
import { DSALangToggle } from "@/components/dsa/DSALangToggle";
import { DSADryRun } from "@/components/dsa/DSADryRun";
import { DSADiagram } from "@/components/dsa/DSADiagram";
import { InteractiveDecisionTree } from "@/components/dsa/interactive/InteractiveDecisionTree";
import { DSAProblemTwoPaneShell } from "@/components/dsa/DSAProblemTwoPaneShell";
import { DSABreadcrumb } from "@/components/dsa/DSABreadcrumb";
import { DSAPill, DifficultyPill } from "@/components/dsa/DSAPills";
import { ProblemSidebar } from "@/components/dsa/ProblemSidebar";
import { cn } from "@/lib/utils";
import { resolveContentRoot } from "@/lib/content-paths";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";
const DSA_ROOT = path.join(resolveContentRoot(), "dsa");

export const revalidate = 3600;

function toDisplayName(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function problemHasAuthoredContent(category: string, slug: string): boolean {
  try {
    return fs.existsSync(path.join(DSA_ROOT, category, `${slug}.json`));
  } catch {
    return false;
  }
}

const FREQUENCY_META: Record<
  string,
  { label: string; tone: "amber" | "red" | "slate" }
> = {
  "very-high": { label: "Asked very often", tone: "red" },
  high: { label: "Frequently asked", tone: "amber" },
  medium: { label: "Sometimes asked", tone: "slate" },
  low: { label: "Rarely asked", tone: "slate" },
};

function getOptimalApproachIndex(approaches: DSAApproach[]): number {
  const explicit = approaches.findIndex((approach) => /\boptimal\b/i.test(approach.name));
  return explicit >= 0 ? explicit : Math.max(0, approaches.length - 1);
}

type LearningTone = "teal" | "violet" | "indigo" | "emerald" | "rose" | "amber";

function LearningSectionHeader({
  number,
  eyebrow,
  title,
  description,
  tone,
  action,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  tone: LearningTone;
  action?: React.ReactNode;
}) {
  const tones: Record<LearningTone, { shell: string; badge: string; eyebrow: string }> = {
    teal: { shell: "border-blue-100 bg-blue-50/35", badge: "border-blue-200 bg-white/90 text-blue-700", eyebrow: "text-blue-700" },
    violet: { shell: "border-blue-100 bg-blue-50/30", badge: "border-blue-200 bg-white/90 text-blue-700", eyebrow: "text-blue-700" },
    indigo: { shell: "border-blue-100 bg-blue-50/30", badge: "border-blue-200 bg-white/90 text-blue-700", eyebrow: "text-blue-700" },
    emerald: { shell: "border-green-100 bg-green-50/35", badge: "border-green-200 bg-white/90 text-green-700", eyebrow: "text-green-700" },
    rose: { shell: "border-orange-100 bg-orange-50/30", badge: "border-orange-200 bg-white/90 text-orange-700", eyebrow: "text-orange-700" },
    amber: { shell: "border-orange-100 bg-orange-50/35", badge: "border-orange-200 bg-white/90 text-orange-700", eyebrow: "text-orange-700" },
  };
  const selected = tones[tone];
  return (
    <div className={cn("mb-4 flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-sm sm:px-5", selected.shell)}>
      <span className={cn("flex h-10 min-w-10 shrink-0 items-center justify-center rounded-xl border px-2 font-mono text-sm font-black", selected.badge)}>
        {number}
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn("text-[10px] font-black uppercase tracking-[0.15em]", selected.eyebrow)}>{eyebrow}</p>
        <h2 className="mt-0.5 text-[18px] font-black leading-tight text-slate-900 sm:text-[20px]">{title}</h2>
        {description && <p className="mt-0.5 text-[12px] leading-relaxed text-slate-600 sm:text-[13px]">{description}</p>}
      </div>
      {action && <div className="ml-auto shrink-0">{action}</div>}
    </div>
  );
}

function ExpandPrompt({ openLabel, closeLabel }: { openLabel: string; closeLabel: string }) {
  return (
    <span className="mt-2 flex justify-center">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-600 shadow-sm transition-colors group-hover:border-blue-200 group-hover:text-blue-700">
        <span className="group-open:hidden">{openLabel}</span>
        <span className="hidden group-open:inline">{closeLabel}</span>
        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-open:rotate-180" />
      </span>
    </span>
  );
}

function getDecisionTreePreview(diagrams?: DSADiagramType[]) {
  const mermaid = diagrams?.find(
    (diagram): diagram is Extract<DSADiagramType, { type: "mermaid" }> =>
      diagram.type === "mermaid" && /[A-Za-z][\w-]*\s*\{\s*"[^"]+"\s*\}/.test(diagram.source),
  );
  if (!mermaid) return null;
  const clean = (value: string) => value
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const goal = mermaid.source.match(/^\s*[A-Za-z][\w-]*\s*\[\s*"([^"]+)"/m)?.[1];
  const decision = mermaid.source.match(/([A-Za-z][\w-]*)\s*\{\s*"([^"]+)"\s*\}/);
  if (!decision) return null;
  const decisionId = decision[1];
  const branches = mermaid.source
    .split("\n")
    .filter((line) => new RegExp(`^\\s*${decisionId}\\s+--`).test(line))
    .map((line) => line.match(/-->\|([^|]+)\|/)?.[1] ?? line.match(/--\s+"?(.+?)"?\s+-->/)?.[1])
    .filter((label): label is string => Boolean(label))
    .map(clean)
    .slice(0, 2);
  return {
    goal: clean(goal ?? "Problem constraints"),
    decision: clean(decision[2]),
    branches: branches.length ? branches : ["Yes", "No"],
  };
}

export async function generateStaticParams() {
  const index = getDSAIndex();
  const slugs = new Set<string>((index?.problems ?? []).map((p) => p.slug));
  for (const s of getBasic100Slugs()) slugs.add(s);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const problem = getDSAProblemBySlug(slug);
  if (!problem) return { title: "Problem Not Found | InterviewExplainer" };

  const rawTitle =
    problem.seo?.metaTitle ??
    `${problem.title} — Line-by-Line Solution in Java & Python`;
  const title = rawTitle.replace(/\s*\|\s*InterviewExplainer\s*$/i, "");
  const description =
    problem.seo?.metaDescription ??
    `${problem.title} solved with ${problem.approaches.length} approaches. Line-by-line code walkthrough in Java and Python with interview talking points.`;

  return {
    title: `${title} | InterviewExplainer`,
    description,
    alternates: { canonical: `${SITE_URL}/dsa/problem/${slug}` },
    openGraph: {
      title: `${problem.title} — DSA Walkthrough`,
      description,
      type: "article",
    },
  };
}

export default async function DSAProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = getDSAProblemBySlug(slug);
  if (!problem) notFound();

  const index = getDSAIndex();
  const indexEntry = index?.problems.find((p) => p.slug === slug);
  const moduleSlug = indexEntry?.moduleSlug;
  const mod = moduleSlug ? getDSAModule(moduleSlug) : null;

  const siblings = moduleSlug ? getDSAProblemsByModule(moduleSlug) : [];
  const siblingIdx = siblings.findIndex((p) => p.slug === slug);
  const prev = siblingIdx > 0 ? siblings[siblingIdx - 1] : null;
  const next =
    siblingIdx >= 0 && siblingIdx < siblings.length - 1
      ? siblings[siblingIdx + 1]
      : null;

  const followupVariations = problem.followupVariations.map((fv) => ({
    ...fv,
    authored: problem.category
      ? problemHasAuthoredContent(problem.category, fv.slug)
      : false,
  }));

  const followupSlugs = new Set(followupVariations.map((fv) => fv.slug));
  const relatedByPattern = (problem.patterns ?? [])
    .flatMap((p) => getDSAByPattern(p))
    .filter((p) => p.slug !== slug && !followupSlugs.has(p.slug))
    .filter((p) => problemHasAuthoredContent(p.category, p.slug))
    .filter((p, i, arr) => arr.findIndex((q) => q.slug === p.slug) === i)
    .slice(0, 6);

  const canonicalUrl = `${SITE_URL}/dsa/problem/${slug}`;
  const optimalApproachIndex = getOptimalApproachIndex(problem.approaches);
  const optimal = problem.approaches[optimalApproachIndex];
  const decisionTreePreview = getDecisionTreePreview(problem.diagrams);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "DSA", item: `${SITE_URL}/dsa` },
          ...(mod
            ? [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: mod.title,
                  item: `${SITE_URL}/dsa/module/${mod.moduleSlug}`,
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: problem.title,
                  item: canonicalUrl,
                },
              ]
            : [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: toDisplayName(problem.category),
                  item: `${SITE_URL}/dsa/${problem.category}`,
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: problem.title,
                  item: canonicalUrl,
                },
              ]),
        ],
      },
      {
        "@type": "TechArticle",
        headline: `${problem.title} — Line-by-Line Solution`,
        programmingLanguage: ["Java", "Python"],
        proficiencyLevel:
          problem.difficulty === "easy"
            ? "Beginner"
            : problem.difficulty === "medium"
              ? "Intermediate"
              : "Advanced",
        url: canonicalUrl,
      },
      ...(problem.approaches.length >= 2
        ? [
            {
              "@type": "FAQPage",
              mainEntity: problem.approaches.map((a) => ({
                "@type": "Question",
                name: `How do you solve ${problem.title} using the ${a.name} approach?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: [
                    a.whenToMention ? `When to use it: ${a.whenToMention}` : "",
                    a.explanation,
                    `Time complexity: ${a.complexity.time}. Space complexity: ${a.complexity.space}.`,
                  ]
                    .filter(Boolean)
                    .join(" "),
                },
              })),
            },
          ]
        : []),
    ],
  };

  const breadcrumbTrail = mod
    ? [
        { label: mod.title, href: `/dsa/module/${mod.moduleSlug}` },
        { label: problem.title },
      ]
    : [
        {
          label: toDisplayName(problem.category),
          href: `/dsa/${problem.category}`,
        },
        { label: problem.title },
      ];

  const freq = problem.frequency
    ? FREQUENCY_META[problem.frequency]
    : undefined;

  const hasMistakes =
    problem.commonMistakes.length > 0 ||
    (problem.commonMistakesDetailed?.length ?? 0) > 0;

  const moduleHref = mod
    ? `/dsa/module/${mod.moduleSlug}`
    : `/dsa/${problem.category}`;
  const moduleLabel = mod ? mod.title : toDisplayName(problem.category);

  // ─── Build left pane content ───────────────────────────────────────
  const leftPane = (
    <div className="pb-8">
      {/* Compact header */}
      <header className="mb-5">
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <DifficultyPill difficulty={problem.difficulty} />
          <DSAPill label={toDisplayName(problem.category)} tone="violet" />
          {problem.leetcodeNumber && (
            <DSAPill label={`LC #${problem.leetcodeNumber}`} tone="slate" />
          )}
          {freq && (
            <span
              className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              <Flame className="h-2.5 w-2.5" />
              {freq.label}
            </span>
          )}
        </div>
        <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
          <h1 className="text-2xl sm:text-[28px] font-black text-foreground leading-[1.1] tracking-tight">
            {problem.title}
          </h1>
          {problem.leetcodeNumber && (
            <a
              href={`https://leetcode.com/problems/${problem.leetcodeSlug ?? problem.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#ffa116] hover:bg-[#ff8a00] text-foreground font-bold text-xs shadow-sm border border-[#e59400] transition-all shrink-0"
            >
              <span className="inline-flex items-center justify-center h-4 w-4 rounded dark:bg-surface text-[#ffa116] font-black text-[9px]">
                LC
              </span>
              Practice
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {moduleLabel}
          {siblingIdx >= 0 && siblings.length > 0 && (
            <>
              {" · "}
              <span className="font-semibold text-muted-foreground">
                {siblingIdx + 1} of {siblings.length}
              </span>
            </>
          )}
          {problem.readingTimeMinutes && (
            <>
              {" · "}
              <span className="inline-flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />
                {problem.readingTimeMinutes} min
              </span>
            </>
          )}
        </p>
      </header>

      {/* Problem statement */}
      <div className="mb-5 space-y-4">
        <div className="prose porange-slate max-w-none porange-p:text-[15px] porange-p:leading-[1.8] porange-p:text-foreground porange-p:mb-3 porange-p:last:mb-0 porange-code:text-sm porange-code:font-mono porange-code:text-foreground porange-code:bg-surface porange-code:border porange-code:border-border porange-code:rounded porange-code:px-1.5 porange-code:py-0.5 porange-code:font-semibold porange-strong:text-foreground porange-strong:font-bold porange-em:text-blue-800 dark:text-blue-400 porange-em:font-semibold porange-em:not-italic">
          <MarkdownContent content={problem.problemStatement} />
        </div>

        {problem.understanding && (
          <div className="rounded-lg border border-slate-200 border-l-4 border-l-blue-400 bg-slate-50/70 px-4 py-3">
            <p className="text-xs font-black uppercase tracking-widest text-blue-700 mb-1 flex items-center gap-1.5">
              <Lightbulb className="h-3 w-3" />
              In plain English
            </p>
            <p className="text-[13.5px] text-foreground leading-[1.7]">
              {problem.understanding}
            </p>
          </div>
        )}
      </div>

      {/* Examples */}
      {problem.examples.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
            <ListChecks className="h-3 w-3" />
            Examples
          </p>
          <div className="space-y-2">
            {problem.examples.map((ex, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-surface/70 overflow-hidden"
              >
                <div className="px-3 py-1 bg-slate-200/70 dark:bg-slate-800/60 border-b border-border">
                  <span className="text-xs font-black uppercase tracking-widest text-foreground">
                    Example {i + 1}
                  </span>
                </div>
                <dl className="px-3 py-2.5 space-y-1 font-mono text-[13.5px] leading-[1.6]">
                  <div className="flex items-start gap-2">
                    <dt className="shrink-0 w-[72px] text-xs font-black uppercase tracking-widest text-sky-700 dark:text-sky-400 pt-[2px]">
                      Input
                    </dt>
                    <dd className="text-foreground break-all">{ex.input}</dd>
                  </div>
                  <div className="flex items-start gap-2">
                    <dt className="shrink-0 w-[72px] text-xs font-black uppercase tracking-widest text-green-700 dark:text-green-400 pt-[2px]">
                      Output
                    </dt>
                    <dd className="text-foreground break-all">{ex.output}</dd>
                  </div>
                  {ex.explanation && (
                    <div className="flex items-start gap-2 pt-1 border-t border-border mt-1">
                      <dt className="shrink-0 w-[72px] text-xs font-black uppercase tracking-widest text-muted-foreground pt-[2px]">
                        Note
                      </dt>
                      <dd className="text-foreground font-sans italic text-[13.5px]">
                        {ex.explanation}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constraints */}
      {problem.constraints.length > 0 && (
        <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50/55 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-widest text-slate-600 mb-2 flex items-center gap-1.5">
            <ShieldAlert className="h-3 w-3" />
            Constraints
          </p>
          <ul className="space-y-1">
            {problem.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-mono text-foreground">
                <span className="mt-[9px] h-1 w-1 rounded-full bg-slate-500 dark:bg-slate-800 shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Clarifying questions */}
      {problem.clarifyingQuestions && problem.clarifyingQuestions.length > 0 && (
        <details
          className="mb-5 rounded-lg border border-slate-200 bg-slate-50/45 group overflow-hidden"
        >
          <summary className="cursor-pointer list-none px-4 py-2.5 hover:bg-slate-100/70 transition-colors">
            <span className="flex items-center justify-between gap-3">
              <span className="text-sm font-black text-foreground flex items-center gap-2">
                <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
                Clarifying questions
                <span className="inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full bg-slate-200 text-slate-700 text-xs font-black">
                  {problem.clarifyingQuestions.length}
                </span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500 transition-transform duration-150 group-open:rotate-180" />
            </span>
            <span className="mt-1.5 block truncate pl-5 text-[11px] text-slate-600 group-open:hidden">
              First question: {problem.clarifyingQuestions[0].question}
            </span>
            <ExpandPrompt openLabel="Explore questions" closeLabel="Hide questions" />
          </summary>
          <ul className="divide-y divide-border border-t border-border">
            {problem.clarifyingQuestions.map((qa, i) => (
              <li key={i} className="px-4 py-2.5 bg-background">
                <p className="text-sm font-bold text-foreground leading-snug flex items-start gap-1.5">
                  <span className="text-blue-600 font-black">Q{i + 1}.</span>
                  <span>{qa.question}</span>
                </p>
                <p className="text-[13.5px] text-muted-foreground leading-[1.65] mt-1 pl-[26px] border-l-2 border-border ml-1">
                  {qa.answer}
                </p>
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* Sidebar nav (companies, module siblings, prev/next) */}
      <div className="mt-6 pt-6 border-t border-border">
        <ProblemSidebar
          backHref={moduleHref}
          backLabel={moduleLabel}
          currentSlug={slug}
          siblings={siblings.map((s) => ({ slug: s.slug, title: s.title }))}
          difficulty={problem.difficulty}
          optimalComplexity={optimal ? optimal.complexity : undefined}
          frequencyLabel={freq?.label}
          readingTimeMinutes={problem.readingTimeMinutes}
          companies={problem.companies}
          prev={prev ? { slug: prev.slug, title: prev.title } : null}
          next={next ? { slug: next.slug, title: next.title } : null}
        />
      </div>
    </div>
  );

  return (
    <DSAProblemTwoPaneShell jsonLd={jsonLd} leftPane={leftPane} rightPane={
      <article className="pb-16">
        <DSABreadcrumb trail={breadcrumbTrail} />

        {problem.remember && (
          <div className="-mt-1 mb-4 flex justify-end">
            <a
              href="#quick-revision"
              className="inline-flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-900 px-3.5 py-2.5 text-[10.5px] font-black uppercase tracking-[0.1em] text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <BookOpen className="h-3.5 w-3.5" /> Quick interview revision
            </a>
          </div>
        )}

        {/* ─── ZONE 1 · 30-SECOND ANSWER ─────────────────────────────── */}
        {problem.directAnswer && (
          <section aria-label="Quick answer" className="mb-6">
            <LearningSectionHeader
              number="01"
              eyebrow="Understand"
              title="30-second explanation"
              description="Build the interview-ready mental model before comparing implementations."
              tone="teal"
            />
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="px-5 py-5 sm:px-6">
                <p className="text-[16px] font-medium leading-[1.8] text-slate-800">
                  {problem.directAnswer}
                </p>
                {problem.interviewerIntent && (
                  <details className="group mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/45">
                    <summary className="cursor-pointer list-none px-4 py-3 rounded-t-lg hover:bg-slate-100/70 transition-colors">
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                          <Target className="h-3.5 w-3.5" />
                          Interview context
                        </span>
                      </span>
                      <span className="mt-2 flex flex-wrap gap-1.5 group-open:hidden">
                        <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[9px] font-bold text-slate-600">What is tested</span>
                        <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[9px] font-bold text-slate-600">Where candidates slip</span>
                        <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[9px] font-bold text-slate-600">How to stand out</span>
                      </span>
                      <ExpandPrompt openLabel="Explore interview context" closeLabel="Hide interview context" />
                    </summary>
                    <div className="border-t border-border px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <IntentBlock
                        tone="blue"
                        icon={<Target className="h-4 w-4" />}
                        label="What's being tested"
                        text={problem.interviewerIntent.testing}
                      />
                      <IntentBlock
                        tone="rose"
                        icon={<ShieldAlert className="h-4 w-4" />}
                        label="Where candidates slip"
                        text={problem.interviewerIntent.commonMistake}
                      />
                      <IntentBlock
                        tone="emerald"
                        icon={<Trophy className="h-4 w-4" />}
                        label="How to stand out"
                        text={problem.interviewerIntent.toStandOut}
                      />
                    </div>
                  </details>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ─── ZONE 2 · CHOOSE AN APPROACH ──────────────────────────── */}
        <section className="mb-8">
          <LearningSectionHeader
            number="02"
            eyebrow="Choose"
            title="Compare the available approaches"
            description="Use constraints and trade-offs to select the route you can defend in an interview."
            tone="violet"
          />

          {/* Approaches at a glance — a compact comparison row so
              the reader sees the full solution space before diving
              into any single block. LeetCode editorials open with
              this kind of summary; readers use it to decide which
              approach they want to drill into first. */}
          {problem.approaches.length > 1 && (
            <div className="mb-6 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 flex items-center gap-2">
                <Scale className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-600">
                  Approaches at a glance
                </span>
                <span className="ml-auto text-[11px] text-muted-foreground italic">
                  Compare before you dive in
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                      <th className="px-4 py-2 w-10">#</th>
                      <th className="px-4 py-2">Approach</th>
                      <th className="px-3 py-2 whitespace-nowrap">Time</th>
                      <th className="px-3 py-2 whitespace-nowrap">Space</th>
                      <th className="px-4 py-2 hidden md:table-cell">
                        When to mention
                      </th>
                      <th className="px-3 py-2 text-right">Jump</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {problem.approaches.map((a, i) => {
                      const isOptimal = i === optimalApproachIndex;
                      return (
                        <tr
                          key={i}
                          className={cn(
                            "align-top text-sm",
                            isOptimal
                              ? "bg-green-50/45 hover:bg-green-50/65"
                              : "hover:bg-slate-50/70",
                          )}
                        >
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "inline-flex items-center justify-center h-6 w-6 rounded-md font-black text-sm font-mono border-2",
                                isOptimal
                                  ? "bg-green-600 text-white border-green-700"
                                  : "bg-slate-100 text-slate-700 border-slate-300",
                              )}
                            >
                              {i + 1}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-foreground">
                                {a.name}
                              </span>
                              {isOptimal && (
                                <span className="inline-flex items-center gap-1 text-[9.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-green-200 bg-green-50 text-green-700">
                                  <Trophy className="h-2.5 w-2.5" />
                                  Optimal
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <code
                              className={cn(
                                "font-mono font-bold text-sm px-1.5 py-0.5 rounded border",
                                isOptimal
                                  ? "bg-green-50 text-green-900 border-green-200"
                                  : "bg-slate-50 text-slate-700 border-slate-200",
                              )}
                            >
                              {a.complexity.time}
                            </code>
                          </td>
                          <td className="px-3 py-3">
                            <code
                              className={cn(
                                "font-mono font-bold text-sm px-1.5 py-0.5 rounded border",
                                isOptimal
                                  ? "bg-green-50 text-green-900 border-green-200"
                                  : "bg-slate-50 text-slate-700 border-slate-200",
                              )}
                            >
                              {a.complexity.space}
                            </code>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-[13.5px] italic hidden md:table-cell leading-snug">
                            {a.whenToMention ?? "—"}
                          </td>
                          <td className="px-3 py-3 text-right">
                            <a
                              href={`#approach-${i + 1}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline"
                            >
                              Read
                              <ArrowRight className="h-3 w-3" />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {problem.diagrams && problem.diagrams.length > 0 && (
            <details
              className="group mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow open:shadow-md"
            >
              <summary className="block cursor-pointer list-none bg-slate-50/70 px-4 py-4 transition-colors hover:bg-slate-100/70 sm:px-5">
                <span className="flex items-center gap-3">
                  <span className="relative h-11 w-14 shrink-0" aria-hidden="true">
                    <span className="absolute left-[19px] top-0 h-4 w-5 rounded border border-blue-400 bg-white" />
                    <span className="absolute left-[28px] top-4 h-2.5 w-px bg-blue-300" />
                    <span className="absolute left-[10px] top-[25px] h-px w-[37px] bg-blue-300" />
                    <span className="absolute left-[10px] top-[25px] h-2.5 w-px bg-blue-300" />
                    <span className="absolute left-[46px] top-[25px] h-2.5 w-px bg-blue-300" />
                    <span className="absolute bottom-0 left-0 h-3 w-5 rounded border border-green-400 bg-white" />
                    <span className="absolute bottom-0 right-0 h-3 w-5 rounded border border-blue-300 bg-white" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-blue-700">
                      Interactive decision tree
                      <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[8px] tracking-[0.12em] text-slate-500">Interactive</span>
                    </span>
                    <span className="mt-0.5 block text-[14px] font-black text-slate-900">
                      Choose the right approach
                    </span>
                    <span className="mt-0.5 hidden text-xs text-slate-600 sm:block">
                      Follow the branches and learn why each constraint changes the solution.
                    </span>
                  </span>
                </span>

                {decisionTreePreview && (
                  <span className="relative mt-3 block overflow-hidden rounded-xl border border-slate-200 bg-white px-3 pb-3 pt-2.5 shadow-inner group-open:hidden">
                    <span className="block text-center text-[9px] font-black uppercase tracking-[0.12em] text-slate-500">
                      First decision preview
                    </span>
                    <span className="mt-2 flex flex-col items-center">
                      <span className="max-w-[260px] rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-center text-[9px] font-bold text-slate-700">
                        {decisionTreePreview.goal}
                      </span>
                      <span className="h-2.5 w-px bg-blue-300" />
                      <span className="max-w-[280px] rounded-lg border border-blue-200 bg-blue-50/65 px-3 py-1.5 text-center text-[10px] font-black text-slate-800">
                        {decisionTreePreview.decision}
                      </span>
                      <span className="h-2 w-px bg-blue-300" />
                      <span className="h-px w-36 bg-blue-300" />
                      <span className="flex w-36 justify-between">
                        {decisionTreePreview.branches.map((branch, branchIndex) => (
                          <span key={`${branch}-${branchIndex}`} className="flex w-14 flex-col items-center">
                            <span className="h-2 w-px bg-blue-300" />
                            <span className="w-full rounded-md border border-slate-200 bg-white px-1.5 py-1 text-center text-[9px] font-bold text-blue-700 shadow-sm">
                              {branch}
                            </span>
                          </span>
                        ))}
                      </span>
                    </span>
                  </span>
                )}
                <ExpandPrompt openLabel="Explore the full tree" closeLabel="Collapse the tree" />
              </summary>
              <div className="border-t border-slate-200 bg-slate-50/40 p-3 sm:p-4">
                {problem.diagrams.map((d, i) => d.type === "mermaid" ? (
                  <InteractiveDecisionTree
                    key={i}
                    diagram={d}
                    optimal={optimal ? {
                      name: optimal.name,
                      time: optimal.complexity.time,
                      space: optimal.complexity.space,
                    } : undefined}
                  />
                ) : (
                  <DSADiagram key={i} diagram={d} />
                ))}
              </div>
            </details>
          )}

        </section>

        {/* ─── ZONE 3 · LEARN AND TRACE ─────────────────────────────── */}
        <section className="mb-8">
          <LearningSectionHeader
            number="03"
            eyebrow="Learn & trace"
            title="Build each solution step by step"
            description="Move from the core idea to a visual trace, implementation, proof, and edge cases."
            tone="indigo"
            action={<DSALangToggle />}
          />
          <div className="space-y-6">
            {problem.approaches.map((approach, i) => (
              <ApproachBlock
                key={i}
                index={i + 1}
                total={problem.approaches.length}
                approach={approach}
                isOptimal={i === optimalApproachIndex}
                fallbackDiagram={i === optimalApproachIndex ? problem.diagrams?.[0] : undefined}
              />
            ))}
          </div>
        </section>

        {/* ─── ZONE 5 · CODE PLAYGROUND ─────────────────────────────── */}
        {(() => {
          // Prefer the authored optimal approach, then fall back to another
          // approach only when that language is missing from the optimal one.
          const starterCode: Record<string, string> = {};
          const langs = ["java", "python", "javascript", "cpp"];
          const approachPriority = [
            problem.approaches[optimalApproachIndex],
            ...problem.approaches.filter((_, index) => index !== optimalApproachIndex).reverse(),
          ];
          for (const lang of langs) {
            for (const approach of approachPriority) {
              const src = (approach?.code as Record<string, string> | undefined)?.[lang];
              if (src) { starterCode[lang] = src; break; }
            }
          }
          if (Object.keys(starterCode).length === 0) return null;
          const defaultStdin = problem.examples[0]
            ? `${problem.examples[0].input}`
            : "";
          const previewCode = (starterCode.java ?? Object.values(starterCode)[0] ?? "")
            .split("\n")
            .slice(0, 5)
            .join("\n");
          return (
            <section className="mb-8">
              <LearningSectionHeader
                number="04"
                eyebrow="Practice"
                title="Try the solution yourself"
                description="Edit the optimal implementation, test another input, and observe the result."
                tone="emerald"
              />
              <details className="group overflow-hidden rounded-xl border border-slate-300 bg-slate-950 shadow-lg">
                <summary className="cursor-pointer list-none bg-slate-950 px-4 py-3 text-slate-100 hover:bg-slate-900">
                  <span className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-300">
                      <Code2 className="h-4 w-4" /> Editable code preview
                    </span>
                  </span>
                  <span className="mt-2 block max-h-[92px] overflow-hidden whitespace-pre rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 font-mono text-[10px] leading-[1.55] text-slate-400 group-open:hidden">{previewCode}</span>
                  <ExpandPrompt openLabel="Explore the playground" closeLabel="Close the playground" />
                </summary>
                <div className="border-t border-slate-800 bg-slate-900 p-2 sm:p-3">
                  <CodePlayground
                    starterCode={starterCode}
                    defaultStdin={defaultStdin}
                  />
                </div>
              </details>
            </section>
          );
        })()}

        {/* ─── ZONE 6 · COMMON MISTAKES ─────────────────────────────── */}
        {hasMistakes && (
          <section className="mb-8">
            <LearningSectionHeader
              number="05"
              eyebrow="Avoid mistakes"
              title="Recognize the interview traps"
              description="Understand why common attempts fail before reviewing the corrected implementation."
              tone="rose"
            />
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/40 p-4 shadow-sm">
              {problem.commonMistakesDetailed &&
              problem.commonMistakesDetailed.length > 0 ? (
                <div className="space-y-3">
                  {problem.commonMistakesDetailed.map((m, i) => (
                    <details
                      key={i}
                      className="rounded-lg border border-slate-200 bg-white group overflow-hidden shadow-sm"
                    >
                      <summary className="cursor-pointer list-none px-4 py-3 hover:bg-slate-50 transition-colors">
                        <div className="min-w-0 flex items-start gap-3">
                          <span className="shrink-0 mt-0.5 h-7 w-7 rounded-md bg-orange-100 text-orange-700 text-sm font-black font-mono flex items-center justify-center border border-orange-300">
                            {i + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[14.5px] font-bold text-foreground leading-snug">
                              {m.title}
                            </p>
                            <p className="text-[13.5px] text-foreground leading-[1.65] mt-1">
                              {m.why}
                            </p>
                          </div>
                        </div>
                        {(m.bad || m.good) && <ExpandPrompt openLabel="Explore the code comparison" closeLabel="Hide the code comparison" />}
                      </summary>
                      {(m.bad || m.good) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-slate-700 border-t border-orange-200 bg-slate-950 text-slate-100">
                          {m.bad && (
                            <div>
                              <p className="px-3 py-1.5 text-xs font-black uppercase tracking-widest text-orange-200 bg-orange-950/60 border-b border-orange-900 flex items-center gap-1.5">
                                <XCircle className="h-3.5 w-3.5" />
                                Don't write this
                              </p>
                              <pre className="m-0 px-4 py-3 text-[13.5px] leading-[1.7] overflow-x-auto font-mono">
                                <code className={`hljs language-${m.lang ?? "java"}`}>
                                  {m.bad}
                                </code>
                              </pre>
                            </div>
                          )}
                          {m.good && (
                            <div>
                              <p className="px-3 py-1.5 text-xs font-black uppercase tracking-widest text-green-200 bg-green-950/50 border-b border-green-900 flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Write this instead
                              </p>
                              <pre className="m-0 px-4 py-3 text-[13.5px] leading-[1.7] overflow-x-auto font-mono">
                                <code className={`hljs language-${m.lang ?? "java"}`}>
                                  {m.good}
                                </code>
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </details>
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {problem.commonMistakes.map((m, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[14.5px] text-foreground leading-[1.65]"
                    >
                      <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-800 shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* Consolidate after the learner has traced, practised, and reviewed mistakes. */}
        {problem.remember && <RevisionCard remember={problem.remember} />}

        {/* ─── ZONE 7 · CONTINUE THE PATTERN ───────────────────────── */}
        {(problem.patternNote || followupVariations.length > 0 || relatedByPattern.length > 0) && (
          <LearningSectionHeader
            number="07"
            eyebrow="Continue"
            title="Transfer the pattern to another problem"
            description="Use a direct variation or pattern sibling to prove the idea is reusable."
            tone="violet"
          />
        )}

        {problem.patternNote && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/55 px-4 py-3">
            <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-[13.5px] text-foreground leading-[1.65]">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700 mr-1.5">
                Transferable pattern
              </span>
              {problem.patternNote}
            </p>
          </div>
        )}

        {(followupVariations.length > 0 || relatedByPattern.length > 0) && (
          <section className="mb-8">
            <h3 className="text-[16px] font-black text-foreground mb-3 flex items-baseline gap-2">
              Practice queue
              <span className="text-sm font-medium text-muted-foreground">
                Direct variations and pattern siblings
              </span>
            </h3>

            {followupVariations.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Direct follow-ups
                </p>
                <ul className="space-y-2">
                  {followupVariations.map((fv) =>
                    fv.authored ? (
                      <li key={fv.slug}>
                        <Link
                          href={`/dsa/problem/${fv.slug}`}
                          className="group flex items-start gap-3 p-3 rounded-lg border border-border bg-background hover:border-blue-200 hover:bg-slate-50 hover:shadow-sm transition-all"
                        >
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 mt-1 shrink-0" />
                          <div className="flex-1">
                            <div className="text-[14.5px] font-bold text-foreground group-hover:text-blue-700 leading-snug">
                              {fv.title}
                            </div>
                            <div className="text-sm text-muted-foreground mt-0.5 leading-[1.65]">
                              {fv.hint}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ) : (
                      <li
                        key={fv.slug}
                        className="flex items-start gap-3 p-3 rounded-lg border border-dashed border-border bg-surface"
                        aria-disabled="true"
                      >
                        <ArrowRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-[14.5px] font-bold text-muted-foreground leading-snug">
                              {fv.title}
                            </div>
                            <span className="text-[9.5px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-muted-foreground border border-border">
                              Coming soon
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-0.5 leading-[1.65]">
                            {fv.hint}
                          </div>
                        </div>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

            {relatedByPattern.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Same pattern
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {relatedByPattern.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/dsa/problem/${r.slug}`}
                        className="flex items-center justify-between gap-2 p-3 rounded-lg border border-border bg-background hover:border-blue-200 hover:bg-slate-50 group transition-all"
                      >
                        <span className="text-[13.5px] font-semibold text-foreground group-hover:text-blue-700 truncate">
                          {r.title}
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* ─── Prev / Next continue rail ─── */}
        {(prev || next) && (
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
            {prev ? (
              <Link
                href={`/dsa/problem/${prev.slug}`}
                className="sm:w-auto sm:max-w-[40%] flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 hover:border-border hover:bg-surface transition-all"
              >
                <span className="text-muted-foreground">←</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Previous
                  </div>
                  <div className="text-[13.5px] text-foreground line-clamp-1 font-semibold">
                    {prev.title}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="hidden sm:block sm:w-[40%]" />
            )}
            {next && (
              <Link
                href={`/dsa/problem/${next.slug}`}
                className="group flex-1 flex items-center justify-between gap-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 shadow-md transition-all"
              >
                <div className="min-w-0">
                  <div className="text-xs font-black uppercase tracking-widest text-blue-200">
                    Continue · Next problem
                  </div>
                  <div className="text-[14.5px] font-bold line-clamp-1">
                    {next.title}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        )}
      </article>
    } />
  );
}

// ─── Presentational helpers ────────────────────────────────────────────

function RevisionCard({ remember }: { remember: DSARevision }) {
  return (
    <section id="quick-revision" aria-label="Quick revision" className="mb-6 scroll-mt-24 rounded-2xl border border-slate-300 bg-slate-100/90 p-3 shadow-inner sm:p-4">
      <LearningSectionHeader
        number="06"
        eyebrow="Revise"
        title="Carry the pattern into the interview"
        description=""
        tone="indigo"
        action={
          <span
            aria-disabled="true"
            className="inline-flex cursor-default items-center gap-2 px-1 py-1 text-[10.5px] font-black uppercase tracking-[0.1em] text-blue-800"
          >
            <BookOpen className="h-3.5 w-3.5" /> Quick interview revision
          </span>
        }
      />
      <div className="overflow-hidden rounded-xl border border-slate-300 bg-slate-50 shadow-sm">
        <div className="border-b border-blue-200 bg-blue-100/80 px-5 py-4">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-blue-900">
              <BrainCircuit className="h-3.5 w-3.5" /> Pattern to remember
            </p>
            <p className="mt-1 text-[17px] font-black leading-snug text-slate-900">{remember.pattern}</p>
          </div>
        </div>

        <div id="quick-revision-content" className="space-y-5 bg-slate-100/55 p-4 sm:p-5">
          {remember.formula && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-blue-900">
                <Lightbulb className="h-3.5 w-3.5" /> Code pattern to memorize
              </p>
              <pre className="m-0 overflow-x-auto rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-[12.5px] leading-[1.7] text-slate-200"><code>{remember.formula}</code></pre>
            </div>
          )}

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-green-900">
              <CheckCircle2 className="h-3.5 w-3.5" /> Rules to remember
            </p>
            <ol className="space-y-2">
              {remember.rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-3 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-green-200 bg-green-50 font-mono text-[11px] font-black text-green-700">{index + 1}</span>
                  <span className="text-[13px] leading-[1.6] text-slate-600 [&_code]:rounded [&_code]:border [&_code]:border-slate-200 [&_code]:bg-white [&_code]:px-1 [&_code]:font-mono [&_strong]:font-black [&_strong]:text-slate-900">
                    <MarkdownContent content={rule} inline />
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {(remember.whenToUse?.length || remember.antiSignals?.length) && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {remember.whenToUse && remember.whenToUse.length > 0 && (
                <div className="rounded-lg border border-blue-200 bg-blue-50/45 px-4 py-3">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.15em] text-blue-900">Use this pattern when</p>
                  <ul className="space-y-1.5">{remember.whenToUse.map((signal, index) => <li key={index} className="flex items-start gap-2 text-[12.5px] leading-[1.55] text-slate-600"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" /><span>{signal}</span></li>)}</ul>
                </div>
              )}
              {remember.antiSignals && remember.antiSignals.length > 0 && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50/55 px-4 py-3">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.15em] text-yellow-900">Choose another pattern when</p>
                  <ul className="space-y-1.5">{remember.antiSignals.map((signal, index) => <li key={index} className="flex items-start gap-2 text-[12.5px] leading-[1.55] text-slate-600"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500" /><span>{signal}</span></li>)}</ul>
                </div>
              )}
            </div>
          )}

          {remember.takeaway && (
            <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50/55 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-900">Interview takeaway</p>
              <p className="mt-1 text-[13px] font-medium leading-[1.65] text-slate-700">{remember.takeaway}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Per-approach block. Each approach is a **full-weight section** now —
 * not a sub-card inside a shared wrapper — so the reader sees clearly
 * that there are N distinct approaches to the problem.
 *
 * Layout:
 *   - Tall numbered header bar ("Approach 1 of N — Brute Force, O(n²)")
 *   - Header background: dark slate for brute force, bold emerald for
 *     the optimal approach. Strong contrast instead of the pastel
 *     border-only treatment that was getting lost on the page.
 *   - Inside: the plan prose, dry-run, diagrams, annotated code, and
 *     collapsibles for "why it works" and "edge cases & pitfalls".
 *
 * The user's feedback was specifically that Approach 1 and Approach 2
 * didn't feel like distinct things — this component makes them feel
 * like separate chapters.
 */
function ApproachBlock({
  index,
  total,
  approach,
  isOptimal,
  fallbackDiagram,
}: {
  index: number;
  total: number;
  approach: DSAApproach;
  isOptimal: boolean;
  fallbackDiagram?: DSADiagramType;
}) {
  const hasNotes =
    (approach.edgeCases?.length ?? 0) + (approach.pitfalls?.length ?? 0) > 0;
  const hasDiagrams = (approach.diagrams?.length ?? 0) > 0;
  const hasDryRun = Boolean(approach.dryRun);
  const dryRunDiagram =
    approach.diagrams?.find((diagram) => diagram.type !== "mermaid") ??
    approach.diagrams?.[0] ??
    fallbackDiagram;
  const codePreview = (
    (approach.code as Record<string, string> | undefined)?.java ??
    Object.values((approach.code as Record<string, string> | undefined) ?? {})[0] ??
    ""
  ).split("\n").slice(0, 5).join("\n");

  return (
    <article
      id={`approach-${index}`}
      className={`scroll-mt-24 rounded-xl overflow-hidden shadow-md border-2 ${
        isOptimal ? "border-green-200" : "border-slate-200"
      }`}
    >
      {/* Header bar — the dominant visual divider. Dark for brute
          force, emerald for optimal so the reader knows instantly which
          one is the answer. */}
      <div
        className={`px-5 py-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-b ${
          isOptimal
            ? "border-green-200 bg-gradient-to-r from-green-50 via-slate-50 to-white text-slate-900"
            : "border-slate-200 bg-gradient-to-r from-slate-100 via-slate-50 to-white text-slate-900"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`shrink-0 h-10 min-w-[52px] px-2 rounded-lg flex items-center justify-center font-black text-[13px] font-mono shadow-sm ${
              isOptimal
                ? "border border-green-200 bg-green-600 text-white"
                : "border border-blue-200 bg-blue-50 text-blue-700"
            }`}
          >
            03.{index}
          </div>
          <div className="min-w-0">
            <p
              className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${
                isOptimal ? "text-green-700" : "text-slate-500"
              }`}
            >
              Approach {index} of {total}
              {isOptimal && " · Optimal"}
            </p>
            <h3 className="text-[18px] md:text-[19px] font-black leading-tight text-slate-900">
              {approach.name}
            </h3>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <ComplexityPill
            label="Time"
            value={approach.complexity.time}
            isOptimal={isOptimal}
          />
          <ComplexityPill
            label="Space"
            value={approach.complexity.space}
            isOptimal={isOptimal}
          />
        </div>
      </div>

      {/* When to mention — sits as a strip right below the header so
          the reader gets the interview framing before the prose. */}
      {approach.whenToMention && (
        <div
          className={`px-5 py-2 text-[13.5px] border-b-2 flex items-start gap-2 ${
            isOptimal
              ? "bg-green-50/65 text-green-900 border-green-200"
              : "bg-slate-50/70 text-slate-700 border-slate-200"
          }`}
        >
          <Target
            className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${
              isOptimal ? "text-green-600" : "text-slate-500"
            }`}
          />
          <span className="italic">{approach.whenToMention}</span>
        </div>
      )}

      {/* Body */}
      <div className="px-5 py-5 space-y-5 bg-background">
        {/* Progressive hints — LeetCode-style. Each hint is its own
            visible "Reveal" button so the affordance is obvious
            (addressing user feedback that closed <details> can feel
            hidden) while still preserving the self-challenge flow:
            readers can peek at Hint 1, try again, then Hint 2, etc.,
            without the full plan spoiling the aha moment.

            We only render the block when hints exist — problems
            without hints get straight to "The idea" as before. */}
        {approach.hints && approach.hints.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-50/60 overflow-hidden">
            <div className="px-4 py-2 bg-slate-100/80 border-b border-slate-200 flex items-center gap-2">
              <HelpCircle className="h-3.5 w-3.5 text-orange-600" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-700">
                Stuck? Progressive hints
              </span>
              <span className="ml-auto text-[11px] text-slate-500 italic">
                Reveal one at a time
              </span>
            </div>
            <div className="p-3 space-y-2">
              {approach.hints.map((hint, hi) => (
                <details
                  key={hi}
                  className="group rounded-md border border-slate-200 bg-white overflow-hidden"
                >
                  <summary className="cursor-pointer list-none px-3 py-2 hover:bg-slate-50 transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-orange-50 text-orange-700 border border-orange-200 text-[11px] font-black shrink-0">
                        {hi + 1}
                      </span>
                      <span className="text-[13.5px] font-bold text-slate-700">Hint {hi + 1}</span>
                    </span>
                    <ExpandPrompt openLabel="Explore hint" closeLabel="Hide hint" />
                  </summary>
                  <p className="px-3 pb-3 pt-1 text-[13.5px] leading-[1.65] text-foreground border-t border-slate-200">
                    {hint}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* The idea — prose plan. This is the "teaching" block; we
            lean on a larger type size and generous leading so it reads
            as a narrative rather than a caption. */}
        <div className="rounded-xl border-l-4 border-blue-400 bg-blue-50/50 px-4 py-4">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-2 flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-blue-600" />
            A · Core idea
          </p>
          <div className="prose porange-slate max-w-none porange-p:text-[15.5px] porange-p:leading-[1.8] porange-p:text-foreground porange-p:mb-3 porange-p:last:mb-0 porange-code:text-[13.5px] porange-code:font-mono porange-code:text-foreground porange-code:bg-surface porange-code:rounded porange-code:px-1 porange-code:py-0.5 porange-code:font-semibold porange-strong:text-foreground porange-strong:font-bold">
            <MarkdownContent content={approach.explanation} />
          </div>
        </div>

        {/* The authored dry run is the interactive visual teaching layer.
            A diagram is synchronized to the selected frame when available. */}
        {(hasDryRun || hasDiagrams) && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-2 flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 text-green-600" />
              B · Visual dry run
            </p>
            <div className="space-y-4">
              {approach.dryRun ? (
                <DSADryRun run={approach.dryRun} diagram={dryRunDiagram} />
              ) : approach.diagrams?.map((d, j) => (
                <DSADiagram key={j} diagram={d} />
              ))}
            </div>
          </div>
        )}

        {/* Code with inline teaching comments — the star of the show.
            The CodeWalkthrough component now injects the per-line
            explanations as inline `//` comments, so there's no separate
            "Key lines explained" list to cross-reference. */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-slate-500" />
            C · Code with teaching comments
          </p>
          {isOptimal ? (
            <CodeWalkthrough
              lineByLine={approach.lineByLine ?? {}}
              code={approach.code}
              title={`${approach.name} — optimal`}
            />
          ) : (
            <details className="group overflow-hidden rounded-xl border border-slate-300 bg-slate-950 shadow-md">
              <summary className="cursor-pointer list-none px-4 py-3 text-slate-100 hover:bg-slate-900">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Reference implementation preview</span>
                </span>
                <span className="mt-2 block max-h-[88px] overflow-hidden whitespace-pre rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 font-mono text-[10px] leading-[1.55] text-slate-400 group-open:hidden">{codePreview}</span>
                <ExpandPrompt openLabel="Explore the full code" closeLabel="Hide the full code" />
              </summary>
              <div className="border-t border-slate-800 bg-slate-900 p-2">
                <CodeWalkthrough
                  lineByLine={approach.lineByLine ?? {}}
                  code={approach.code}
                  title={`${approach.name} — reference`}
                />
              </div>
            </details>
          )}
        </div>

        {/* Why it works + complexity reasoning — open by default, the
            reader shouldn't have to click to see the payoff prose. */}
        {(approach.insight || approach.complexityReasoning) && (
          <details
            className="rounded-lg border border-blue-200 bg-blue-50/30 shadow-sm group overflow-hidden"
          >
            <summary className="cursor-pointer list-none px-4 py-3 bg-blue-50/40 hover:bg-blue-50/65 group-open:border-b group-open:border-blue-200 transition-colors">
              <span className="block min-w-0">
                <span className="text-[13.5px] font-black text-slate-900 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  D · Why it works and complexity
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-1.5 group-open:hidden">
                  <code className="rounded border border-blue-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-blue-800">{approach.complexity.time} time</code>
                  <code className="rounded border border-green-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-green-800">{approach.complexity.space} space</code>
                  <span className="text-[10px] text-slate-500">Open the invariant and proof</span>
                </span>
              </span>
              <ExpandPrompt openLabel="Explore the proof" closeLabel="Hide the proof" />
            </summary>
            <div className="px-4 py-4 space-y-3 bg-background">
              {approach.insight && (
                <div className="prose porange-slate max-w-none porange-p:text-[14.5px] porange-p:leading-[1.8] porange-p:text-foreground">
                  <MarkdownContent content={approach.insight} />
                </div>
              )}
              {approach.complexityReasoning && (
                <p className="text-[14px] text-foreground leading-[1.7] border-t border-border pt-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-700 mr-1.5">
                    Complexity
                  </span>
                  <code className="font-mono font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200">
                    {approach.complexity.time}
                  </code>{" "}
                  time,{" "}
                  <code className="font-mono font-bold text-green-800 bg-green-100 px-1.5 py-0.5 rounded border border-green-200">
                    {approach.complexity.space}
                  </code>{" "}
                  space — {approach.complexityReasoning}
                </p>
              )}
            </div>
          </details>
        )}

        {/* Edge cases + pitfalls — open by default; readers shouldn't
            have to click through to see the traps. */}
        {hasNotes && (
          <details
            className="rounded-lg border border-slate-200 bg-slate-50/35 group overflow-hidden"
          >
            <summary className="cursor-pointer list-none px-4 py-3 hover:bg-slate-50 transition-colors">
              <span className="block min-w-0">
                <span className="text-[13.5px] font-black text-slate-900 flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-slate-500" />
                  E · Edge cases and pitfalls
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-slate-200 text-slate-700 text-xs font-black">
                    {(approach.edgeCases?.length ?? 0) +
                      (approach.pitfalls?.length ?? 0)}
                  </span>
                </span>
                <span className="mt-1 block truncate text-[10.5px] text-slate-500 group-open:hidden">
                  {approach.edgeCases?.[0]
                    ? `${approach.edgeCases[0].input} — ${approach.edgeCases[0].behavior}`
                    : approach.pitfalls?.[0]}
                </span>
              </span>
              <ExpandPrompt openLabel="Explore edge cases" closeLabel="Hide edge cases" />
            </summary>
            <div className="border-t border-border px-4 py-4 space-y-3 bg-background">
              {approach.edgeCases && approach.edgeCases.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400 mb-2">
                    Edge cases handled
                  </p>
                  <ul className="space-y-2">
                    {approach.edgeCases.map((ec, j) => (
                      <li key={j} className="text-[13.5px] leading-[1.65]">
                        <code className="font-mono text-sm text-foreground bg-surface border border-border rounded px-1.5 py-0.5 mr-2 font-semibold">
                          {ec.input}
                        </code>
                        <span className="text-foreground">{ec.behavior}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {approach.pitfalls && approach.pitfalls.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-700 dark:text-orange-400 mb-2">
                    Pitfalls
                  </p>
                  <ul className="space-y-1.5">
                    {approach.pitfalls.map((p, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-[13.5px] text-foreground leading-[1.65]"
                      >
                        <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-800 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </article>
  );
}

function ComplexityPill({
  label,
  value,
  isOptimal,
}: {
  label: string;
  value: string;
  isOptimal: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-mono text-[13.5px] font-bold border-2 ${
        isOptimal
          ? "bg-white/90 text-green-800 border-green-200"
          : "bg-white/90 text-slate-700 border-slate-200"
      }`}
    >
      <span
        className={`text-[9.5px] font-sans font-bold uppercase tracking-widest ${
          isOptimal ? "text-green-600" : "text-slate-500"
        }`}
      >
        {label}
      </span>
      {value}
    </span>
  );
}

function IntentBlock({
  tone,
  icon,
  label,
  text,
}: {
  tone: "blue" | "rose" | "emerald";
  icon: React.ReactNode;
  label: string;
  text: string;
}) {
  const toneClasses = {
    blue: { shell: "border-slate-200 bg-white", accent: "text-blue-600" },
    rose: { shell: "border-slate-200 bg-white", accent: "text-slate-500" },
    emerald: { shell: "border-slate-200 bg-white", accent: "text-green-600" },
  };
  return (
    <div className={cn("rounded-md border px-3.5 py-3", toneClasses[tone].shell)}>
      <p className="text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5 text-foreground">
        <span className={toneClasses[tone].accent}>{icon}</span>
        {label}
      </p>
      <p className="text-[13.5px] text-muted-foreground leading-[1.65]">{text}</p>
    </div>
  );
}
