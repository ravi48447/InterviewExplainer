"use client";

import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  ClipboardList,
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
                  <span className="h-2 w-2 rounded-full bg-red-400 dark:bg-red-800 shrink-0" />
                  <span className="text-[11px] font-bold text-red-600 dark:text-red-300 uppercase tracking-wider">
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
                  <span className="h-2 w-2 rounded-full bg-emerald-400 dark:bg-emerald-800 shrink-0" />
                  <span className="text-[11px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider">
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
          ? "border border-border/60 bg-[#202020] shadow-black/40"
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
                ? "bg-[#282828] border-border/40"
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
                      ? "bg-blue-800 dark:bg-blue-800 text-primary"
                      : "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary"
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

function SectionRenderer({
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
    return (
      <div>
        {title && (
          <div className="flex items-center gap-2 mb-3">
            <Layers className="h-3.5 w-3.5 text-primary dark:text-primary" />
            <h3
              className={`text-[13px] font-bold ${
                d ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {title}
            </h3>
          </div>
        )}
        <MarkdownContent content={content} />
      </div>
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
            ? "bg-[#101a2a] border-default dark:border-default/60"
            : "bg-blue-50 dark:bg-blue-500/10 dark:bg-blue-950/20/60 border-default dark:border-default/20/70"
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
            ? "bg-[#0d1c14] border-default dark:border-default/50"
            : "bg-emerald-50 dark:bg-emerald-500/10 dark:bg-emerald-950/20/60 border-default dark:border-default/20/70"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
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
            ? "bg-[#1a1408] border-default dark:border-default/50"
            : "bg-amber-50 dark:bg-amber-500/10 dark:bg-amber-950/20/60 border-default dark:border-default/20/70"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
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
            ? "bg-[#10102a] border-default dark:border-default/50"
            : "bg-blue-50 dark:bg-blue-500/10 dark:bg-blue-950/20/60 border-default dark:border-default/20/70"
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
            ? "bg-[#10102a] border-default dark:border-default/50"
            : "bg-blue-50 dark:bg-blue-500/10 dark:bg-blue-950/20/60 border-default dark:border-default/20/70"
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
            ? "bg-[#272727] border-slate-600 dark:border-slate-700/60"
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
            ? "bg-[#1a1408] border-default dark:border-default/50"
            : "bg-amber-50 dark:bg-amber-500/10 dark:bg-amber-950/20/60 border-default dark:border-default/20/70"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
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
            ? "bg-[#1c0e0e] border-default dark:border-default/50"
            : "bg-red-50 dark:bg-red-500/10 dark:bg-red-950/20/60 border-default dark:border-default/20/70"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Bug className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
          <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
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
            ? "bg-[#1a1408] border-default dark:border-default/50"
            : "bg-amber-50 dark:bg-amber-500/10 dark:bg-amber-950/20/60 border-default dark:border-default/20/70"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Search className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
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
            ? "bg-[#272727] border-slate-600 dark:border-slate-700/60"
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
            ? "bg-[#272727] border-slate-600 dark:border-slate-700/60"
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
            ? "bg-[#0d1c14] border-default dark:border-default/50"
            : "bg-emerald-50 dark:bg-emerald-500/10 dark:bg-emerald-950/20/60 border-default dark:border-default/20/70"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Wrench className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
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
            ? "bg-[#150f24] border-default dark:border-default/50"
            : "bg-blue-50 dark:bg-blue-950/20/60 border-default dark:border-default/20/70"
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
            ? "bg-[#0e1a10] border-default dark:border-default/50"
            : "bg-emerald-50 dark:bg-emerald-500/10 dark:bg-emerald-950/20/70 border-default dark:border-default/20/80"
        }`}
      >
        <div
          className={`flex items-center gap-2 px-4 py-2.5 border-b ${
            d ? "border-default dark:border-default/40" : "border-default dark:border-default/20/60"
          }`}
        >
          <MessageCircle className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
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
            ? "bg-[#10102a] border-default dark:border-default/50"
            : "bg-blue-50 dark:bg-blue-500/10 dark:bg-blue-950/20/60 border-default dark:border-default/20/70"
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
