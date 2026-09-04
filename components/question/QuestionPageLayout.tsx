"use client";

import { useEffect, useState } from "react";
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
  PanelLeftOpen,
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
import { InterviewSpeakingStudio } from "./InterviewSpeakingStudio";
import { QuickAnswer } from "./QuickAnswer";
import { SectionRenderer } from "./DetailedExplanation";
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

type DeepDiveTone = "blue" | "green" | "amber";

function deepDivePresentation(section: AnswerSection, index: number): {
  label: string;
  tone: DeepDiveTone;
} {
  const type = section.sectionType;

  if (type === "code_example" || type === "before_code" || type === "after_code") {
    return { label: "See it in code", tone: "green" };
  }
  if (type.includes("diagram") || type === "concept_map") {
    return { label: "Visualise it", tone: "blue" };
  }
  if (type === "comparison_table" || type === "tradeoffs") {
    return { label: "Compare", tone: "amber" };
  }
  if (
    type.includes("mistake") ||
    type.includes("warning") ||
    type.includes("pitfall") ||
    type === "problem_statement" ||
    type === "diagnosis"
  ) {
    return { label: "Watch the boundary", tone: "amber" };
  }
  if (
    type === "when_to_use" ||
    type === "real_world_example" ||
    type === "scenario_based" ||
    type === "best_practices"
  ) {
    return { label: "Apply it", tone: "green" };
  }

  return { label: index === 0 ? "Understand" : "Build the model", tone: "blue" };
}

const deepDiveToneClasses: Record<DeepDiveTone, {
  dot: string;
  label: string;
  number: string;
  edge: string;
}> = {
  blue: {
    dot: "bg-primary",
    label: "text-primary",
    number: "border-primary/20 bg-primary/[0.055] text-primary",
    edge: "border-t-primary/45",
  },
  green: {
    dot: "bg-success",
    label: "text-success",
    number: "border-success/20 bg-success/[0.055] text-success",
    edge: "border-t-success/45",
  },
  amber: {
    dot: "bg-warning",
    label: "text-amber-700 dark:text-amber-300",
    number: "border-warning/25 bg-warning/[0.065] text-amber-700 dark:text-amber-300",
    edge: "border-t-warning/50",
  },
};

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
  const logoSource = questionUrlPrefix.toLowerCase();
  const technologySlug = logoSource.includes("frontend")
    ? "javascript"
    : ["java", "go", "python", "ruby", "javascript", "typescript", "kotlin", "cplusplus", "csharp"]
        .find((slug) => logoSource.includes(`/${slug}-`) || logoSource.includes(`/${slug}/`));
  const { theme, toggleTheme } = useContentTheme();
  const d = theme === "dark";
  const [curriculumOpen, setCurriculumOpen] = useState(false);

  useEffect(() => {
    if (!curriculumOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCurriculumOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [curriculumOpen]);

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

  const previewQuestionCount = Math.min(6, topicQuestions.length);
  const previewStart = Math.max(
    0,
    Math.min(topicIdx - 2, topicQuestions.length - previewQuestionCount)
  );
  const previewQuestions = topicQuestions.slice(
    previewStart,
    previewStart + previewQuestionCount
  );

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        d ? "bg-background text-muted-foreground" : "bg-surface text-foreground"
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
        {sidebar && currentTopicName && (
          <aside
            className={`hidden lg:flex w-[244px] shrink-0 self-start sticky top-0 h-screen flex-col border-r px-3 py-4 transition-colors ${
              d ? "border-border/60 bg-surface" : "border-primary/10 bg-surface/70"
            }`}
            aria-label={`${currentTopicName} question preview`}
          >
            <button
              type="button"
              onClick={() => setCurriculumOpen(true)}
              className="group flex items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-primary/5"
              aria-label={`Show all ${topicQuestions.length} ${currentTopicName} questions`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                  Current topic
                </span>
                <span className="block truncate text-xs font-extrabold text-foreground">
                  {currentTopicName}
                </span>
              </span>
              <PanelLeftOpen className="h-4 w-4 shrink-0 text-primary" />
            </button>

            <div className="mt-3 flex items-center justify-between border-y border-border/70 px-2 py-2">
              <span className="text-[10px] font-bold text-muted-foreground">
                Questions in this topic
              </span>
              <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-extrabold tabular-nums text-primary">
                Q {Math.max(topicIdx + 1, 1)} of {topicQuestions.length}
              </span>
            </div>

            <ol className="mt-2 min-h-0 flex-1 space-y-0.5 overflow-hidden">
              {previewQuestions.map((question, previewIndex) => {
                const questionIndex = previewStart + previewIndex;
                const active = question.slug === questionSlug;
                return (
                  <li key={question.slug}>
                    <Link
                      href={buildQuestionUrl(
                        question.slug,
                        question.stackSlug || stackSlug
                      )}
                      className={`flex items-start gap-2 rounded-lg px-2 py-2 text-[11.5px] leading-snug transition-colors ${
                        active
                          ? "bg-primary/10 font-bold text-primary ring-1 ring-primary/15"
                          : "text-muted-foreground hover:bg-background hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[8px] ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background"
                        }`}
                      >
                        {active ? "✓" : ""}
                      </span>
                      <span className="w-5 shrink-0 text-[9px] font-bold tabular-nums text-muted-foreground">
                        {String(questionIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="line-clamp-2 flex-1">{question.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>

            <button
              type="button"
              onClick={() => setCurriculumOpen(true)}
              className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-primary/20 bg-background px-3 py-2.5 text-xs font-bold text-foreground shadow-sm transition-colors hover:border-primary/35 hover:text-primary"
            >
              Show all {topicQuestions.length} questions
              <PanelLeftOpen className="h-4 w-4 text-primary" />
            </button>
          </aside>
        )}

        {/* ── Main content ── */}
        <main
          className={`flex-1 min-w-0 transition-colors duration-200 ${
            d ? "bg-surface" : "bg-background"
          }`}
        >
          <article
            className={`mx-auto w-full max-w-[1280px] ${
              sidebar
                ? "px-5 lg:px-7 xl:px-8 py-6 pb-24 lg:pb-16"
                : "px-5 lg:px-7 xl:px-8 py-6 pb-16"
            }`}
          >
            {/* Compact route context — curriculum opens without consuming width. */}
            <div
              className={`sticky top-0 z-[var(--z-sticky)] -mx-2 mb-6 flex flex-col gap-3 rounded-xl border px-3 py-2.5 shadow-sm backdrop-blur sm:flex-row sm:items-center ${
                d
                  ? "border-border/60 bg-surface/95"
                  : "border-primary/10 bg-background/95 shadow-slate-200/50"
              }`}
            >
              <nav
                aria-label="Question route"
                className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto whitespace-nowrap text-[12px] sm:text-[13px]"
              >
                {breadcrumbs.map((bc, index) => (
                  <span key={bc.href} className="contents">
                    {index > 0 && (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                    )}
                    <Link
                      href={bc.href}
                      className="font-semibold text-muted-foreground transition-colors hover:text-primary"
                    >
                      {bc.label}
                    </Link>
                  </span>
                ))}
                {currentTopicName && currentTopicSlug && (
                  <>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                    <Link
                      href={`${breadcrumbs[breadcrumbs.length - 1]?.href}#${currentTopicSlug}`}
                      className="font-bold text-foreground transition-colors hover:text-primary"
                    >
                      {currentTopicName}
                    </Link>
                  </>
                )}
                {topicIdx >= 0 && topicQuestions.length > 0 && (
                  <>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                    <span className="rounded-md bg-primary/10 px-2 py-1 font-extrabold tabular-nums text-primary">
                      Q {topicIdx + 1} of {topicQuestions.length}
                    </span>
                  </>
                )}
              </nav>

              <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-auto">
                {previousQuestion && (
                  <Link
                    href={buildQuestionUrl(
                      previousQuestion.slug,
                      previousQuestion.stackSlug || stackSlug
                    )}
                    className="touch-target inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                    aria-label={`Previous: ${previousQuestion.title}`}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Previous</span>
                  </Link>
                )}
                {nextQuestion && (
                  <Link
                    href={buildQuestionUrl(
                      nextQuestion.slug,
                      nextQuestion.stackSlug || stackSlug
                    )}
                    className="touch-target inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                    aria-label={`Next: ${nextQuestion.title}`}
                  >
                    <span className="hidden md:inline">Next</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
                {sidebar && (
                  <button
                    type="button"
                    onClick={() => setCurriculumOpen(true)}
                    className="touch-target inline-flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs font-extrabold text-primary transition-colors hover:border-primary/40 hover:bg-primary/10"
                    aria-haspopup="dialog"
                    aria-expanded={curriculumOpen}
                  >
                    <BookOpen className="h-4 w-4" />
                    All {topicQuestions.length} questions
                  </button>
                )}
              </div>
              <span className="absolute inset-x-3 bottom-0 h-px bg-primary/20" />
            </div>

            {/* Breadcrumb */}
            <nav
              className={`hidden items-center gap-1 text-xs mb-4 flex-wrap ${
                d ? "text-muted-foreground" : "text-muted-foreground"
              }`}
            >
              <Link
                href="/"
                className={`transition-colors flex items-center gap-1 ${
                  d
                    ? "hover:text-muted-foreground"
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
                      d ? "text-muted-foreground" : "text-muted-foreground"
                    }`}
                  />
                  <Link
                    href={bc.href}
                    className={`transition-colors ${
                      d ? "hover:text-muted-foreground" : "hover:text-foreground"
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
                        d ? "text-muted-foreground" : "text-muted-foreground"
                      }`}
                    />
                    <Link
                      href={`${breadcrumbs[breadcrumbs.length - 1].href}#${currentTopicSlug}`}
                      className={`transition-colors font-semibold ${
                        d
                          ? "hover:text-muted-foreground text-muted-foreground"
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
                className={`hidden sticky top-1 z-[var(--z-sticky)] -mx-2 mb-5 items-center gap-2 rounded-lg border px-3 py-2 shadow-lg backdrop-blur ${
                  d
                    ? "border-slate-600 dark:border-slate-700/50 bg-surface-elevated/95 shadow-black/40"
                    : "border-border bg-background/95 shadow-slate-200/60"
                }`}
              >
                <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap text-[11px]">
                  <span
                    className={`font-extrabold tabular-nums ${
                      d ? "text-primary" : "text-primary dark:text-primary"
                    }`}
                  >
                    Q {currentIdx + 1}{" "}
                    <span
                      className={`font-bold ${
                        d ? "text-muted-foreground" : "text-muted-foreground"
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
                          className={d ? "text-muted-foreground" : "text-muted-foreground"}
                        >
                          &middot;
                        </span>
                        <span
                          className={`flex items-center gap-1 font-semibold ${
                            d ? "text-muted-foreground" : "text-muted-foreground"
                          }`}
                        >
                          <Folder
                            className={`h-3 w-3 ${
                              d ? "text-muted-foreground" : "text-muted-foreground"
                            }`}
                          />
                          <span>{currentTopicName}</span>
                          <span
                            className={`tabular-nums ${
                              d ? "text-muted-foreground" : "text-muted-foreground"
                            }`}
                          >
                            ({topicIdx + 1}/{topicQuestions.length})
                          </span>
                        </span>
                      </>
                    )}
                  <span className={d ? "text-muted-foreground" : "text-muted-foreground"}>
                    &middot;
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      d ? "text-muted-foreground" : "text-muted-foreground"
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
                    className={`touch-target p-1.5 rounded-md transition-colors ${
                      d
                        ? "text-muted-foreground hover:text-warning hover:bg-slate-700 dark:bg-slate-800/60"
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
                      className={`touch-target p-1.5 rounded-md transition-colors ${
                        d
                          ? "hover:bg-slate-700 dark:bg-slate-800/60 text-muted-foreground hover:text-muted-foreground"
                          : "hover:bg-surface text-muted-foreground hover:text-muted-foreground"
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
                      className="touch-target p-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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
              className={`type-display text-[26px] sm:text-[30px] lg:text-[32px] font-extrabold mb-3 leading-[1.15] tracking-[-0.015em] ${
                d ? "text-white" : "text-foreground"
              }`}
            >
              {data.questionText || data.title}
            </h1>
            {/* Meta row */}
            <div
              className={`flex flex-wrap items-center gap-2 text-[12px] mb-8 ${
                d ? "text-muted-foreground" : "text-muted-foreground"
              }`}
            >
              <span
                className={`font-bold px-2.5 py-0.5 rounded-full border ${meta.colorClass}`}
              >
                {meta.label}
              </span>
              <span className={d ? "text-muted-foreground" : "text-muted-foreground"}>
                &middot;
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {readTime}–{Math.min(readTime + 1, 5)} min read
              </span>
              {v2?.companyTags && v2.companyTags.length > 0 && (
                <>
                  <span className={d ? "text-muted-foreground" : "text-muted-foreground"}>
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
                  className={`hidden mb-6 rounded-xl border overflow-hidden ${
                    d
                      ? "border-border/60 bg-code"
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
                        d ? "text-primary dark:text-primary" : "text-primary dark:text-primary"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-bold uppercase tracking-widest ${
                        d ? "text-muted-foreground" : "text-muted-foreground"
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
                            ? "bg-info/10 border-default dark:border-default/40"
                            : "bg-primary/10 border-primary/20"
                        }`}
                      >
                        <div
                          className={`text-[10px] font-extrabold uppercase tracking-widest mb-1 ${
                            d ? "text-primary" : "text-primary dark:text-primary"
                          }`}
                        >
                          Testing
                        </div>
                        <p
                          className={`text-[13px] leading-snug ${
                            d ? "text-muted-foreground" : "text-foreground"
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
                            ? "bg-warning/10 border-default dark:border-default/40"
                            : "bg-warning/10 border-warning/20"
                        }`}
                      >
                        <div
                          className={`text-[10px] font-extrabold uppercase tracking-widest mb-1 text-warning`}
                        >
                          Common Mistake
                        </div>
                        <p
                          className={`text-[13px] leading-snug ${
                            d ? "text-muted-foreground" : "text-foreground"
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
                            ? "bg-success/10 border-default dark:border-default/40"
                            : "bg-success/10 border-success/20"
                        }`}
                      >
                        <div
                          className={`text-[10px] font-extrabold uppercase tracking-widest mb-1 text-success`}
                        >
                          To Stand Out
                        </div>
                        <p
                          className={`text-[13px] leading-snug ${
                            d ? "text-muted-foreground" : "text-foreground"
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
              <section className="hidden mb-6" aria-hidden="true">
                <div
                  className={`rounded-xl overflow-hidden shadow-lg ${
                    d
                      ? "border border-default dark:border-default/50 bg-success/10 shadow-black/40"
                      : "border border-success/20 bg-success/10 shadow-sm"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 px-5 py-2.5 border-b ${
                      d
                        ? "border-default dark:border-default/50 bg-success/20"
                        : "border-success/20 bg-success/10"
                    }`}
                  >
                    <MessageSquare
                      className={`h-3.5 w-3.5 text-success`}
                    />
                    <span
                      className={`text-[11px] font-bold uppercase tracking-widest text-success`}
                    >
                      Interview Answer
                    </span>
                    <span
                      className={`ml-auto text-[11px] text-success`}
                    >
                      {readTime}–{Math.min(readTime + 1, 5)} min
                    </span>
                  </div>
                  <div className="px-6 py-5 sm:px-7 sm:py-6">
                    <MarkdownContent content={answerMarkdown} />
                    <div
                      className={`mt-5 pt-4 border-t ${
                        d ? "border-default dark:border-default/50" : "border-default dark:border-default/20"
                      }`}
                    >
                      <MarkCompleteButton questionId={Number(data.id)} />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ── Zone 2: practise one complete, detailed interview answer ── */}
            {answerMarkdown && (
              <InterviewSpeakingStudio
                content={answerMarkdown}
                questionId={Number(data.id)}
                technologySlug={technologySlug}
                cues={speakableAnswerSection?.speakingCues}
                speakableV2={v2?.speakableV2}
              />
            )}

            {/* ── Zone 3: Deep Dive ── */}
            {deepDiveSections.length > 0 && (
              <section className="mb-6" data-testid="deep-dive">
                <div
                  className={`overflow-hidden rounded-2xl border shadow-sm ${
                    d
                      ? "border-border/60 bg-surface shadow-black/30"
                      : "border-slate-200 bg-[#fffdf9] shadow-slate-200/50"
                  }`}
                >
                  <div
                    className={`flex flex-wrap items-center gap-3 border-b px-5 py-4 sm:px-6 ${
                      d
                        ? "border-border/60 bg-slate-950"
                        : "border-slate-800 bg-[#172033]"
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] text-[11px] font-extrabold tabular-nums text-blue-200">
                      03
                    </span>
                    <BookOpen className="h-4 w-4 shrink-0 text-blue-300" />
                    <div className="min-w-0 flex-1">
                      <h2 className="text-[14px] font-extrabold text-white">Deep dive</h2>
                      <p className="mt-0.5 text-[11.5px] text-slate-300">
                        Build the mental model, see it work, then test your understanding.
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-[10.5px] font-semibold text-slate-300">
                      <span className="rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1">
                        {deepDiveSections.length} focused {deepDiveSections.length === 1 ? "part" : "parts"}
                      </span>
                      {deepDiveSections.some((section) => section.sectionType.includes("code")) && (
                        <span className="hidden items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-2.5 py-1 text-emerald-200 sm:inline-flex">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                          Code included
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`px-4 py-5 sm:px-6 sm:py-6 ${d ? "bg-surface" : "bg-stone-50/55"}`}>
                    <div className="relative space-y-4">
                      <span className={`absolute bottom-7 left-[17px] top-7 w-px ${d ? "bg-border/70" : "bg-slate-200"}`} aria-hidden="true" />
                      {deepDiveSections.map((section, index) => {
                        const presentation = deepDivePresentation(section, index);
                        const tone = deepDiveToneClasses[presentation.tone];
                        return (
                          <article
                            key={`${section.sectionType}-${index}`}
                            className="relative pl-11 sm:pl-12"
                          >
                            <span className={`absolute left-0 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl border text-[10px] font-extrabold tabular-nums shadow-sm ${tone.number}`}>
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className={`overflow-hidden rounded-xl border border-t-2 px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.035)] transition-colors sm:px-5 sm:py-5 ${tone.edge} ${d ? "border-x-border/55 border-b-border/55 bg-surface-elevated/20" : "border-x-stone-200 border-b-stone-200 bg-white hover:border-x-slate-300 hover:border-b-slate-300"}`}>
                              <div className="mb-3 flex items-center gap-2">
                                <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                                <span className={`text-[10px] font-extrabold uppercase tracking-[0.14em] ${tone.label}`}>
                                  {presentation.label}
                                </span>
                              </div>
                              <SectionRenderer section={section} theme={theme} />
                            </div>
                          </article>
                        );
                      })}
                    </div>

                    {followups.length > 0 && (
                      <div className={`ml-11 mt-5 overflow-hidden rounded-xl border sm:ml-12 ${d ? "border-border/55 bg-surface-elevated/20" : "border-amber-200/70 bg-white"}`}>
                        <div className={`flex items-center gap-2 border-b px-4 py-3 sm:px-5 ${d ? "border-border/55 bg-warning/[0.05]" : "border-amber-100 bg-amber-50/65"}`}>
                          <HelpCircle className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                          <div>
                            <h3 className="text-[12px] font-extrabold text-foreground">Check your understanding</h3>
                            <p className="mt-0.5 text-[10.5px] text-muted-foreground">Answer these without looking back.</p>
                          </div>
                        </div>
                        <ol className="grid gap-px bg-border/55 sm:grid-cols-2">
                          {followups.map((question, index) => (
                            <li key={question} className={`flex gap-3 px-4 py-3.5 text-[12.5px] leading-relaxed text-foreground sm:px-5 ${d ? "bg-surface" : "bg-white"}`}>
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-amber-200 bg-amber-50 text-[9px] font-extrabold text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200">{index + 1}</span>
                              <span>{question}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* ── Follow-up questions ── */}
            {followups.length > 0 && (
              <section className="hidden mb-6" aria-live="polite">
                <div
                  className={`rounded-xl overflow-hidden ${
                    d
                      ? "border border-default dark:border-default/40 bg-surface"
                      : "border border-primary/20 bg-primary/10"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 px-5 py-2.5 border-b ${
                      d
                        ? "border-default dark:border-default/50 bg-primary/20"
                        : "border-primary/20 bg-primary/10"
                    }`}
                  >
                    <HelpCircle
                      className={`h-3.5 w-3.5 text-primary`}
                    />
                    <span
                      className={`text-[11px] font-bold uppercase tracking-widest text-primary`}
                    >
                      Follow-up questions
                    </span>
                  </div>
                  <ol className="px-5 py-4 space-y-3">
                    {followups.map((q, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className={`mt-[2px] flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-extrabold border ${
                            d
                              ? "bg-primary/20 text-primary border-default dark:border-default/60"
                              : "bg-primary/10 text-primary dark:text-primary border-default dark:border-default/20"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span
                          className={`text-[15px] leading-[1.65] ${
                            d ? "text-muted-foreground" : "text-foreground"
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
                      ? "bg-warning/10 border-default/40 text-warning"
                      : "bg-warning/10 border-default dark:border-default/20 text-warning"
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
                    className={`sm:w-auto sm:max-w-[40%] flex items-center gap-2 rounded-xl border px-4 py-3 transition-colors ${
                      d
                        ? "border-border/60 bg-surface/60 hover:border-border hover:bg-hover"
                        : "border-border bg-surface hover:border-border hover:bg-surface"
                    }`}
                  >
                    <ArrowLeft
                      className={`h-4 w-4 shrink-0 ${
                        d ? "text-muted-foreground" : "text-muted-foreground"
                      }`}
                    />
                    <div className="min-w-0">
                      <div
                        className={`text-[10px] font-bold uppercase tracking-wide ${
                          d ? "text-muted-foreground" : "text-muted-foreground"
                        }`}
                      >
                        Previous
                      </div>
                      <div
                        className={`text-[13px] line-clamp-1 ${
                          d ? "text-muted-foreground" : "text-muted-foreground"
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
                    className="group flex-1 flex items-center justify-between gap-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-3 shadow-sm transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-[10px] font-extrabold uppercase tracking-widest text-primary-foreground/80">
                        Continue · Next question
                        {totalQuestions > 0 && currentIdx >= 0 && (
                          <span className="text-primary-foreground/60 font-bold">
                            {" "}
                            · Q {currentIdx + 2}/{totalQuestions}
                          </span>
                        )}
                      </div>
                      <div className="text-[14px] font-bold line-clamp-1">
                        {nextQuestion.title}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 transition-colors" />
                  </Link>
                )}
              </div>
              {!nextQuestion && previousQuestion && (
                <div
                  className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[12px] font-bold ${
                    d
                      ? "bg-success/10 border-default/40 text-success"
                      : "bg-success/10 border-default dark:border-default/20 text-success"
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
                className={`group mt-8 block rounded-xl border hover:shadow-md transition-colors overflow-hidden ${
                  d
                    ? "border-default/40 bg-surface hover:border-default/60 hover:shadow-sm"
                    : "border-default dark:border-default/20 bg-gradient-to-br  via-white to-white dark:via-zinc-900 dark:to-zinc-900 hover:border-default dark:border-default/30 hover:shadow-sm"
                }`}
              >
                <div className="px-5 py-4 flex items-center gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-success flex items-center justify-center text-white text-xs font-extrabold">
                    {nextCurriculumModule.moduleNumber || "→"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-[10px] font-extrabold uppercase tracking-widest mb-0.5 text-success`}
                    >
                      Up next in your roadmap
                    </div>
                    <div
                      className={`text-[15px] font-extrabold leading-snug truncate group-hover:text-success transition-colors ${
                        d ? "text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {nextCurriculumModule.title}
                    </div>
                    {nextCurriculumModule.pillarName && (
                      <div
                        className={`mt-0.5 text-[11px] leading-snug truncate ${
                          d ? "text-muted-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {nextCurriculumModule.pillarName}
                      </div>
                    )}
                  </div>
                  <ArrowRight
                    className={`h-5 w-5 shrink-0 transition-colors text-success`}
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
                  <Compass className="h-4 w-4 text-primary dark:text-primary" />
                  <h2
                    id="related-prep-heading"
                    className={`text-sm font-extrabold tracking-tight ${
                      d ? "text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    Related interview prep categories
                  </h2>
                  <span
                    className={`ml-auto text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      d
                        ? "bg-primary/20 text-primary"
                        : "bg-primary/10 text-primary dark:text-primary"
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
                        className={`group flex items-start gap-2.5 rounded-lg border px-3 py-2.5 transition-colors ${
                          d
                            ? "border-border/60 dark:bg-surface/60 hover:border-default dark:border-default/50 hover:bg-slate-700 dark:bg-slate-800/60"
                            : "border-border bg-background hover:border-default hover:bg-primary/10"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-[13px] font-extrabold leading-snug group-hover:text-primary dark:group-hover:text-primary transition-colors ${
                              d ? "text-muted-foreground" : "text-foreground"
                            }`}
                          >
                            {p.title.replace(/\s+Interview Prep$/, "")}
                          </div>
                          <div
                            className={`mt-0.5 text-[11px] leading-snug line-clamp-1 ${
                              d ? "text-muted-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {p.tagline}
                          </div>
                        </div>
                        <ChevronRight
                          className={`h-3.5 w-3.5 shrink-0 mt-0.5 transition-colors ${
                            d
                              ? "text-muted-foreground group-hover:text-primary dark:group-hover:text-primary"
                              : "text-muted-foreground group-hover:text-primary dark:group-hover:text-primary"
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
                    ? "border-default/40 bg-surface"
                    : "border-default dark:border-default/20 bg-gradient-to-br  via-white to-white dark:via-zinc-900 dark:to-zinc-900"
                }`}
              >
                <div className="p-5 flex items-start gap-4 flex-wrap">
                  <div className="shrink-0 w-11 h-11 rounded-lg bg-primary flex items-center justify-center">
                    <Compass className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-[220px]">
                    <div
                      className={`text-[10px] font-extrabold uppercase tracking-widest mb-1 text-primary`}
                    >
                      Full prep
                    </div>
                    <h2
                      id="roadmap-cta-heading"
                      className={`text-base font-extrabold mb-1 leading-snug ${
                        d ? "text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {roadmapCta.title}
                    </h2>
                    <p
                      className={`text-[13px] leading-relaxed ${
                        d ? "text-muted-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {roadmapCta.tagline}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <Link
                      href={roadmapCta.href}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 shadow-sm transition-colors"
                    >
                      {roadmapCta.ctaLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    {roadmapCta.secondaryHref && roadmapCta.secondaryLabel && (
                      <Link
                        href={roadmapCta.secondaryHref}
                        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border font-bold text-sm transition-colors ${
                          d
                            ? "bg-slate-700 dark:bg-slate-800 border-slate-600 dark:border-slate-700 text-muted-foreground hover:bg-slate-600 dark:bg-slate-800"
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
          className={`hidden w-[280px] shrink-0 flex-col self-start sticky top-0 border-l overflow-y-auto h-screen transition-colors duration-200 ${
            d
              ? "border-border/50 bg-surface"
              : "border-border/80 bg-background"
          }`}
        >
          {/* Theme toggle at top of sidebar */}
          <div
            className={`px-5 py-3 border-b flex items-center justify-between ${
              d ? "border-border/50" : "border-slate-100 dark:border-slate-800/60"
            }`}
          >
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                d ? "text-muted-foreground" : "text-muted-foreground"
              }`}
            >
              {d ? "Dark mode" : "Light mode"}
            </span>
            <button
              onClick={toggleTheme}
              className={`touch-target flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                d
                  ? "border-slate-600 dark:border-slate-700 dark:bg-surface text-muted-foreground hover:border-default hover:text-warning"
                  : "border-border bg-surface text-muted-foreground hover:border-border hover:text-foreground"
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
                d ? "border-border/50" : "border-slate-100 dark:border-slate-800/60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    d ? "text-muted-foreground" : "text-muted-foreground"
                  }`}
                >
                  Progress
                </span>
                <span
                  className={`text-sm font-bold ${
                    d ? "text-primary" : "text-primary dark:text-primary"
                  }`}
                >
                  {currentIdx + 1}/{totalQuestions}
                </span>
              </div>
              <div
                className={`w-full h-1.5 rounded-full overflow-hidden ${
                  d ? "bg-slate-700" : "bg-slate-200 dark:bg-slate-800"
                }`}
              >
                <div
                  className="h-full bg-primary rounded-full transition-colors"
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
              d ? "border-border/50" : "border-slate-100 dark:border-slate-800/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[13px] flex items-center gap-1.5 ${
                  d ? "text-muted-foreground" : "text-muted-foreground"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                Answer time
              </span>
              <span
                className={`text-[13px] font-semibold ${
                  d ? "text-muted-foreground" : "text-muted-foreground"
                }`}
              >
                {readTime}–{Math.min(readTime + 1, 5)} min
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-[13px] flex items-center gap-1.5 ${
                  d ? "text-muted-foreground" : "text-muted-foreground"
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
                d ? "border-border/50" : "border-slate-100 dark:border-slate-800/60"
              }`}
            >
              <div
                className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${
                  d ? "text-muted-foreground" : "text-muted-foreground"
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
                        ? "text-muted-foreground dark:bg-surface border-border"
                        : "text-muted-foreground bg-surface border-border"
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
              d ? "border-border/50" : "border-slate-100 dark:border-slate-800/60"
            }`}
          >
            <Link
              href="/mock-interviews"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
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
                  d ? "text-muted-foreground" : "text-muted-foreground"
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
                            ? "bg-primary/20 text-primary font-semibold"
                            : "bg-primary/10 text-primary dark:text-primary font-semibold"
                          : d
                          ? "text-muted-foreground hover:text-foreground hover:bg-surface/70"
                          : "text-muted-foreground hover:text-foreground hover:bg-surface"
                      }`}
                    >
                      <span
                        className={`mr-1 text-[11px] ${
                          d ? "text-muted-foreground" : "text-muted-foreground"
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

      {sidebar && curriculumOpen && (
        <div
          className="fixed inset-0 z-[var(--z-drawer)]"
          role="dialog"
          aria-modal="true"
          aria-label={`${currentTopicName || "Topic"} questions`}
        >
          <button
            type="button"
            aria-label="Close question list"
            onClick={() => setCurriculumOpen(false)}
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]"
          />
          <aside
            className={`absolute inset-y-0 left-0 flex w-[488px] max-w-[94vw] flex-col border-r shadow-2xl ${
              d ? "border-border bg-surface" : "border-primary/10 bg-background"
            }`}
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-border px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-extrabold text-foreground">
                  {currentTopicName} questions
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {breadcrumbs[1]?.label} · {topicQuestions.length} questions
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCurriculumOpen(false)}
                className="touch-target rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                aria-label="Close question list"
              >
                <span aria-hidden="true" className="text-lg leading-none">×</span>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
              <div className="mb-4 rounded-xl border border-primary/15 bg-primary/[0.035] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">
                      Your position
                    </div>
                    <div className="mt-1 truncate text-sm font-extrabold text-foreground">
                      Question {Math.max(topicIdx + 1, 1)} of {topicQuestions.length}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-md bg-background px-2 py-1 text-[11px] font-extrabold tabular-nums text-primary shadow-sm">
                    {topicQuestions.length > 0
                      ? Math.round(((topicIdx + 1) / topicQuestions.length) * 100)
                      : 0}%
                  </span>
                </div>
                {topicQuestions.length > 0 && (
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-primary/10">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${((topicIdx + 1) / topicQuestions.length) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="mb-2 px-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
                All questions in this topic
              </div>
              <ol className="space-y-1">
                {topicQuestions.map((question, questionIndex) => {
                  const active = question.slug === questionSlug;
                  return (
                    <li key={question.slug}>
                      <Link
                        href={buildQuestionUrl(
                          question.slug,
                          question.stackSlug || stackSlug
                        )}
                        onClick={() => setCurriculumOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`group flex items-start gap-3 rounded-xl border px-3 py-3 text-sm leading-snug transition-colors ${
                          active
                            ? "border-primary/25 bg-primary/[0.07] font-bold text-primary shadow-sm"
                            : "border-transparent text-foreground hover:border-border hover:bg-surface"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-8 shrink-0 items-center justify-center rounded-md text-[10px] font-extrabold tabular-nums ${
                            active
                              ? "bg-primary text-primary-foreground"
                              : "bg-surface text-muted-foreground group-hover:text-foreground"
                          }`}
                        >
                          {String(questionIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1 pt-1">
                          {question.title}
                        </span>
                        {active && (
                          <span className="mt-1 shrink-0 rounded-full bg-primary px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-primary-foreground">
                            Current
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="flex shrink-0 items-center gap-2 border-t border-border p-3">
              <Link
                href={breadcrumbs[1]?.href || `${questionUrlPrefix}/${stackSlug}`}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-border px-3 py-2.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Topic overview
              </Link>
              <button
                type="button"
                onClick={() => setCurriculumOpen(false)}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary px-3 py-2.5 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Collapse preview
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            </div>
          </aside>
        </div>
      )}
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
