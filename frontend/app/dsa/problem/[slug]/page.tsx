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
  Bug,
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
  Repeat,
  Scale,
  ShieldAlert,
  Sparkles,
  Target,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import {
  getDSAIndex,
  getDSAProblemBySlug,
  getDSAProblemsByModule,
  getDSAModule,
  getDSAByPattern,
  getBasic100Slugs,
} from "@/lib/contentV2";
import type { DSAApproach, DSARevision } from "@/lib/contentV2-types";
import MarkdownContent from "@/components/MarkdownContent";
import { CodeWalkthrough } from "@/components/dsa/CodeWalkthrough";
import { CodePlayground } from "@/components/dsa/CodePlayground";
import { DSALangToggle } from "@/components/dsa/DSALangToggle";
import { DSADryRun } from "@/components/dsa/DSADryRun";
import { DSADiagram } from "@/components/dsa/DSADiagram";
import { DSAProblemTwoPaneShell } from "@/components/dsa/DSAProblemTwoPaneShell";
import { DSABreadcrumb } from "@/components/dsa/DSABreadcrumb";
import { DSAPill, DifficultyPill } from "@/components/dsa/DSAPills";
import { ProblemSidebar } from "@/components/dsa/ProblemSidebar";
import { cn } from "@/lib/utils";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";
const DSA_ROOT = path.join(process.cwd(), "..", "content", "dsa");

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
  const optimal = problem.approaches[problem.approaches.length - 1];

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
              className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                freq.tone === "red"
                  ? "bg-rose-100 text-rose-800 border-rose-300"
                  : freq.tone === "amber"
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : "bg-surface text-foreground border-border"
              }`}
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
              <span className="font-semibold text-secondary">
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
        <div className="prose prose-slate max-w-none prose-p:text-[15px] prose-p:leading-[1.8] prose-p:text-foreground prose-p:mb-3 prose-p:last:mb-0 prose-code:text-sm prose-code:font-mono prose-code:text-foreground prose-code:bg-surface prose-code:border prose-code:border-border prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:font-semibold prose-strong:text-foreground prose-strong:font-bold prose-em:text-violet-800 prose-em:font-semibold prose-em:not-italic">
          <MarkdownContent content={problem.problemStatement} />
        </div>

        {problem.understanding && (
          <div className="rounded-md border-l-4 border-l-violet-500 bg-violet-50 px-4 py-3">
            <p className="text-xs font-black uppercase tracking-widest text-violet-800 mb-1 flex items-center gap-1.5">
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
          <p className="text-xs font-black uppercase tracking-widest text-secondary mb-2 flex items-center gap-1.5">
            <ListChecks className="h-3 w-3" />
            Examples
          </p>
          <div className="space-y-2">
            {problem.examples.map((ex, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-surface/70 overflow-hidden"
              >
                <div className="px-3 py-1 bg-slate-200/70 border-b border-border">
                  <span className="text-xs font-black uppercase tracking-widest text-foreground">
                    Example {i + 1}
                  </span>
                </div>
                <dl className="px-3 py-2.5 space-y-1 font-mono text-[13.5px] leading-[1.6]">
                  <div className="flex items-start gap-2">
                    <dt className="shrink-0 w-[72px] text-xs font-black uppercase tracking-widest text-sky-700 pt-[2px]">
                      Input
                    </dt>
                    <dd className="text-foreground break-all">{ex.input}</dd>
                  </div>
                  <div className="flex items-start gap-2">
                    <dt className="shrink-0 w-[72px] text-xs font-black uppercase tracking-widest text-emerald-700 pt-[2px]">
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
        <div className="mb-5 rounded-lg border border-border bg-background px-4 py-3">
          <p className="text-xs font-black uppercase tracking-widest text-secondary mb-2 flex items-center gap-1.5">
            <ShieldAlert className="h-3 w-3" />
            Constraints
          </p>
          <ul className="space-y-1">
            {problem.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-mono text-foreground">
                <span className="mt-[9px] h-1 w-1 rounded-full bg-slate-500 shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Clarifying questions */}
      {problem.clarifyingQuestions && problem.clarifyingQuestions.length > 0 && (
        <details
          open
          className="mb-5 rounded-lg border border-sky-300 bg-sky-50/60 group overflow-hidden"
        >
          <summary className="cursor-pointer list-none px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-sky-100/80 transition-colors">
            <span className="text-sm font-black text-sky-900 flex items-center gap-2">
              <HelpCircle className="h-3.5 w-3.5 text-sky-700" />
              Clarifying questions
              <span className="inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full bg-sky-600 text-primary-foreground dark:text-foreground text-xs font-black">
                {problem.clarifyingQuestions.length}
              </span>
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-sky-700 transition-transform duration-150 group-open:rotate-180" />
          </summary>
          <ul className="divide-y divide-sky-200 border-t border-sky-200">
            {problem.clarifyingQuestions.map((qa, i) => (
              <li key={i} className="px-4 py-2.5 bg-background">
                <p className="text-sm font-bold text-foreground leading-snug flex items-start gap-1.5">
                  <span className="text-sky-700 font-black">Q{i + 1}.</span>
                  <span>{qa.question}</span>
                </p>
                <p className="text-[13.5px] text-foreground leading-[1.65] mt-1 pl-[26px] border-l-2 border-sky-200 ml-1">
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

        {/* ─── ZONE 1 · 30-SECOND ANSWER ─────────────────────────────── */}
        {problem.directAnswer && (
          <section aria-label="Quick answer" className="mb-6">
            <div className="rounded-xl border border-violet-200 bg-violet-50 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-primary-foreground dark:text-foreground">
                <Zap className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  30-second answer
                </span>
                <div className="ml-auto">
                  <DSALangToggle />
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-[16px] leading-[1.7] text-foreground font-medium">
                  {problem.directAnswer}
                </p>
                {problem.interviewerIntent && (
                  <details open className="mt-5 group rounded-lg border border-violet-200 bg-background/80">
                    <summary className="cursor-pointer list-none px-4 py-2.5 flex items-center justify-between gap-3 rounded-t-lg hover:bg-violet-50/50">
                      <span className="text-xs font-black uppercase tracking-widest text-violet-800 flex items-center gap-2">
                        <Target className="h-3.5 w-3.5" />
                        Why interviewers ask this
                      </span>
                      <ChevronDown className="h-4 w-4 text-violet-700 transition-transform duration-150 group-open:rotate-180" />
                    </summary>
                    <div className="border-t border-violet-200 px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-3">
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

        {/* ─── ZONE 2 · THINGS TO REMEMBER / REVISE ─────────────────── */}
        {problem.remember && <RevisionCard remember={problem.remember} />}

        {/* ─── ZONE 4 · PROBLEM SOLVING (approaches) ────────────────── */}
        <section className="mb-8">
          <div className="mb-5 rounded-xl bg-gradient-to-r from-violet-600 via-violet-700 to-indigo-700 px-5 py-4 text-primary-foreground dark:text-foreground shadow-md">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-widest text-violet-200 mb-1 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Problem Solving
                </p>
                <h2 className="text-[22px] md:text-[24px] font-black leading-tight">
                  {problem.approaches.length} approaches — brute force → optimal
                </h2>
              </div>
              {/* Approach legend: a visual primer so the reader knows
                  dark slate = brute, emerald = optimal. */}
              <div className="flex items-center gap-4 text-xs font-medium text-violet-100">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-gradient-to-r from-slate-600 to-slate-700 border border-slate-400/40" />
                  Brute force
                </span>
                <span className="text-violet-300">→</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-gradient-to-r from-emerald-500 to-emerald-600 border border-emerald-300" />
                  Optimal
                </span>
              </div>
            </div>
          </div>

          {/* Approaches at a glance — a compact comparison row so
              the reader sees the full solution space before diving
              into any single block. LeetCode editorials open with
              this kind of summary; readers use it to decide which
              approach they want to drill into first. */}
          {problem.approaches.length > 1 && (
            <div className="mb-6 rounded-xl border border-border bg-background overflow-hidden shadow-sm">
              <div className="px-4 py-2 bg-surface border-b border-border flex items-center gap-2">
                <Scale className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-black uppercase tracking-widest text-secondary">
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
                  <tbody className="divide-y divide-slate-100">
                    {problem.approaches.map((a, i) => {
                      const isOptimal =
                        i === problem.approaches.length - 1;
                      return (
                        <tr
                          key={i}
                          className={cn(
                            "align-top text-sm",
                            isOptimal
                              ? "bg-emerald-50/50 hover:bg-emerald-50"
                              : "hover:bg-surface",
                          )}
                        >
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "inline-flex items-center justify-center h-6 w-6 rounded-md font-black text-sm font-mono border-2",
                                isOptimal
                                  ? "bg-emerald-500 text-primary-foreground dark:text-foreground border-emerald-600"
                                  : "bg-slate-700 text-primary-foreground dark:text-foreground border-border",
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
                                <span className="inline-flex items-center gap-1 text-[9.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-600 text-primary-foreground dark:text-foreground">
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
                                  ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                  : "bg-surface text-foreground border-border",
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
                                  ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                  : "bg-surface text-foreground border-border",
                              )}
                            >
                              {a.complexity.space}
                            </code>
                          </td>
                          <td className="px-4 py-3 text-secondary text-[13.5px] italic hidden md:table-cell leading-snug">
                            {a.whenToMention ?? "—"}
                          </td>
                          <td className="px-3 py-3 text-right">
                            <a
                              href={`#approach-${i + 1}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:text-violet-900 hover:underline"
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
              open
              className="mb-6 rounded-lg border border-violet-300 bg-violet-50/60 group overflow-hidden"
            >
              <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between hover:bg-violet-100/80 transition-colors">
                <span className="text-[13.5px] font-black text-violet-900 flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-violet-700" />
                  How to pick the right approach
                  <span className="text-[11px] font-medium text-violet-700 italic">
                    · decision tree
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 text-violet-700 transition-transform duration-150 group-open:rotate-180" />
              </summary>
              <div className="border-t border-violet-200 px-4 py-4 bg-background">
                {problem.diagrams.map((d, i) => (
                  <DSADiagram key={i} diagram={d} />
                ))}
              </div>
            </details>
          )}

          <div className="space-y-8">
            {problem.approaches.map((approach, i) => (
              <ApproachBlock
                key={i}
                index={i + 1}
                total={problem.approaches.length}
                approach={approach}
                isOptimal={i === problem.approaches.length - 1}
              />
            ))}
          </div>
        </section>

        {/* ─── ZONE 5 · CODE PLAYGROUND ─────────────────────────────── */}
        {(() => {
          // Build starter code: use the optimal approach's code per language,
          // falling back to brute force if optimal has no code for that lang.
          const starterCode: Record<string, string> = {};
          const langs = ["java", "python", "javascript", "cpp"];
          for (const lang of langs) {
            for (let i = problem.approaches.length - 1; i >= 0; i--) {
              const src = (problem.approaches[i]?.code as Record<string, string> | undefined)?.[lang];
              if (src) { starterCode[lang] = src; break; }
            }
          }
          if (Object.keys(starterCode).length === 0) return null;
          const defaultStdin = problem.examples[0]
            ? `${problem.examples[0].input}`
            : "";
          return (
            <section className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100">
                  <Code2 className="h-4 w-4 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-[18px] font-black text-foreground leading-tight">
                    Try it yourself
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Edit and run the code — no setup needed
                  </p>
                </div>
              </div>
              <CodePlayground
                starterCode={starterCode}
                defaultStdin={defaultStdin}
              />
            </section>
          );
        })()}

        {/* ─── ZONE 6 · COMMON MISTAKES ─────────────────────────────── */}
        {hasMistakes && (
          <section className="mb-8 rounded-xl border-2 border-rose-300 bg-rose-50/40 overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 text-primary-foreground dark:text-foreground">
              <Bug className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-widest">
                Common mistakes
              </span>
              <span className="ml-auto text-[11px] text-rose-100">
                Bugs that trip candidates on this exact problem
              </span>
            </div>
            <div className="px-4 py-4">
              {problem.commonMistakesDetailed &&
              problem.commonMistakesDetailed.length > 0 ? (
                <div className="space-y-3">
                  {problem.commonMistakesDetailed.map((m, i) => (
                    <details
                      key={i}
                      open
                      className="rounded-lg border border-rose-200 bg-background group overflow-hidden shadow-sm"
                    >
                      <summary className="cursor-pointer list-none px-4 py-3 flex items-start justify-between gap-3 hover:bg-rose-50 transition-colors">
                        <div className="min-w-0 flex items-start gap-3">
                          <span className="shrink-0 mt-0.5 h-7 w-7 rounded-md bg-rose-100 text-rose-700 text-sm font-black font-mono flex items-center justify-center border border-rose-300">
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
                        {(m.bad || m.good) && (
                          <ChevronDown className="h-4 w-4 text-rose-700 shrink-0 transition-transform duration-150 group-open:rotate-180" />
                        )}
                      </summary>
                      {(m.bad || m.good) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-slate-700 border-t border-rose-200">
                          {m.bad && (
                            <div>
                              <p className="px-3 py-1.5 text-xs font-black uppercase tracking-widest text-rose-50 bg-gradient-to-r from-rose-700 to-rose-800 flex items-center gap-1.5">
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
                              <p className="px-3 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-50 bg-gradient-to-r from-emerald-700 to-emerald-800 flex items-center gap-1.5">
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
                      <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* ─── Pattern footer + More problems ─── */}
        {problem.patternNote && (
          <div className="mb-8 flex items-start gap-3 rounded-lg border border-violet-300 bg-violet-50 px-4 py-3">
            <Sparkles className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
            <p className="text-[13.5px] text-foreground leading-[1.65]">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-700 mr-1.5">
                Pattern
              </span>
              {problem.patternNote}
            </p>
          </div>
        )}

        {(followupVariations.length > 0 || relatedByPattern.length > 0) && (
          <section className="mb-8">
            <h2 className="text-[18px] font-black text-foreground mb-3 flex items-baseline gap-2">
              More problems
              <span className="text-sm font-medium text-slate-400">
                Direct variations and pattern siblings
              </span>
            </h2>

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
                          className="group flex items-start gap-3 p-3 rounded-lg border border-border bg-background hover:border-violet-300 hover:shadow-sm transition-all"
                        >
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-violet-600 mt-1 shrink-0" />
                          <div className="flex-1">
                            <div className="text-[14.5px] font-bold text-foreground group-hover:text-violet-700 leading-snug">
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
                        <ArrowRight className="h-4 w-4 text-slate-300 mt-1 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-[14.5px] font-bold text-muted-foreground leading-snug">
                              {fv.title}
                            </div>
                            <span className="text-[9.5px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-slate-200 text-secondary border border-border">
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
                        className="flex items-center justify-between gap-2 p-3 rounded-lg border border-border bg-background hover:border-violet-300 group transition-all"
                      >
                        <span className="text-[13.5px] font-semibold text-foreground group-hover:text-violet-700 truncate">
                          {r.title}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-violet-600 shrink-0" />
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
                <span className="text-slate-400">←</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
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
                className="group flex-1 flex items-center justify-between gap-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-primary-foreground dark:text-foreground px-5 py-3 shadow-md transition-all"
              >
                <div className="min-w-0">
                  <div className="text-xs font-black uppercase tracking-widest text-violet-200">
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

/**
 * "Things to remember" block. Replaces the old speakable-answer zone.
 *
 * Design intent: this is a *study* card, not a narrative. The reader
 * should be able to close the page and answer "what pattern was that,
 * what are the three rules, what's the formula?" from memory. Colors
 * lean amber (the "highlighter" palette) because the user said things
 * need to pop — light-on-light wasn't teaching weight.
 */
function RevisionCard({ remember }: { remember: DSARevision }) {
  return (
    <section aria-label="Things to remember" className="mb-6">
      <div className="rounded-xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-primary-foreground dark:text-foreground">
          <Repeat className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Revise & remember
          </span>
          <span className="ml-auto text-[11px] text-amber-50">
            The pattern to carry to your next interview
          </span>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Pattern classifier */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1 flex items-center gap-1.5">
              <BrainCircuit className="h-3.5 w-3.5" />
              Pattern
            </p>
            <p className="text-[16px] font-bold text-foreground leading-snug">
              <span className="bg-amber-200/70 px-1.5 py-0.5 rounded">
                {remember.pattern}
              </span>
            </p>
          </div>

          {/* Formula / template */}
          {remember.formula && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1.5 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" />
                Template to memorize
              </p>
              <pre className="m-0 px-4 py-3 rounded-md dark:bg-surface text-slate-100 text-sm leading-[1.7] font-mono overflow-x-auto border border-amber-400">
                <code>{remember.formula}</code>
              </pre>
            </div>
          )}

          {/* Rules — the big highlighter list */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Rules to internalize
            </p>
            <ol className="space-y-2">
              {remember.rules.map((r, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 h-6 w-6 rounded-md bg-amber-500 text-primary-foreground dark:text-foreground text-sm font-bold font-mono flex items-center justify-center shadow-sm">
                    {i + 1}
                  </span>
                  <span
                    className="text-[14.5px] text-foreground leading-[1.65] [&_code]:font-mono [&_code]:text-sm [&_code]:bg-background [&_code]:border [&_code]:border-amber-300 [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-semibold [&_strong]:text-foreground [&_strong]:font-black [&_strong]:bg-amber-200/80 [&_strong]:px-1 [&_strong]:rounded"
                  >
                    <MarkdownContent content={r} inline />
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* When to use / anti-signals — side by side */}
          {(remember.whenToUse?.length || remember.antiSignals?.length) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {remember.whenToUse && remember.whenToUse.length > 0 && (
                <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-800 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Reach for this when
                  </p>
                  <ul className="space-y-1">
                    {remember.whenToUse.map((s, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[13.5px] text-foreground leading-[1.55]"
                      >
                        <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {remember.antiSignals && remember.antiSignals.length > 0 && (
                <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-rose-800 mb-1.5 flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5" />
                    Do NOT reach for this when
                  </p>
                  <ul className="space-y-1">
                    {remember.antiSignals.map((s, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[13.5px] text-foreground leading-[1.55]"
                      >
                        <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Takeaway — the wisdom line */}
          {remember.takeaway && (
            <div className="rounded-md dark:bg-surface text-slate-100 px-4 py-3 border-l-4 border-amber-400">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-300 mb-1">
                Takeaway
              </p>
              <p className="text-[14px] italic text-slate-100 leading-[1.7]">
                {remember.takeaway}
              </p>
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
}: {
  index: number;
  total: number;
  approach: DSAApproach;
  isOptimal: boolean;
}) {
  const hasNotes =
    (approach.edgeCases?.length ?? 0) + (approach.pitfalls?.length ?? 0) > 0;
  const hasDiagrams = (approach.diagrams?.length ?? 0) > 0;
  const hasDryRun = Boolean(approach.dryRun);

  return (
    <article
      id={`approach-${index}`}
      className={`scroll-mt-24 rounded-xl overflow-hidden shadow-md border-2 ${
        isOptimal ? "border-emerald-500" : "border-border"
      }`}
    >
      {/* Header bar — the dominant visual divider. Dark for brute
          force, emerald for optimal so the reader knows instantly which
          one is the answer. */}
      <div
        className={`px-5 py-4 flex flex-wrap items-center gap-x-5 gap-y-2 ${
          isOptimal
            ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-primary-foreground dark:text-foreground"
            : "bg-gradient-to-r from-slate-700 to-slate-800 text-primary-foreground dark:text-foreground"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`shrink-0 h-10 w-10 rounded-lg flex items-center justify-center font-black text-[16px] font-mono shadow-md ${
              isOptimal
                ? "bg-background text-emerald-700"
                : "bg-background/90 text-foreground"
            }`}
          >
            {index}
          </div>
          <div className="min-w-0">
            <p
              className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${
                isOptimal ? "text-emerald-200" : "text-slate-300"
              }`}
            >
              Approach {index} of {total}
              {isOptimal && " · Optimal"}
            </p>
            <h3 className="text-[18px] md:text-[19px] font-black leading-tight">
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
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-surface text-foreground border-border"
          }`}
        >
          <Target
            className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${
              isOptimal ? "text-emerald-600" : "text-muted-foreground"
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
          <div className="rounded-lg border border-amber-300 bg-amber-50/70 overflow-hidden">
            <div className="px-4 py-2 bg-amber-100/80 border-b border-amber-200 flex items-center gap-2">
              <HelpCircle className="h-3.5 w-3.5 text-amber-700" />
              <span className="text-xs font-black uppercase tracking-widest text-amber-900">
                Stuck? Progressive hints
              </span>
              <span className="ml-auto text-[11px] text-amber-700 italic">
                Reveal one at a time
              </span>
            </div>
            <div className="p-3 space-y-2">
              {approach.hints.map((hint, hi) => (
                <details
                  key={hi}
                  className="group rounded-md border border-amber-200 bg-background overflow-hidden"
                >
                  <summary className="cursor-pointer list-none px-3 py-2 flex items-center gap-2 hover:bg-amber-50 transition-colors">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-amber-500 text-primary-foreground dark:text-foreground text-[11px] font-black shrink-0">
                      {hi + 1}
                    </span>
                    <span className="text-[13.5px] font-bold text-amber-900">
                      Hint {hi + 1}
                    </span>
                    <span className="ml-auto text-xs font-bold uppercase tracking-widest text-amber-600 group-open:hidden">
                      Reveal
                    </span>
                    <span className="ml-auto text-xs font-bold uppercase tracking-widest text-amber-500 hidden group-open:inline">
                      Hide
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-amber-600 transition-transform duration-150 group-open:rotate-180" />
                  </summary>
                  <p className="px-3 pb-3 pt-1 text-[13.5px] leading-[1.65] text-foreground border-t border-amber-100">
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
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-muted-foreground" />
            The idea
          </p>
          <div className="prose prose-slate max-w-none prose-p:text-[15.5px] prose-p:leading-[1.8] prose-p:text-foreground prose-p:mb-3 prose-p:last:mb-0 prose-code:text-[13.5px] prose-code:font-mono prose-code:text-foreground prose-code:bg-surface prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:font-semibold prose-strong:text-foreground prose-strong:font-bold">
            <MarkdownContent content={approach.explanation} />
          </div>
        </div>

        {/* Visuals — dry-run + diagrams side by side when both exist
            on wide screens, stacked otherwise. */}
        {(hasDryRun || hasDiagrams) && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 text-muted-foreground" />
              Dry run it on paper
            </p>
            <div
              className={
                hasDryRun && hasDiagrams && approach.diagrams!.length === 1
                  ? "grid grid-cols-1 xl:grid-cols-2 gap-4"
                  : "space-y-4"
              }
            >
              {approach.dryRun && <DSADryRun run={approach.dryRun} />}
              {approach.diagrams?.map((d, j) => (
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
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            Code with inline teaching comments
          </p>
          <CodeWalkthrough
            lineByLine={approach.lineByLine ?? {}}
            code={approach.code}
            title={`${approach.name} — ${isOptimal ? "optimal" : "reference"}`}
          />
        </div>

        {/* Why it works + complexity reasoning — open by default, the
            reader shouldn't have to click to see the payoff prose. */}
        {(approach.insight || approach.complexityReasoning) && (
          <details
            open
            className="rounded-lg border border-violet-300 bg-violet-50/60 group overflow-hidden"
          >
            <summary className="cursor-pointer list-none px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-violet-100/80 transition-colors">
              <span className="text-[13.5px] font-black text-violet-900 flex items-center gap-2">
                <Brain className="h-4 w-4 text-violet-700" />
                Why it works · why these complexities
              </span>
              <ChevronDown className="h-4 w-4 text-violet-700 transition-transform duration-150 group-open:rotate-180" />
            </summary>
            <div className="border-t border-violet-200 px-4 py-4 space-y-3 bg-background">
              {approach.insight && (
                <div className="prose prose-slate max-w-none prose-p:text-[14.5px] prose-p:leading-[1.8] prose-p:text-foreground">
                  <MarkdownContent content={approach.insight} />
                </div>
              )}
              {approach.complexityReasoning && (
                <p className="text-[14px] text-foreground leading-[1.7] border-t border-violet-100 pt-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-violet-700 mr-1.5">
                    Complexity
                  </span>
                  <code className="font-mono font-bold text-foreground bg-violet-100 px-1.5 py-0.5 rounded">
                    {approach.complexity.time}
                  </code>{" "}
                  time,{" "}
                  <code className="font-mono font-bold text-foreground bg-violet-100 px-1.5 py-0.5 rounded">
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
            open
            className="rounded-lg border border-border bg-surface/70 group overflow-hidden"
          >
            <summary className="cursor-pointer list-none px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-surface transition-colors">
              <span className="text-[13.5px] font-black text-foreground flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-secondary" />
                Edge cases & pitfalls
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-slate-700 text-primary-foreground dark:text-foreground text-xs font-black">
                  {(approach.edgeCases?.length ?? 0) +
                    (approach.pitfalls?.length ?? 0)}
                </span>
              </span>
              <ChevronDown className="h-4 w-4 text-secondary transition-transform duration-150 group-open:rotate-180" />
            </summary>
            <div className="border-t border-border px-4 py-4 space-y-3 bg-background">
              {approach.edgeCases && approach.edgeCases.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
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
                  <p className="text-xs font-bold uppercase tracking-widest text-rose-700 mb-2">
                    Pitfalls
                  </p>
                  <ul className="space-y-1.5">
                    {approach.pitfalls.map((p, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-[13.5px] text-foreground leading-[1.65]"
                      >
                        <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
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
          ? "bg-background text-emerald-800 border-emerald-300"
          : "dark:bg-surface/40 text-slate-100 border-slate-600"
      }`}
    >
      <span
        className={`text-[9.5px] font-sans font-bold uppercase tracking-widest ${
          isOptimal ? "text-emerald-600" : "text-slate-400"
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
    blue: "border-blue-300 bg-background [&_.icon]:text-blue-600 [&_.label]:text-blue-800",
    rose: "border-rose-300 bg-background [&_.icon]:text-rose-600 [&_.label]:text-rose-800",
    emerald:
      "border-emerald-300 bg-background [&_.icon]:text-emerald-600 [&_.label]:text-emerald-800",
  }[tone];
  return (
    <div className={`rounded-md border-2 px-3.5 py-3 ${toneClasses}`}>
      <p className="label text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
        <span className="icon">{icon}</span>
        {label}
      </p>
      <p className="text-[13.5px] text-foreground leading-[1.65]">{text}</p>
    </div>
  );
}
