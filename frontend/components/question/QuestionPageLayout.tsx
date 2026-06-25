"use client";

import Link from "next/link";
import type { AnswerSection, QuestionPagePayload } from "@/lib/api";
import type { SpeakableV2 } from "@/lib/speakable/schema";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  Compass,
  Folder,
  HelpCircle,
  Home,
  MessageSquare,
  Moon,
  PlayCircle,
  Sun,
  Target,
} from "lucide-react";
import { EXPERIENCE_LEVELS, type ExperienceLevelKey } from "@/lib/levels";

import CodeHighlighter from "@/components/CodeHighlighter";
import CompletionTrigger from "@/components/CompletionTrigger";
import MarkdownContent from "@/components/MarkdownContent";
import { MarkCompleteButton } from "@/components/mark-complete-button";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import ViewTracker from "@/components/ViewTracker";
import { CompanyTagsBadges } from "./CompanyTagsBadges";
import { QuickAnswer } from "./QuickAnswer";
import { ContentThemeProvider, useContentTheme } from "./ThemeContext";

/* ──────────────────────────────────────────────────────────────────────────
 * Deep-dive section → markdown transform
 *
 * The whole answer page renders through a single framework — <MarkdownContent>
 * (the same renderer the "In a nutshell" card uses). To feed Zone 3 through it,
 * the typed answer sections are flattened into one markdown string. Code stays
 * fenced (so the shared client highlighter colours it) and the bespoke
 * `concept_map` pipe format is rewritten as plain markdown.
 * ────────────────────────────────────────────────────────────────────────── */

function ensureFenced(content: string, lang = "java"): string {
  if (content.includes("```")) return content;
  return `\`\`\`${lang}\n${content.trim()}\n\`\`\``;
}

/** `color|heading|~subtitle|point|point` → bold heading + bullet list. */
function conceptMapToMarkdown(content: string): string {
  return content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      const heading = parts[1] || "";
      let subtitle = "";
      const points: string[] = [];
      for (const p of parts.slice(2)) {
        if (p.startsWith("~")) subtitle = p.slice(1).trim();
        else if (p) points.push(p);
      }
      const head = subtitle
        ? `**${heading}** — _${subtitle}_`
        : `**${heading}**`;
      const bullets = points.map((p) => `- ${p}`).join("\n");
      return bullets ? `${head}\n${bullets}` : head;
    })
    .join("\n\n");
}

function deepDiveToMarkdown(sections: AnswerSection[]): string {
  const parts: string[] = [];
  for (const s of sections) {
    const type = s.sectionType;
    const title = s.sectionTitle || "";
    const content = (s.content || "").trim();
    if (!content) continue;

    if (type === "concept_map") {
      if (title) parts.push(`## ${title}`);
      parts.push(conceptMapToMarkdown(content));
      continue;
    }
    if (
      type === "code_example" ||
      type === "before_code" ||
      type === "after_code"
    ) {
      parts.push(ensureFenced(content));
      continue;
    }
    if (title) parts.push(`## ${title}`);
    parts.push(content);
  }
  return parts.join("\n\n");
}

export interface V2ExtendedFields {
  directAnswer?: string;
  interviewerIntent?: {
    testing: string;
    common_mistake: string;
    to_stand_out: string;
  };
  companyTags?: string[];
  followupQuestions?: string[];
  lastUpdated?: string;
  layoutType?: string;
  /** Structured Speakable v2 — when present, Zone 2 renders the archetype layout. */
  speakableV2?: SpeakableV2;
}

interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface RelatedPillarRef {
  pillarSlug: string;
  title: string;
  tagline: string;
}

export interface NextCurriculumModuleRef {
  href: string;
  title: string;
  pillarName: string;
  moduleNumber: string;
}

export interface RoadmapCtaRef {
  title: string;
  tagline: string;
  href: string;
  ctaLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

interface QuestionPageLayoutProps {
  data: QuestionPagePayload;
  v2?: V2ExtendedFields;
  breadcrumbs: BreadcrumbItem[];
  levelKey: ExperienceLevelKey;
  /** URL prefix before `[stack]/[slug]`, e.g. `/java-backend-intermediate` */
  questionUrlPrefix: string;
  /** Set true when the URL pattern omits the stack segment (e.g. SEO pages) */
  questionUrlSkipStack?: boolean;
  stackSlug: string;
  questionSlug: string;
  sidebar?: React.ReactNode;
  relatedPillars?: RelatedPillarRef[];
  nextCurriculumModule?: NextCurriculumModuleRef;
  roadmapCta?: RoadmapCtaRef;
}

// Inner component that consumes the theme context
function QuestionPageLayoutInner({
  data,
  v2,
  breadcrumbs,
  levelKey,
  questionUrlPrefix,
  questionUrlSkipStack,
  stackSlug,
  questionSlug,
  sidebar,
  relatedPillars,
  nextCurriculumModule,
  roadmapCta,
}: QuestionPageLayoutProps) {
  const buildQuestionUrl = (qSlug: string, qStack?: string) =>
    questionUrlSkipStack
      ? `${questionUrlPrefix}/${qSlug}`
      : `${questionUrlPrefix}/${qStack ?? stackSlug}/${qSlug}`;
  const { theme, toggleTheme } = useContentTheme();
  const d = theme === "dark";

  const sections = (data.answerSections || []).filter(
    (s) => s.content != null && s.content.length > 0
  );

  const speakableAnswerSection = sections.find(
    (s) => s.sectionType === "speakable_answer"
  );
  const expectationSection = sections.find(
    (s) => s.sectionType === "interviewer_expectation"
  );
  const keyPointsSection = sections.find(
    (s) =>
      s.sectionType === "key_points" || s.sectionType === "important_points"
  );

  const zone1Types = [
    "speakable_answer",
    "interviewer_expectation",
    ...(keyPointsSection ? [keyPointsSection.sectionType] : []),
  ];
  const deepDiveSections = sections
    .filter((s) => !zone1Types.includes(s.sectionType))
    .sort((a, b) => a.sectionOrder - b.sectionOrder);

  let previousQuestion = data.previousQuestion;
  let nextQuestion = data.nextQuestion;
  if (!previousQuestion || !nextQuestion) {
    const allQuestions = (data.quickQuestions ?? []).map((q) => ({
      ...q,
      stackSlug,
    }));
    const cidx = allQuestions.findIndex((q) => q.slug === questionSlug);
    if (cidx !== -1) {
      if (!previousQuestion && cidx > 0)
        previousQuestion = allQuestions[cidx - 1];
      if (!nextQuestion && cidx < allQuestions.length - 1)
        nextQuestion = allQuestions[cidx + 1];
    }
  }

  const meta = EXPERIENCE_LEVELS[levelKey];
  const readTime = data.estimatedReadTime || 3;
  const totalQuestions = data.quickQuestions?.length ?? 0;
  const currentIdx = (data.quickQuestions ?? []).findIndex(
    (q) => q.slug === questionSlug
  );

  const speakableText = speakableAnswerSection?.content
    ? speakableAnswerSection.content.replace(/^#[^\n]*\n+/, "").trim()
    : "";

  // Zone 2 + Zone 3 both render through the single <MarkdownContent> framework.
  const answerMarkdown = speakableText || v2?.directAnswer || "";
  const deepDiveMarkdown = deepDiveToMarkdown(deepDiveSections);
  const followups = v2?.followupQuestions ?? [];

  const currentQuickQ =
    currentIdx >= 0 ? (data.quickQuestions ?? [])[currentIdx] : undefined;
  const currentTopicName = currentQuickQ?.subcategoryName ?? null;
  const currentTopicSlug = currentQuickQ?.subcategorySlug ?? null;
  const nextTopicName =
    nextQuestion?.subcategoryName &&
    nextQuestion.subcategoryName !== currentTopicName
      ? nextQuestion.subcategoryName
      : null;

  const topicQuestions = currentTopicSlug
    ? (data.quickQuestions ?? []).filter(
        (q) => q.subcategorySlug === currentTopicSlug
      )
    : [];
  const topicIdx = currentTopicSlug
    ? topicQuestions.findIndex((q) => q.slug === questionSlug)
    : -1;

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        d ? "bg-[#111111] text-slate-200" : "bg-surface text-foreground"
      }`}
      style={
        d
          ? {
              backgroundImage: [
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
                "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              ].join(", "),
              backgroundSize: "40px 40px",
            }
          : undefined
      }
    >
      <ReadingProgressBar />
      <ViewTracker questionId={data.id} />
      <CodeHighlighter />

      <div className="flex w-full min-h-screen">
        {/* ── Left sidebar ── */}
        {sidebar && (
          <div className="hidden lg:block shrink-0 self-start sticky top-0 overflow-y-auto max-h-screen">
            {sidebar}
          </div>
        )}

        {/* ── Main content ── */}
        <main
          className={`flex-1 min-w-0 transition-colors duration-300 ${
            d ? "bg-[#1a1a1a]" : "bg-background"
          }`}
        >
          <article
            className={
              sidebar
                ? "px-5 lg:px-7 xl:px-8 py-6 pb-24 lg:pb-16"
                : "px-5 lg:px-7 xl:px-8 py-6 pb-16"
            }
          >
            {/* Breadcrumb */}
            <nav
              className={`flex items-center gap-1 text-xs mb-4 flex-wrap ${
                d ? "text-muted-foreground" : "text-slate-400"
              }`}
            >
              <Link
                href="/"
                className={`transition-colors flex items-center gap-1 ${
                  d
                    ? "hover:text-slate-300"
                    : "hover:text-foreground"
                }`}
              >
                <Home className="h-3 w-3" />
                Home
              </Link>
              {breadcrumbs.map((bc, i) => (
                <span key={i} className="contents">
                  <ChevronRight
                    className={`h-3 w-3 ${
                      d ? "text-secondary" : "text-slate-300"
                    }`}
                  />
                  <Link
                    href={bc.href}
                    className={`transition-colors ${
                      d ? "hover:text-slate-300" : "hover:text-foreground"
                    }`}
                  >
                    {bc.label}
                  </Link>
                </span>
              ))}
              {currentTopicName &&
                currentTopicSlug &&
                breadcrumbs.length > 0 && (
                  <>
                    <ChevronRight
                      className={`h-3 w-3 ${
                        d ? "text-secondary" : "text-slate-300"
                      }`}
                    />
                    <Link
                      href={`${breadcrumbs[breadcrumbs.length - 1].href}#${currentTopicSlug}`}
                      className={`transition-colors font-semibold ${
                        d
                          ? "hover:text-slate-300 text-slate-400"
                          : "hover:text-foreground text-muted-foreground"
                      }`}
                    >
                      {currentTopicName}
                    </Link>
                  </>
                )}
            </nav>

            {/* Sticky position header */}
            {totalQuestions > 0 && currentIdx >= 0 && (
              <div
                className={`sticky top-1 z-30 -mx-2 mb-5 flex items-center gap-2 rounded-lg border px-3 py-2 shadow-lg backdrop-blur ${
                  d
                    ? "border-slate-600/50 bg-[#222222]/95 shadow-black/40"
                    : "border-border bg-background/95 shadow-slate-200/60"
                }`}
              >
                <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap text-[11px]">
                  <span
                    className={`font-black tabular-nums ${
                      d ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    Q {currentIdx + 1}{" "}
                    <span
                      className={`font-bold ${
                        d ? "text-muted-foreground" : "text-slate-400"
                      }`}
                    >
                      of {totalQuestions}
                    </span>
                  </span>
                  {currentTopicName &&
                    topicIdx >= 0 &&
                    topicQuestions.length > 1 && (
                      <>
                        <span
                          className={d ? "text-secondary" : "text-slate-300"}
                        >
                          &middot;
                        </span>
                        <span
                          className={`flex items-center gap-1 font-semibold ${
                            d ? "text-slate-400" : "text-muted-foreground"
                          }`}
                        >
                          <Folder
                            className={`h-3 w-3 ${
                              d ? "text-muted-foreground" : "text-slate-400"
                            }`}
                          />
                          <span>{currentTopicName}</span>
                          <span
                            className={`tabular-nums ${
                              d ? "text-muted-foreground" : "text-slate-400"
                            }`}
                          >
                            ({topicIdx + 1}/{topicQuestions.length})
                          </span>
                        </span>
                      </>
                    )}
                  <span className={d ? "text-secondary" : "text-slate-300"}>
                    &middot;
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      d ? "text-muted-foreground" : "text-slate-400"
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    {readTime}–{Math.min(readTime + 1, 5)} min
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {/* Theme toggle */}
                  <button
                    onClick={toggleTheme}
                    className={`p-1.5 rounded-md transition-colors ${
                      d
                        ? "text-slate-400 hover:text-amber-300 hover:bg-slate-700/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface"
                    }`}
                    aria-label={
                      d ? "Switch to light mode" : "Switch to dark mode"
                    }
                    title={d ? "Light mode" : "Dark mode"}
                  >
                    {d ? (
                      <Sun className="h-3.5 w-3.5" />
                    ) : (
                      <Moon className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {previousQuestion && (
                    <Link
                      prefetch={true}
                      href={buildQuestionUrl(
                        previousQuestion.slug,
                        previousQuestion.stackSlug || stackSlug
                      )}
                      className={`p-1.5 rounded-md transition-colors ${
                        d
                          ? "hover:bg-slate-700/60 text-muted-foreground hover:text-slate-300"
                          : "hover:bg-surface text-slate-400 hover:text-secondary"
                      }`}
                      aria-label={`Previous: ${previousQuestion.title}`}
                      title={`Previous: ${previousQuestion.title}`}
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  {nextQuestion && (
                    <Link
                      prefetch={true}
                      href={buildQuestionUrl(
                        nextQuestion.slug,
                        nextQuestion.stackSlug || stackSlug
                      )}
                      className="p-1.5 rounded-md bg-blue-600 text-primary-foreground dark:text-foreground hover:bg-blue-700 transition-colors"
                      aria-label={`Next: ${nextQuestion.title}`}
                      title={`Next: ${nextQuestion.title}`}
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Title */}
            <h1
              className={`text-[26px] sm:text-[30px] lg:text-[32px] font-black mb-3 leading-[1.15] tracking-[-0.015em] ${
                d ? "text-primary-foreground dark:text-foreground" : "text-foreground"
              }`}
            >
              {data.questionText || data.title}
            </h1>
            {totalQuestions > 0 && breadcrumbs.length > 0 && (
              <p className="mb-5 text-sm">
                <Link
                  href={`${breadcrumbs[breadcrumbs.length - 1].href}#all-questions`}
                  className={`font-semibold underline underline-offset-[3px] transition-colors ${
                    d
                      ? "text-indigo-400 decoration-indigo-700 hover:text-indigo-300 hover:decoration-indigo-500"
                      : "text-indigo-600 decoration-indigo-300 hover:text-indigo-700 hover:decoration-indigo-500"
                  }`}
                >
                  Full question list in order
                </Link>
                <span
                  className={`font-normal ${
                    d ? "text-muted-foreground" : "text-slate-400"
                  }`}
                >
                  {" "}
                  · Q1–Q{totalQuestions} on this module
                </span>
              </p>
            )}

            {/* Meta row */}
            <div
              className={`flex flex-wrap items-center gap-2 text-[12px] mb-8 ${
                d ? "text-slate-400" : "text-muted-foreground"
              }`}
            >
              <span
                className={`font-bold px-2.5 py-0.5 rounded-full border ${meta.colorClass}`}
              >
                {meta.label}
              </span>
              <span className={d ? "text-secondary" : "text-slate-300"}>
                &middot;
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {readTime}–{Math.min(readTime + 1, 5)} min read
              </span>
              {v2?.companyTags && v2.companyTags.length > 0 && (
                <>
                  <span className={d ? "text-secondary" : "text-slate-300"}>
                    &middot;
                  </span>
                  <CompanyTagsBadges companyTags={v2.companyTags} />
                </>
              )}
            </div>

            {/* ── Zone 1: Key Points ── */}
            <QuickAnswer
              keyPointsContent={keyPointsSection?.content}
              directAnswer={v2?.directAnswer}
              legacyExpectation={
                !keyPointsSection && !v2?.directAnswer
                  ? expectationSection?.content
                  : undefined
              }
            />

            {/* ── Interviewer Insight card ── */}
            {v2?.interviewerIntent &&
              (v2.interviewerIntent.testing ||
                v2.interviewerIntent.common_mistake ||
                v2.interviewerIntent.to_stand_out) && (
                <div
                  className={`mb-6 rounded-xl border overflow-hidden ${
                    d
                      ? "border-border/60 bg-[#1e1e1e]"
                      : "border-border bg-surface"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 px-5 py-3 border-b ${
                      d
                        ? "dark:bg-surface/80 border-border/60"
                        : "bg-background border-border"
                    }`}
                  >
                    <Target
                      className={`h-3.5 w-3.5 ${
                        d ? "text-indigo-400" : "text-indigo-500"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-bold uppercase tracking-widest ${
                        d ? "text-slate-300" : "text-muted-foreground"
                      }`}
                    >
                      Interviewer Insight
                    </span>
                  </div>
                  <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {v2.interviewerIntent.testing && (
                      <div
                        className={`rounded-lg px-3 py-2.5 border ${
                          d
                            ? "bg-[#101a2a] border-blue-700/40"
                            : "bg-blue-50/60 border-blue-200/60"
                        }`}
                      >
                        <div
                          className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                            d ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          Testing
                        </div>
                        <p
                          className={`text-[13px] leading-snug ${
                            d ? "text-slate-300" : "text-foreground"
                          }`}
                        >
                          {v2.interviewerIntent.testing}
                        </p>
                      </div>
                    )}
                    {v2.interviewerIntent.common_mistake && (
                      <div
                        className={`rounded-lg px-3 py-2.5 border ${
                          d
                            ? "bg-[#1a1408] border-amber-700/40"
                            : "bg-amber-50/60 border-amber-200/60"
                        }`}
                      >
                        <div
                          className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                            d ? "text-amber-400" : "text-amber-600"
                          }`}
                        >
                          Common Mistake
                        </div>
                        <p
                          className={`text-[13px] leading-snug ${
                            d ? "text-slate-300" : "text-foreground"
                          }`}
                        >
                          {v2.interviewerIntent.common_mistake}
                        </p>
                      </div>
                    )}
                    {v2.interviewerIntent.to_stand_out && (
                      <div
                        className={`rounded-lg px-3 py-2.5 border ${
                          d
                            ? "bg-[#0d1c14] border-emerald-700/40"
                            : "bg-emerald-50/60 border-emerald-200/60"
                        }`}
                      >
                        <div
                          className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                            d ? "text-emerald-400" : "text-emerald-600"
                          }`}
                        >
                          To Stand Out
                        </div>
                        <p
                          className={`text-[13px] leading-snug ${
                            d ? "text-slate-300" : "text-foreground"
                          }`}
                        >
                          {v2.interviewerIntent.to_stand_out}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* ── Zone 2: Interview Answer ── */}
            {answerMarkdown && (
              <section className="mb-6">
                <div
                  className={`rounded-xl overflow-hidden shadow-lg ${
                    d
                      ? "border border-emerald-600/50 bg-[#0d1c15] shadow-black/40"
                      : "border border-emerald-200/70 bg-emerald-50/40 shadow-emerald-100/60"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 px-5 py-2.5 border-b ${
                      d
                        ? "border-emerald-700/50 bg-emerald-900/30"
                        : "border-emerald-200/60 bg-emerald-100/40"
                    }`}
                  >
                    <MessageSquare
                      className={`h-3.5 w-3.5 ${
                        d ? "text-emerald-400" : "text-emerald-600"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-bold uppercase tracking-widest ${
                        d ? "text-emerald-300" : "text-emerald-700"
                      }`}
                    >
                      Interview Answer
                    </span>
                    <span
                      className={`ml-auto text-[11px] ${
                        d ? "text-emerald-500" : "text-emerald-600"
                      }`}
                    >
                      {readTime}–{Math.min(readTime + 1, 5)} min
                    </span>
                  </div>
                  <div className="px-6 py-5 sm:px-7 sm:py-6">
                    <MarkdownContent content={answerMarkdown} />
                    <div
                      className={`mt-5 pt-4 border-t ${
                        d ? "border-emerald-900/50" : "border-emerald-200/50"
                      }`}
                    >
                      <MarkCompleteButton questionId={Number(data.id)} />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ── Zone 3: Deep Dive ── */}
            {deepDiveMarkdown && (
              <section className="mb-6">
                <div
                  className={`rounded-xl overflow-hidden shadow-md ${
                    d
                      ? "border border-border/60 bg-[#1a1a1a] shadow-black/40"
                      : "border border-border bg-background shadow-slate-100/60"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 px-5 py-2.5 border-b ${
                      d
                        ? "border-border/60 dark:bg-surface/60"
                        : "border-border bg-surface"
                    }`}
                  >
                    <BookOpen
                      className={`h-3.5 w-3.5 ${
                        d ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-bold uppercase tracking-widest ${
                        d ? "text-slate-300" : "text-muted-foreground"
                      }`}
                    >
                      Deep dive
                    </span>
                  </div>
                  <div className="px-6 py-5 sm:px-7 sm:py-6">
                    <MarkdownContent content={deepDiveMarkdown} />
                  </div>
                </div>
              </section>
            )}

            {/* ── Follow-up questions ── */}
            {followups.length > 0 && (
              <section className="mb-6">
                <div
                  className={`rounded-xl overflow-hidden ${
                    d
                      ? "border border-indigo-700/40 bg-[#13131f]"
                      : "border border-indigo-200/70 bg-indigo-50/40"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 px-5 py-2.5 border-b ${
                      d
                        ? "border-indigo-800/50 bg-indigo-900/20"
                        : "border-indigo-200/60 bg-indigo-100/40"
                    }`}
                  >
                    <HelpCircle
                      className={`h-3.5 w-3.5 ${
                        d ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-bold uppercase tracking-widest ${
                        d ? "text-indigo-300" : "text-indigo-700"
                      }`}
                    >
                      Follow-up questions
                    </span>
                  </div>
                  <ol className="px-5 py-4 space-y-3">
                    {followups.map((q, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className={`mt-[2px] flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-black border ${
                            d
                              ? "bg-indigo-950/60 text-indigo-300 border-indigo-800/60"
                              : "bg-indigo-50 text-indigo-600 border-indigo-100"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span
                          className={`text-[15px] leading-[1.65] ${
                            d ? "text-slate-200" : "text-foreground"
                          }`}
                        >
                          {q}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            )}

            {/* Prev / Next */}
            <div className="mt-10">
              {nextTopicName && nextQuestion && (
                <div
                  className={`mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${
                    d
                      ? "bg-amber-900/30 border-amber-700/40 text-amber-400"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}
                >
                  <Folder className="h-3 w-3" />
                  Up next: {nextTopicName} topic
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                {previousQuestion && (
                  <Link
                    prefetch={true}
                    href={buildQuestionUrl(
                      previousQuestion.slug,
                      previousQuestion.stackSlug || stackSlug
                    )}
                    className={`sm:w-auto sm:max-w-[40%] flex items-center gap-2 rounded-xl border px-4 py-3 transition-all ${
                      d
                        ? "border-border/60 dark:bg-surface/60 hover:border-slate-600 hover:dark:bg-surface"
                        : "border-border bg-surface hover:border-border hover:bg-surface"
                    }`}
                  >
                    <ArrowLeft
                      className={`h-4 w-4 shrink-0 ${
                        d ? "text-muted-foreground" : "text-slate-400"
                      }`}
                    />
                    <div className="min-w-0">
                      <div
                        className={`text-[10px] font-bold uppercase tracking-wide ${
                          d ? "text-slate-400" : "text-muted-foreground"
                        }`}
                      >
                        Previous
                      </div>
                      <div
                        className={`text-[13px] line-clamp-1 ${
                          d ? "text-slate-300" : "text-secondary"
                        }`}
                      >
                        {previousQuestion.title}
                      </div>
                    </div>
                  </Link>
                )}
                {nextQuestion && (
                  <Link
                    prefetch={true}
                    href={buildQuestionUrl(
                      nextQuestion.slug,
                      nextQuestion.stackSlug || stackSlug
                    )}
                    className="group flex-1 flex items-center justify-between gap-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-primary-foreground dark:text-foreground px-5 py-3 shadow-sm transition-all"
                  >
                    <div className="min-w-0">
                      <div className="text-[10px] font-black uppercase tracking-widest text-blue-200">
                        Continue · Next question
                        {totalQuestions > 0 && currentIdx >= 0 && (
                          <span className="text-blue-100 font-bold">
                            {" "}
                            · Q {currentIdx + 2}/{totalQuestions}
                          </span>
                        )}
                      </div>
                      <div className="text-[14px] font-bold line-clamp-1">
                        {nextQuestion.title}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                )}
              </div>
              {!nextQuestion && previousQuestion && (
                <div
                  className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[12px] font-bold ${
                    d
                      ? "bg-emerald-900/30 border-emerald-700/40 text-emerald-400"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }`}
                >
                  You&apos;ve reached the end of this module — well done.
                </div>
              )}
            </div>

            {/* Up next in roadmap */}
            {nextCurriculumModule && (
              <Link
                href={nextCurriculumModule.href}
                className={`group mt-8 block rounded-xl border hover:shadow-md transition-all overflow-hidden ${
                  d
                    ? "border-emerald-700/40 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 hover:border-emerald-600/60 hover:shadow-emerald-950/30"
                    : "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white hover:border-emerald-300 hover:shadow-emerald-100/60"
                }`}
              >
                <div className="px-5 py-4 flex items-center gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center text-primary-foreground dark:text-foreground text-xs font-black">
                    {nextCurriculumModule.moduleNumber || "→"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${
                        d ? "text-emerald-500" : "text-emerald-600"
                      }`}
                    >
                      Up next in your roadmap
                    </div>
                    <div
                      className={`text-[15px] font-black leading-snug truncate group-hover:text-emerald-600 transition-colors ${
                        d ? "text-slate-100" : "text-foreground"
                      }`}
                    >
                      {nextCurriculumModule.title}
                    </div>
                    {nextCurriculumModule.pillarName && (
                      <div
                        className={`mt-0.5 text-[11px] leading-snug truncate ${
                          d ? "text-slate-400" : "text-muted-foreground"
                        }`}
                      >
                        {nextCurriculumModule.pillarName}
                      </div>
                    )}
                  </div>
                  <ArrowRight
                    className={`h-5 w-5 shrink-0 group-hover:translate-x-0.5 transition-transform ${
                      d ? "text-emerald-600" : "text-emerald-500"
                    }`}
                  />
                </div>
              </Link>
            )}

            {/* Related prep categories */}
            {relatedPillars && relatedPillars.length > 0 && (
              <section
                aria-labelledby="related-prep-heading"
                className={`mt-8 rounded-xl border overflow-hidden ${
                  d
                    ? "border-border/60 dark:bg-surface/40"
                    : "border-border bg-surface/60"
                }`}
              >
                <div
                  className={`px-5 py-3 border-b flex items-center gap-2 ${
                    d
                      ? "border-border/60 dark:bg-surface/60"
                      : "border-border bg-background"
                  }`}
                >
                  <Compass className="h-4 w-4 text-indigo-400" />
                  <h2
                    id="related-prep-heading"
                    className={`text-sm font-black tracking-tight ${
                      d ? "text-slate-200" : "text-foreground"
                    }`}
                  >
                    Related interview prep categories
                  </h2>
                  <span
                    className={`ml-auto text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      d
                        ? "bg-indigo-900/60 text-indigo-300"
                        : "bg-indigo-100 text-indigo-600"
                    }`}
                  >
                    {relatedPillars.length}
                  </span>
                </div>
                <div className="px-3 sm:px-4 py-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {relatedPillars.map((p) => (
                      <Link
                        key={p.pillarSlug}
                        href={`/${p.pillarSlug}`}
                        className={`group flex items-start gap-2.5 rounded-lg border px-3 py-2.5 transition-all ${
                          d
                            ? "border-border/60 dark:bg-surface/60 hover:border-indigo-600/50 hover:bg-slate-700/60"
                            : "border-border bg-background hover:border-indigo-300 hover:bg-indigo-50/40"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-[13px] font-black leading-snug group-hover:text-indigo-500 transition-colors ${
                              d ? "text-slate-200" : "text-foreground"
                            }`}
                          >
                            {p.title.replace(/\s+Interview Prep$/, "")}
                          </div>
                          <div
                            className={`mt-0.5 text-[11px] leading-snug line-clamp-1 ${
                              d ? "text-slate-400" : "text-muted-foreground"
                            }`}
                          >
                            {p.tagline}
                          </div>
                        </div>
                        <ChevronRight
                          className={`h-3.5 w-3.5 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 ${
                            d
                              ? "text-secondary group-hover:text-indigo-400"
                              : "text-slate-300 group-hover:text-indigo-500"
                          }`}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Roadmap CTA */}
            {roadmapCta && (
              <section
                aria-labelledby="roadmap-cta-heading"
                className={`mt-8 rounded-xl border shadow-sm overflow-hidden ${
                  d
                    ? "border-indigo-700/40 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900"
                    : "border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-white"
                }`}
              >
                <div className="p-5 flex items-start gap-4 flex-wrap">
                  <div className="shrink-0 w-11 h-11 rounded-lg bg-indigo-700 flex items-center justify-center">
                    <Compass className="h-5 w-5 text-primary-foreground dark:text-foreground" />
                  </div>
                  <div className="flex-1 min-w-[220px]">
                    <div
                      className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                        d ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    >
                      Full prep
                    </div>
                    <h2
                      id="roadmap-cta-heading"
                      className={`text-base font-black mb-1 leading-snug ${
                        d ? "text-slate-100" : "text-foreground"
                      }`}
                    >
                      {roadmapCta.title}
                    </h2>
                    <p
                      className={`text-[13px] leading-relaxed ${
                        d ? "text-slate-400" : "text-muted-foreground"
                      }`}
                    >
                      {roadmapCta.tagline}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <Link
                      href={roadmapCta.href}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-primary-foreground dark:text-foreground font-bold text-sm hover:bg-indigo-700 shadow-sm transition-colors"
                    >
                      {roadmapCta.ctaLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    {roadmapCta.secondaryHref && roadmapCta.secondaryLabel && (
                      <Link
                        href={roadmapCta.secondaryHref}
                        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border font-bold text-sm transition-colors ${
                          d
                            ? "bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                            : "bg-background border-border text-foreground hover:bg-surface"
                        }`}
                      >
                        {roadmapCta.secondaryLabel}
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            )}

            <CompletionTrigger questionId={data.id} />
          </article>
        </main>

        {/* ── Right sidebar ── */}
        <aside
          className={`hidden xl:flex w-[280px] shrink-0 flex-col self-start sticky top-0 border-l overflow-y-auto max-h-screen transition-colors duration-300 ${
            d
              ? "border-border/50 bg-[#1a1a1a]"
              : "border-border/80 bg-background"
          }`}
        >
          {/* Theme toggle at top of sidebar */}
          <div
            className={`px-5 py-3 border-b flex items-center justify-between ${
              d ? "border-border/50" : "border-slate-100"
            }`}
          >
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                d ? "text-muted-foreground" : "text-slate-400"
              }`}
            >
              {d ? "Dark mode" : "Light mode"}
            </span>
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                d
                  ? "border-slate-600 dark:bg-surface text-slate-300 hover:border-amber-500/60 hover:text-amber-300"
                  : "border-border bg-surface text-secondary hover:border-border hover:text-foreground"
              }`}
              aria-label={d ? "Switch to light mode" : "Switch to dark mode"}
            >
              {d ? (
                <>
                  <Sun className="h-3 w-3" />
                  Light
                </>
              ) : (
                <>
                  <Moon className="h-3 w-3" />
                  Dark
                </>
              )}
            </button>
          </div>

          {/* Progress */}
          {totalQuestions > 0 && currentIdx >= 0 && (
            <div
              className={`px-5 py-4 border-b ${
                d ? "border-border/50" : "border-slate-100"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    d ? "text-slate-400" : "text-muted-foreground"
                  }`}
                >
                  Progress
                </span>
                <span
                  className={`text-sm font-bold ${
                    d ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {currentIdx + 1}/{totalQuestions}
                </span>
              </div>
              <div
                className={`w-full h-1.5 rounded-full overflow-hidden ${
                  d ? "bg-slate-700" : "bg-slate-200"
                }`}
              >
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{
                    width: `${((currentIdx + 1) / totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div
            className={`px-5 py-4 border-b space-y-2.5 ${
              d ? "border-border/50" : "border-slate-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[13px] flex items-center gap-1.5 ${
                  d ? "text-slate-400" : "text-muted-foreground"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                Answer time
              </span>
              <span
                className={`text-[13px] font-semibold ${
                  d ? "text-slate-300" : "text-secondary"
                }`}
              >
                {readTime}–{Math.min(readTime + 1, 5)} min
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-[13px] flex items-center gap-1.5 ${
                  d ? "text-slate-400" : "text-muted-foreground"
                }`}
              >
                <Target className="h-3.5 w-3.5" />
                Level
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${meta.colorClass}`}
              >
                {meta.label}
              </span>
            </div>
          </div>

          {/* Company Tags */}
          {v2?.companyTags && v2.companyTags.length > 0 && (
            <div
              className={`px-5 py-4 border-b ${
                d ? "border-border/50" : "border-slate-100"
              }`}
            >
              <div
                className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${
                  d ? "text-slate-400" : "text-muted-foreground"
                }`}
              >
                Asked at
              </div>
              <div className="flex flex-wrap gap-1.5">
                {v2.companyTags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[12px] font-medium px-2.5 py-0.5 rounded-full border ${
                      d
                        ? "text-slate-300 dark:bg-surface border-border"
                        : "text-secondary bg-surface border-border"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mock Interview CTA */}
          <div
            className={`px-5 py-4 border-b ${
              d ? "border-border/50" : "border-slate-100"
            }`}
          >
            <Link
              href="/mock-interviews"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-indigo-600 text-primary-foreground dark:text-foreground text-sm font-bold hover:bg-indigo-700 transition-colors"
            >
              <PlayCircle className="h-4 w-4" />
              Mock Interview
            </Link>
          </div>

          {/* In This Stack */}
          {data.quickQuestions && data.quickQuestions.length > 0 && (
            <div className="px-5 py-4 flex-1">
              <div
                className={`text-[11px] font-bold uppercase tracking-wider mb-2.5 ${
                  d ? "text-slate-400" : "text-muted-foreground"
                }`}
              >
                In this stack
              </div>
              <ul className="space-y-0.5">
                {data.quickQuestions.slice(0, 30).map((q, i) => (
                  <li key={q.slug}>
                    <Link
                      href={buildQuestionUrl(q.slug, q.stackSlug || stackSlug)}
                      className={`block text-[13px] py-1.5 px-2 rounded-md transition-colors leading-snug ${
                        q.slug === questionSlug
                          ? d
                            ? "bg-blue-900/40 text-blue-300 font-semibold"
                            : "bg-blue-50 text-blue-700 font-semibold"
                          : d
                          ? "text-slate-400 hover:text-slate-100 hover:dark:bg-surface/70"
                          : "text-muted-foreground hover:text-foreground hover:bg-surface"
                      }`}
                    >
                      <span
                        className={`mr-1 text-[11px] ${
                          d ? "text-secondary" : "text-slate-400"
                        }`}
                      >
                        {i + 1}.
                      </span>
                      {q.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

// Wrap the inner component in the theme provider so all children have access
export default function QuestionPageLayout(props: QuestionPageLayoutProps) {
  return (
    <ContentThemeProvider>
      <QuestionPageLayoutInner {...props} />
    </ContentThemeProvider>
  );
}
