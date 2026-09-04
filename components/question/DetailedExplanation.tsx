"use client";

import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  ClipboardList,
  ChevronDown,
  Layers,
  Lightbulb,
  List,
  MessageCircle,
  Search,
  Target,
  Wrench,
  Zap,
  Bug,
} from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import { useContentTheme, type ContentTheme } from "./ThemeContext";
import { ConceptMap } from "./ConceptMap";
import type { AnswerSection } from "@/lib/api";

interface DetailedExplanationProps {
  sections: AnswerSection[];
  followupQuestions?: string[];
}

interface SectionGroup {
  main: AnswerSection;
  codeBlocks: AnswerSection[];
  phaseIndex?: number;
}

const CODE_BLOCK_TYPES = new Set(["before_code", "after_code"]);

function learningParagraphs(content: string): string[] {
  if (/```|^\s*[-*+]\s|^\s*\d+[.)]\s|^\s*#{1,6}\s|^\s*\|/m.test(content)) {
    return [];
  }

  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

const LEARNING_LABELS = [
  "Definition",
  "How it works",
  "Key details",
  "Boundary to remember",
];

function groupSections(sections: AnswerSection[]): SectionGroup[] {
  const groups: SectionGroup[] = [];
  let phaseCount = 0;

  for (const section of sections) {
    if (CODE_BLOCK_TYPES.has(section.sectionType) && groups.length > 0) {
      groups[groups.length - 1].codeBlocks.push(section);
    } else {
      const isPhase =
        section.sectionType === "phase" || section.sectionType === "step";
      if (isPhase) phaseCount++;
      groups.push({
        main: section,
        codeBlocks: [],
        phaseIndex: isPhase ? phaseCount : undefined,
      });
    }
  }
  return groups;
}

function splitCodeAndNote(content: string): { code: string; note: string } {
  const closingFence = content.lastIndexOf("```");
  const openingFence = content.indexOf("```");
  if (closingFence === -1 || closingFence === openingFence) {
    return { code: content, note: "" };
  }
  const afterFence = content.slice(closingFence + 3).trim();
  const codeOnly = content.slice(0, closingFence + 3).trim();
  return { code: codeOnly, note: afterFence };
}

function CodeBlockGroup({
  codeBlocks,
  theme,
}: {
  codeBlocks: AnswerSection[];
  theme: ContentTheme;
}) {
  const d = theme === "dark";
  const before = codeBlocks.find((s) => s.sectionType === "before_code");
  const after = codeBlocks.find((s) => s.sectionType === "after_code");
  const others = codeBlocks.filter(
    (s) => s.sectionType !== "before_code" && s.sectionType !== "after_code"
  );

  return (
    <div className="mt-5 space-y-2">
      {(before || after) && (
        <p
          className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${
            d ? "text-muted-foreground" : "text-muted-foreground"
          }`}
        >
          In code — see the difference:
        </p>
      )}

      {before &&
        (() => {
          const { code: beforeCode, note: beforeNote } = splitCodeAndNote(
            before.content
          );
          return (
            <>
              <div
                className={`rounded-lg overflow-hidden border ${
                  d ? "border-border/50" : "border-border"
                }`}
              >
                <div
                  className={`flex items-center gap-2 px-4 py-2 ${
                    d ? "dark:bg-surface" : "bg-surface"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-destructive shrink-0" />
                  <span className="text-[11px] font-bold text-destructive uppercase tracking-wider">
                    Without
                  </span>
                  {before.sectionTitle && (
                    <span
                      className={`text-[11px] ml-1 ${
                        d ? "text-muted-foreground" : "text-muted-foreground"
                      }`}
                    >
                      — {before.sectionTitle}
                    </span>
                  )}
                </div>
                <div className="[&_pre]:my-0 [&_pre]:rounded-none [&_code]:rounded-none">
                  <MarkdownContent content={beforeCode} stripTopHeading />
                </div>
              </div>
              {beforeNote && (
                <div
                  className={`text-[13px] italic leading-relaxed mt-2 ${
                    d ? "text-muted-foreground" : "text-muted-foreground"
                  }`}
                >
                  <MarkdownContent content={beforeNote} />
                </div>
              )}
            </>
          );
        })()}

      {before && after && (
        <div className="flex items-center gap-2 py-1">
          <div
            className={`h-px flex-1 ${d ? "bg-slate-700/60" : "bg-slate-200 dark:bg-slate-800"}`}
          />
          <span
            className={`text-[10px] font-bold uppercase tracking-widest ${
              d ? "text-muted-foreground" : "text-muted-foreground"
            }`}
          >
            vs
          </span>
          <div
            className={`h-px flex-1 ${d ? "bg-slate-700/60" : "bg-slate-200 dark:bg-slate-800"}`}
          />
        </div>
      )}

      {after &&
        (() => {
          const { code: afterCode, note: afterNote } = splitCodeAndNote(
            after.content
          );
          return (
            <>
              <div
                className={`rounded-lg overflow-hidden border ${
                  d ? "border-border/50" : "border-border"
                }`}
              >
                <div
                  className={`flex items-center gap-2 px-4 py-2 ${
                    d ? "dark:bg-surface" : "bg-surface"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-success shrink-0" />
                  <span className="text-[11px] font-bold text-success uppercase tracking-wider">
                    With
                  </span>
                  {after.sectionTitle && (
                    <span
                      className={`text-[11px] ml-1 ${
                        d ? "text-muted-foreground" : "text-muted-foreground"
                      }`}
                    >
                      — {after.sectionTitle}
                    </span>
                  )}
                </div>
                <div className="[&_pre]:my-0 [&_pre]:rounded-none [&_code]:rounded-none">
                  <MarkdownContent content={afterCode} stripTopHeading />
                </div>
              </div>
              {afterNote && (
                <div
                  className={`text-[13px] leading-relaxed mt-2 ${
                    d ? "text-muted-foreground" : "text-muted-foreground"
                  }`}
                >
                  <MarkdownContent content={afterNote} />
                </div>
              )}
            </>
          );
        })()}

      {others.length > 0 && (
        <div className="space-y-3">
          {others.map((s, j) => (
            <SectionRenderer key={s.id ?? j} section={s} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
}

export function DetailedExplanation({
  sections,
  followupQuestions,
}: DetailedExplanationProps) {
  const { theme } = useContentTheme();
  const d = theme === "dark";

  if (
    sections.length === 0 &&
    (!followupQuestions || followupQuestions.length === 0)
  ) {
    return null;
  }

  const groups = groupSections(sections);

  return (
    <section
      className={`mb-8 rounded-xl overflow-hidden shadow-lg ${
        d
          ? "border border-border/60 bg-surface shadow-black/40"
          : "border border-border/80 bg-background shadow-slate-100/80"
      }`}
    >
      {/* Card header */}
      <div
        className={`flex items-center gap-2 px-5 py-3 border-b ${
          d
            ? "dark:bg-surface border-border/60"
            : "bg-surface border-border/80"
        }`}
      >
        <BookOpen
          className={`h-3.5 w-3.5 ${d ? "text-muted-foreground" : "text-muted-foreground"}`}
        />
        <span
          className={`text-[11px] font-bold uppercase tracking-widest ${
            d ? "text-muted-foreground" : "text-muted-foreground"
          }`}
        >
          Under the Hood
        </span>
      </div>

      {/* Sections */}
      <div className="px-4 py-4 space-y-4 sm:px-5">
        {groups.map(({ main, codeBlocks, phaseIndex }, idx) => (
          <div
            key={main.id ?? idx}
            className={`rounded-xl px-5 py-5 sm:px-6 sm:py-6 border ${
              d
                ? "bg-muted border-border/40"
                : "bg-background border-border/70"
            }`}
          >
            <SectionRenderer
              section={main}
              phaseIndex={phaseIndex}
              theme={theme}
            />
            {codeBlocks.length > 0 && (
              <CodeBlockGroup codeBlocks={codeBlocks} theme={theme} />
            )}
          </div>
        ))}
      </div>

      {/* Follow-up questions */}
      {followupQuestions && followupQuestions.length > 0 && (
        <div
          className={`border-t px-4 py-4 ${
            d ? "border-border/60" : "border-border/80"
          }`}
          aria-live="polite"
        >
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-3.5 w-3.5 text-primary dark:text-primary" />
            <span
              className={`text-[11px] font-bold uppercase tracking-widest ${
                d ? "text-muted-foreground" : "text-muted-foreground"
              }`}
            >
              Follow-up Questions
            </span>
          </div>
          <ol className="space-y-3">
            {followupQuestions.map((q, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    d
                      ? "bg-primary/20 text-primary"
                      : "bg-primary/10 text-primary dark:text-primary"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`text-[15px] leading-relaxed ${
                    d ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {q}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

export function SectionRenderer({
  section,
  phaseIndex,
  theme,
}: {
  section: AnswerSection;
  phaseIndex?: number;
  theme: ContentTheme;
}) {
  const d = theme === "dark";
  const type = section.sectionType;
  const content = section.content;
  const title = section.sectionTitle || "";

  const bodyText = d
    ? "text-[15.5px] leading-[1.78] text-muted-foreground"
    : "text-[15.5px] leading-[1.78] text-foreground";
  const headingText = d
    ? "text-[18px] font-bold text-muted-foreground tracking-tight"
    : "text-[18px] font-bold text-foreground tracking-tight";

  /* ── Overview / plain explanation ── */
  if (
    type === "overview" ||
    type === "explanation" ||
    type === "deep_explanation" ||
    type === "detailed_explanation"
  ) {
    const paragraphs = learningParagraphs(content);
    const canBuildLearningModel =
      (type === "deep_explanation" || type === "detailed_explanation") &&
      paragraphs.length >= 3 &&
      paragraphs.length <= 4;

    if (canBuildLearningModel) {
      return (
        <div>
          {title && <h3 className={`${headingText} mb-4 leading-snug`}>{title}</h3>}
          <div className={`overflow-hidden rounded-xl border ${d ? "border-border/55 bg-surface/40" : "border-stone-200 bg-white"}`}>
            <div className={`border-b px-4 py-4 sm:px-5 ${d ? "border-border/55 bg-primary/[0.06]" : "border-primary/15 bg-primary/[0.035]"}`}>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">
                  {LEARNING_LABELS[0]}
                </span>
              </div>
              <div className="text-[15.5px] font-medium leading-7 text-foreground [&_code]:border-slate-300 [&_code]:bg-slate-100 [&_code]:text-slate-700 dark:[&_code]:border-slate-600 dark:[&_code]:bg-slate-800 dark:[&_code]:text-slate-100">
                <MarkdownContent content={paragraphs[0]} inline />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 sm:divide-x sm:divide-border/60">
              {paragraphs.slice(1).map((paragraph, index) => {
                const itemIndex = index + 1;
                const isBoundary = itemIndex === paragraphs.length - 1;
                const itemLabel = isBoundary
                  ? "Boundary to remember"
                  : LEARNING_LABELS[itemIndex];
                return (
                  <div
                    key={`${itemLabel}-${index}`}
                    className={`px-4 py-4 sm:px-5 ${index > 0 ? "border-t border-border/60 sm:border-t-0" : ""}`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${isBoundary ? "bg-warning" : itemIndex === 2 ? "bg-success" : "bg-primary"}`} />
                      <span className={`text-[10px] font-extrabold uppercase tracking-[0.11em] ${isBoundary ? "text-amber-700 dark:text-amber-300" : itemIndex === 2 ? "text-success" : "text-primary"}`}>
                        {itemLabel}
                      </span>
                    </div>
                    <div className="text-[12.5px] leading-[1.7] text-foreground/85 [&_code]:border-slate-300 [&_code]:bg-slate-100 [&_code]:text-slate-700 dark:[&_code]:border-slate-600 dark:[&_code]:bg-slate-800 dark:[&_code]:text-slate-100">
                      <MarkdownContent content={paragraph} inline />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        {title && <h3 className={`${headingText} mb-3 leading-snug`}>{title}</h3>}
        <div className={bodyText}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── Phase / Step ── */
  if (type === "phase" || type === "step") {
    return (
      <div>
        {title && (
          <h3 className={`flex items-center gap-2.5 ${headingText} mb-4 leading-snug`}>
            {phaseIndex !== undefined && (
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-md text-white text-[11px] font-bold shrink-0 ${
                  d ? "bg-slate-600 dark:bg-slate-800" : "bg-slate-700 dark:bg-slate-800"
                }`}
              >
                {phaseIndex}
              </span>
            )}
            {title}
          </h3>
        )}
        <div className={bodyText}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── Code example — expanded by default ── */
  if (type === "code_example") {
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-3.5 w-3.5 text-primary dark:text-primary" />
          <span
            className={`text-[13px] font-bold ${
              d ? "text-primary" : "text-primary dark:text-primary"
            }`}
          >
            {title || "Code Example"}
          </span>
        </div>
        <MarkdownContent content={content} stripTopHeading />
      </div>
    );
  }

  if (type === "before_code" || type === "after_code") {
    return null;
  }

  /* ── Architecture / Mermaid diagram ── */
  if (
    type === "architecture_diagram" ||
    type === "flow_diagram" ||
    type === "sequence_diagram"
  ) {
    const opensAsCompactVisual = type === "flow_diagram" && content.length < 700;
    return (
      <details open={opensAsCompactVisual} className={`group rounded-lg border ${d ? "border-border/60 bg-surface/40" : "border-border bg-stone-50/55"}`}>
        <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
          <Layers className="h-4 w-4 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <h3 className="text-[13px] font-bold text-foreground">{title || "Concept visual"}</h3>
            <p className="mt-0.5 text-[11.5px] text-muted-foreground">
              {opensAsCompactVisual ? "Follow the model from left to right" : "Optional visual · open when you want to trace the flow"}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-primary group-open:hidden">Open visual</span>
          <span className="hidden text-[11px] font-semibold text-muted-foreground group-open:inline">Close</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <div className={`border-t px-3 py-4 sm:px-4 ${d ? "border-border/60" : "border-border"}`}>
          <MarkdownContent content={content} />
        </div>
      </details>
    );
  }

  /* ── Diagram — terminal block ── */
  if (type === "diagram" || type === "design_diagram") {
    return (
      <div>
        {title && (
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-3.5 w-3.5 text-primary dark:text-primary" />
            <h3
              className={`text-[13px] font-bold ${
                d ? "text-muted-foreground" : "text-muted-foreground"
              }`}
            >
              {title}
            </h3>
          </div>
        )}
        <div
          className={`rounded-xl px-5 py-5 overflow-x-auto border ${
            d
              ? "bg-slate-50 dark:bg-slate-950 text-muted-foreground border-border/50"
              : "dark:bg-surface text-muted-foreground border-border/50"
          }`}
        >
          <pre className="text-[12.5px] leading-relaxed font-mono whitespace-pre max-w-full">
            {content}
          </pre>
        </div>
      </div>
    );
  }

  /* ── Key Points / Important ── */
  if (type === "key_points" || type === "important_points") {
    return (
      <div
        className={`rounded-lg px-4 py-3 border ${
          d
            ? "bg-info/10 border-default dark:border-default/60"
            : "bg-primary/10 border-primary/20"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Zap className="h-3.5 w-3.5 text-primary dark:text-primary" />
          <span className="text-[11px] font-bold text-primary dark:text-primary uppercase tracking-wide">
            {title || "Key Points"}
          </span>
        </div>
        <div className={bodyText}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── Best Practices / Tips ── */
  if (
    type === "best_practices" ||
    type.includes("best_practice") ||
    type.includes("tip")
  ) {
    return (
      <div
        className={`rounded-lg px-4 py-3 border ${
          d
            ? "bg-success/10 border-default dark:border-default/50"
            : "bg-success/10 border-success/20"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <CheckCircle className="h-3.5 w-3.5 text-success" />
          <span className="text-[11px] font-bold text-success uppercase tracking-wide">
            {title || "Best Practices"}
          </span>
        </div>
        <div className={bodyText}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── Common Mistakes / Pitfalls / Warnings ── */
  if (
    type === "common_mistakes" ||
    type.includes("mistake") ||
    type.includes("pitfall") ||
    type.includes("warning")
  ) {
    return (
      <div
        className={`rounded-lg px-4 py-3 border ${
          d
            ? "bg-warning/10 border-default dark:border-default/50"
            : "bg-warning/10 border-warning/20"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <AlertTriangle className="h-3.5 w-3.5 text-warning" />
          <span className="text-[11px] font-bold text-warning uppercase tracking-wide">
            {title || "Watch Out"}
          </span>
        </div>
        <div className={bodyText}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── Real World / Scenario ── */
  if (type === "real_world_example" || type === "scenario_based") {
    return (
      <div
        className={`rounded-lg px-4 py-3 border ${
          d
            ? "bg-muted border-default dark:border-default/50"
            : "bg-primary/10 border-primary/20"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Layers className="h-3.5 w-3.5 text-primary dark:text-primary" />
          <span className="text-[11px] font-bold text-primary dark:text-primary uppercase tracking-wide">
            {title || "Real World"}
          </span>
        </div>
        <div className={bodyText}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── Comparison table ── */
  if (type === "comparison_table") {
    return (
      <div>
        {title && (
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className={`h-3.5 w-3.5 ${d ? "text-primary dark:text-primary" : "text-primary dark:text-primary"}`} />
            <h3 className={`text-[13px] font-bold ${d ? "text-primary" : "text-primary dark:text-primary"}`}>
              {title}
            </h3>
          </div>
        )}
        <div className={`overflow-x-auto rounded-lg border ${d ? "border-border/50" : "border-border"}`}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── Component ── */
  if (type === "component") {
    return (
      <div
        className={`rounded-lg px-4 py-3 border ${
          d
            ? "bg-muted border-default dark:border-default/50"
            : "bg-primary/10 border-primary/20"
        }`}
      >
        {title && (
          <div className="flex items-center gap-1.5 mb-2">
            <Layers className="h-3.5 w-3.5 text-primary dark:text-primary" />
            <h3
              className={`text-[13px] font-bold ${
                d ? "text-primary" : "text-primary dark:text-primary"
              }`}
            >
              {title}
            </h3>
          </div>
        )}
        <div className={bodyText}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── Requirements ── */
  if (type === "requirements") {
    return (
      <div
        className={`rounded-lg px-4 py-3 border ${
          d
            ? "bg-muted border-slate-600 dark:border-slate-700/60"
            : "bg-surface border-border/70"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <ClipboardList
            className={`h-3.5 w-3.5 ${d ? "text-muted-foreground" : "text-muted-foreground"}`}
          />
          <span
            className={`text-[11px] font-bold uppercase tracking-wide ${
              d ? "text-muted-foreground" : "text-muted-foreground"
            }`}
          >
            {title || "Requirements"}
          </span>
        </div>
        <div className={bodyText}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── Approach ── */
  if (type === "approach") {
    return (
      <div
        className={`rounded-lg px-4 py-3 border ${
          d
            ? "bg-warning/10 border-default dark:border-default/50"
            : "bg-warning/10 border-warning/20"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Lightbulb className="h-3.5 w-3.5 text-warning" />
          <span className="text-[11px] font-bold text-warning uppercase tracking-wide">
            {title || "Approach"}
          </span>
        </div>
        <div className={bodyText}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── Problem Statement ── */
  if (type === "problem_statement") {
    return (
      <div
        className={`rounded-lg px-4 py-3 border ${
          d
            ? "bg-destructive/10 border-default dark:border-default/50"
            : "bg-destructive/10 border-destructive/20"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Bug className="h-3.5 w-3.5 text-destructive" />
          <span className="text-[11px] font-bold text-destructive uppercase tracking-wide">
            {title || "The Problem"}
          </span>
        </div>
        <div className={bodyText}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── Diagnosis ── */
  if (type === "diagnosis") {
    return (
      <div
        className={`rounded-lg px-4 py-3 border ${
          d
            ? "bg-warning/10 border-default dark:border-default/50"
            : "bg-warning/10 border-warning/20"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Search className="h-3.5 w-3.5 text-warning" />
          <span className="text-[11px] font-bold text-warning uppercase tracking-wide">
            {title || "Diagnosis"}
          </span>
        </div>
        <div className={bodyText}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── Recipe ── */
  if (type === "recipe") {
    return (
      <div
        className={`rounded-lg px-4 py-3 border ${
          d
            ? "bg-muted border-slate-600 dark:border-slate-700/60"
            : "bg-surface border-border/70"
        }`}
      >
        {title && (
          <h3
            className={`text-[13px] font-bold mb-1.5 ${
              d ? "text-muted-foreground" : "text-muted-foreground"
            }`}
          >
            {title}
          </h3>
        )}
        <div className={bodyText}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── Reference Group ── */
  if (type === "reference_group") {
    return (
      <div
        className={`rounded-lg px-4 py-3 border ${
          d
            ? "bg-muted border-slate-600 dark:border-slate-700/60"
            : "bg-surface border-border/70"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <List
            className={`h-3.5 w-3.5 ${d ? "text-muted-foreground" : "text-muted-foreground"}`}
          />
          <span
            className={`text-[11px] font-bold uppercase tracking-wide ${
              d ? "text-muted-foreground" : "text-muted-foreground"
            }`}
          >
            {title || "Reference"}
          </span>
        </div>
        <div className={bodyText}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── When to Use ── */
  if (type === "when_to_use") {
    return (
      <div
        className={`rounded-lg px-4 py-3 border ${
          d
            ? "bg-success/10 border-default dark:border-default/50"
            : "bg-success/10 border-success/20"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Wrench className="h-3.5 w-3.5 text-success" />
          <span className="text-[11px] font-bold text-success uppercase tracking-wide">
            {title || "When to Use"}
          </span>
        </div>
        <div className={bodyText}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── Practice Prompt ── */
  if (type === "practice_prompt") {
    return (
      <div
        className={`rounded-lg px-4 py-3 border ${
          d
            ? "bg-muted border-default dark:border-default/50"
            : "bg-primary/10 border-primary/20"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Target className="h-3.5 w-3.5 text-primary dark:text-primary" />
          <span className="text-[11px] font-bold text-primary dark:text-primary uppercase tracking-wide">
            {title || "Practice"}
          </span>
        </div>
        <div className={bodyText}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── Follow-up questions inline ── */
  if (type === "followup_questions") {
    const cleaned = content.replace(/^# undefined\s*\n+/, "");
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="h-3.5 w-3.5 text-primary dark:text-primary" />
          <span
            className={`text-[11px] font-bold uppercase tracking-wide ${
              d ? "text-muted-foreground" : "text-muted-foreground"
            }`}
          >
            Follow-up Questions
          </span>
        </div>
        <div className={bodyText}>
          <MarkdownContent content={cleaned} />
        </div>
      </div>
    );
  }

  /* ── Concept Map ── */
  if (type === "concept_map") {
    return <ConceptMap title={title || undefined} content={content} />;
  }

  /* ── Speakable Answer / How to Answer ── */
  if (type === "speakable_answer" || type === "speakable_v2") {
    return (
      <div
        className={`rounded-lg border ${
          d
            ? "bg-success/10 border-default dark:border-default/50"
            : "bg-success/10 border-success/20"
        }`}
      >
        <div
          className={`flex items-center gap-2 px-4 py-2.5 border-b ${
            d ? "border-default dark:border-default/40" : "border-default dark:border-default/20"
          }`}
        >
          <MessageCircle className="h-3.5 w-3.5 text-success" />
          <span className="text-[11px] font-bold text-success uppercase tracking-wide">
            {title || "How to Answer in Interview"}
          </span>
        </div>
        <div className={`px-4 py-3 ${bodyText}`}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── Tradeoffs ── */
  if (type === "tradeoffs") {
    return (
      <div
        className={`rounded-lg px-4 py-3 border ${
          d
            ? "bg-muted border-default dark:border-default/50"
            : "bg-primary/10 border-primary/20"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Layers className="h-3.5 w-3.5 text-primary dark:text-primary" />
          <span className="text-[11px] font-bold text-primary dark:text-primary uppercase tracking-wide">
            {title || "Trade-offs"}
          </span>
        </div>
        <div className={bodyText}>
          <MarkdownContent content={content} stripTopHeading />
        </div>
      </div>
    );
  }

  /* ── Fallback ── */
  const displayTitle =
    title || type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <div>
      <h3 className={`${headingText} mb-2`}>{displayTitle}</h3>
      <div className={bodyText}>
        <MarkdownContent content={content} stripTopHeading />
      </div>
    </div>
  );
}
