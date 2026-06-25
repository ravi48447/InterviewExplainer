/**
 * DeepDiveArticle — Zone 3 "deep dive" rendered in the JBI / preview
 * magazine-article style (flat single card, serif display headings with a
 * left accent bar, side-by-side bad/good code, light callout asides, an
 * "On this page" jump list, and an indigo follow-up block).
 *
 * Unlike PreviewArticle (which renders from markdown strings), this renders
 * from the typed `answerSections[]` payload used on live question pages. It
 * does so by transforming the sections into the exact markdown shape the
 * preview pipeline already knows how to render, then feeding it through the
 * same ReactMarkdown component set (`baseComponents`) + rehype plugins that
 * PreviewArticle uses — so the output matches JBI 1:1.
 *
 * The article is intentionally light-only (a self-contained "paper" card)
 * to mirror the JBI preview as-is, regardless of the page theme toggle.
 */

"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { BookOpen, MessageCircle } from "lucide-react";
import type { AnswerSection } from "@/lib/api";
import {
  baseComponents,
  extractTocFromBody,
  rehypePairCodeBlocks,
  slugify,
  ZoneHeader,
  type TocItem,
} from "@/components/preview/PreviewArticle";

interface Props {
  sections: AnswerSection[];
  followupQuestions?: string[];
}

const DISPLAY_SERIF =
  "'Crimson Pro', 'Source Serif 4', Charter, 'Iowan Old Style', Palatino, Georgia, serif";

/* ──────────────────────────────────────────────────────────────────────────
 * Section → markdown transform
 * ────────────────────────────────────────────────────────────────────────── */

/** Section types that map onto a GitHub-style callout aside. */
function alertKindFor(type: string): "warning" | "tip" | "note" | null {
  if (
    type === "common_mistakes" ||
    type === "problem_statement" ||
    type.includes("mistake") ||
    type.includes("pitfall") ||
    type.includes("warning")
  ) {
    return "warning";
  }
  if (
    type === "best_practices" ||
    type === "when_to_use" ||
    type.includes("best_practice") ||
    type.includes("tip")
  ) {
    return "tip";
  }
  if (
    type === "key_points" ||
    type === "important_points" ||
    type === "real_world_example" ||
    type === "scenario_based" ||
    type === "tradeoffs" ||
    type === "requirements" ||
    type === "approach" ||
    type === "diagnosis" ||
    type === "recipe" ||
    type === "reference_group" ||
    type === "practice_prompt" ||
    type === "component"
  ) {
    return "note";
  }
  return null;
}

/** Wrap a section body in a GFM alert blockquote so the preview renderer
 *  draws it as a light callout aside. */
function toAlert(
  kind: "warning" | "tip" | "note",
  title: string,
  content: string
): string {
  const head = `> [!${kind}]${title ? ` ${title}` : ""}`;
  const body = content
    .split("\n")
    .map((l) => `> ${l}`)
    .join("\n");
  return `${head}\n>\n${body}`;
}

/** Ensure code content is wrapped in a fenced block so it renders through the
 *  highlighted CodeBlock. Many `code_example` sections ship raw code with no
 *  ``` fence — those would otherwise collapse into a plain paragraph. */
function ensureFenced(content: string, lang = "java"): string {
  if (content.includes("```")) return content;
  return `\`\`\`${lang}\n${content.trim()}\n\`\`\``;
}

/** Inject a leading ❌ / ✅ comment so classifyCode + the pairing plugin
 *  render before/after blocks side-by-side with the right flavour. */
function injectCodeMarker(
  content: string,
  flavour: "bad" | "good",
  title: string
): string {
  const marker =
    flavour === "bad"
      ? `// ❌ ${title || "Without"}`
      : `// ✅ ${title || "With"}`;
  const nl = content.indexOf("\n");
  if (content.startsWith("```") && nl !== -1) {
    return `${content.slice(0, nl + 1)}${marker}\n${content.slice(nl + 1)}`;
  }
  return content;
}

type Block =
  | { kind: "md"; md: string }
  | { kind: "conceptmap"; title: string; content: string };

function sectionsToBlocks(sections: AnswerSection[]): Block[] {
  const blocks: Block[] = [];
  let buf = "";
  const flush = () => {
    if (buf.trim()) blocks.push({ kind: "md", md: buf.trim() });
    buf = "";
  };

  for (const s of sections) {
    const type = s.sectionType;
    const title = s.sectionTitle || "";
    const content = s.content || "";

    if (type === "concept_map") {
      flush();
      blocks.push({ kind: "conceptmap", title, content });
      continue;
    }
    if (type === "before_code") {
      buf += `\n\n${injectCodeMarker(content, "bad", title)}`;
      continue;
    }
    if (type === "after_code") {
      buf += `\n\n${injectCodeMarker(content, "good", title)}`;
      continue;
    }
    if (type === "code_example") {
      // The code window derives its own title from the first comment line,
      // so we skip a redundant `### {title}` heading here.
      buf += `\n\n${ensureFenced(content)}`;
      continue;
    }

    const kind = alertKindFor(type);
    if (kind) {
      buf += `\n\n${toAlert(kind, title, content)}`;
      continue;
    }

    if (title) buf += `\n\n### ${title}\n`;
    buf += `\n${content}`;
  }
  flush();
  return blocks;
}

/** TOC entries — headings only (titled, non-callout, non-code sections). */
function buildToc(sections: AnswerSection[]): TocItem[] {
  const items: TocItem[] = [];
  for (const s of sections) {
    const type = s.sectionType;
    const title = s.sectionTitle || "";
    if (!title) continue;
    if (
      type === "before_code" ||
      type === "after_code" ||
      type === "code_example"
    )
      continue;
    if (alertKindFor(type)) continue;
    items.push({ id: slugify(title), text: title });
  }
  return items;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Concept map — light card grid (self-contained, theme-independent)
 * ────────────────────────────────────────────────────────────────────────── */

const CM_COLORS: Record<string, { bar: string; chip: string }> = {
  amber: { bar: "bg-amber-400", chip: "text-amber-700 bg-amber-50" },
  blue: { bar: "bg-blue-400", chip: "text-blue-700 bg-blue-50" },
  emerald: { bar: "bg-emerald-400", chip: "text-emerald-700 bg-emerald-50" },
  violet: { bar: "bg-violet-400", chip: "text-violet-700 bg-violet-50" },
  indigo: { bar: "bg-indigo-400", chip: "text-indigo-700 bg-indigo-50" },
  rose: { bar: "bg-rose-400", chip: "text-rose-700 bg-rose-50" },
  slate: { bar: "bg-slate-400", chip: "text-foreground bg-surface" },
};

function ConceptMapLight({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const cards = content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      const color = parts[0] || "slate";
      const heading = parts[1] || "";
      let subtitle = "";
      const points: string[] = [];
      for (const p of parts.slice(2)) {
        if (p.startsWith("~")) subtitle = p.slice(1).trim();
        else if (p) points.push(p);
      }
      return { color, heading, subtitle, points };
    });

  if (cards.length === 0) return null;

  return (
    <div className="my-8">
      {title && (
        <h3
          id={slugify(title)}
          className="preview-display text-[20px] font-bold text-foreground tracking-[-0.005em] mb-4 scroll-mt-24"
        >
          {title}
        </h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((c, i) => {
          const theme = CM_COLORS[c.color] || CM_COLORS.slate;
          return (
            <div
              key={i}
              className="relative rounded-xl border border-border/80 bg-background pl-4 pr-4 py-3.5 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <span
                className={`absolute left-0 top-0 bottom-0 w-[3px] ${theme.bar}`}
              />
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <span className="text-[14.5px] font-bold text-foreground leading-snug">
                  {c.heading}
                </span>
                {c.subtitle && (
                  <span
                    className={`shrink-0 text-[10.5px] font-semibold px-1.5 py-[1px] rounded ${theme.chip}`}
                  >
                    {c.subtitle}
                  </span>
                )}
              </div>
              <ul className="space-y-1.5">
                {c.points.map((p, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-[13px] leading-[1.55] text-secondary"
                  >
                    <span
                      className={`mt-[7px] h-1 w-1 rounded-full shrink-0 ${theme.bar}`}
                    />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * "On this page" jump list
 * ────────────────────────────────────────────────────────────────────────── */

function TopToc({ items }: { items: TocItem[] }) {
  return (
    <nav className="mb-8 rounded-xl border border-border/70 bg-surface/60 px-5 py-4">
      <div className="text-[10.5px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2.5">
        On this page
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-[13px] leading-snug text-secondary hover:text-foreground transition-colors"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * DeepDiveArticle
 * ────────────────────────────────────────────────────────────────────────── */

export function DeepDiveArticle({ sections, followupQuestions }: Props) {
  const hasFollowups = !!followupQuestions && followupQuestions.length > 0;
  if (sections.length === 0 && !hasFollowups) return null;

  const blocks = sectionsToBlocks(sections);
  const toc = buildToc(sections);

  // Fold in any deeper `###` headings the markdown itself introduced so the
  // jump list is complete even when section bodies carry their own subheads.
  const mdToc = blocks
    .filter((b): b is { kind: "md"; md: string } => b.kind === "md")
    .flatMap((b) => extractTocFromBody(b.md));
  const seen = new Set<string>();
  const tocItems = [...toc, ...mdToc].filter((t) => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });

  return (
    <section id="zone-deep" className="mb-8 scroll-mt-8 deepdive-scope">
      <style>{`
        .deepdive-scope .preview-display {
          font-family: ${DISPLAY_SERIF};
          font-feature-settings: "kern", "liga", "calt";
        }
      `}</style>

      <ZoneHeader
        kicker="Zone 3"
        title="Deep dive"
        subtitle="Read top to bottom — the full picture"
        icon={BookOpen}
        accent="slate"
      />

      {sections.length > 0 && (
        <div className="rounded-2xl border border-border/80 bg-background px-5 sm:px-8 lg:px-10 py-8 sm:py-10 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          {tocItems.length > 1 && <TopToc items={tocItems} />}
          {blocks.map((b, i) =>
            b.kind === "md" ? (
              <ReactMarkdown
                key={i}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  [rehypeHighlight, { detect: true, ignoreMissing: true }],
                  rehypePairCodeBlocks,
                ]}
                components={baseComponents as never}
              >
                {b.md}
              </ReactMarkdown>
            ) : (
              <ConceptMapLight key={i} title={b.title} content={b.content} />
            )
          )}
        </div>
      )}

      {hasFollowups && (
        <div className="mt-6">
          <ZoneHeader
            kicker="What comes next"
            title="Follow-up questions"
            subtitle="Be ready for these"
            icon={MessageCircle}
            accent="indigo"
          />
          <ol className="rounded-2xl border border-border/80 bg-background px-6 py-6 sm:px-8 sm:py-7 space-y-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            {followupQuestions!.map((q, i) => (
              <li key={i} className="flex items-start gap-3.5">
                <span className="mt-[3px] flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 text-[11px] font-black border border-indigo-100">
                  {i + 1}
                </span>
                <span className="text-[15.5px] leading-[1.65] text-foreground pt-[1px]">
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

export default DeepDiveArticle;
