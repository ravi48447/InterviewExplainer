/**
 * DeepDiveArticle — the third learning zone rendered as one continuous article.
 *
 * The source data is still split into typed sections so authors can validate and
 * reorder it. Presentation is intentionally different: headings, paragraphs,
 * lists and whitespace establish the reading flow. Only content that benefits
 * from a boundary (code, a diagram or a table) gets its own visual container.
 */

"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { BookOpen, Clock3 } from "lucide-react";
import type { AnswerSection } from "@/lib/api";
import {
  baseComponents,
  MarkdownPre,
  slugify,
  type TocItem,
} from "@/components/preview/PreviewArticle";

interface Props {
  sections: AnswerSection[];
  followupQuestions?: string[];
  question?: string;
}

const CODE_TYPES = new Set(["code_example", "before_code", "after_code"]);
const SUPPORTING_TYPES = new Set([
  ...CODE_TYPES,
  "comparison_table",
  "concept_map",
  "diagram",
  "flow_diagram",
  "sequence_diagram",
  "table",
  "visual",
]);
const PRACTICE_TYPES = new Set(["practice_prompt", "practice", "exercise"]);

function ensureFenced(content: string): string {
  if (content.includes("```")) return content;
  // Plaintext is the only honest global fallback. The same renderer serves
  // Java, Python, Go, Ruby, JavaScript, SQL and other domains.
  return `\`\`\`text\n${content.trim()}\n\`\`\``;
}

/** Convert the compact concept-map authoring syntax into normal article prose. */
function conceptMapToMarkdown(content: string): string {
  // Many newer concept maps are authored as Mermaid. They already have the
  // right article-native representation and must not be parsed as pipe rows.
  if (content.includes("```")) return content;

  const rows = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (!rows.some((line) => line.includes("|"))) return content;

  return rows
    .map((line) => {
      const parts = line.split("|").map((part) => part.trim());
      const heading = parts[1] || "Concept";
      let subtitle = "";
      const points: string[] = [];

      for (const part of parts.slice(2)) {
        if (part.startsWith("~")) subtitle = part.slice(1).trim();
        else if (part) points.push(part);
      }

      const intro = subtitle ? `#### ${heading}\n\n_${subtitle}_` : `#### ${heading}`;
      const list = points.map((point) => `- ${point}`).join("\n");
      return list ? `${intro}\n\n${list}` : intro;
    })
    .join("\n\n");
}

function sectionToMarkdown(section: AnswerSection): string {
  const title = section.sectionTitle?.trim() || "";
  let content = section.content?.trim() || "";
  if (!content) return "";

  if (section.sectionType === "concept_map") {
    content = conceptMapToMarkdown(content);
  } else if (CODE_TYPES.has(section.sectionType)) {
    content = ensureFenced(content);
  }

  const heading = SUPPORTING_TYPES.has(section.sectionType) ? "####" : "###";
  return title ? `${heading} ${title}\n\n${content}` : content;
}

function sectionsToMarkdown(sections: AnswerSection[]): string {
  return sections
    .map(sectionToMarkdown)
    .filter(Boolean)
    .join("\n\n");
}

function buildToc(sections: AnswerSection[]): TocItem[] {
  const seen = new Set<string>();

  return sections.flatMap((section) => {
    if (SUPPORTING_TYPES.has(section.sectionType) || PRACTICE_TYPES.has(section.sectionType)) return [];
    const text = section.sectionTitle?.trim();
    if (!text) return [];
    const id = slugify(text);
    if (!id || seen.has(id)) return [];
    seen.add(id);
    return [{ id, text }];
  });
}

function readingMinutes(markdown: string): number {
  const codeBlocks = markdown.match(/```[\s\S]*?```/g) ?? [];
  const codeLines = codeBlocks.reduce((total, block) => total + block.split("\n").length - 2, 0);
  const prose = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_>#|\[\]()-]/g, " ")
    .trim();
  const words = prose ? prose.split(/\s+/).length : 0;
  return Math.max(2, Math.ceil(words / 190 + codeLines / 14));
}

function textFromNode(node: React.ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join("");
  if (React.isValidElement(node)) {
    return textFromNode((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}

const articleComponents = {
  ...baseComponents,
  p({ children }: { children?: React.ReactNode }) {
    return (
      <p className="my-4 text-[17px] leading-[1.78] tracking-[-0.002em] text-[#334861] first:mt-0 last:mb-0 dark:text-slate-300">
        {children}
      </p>
    );
  },
  h2({ children }: { children?: React.ReactNode }) {
    const id = slugify(textFromNode(children));
    return (
      <h2
        id={id}
        className="scroll-mt-24 pt-10 font-display text-[23px] font-bold leading-[1.28] tracking-[-0.02em] text-[#17324d] after:mt-2.5 after:block after:h-[2px] after:w-9 after:rounded-full after:bg-[#4f8795] sm:text-[25px] dark:text-slate-100 dark:after:bg-blue-400/80"
      >
        {children}
      </h2>
    );
  },
  h3({ children }: { children?: React.ReactNode }) {
    const id = slugify(textFromNode(children));
    return (
      <h3
        id={id}
        className="scroll-mt-24 pt-10 font-display text-[22px] font-bold leading-[1.3] tracking-[-0.018em] text-[#17324d] after:mt-2.5 after:block after:h-[2px] after:w-9 after:rounded-full after:bg-[#4f8795] sm:text-[24px] dark:text-slate-100 dark:after:bg-blue-400/80"
      >
        {children}
      </h3>
    );
  },
  h4({ children }: { children?: React.ReactNode }) {
    return (
      <h4 className="pt-7 font-display text-[18px] font-semibold leading-[1.4] tracking-[-0.01em] text-[#28506b] sm:text-[19px] dark:text-blue-200">
        {children}
      </h4>
    );
  },
  ul({ children }: { children?: React.ReactNode }) {
    return (
      <ul className="my-5 list-disc space-y-2 pl-6 marker:text-blue-500/75 dark:marker:text-blue-400/70">
        {children}
      </ul>
    );
  },
  ol({ children }: { children?: React.ReactNode }) {
    return (
      <ol className="my-5 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-blue-700/75 dark:marker:text-blue-300/75">
        {children}
      </ol>
    );
  },
  li({ children }: { children?: React.ReactNode }) {
    return (
      <li className="pl-1.5 text-[16.5px] leading-[1.75] text-[#334861] dark:text-slate-300 [&>p]:my-0">
        {children}
      </li>
    );
  },
  strong({ children }: { children?: React.ReactNode }) {
    return <strong className="font-bold text-[#162a46] dark:text-slate-100">{children}</strong>;
  },
  em({ children }: { children?: React.ReactNode }) {
    return <em className="italic text-[#40566f] dark:text-slate-300">{children}</em>;
  },
  code({ inline, className, children }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
    const isInline = inline ?? !className;
    if (isInline) {
      return (
        <code className="box-decoration-clone rounded-[3px] bg-[#eff3f7] px-1 py-[2px] font-mono text-[0.88em] font-medium text-[#26364d] dark:bg-slate-800 dark:text-slate-200">
          {children}
        </code>
      );
    }
    return <code className={className}>{children}</code>;
  },
  blockquote({ children }: { children?: React.ReactNode }) {
    return (
      <blockquote className="my-7 border-l-[3px] border-amber-400/80 bg-amber-50/45 py-3.5 pl-5 pr-5 text-[#4c5663] dark:border-amber-500/60 dark:bg-amber-950/15 dark:text-slate-300 [&>p]:my-1">
        {children}
      </blockquote>
    );
  },
  table({ children }: { children?: React.ReactNode }) {
    return (
      <div
        className="my-7 overflow-x-auto rounded-xl border border-[#dbe3e8] bg-white shadow-[0_1px_2px_rgba(15,35,55,0.035)] outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900"
        tabIndex={0}
        role="region"
        aria-label="Scrollable data table"
      >
        <table className="w-full border-collapse font-sans text-[14px]">{children}</table>
      </div>
    );
  },
  thead({ children }: { children?: React.ReactNode }) {
    return <thead className="bg-[#edf3f7] dark:bg-slate-800">{children}</thead>;
  },
  th({ children }: { children?: React.ReactNode }) {
    return (
      <th className="border-b border-[#d9e2e8] px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-[#294b65] dark:border-slate-700 dark:text-blue-200">
        {children}
      </th>
    );
  },
  td({ children }: { children?: React.ReactNode }) {
    return (
      <td className="border-b border-slate-100 px-4 py-3.5 align-top leading-[1.62] text-slate-700 dark:border-slate-800 dark:text-slate-300 [&_code]:text-[12.5px]">
        {children}
      </td>
    );
  },
  tr({ children }: { children?: React.ReactNode }) {
    return <tr className="even:bg-[#fafbf9] last:[&_td]:border-b-0 dark:even:bg-slate-900/70">{children}</tr>;
  },
  pre({ children }: { children?: React.ReactNode }) {
    return <MarkdownPre collapseAfterLines={18}>{children}</MarkdownPre>;
  },
};

function ArticleToc({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;

  return (
    <nav aria-label="In this deep dive" className="mb-9 rounded-xl bg-[#f1f5f7] px-5 py-4 ring-1 ring-inset ring-[#e2e9ed] dark:bg-slate-900/70 dark:ring-slate-800">
      <p className="mb-2.5 font-sans text-[10.5px] font-bold uppercase tracking-[0.17em] text-[#42637a] dark:text-slate-400">
        In this article
      </p>
      <ol className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={item.id} className="flex min-w-0 items-baseline gap-2.5">
            <span className="shrink-0 font-sans text-[10px] font-bold tabular-nums text-[#7690a1] dark:text-slate-600">
              {String(index + 1).padStart(2, "0")}
            </span>
            <a
              href={`#${item.id}`}
              className="flex min-h-8 items-center rounded-sm font-sans text-[14px] font-medium leading-snug text-[#435b6c] underline-offset-4 outline-none transition-colors hover:text-blue-700 hover:underline focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 dark:text-slate-400 dark:hover:text-blue-300"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function DeepDiveArticle({ sections, followupQuestions, question }: Props) {
  const hasFollowups = Boolean(followupQuestions?.length);
  const practiceSections = sections.filter((section) => PRACTICE_TYPES.has(section.sectionType));
  const articleSections = sections.filter((section) => !PRACTICE_TYPES.has(section.sectionType));
  const hasConclusion = practiceSections.length > 0 || hasFollowups;
  if (articleSections.length === 0 && !hasConclusion) return null;

  const markdown = sectionsToMarkdown(articleSections);
  const tocItems = buildToc(articleSections);
  const minutes = readingMinutes(markdown);

  return (
    <section id="zone-deep" data-testid="deep-dive" aria-labelledby="deep-dive-title" className="mb-8 scroll-mt-8">
      <div className="relative overflow-hidden rounded-2xl border border-[#d8e1e7] bg-[#fffefa] shadow-[0_8px_30px_rgba(27,48,69,0.055)] dark:border-slate-800 dark:bg-slate-950">
        <span className="absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-400" aria-hidden="true" />
        <header className="border-b border-[#dce5ea] bg-[linear-gradient(112deg,#eaf2f8_0%,#f5f8f7_58%,#faf3e8_100%)] px-5 py-5 sm:px-8 sm:py-6 dark:border-slate-800 dark:bg-none dark:bg-slate-900">
          <div className="flex items-start gap-3.5">
            <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#b9cad7] bg-white/75 font-sans text-[11px] font-extrabold tabular-nums text-[#244c68] shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
              03
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2 font-sans text-[10.5px] font-bold uppercase tracking-[0.17em] text-blue-700 dark:text-blue-300">
                <BookOpen aria-hidden="true" className="h-3.5 w-3.5" />
                03 · Deep dive
              </div>
              <h2 id="deep-dive-title" className="font-display text-[21px] font-bold tracking-[-0.018em] text-[#17324d] sm:text-[23px] dark:text-slate-100">
                {question?.replace(/\?$/, "") || "Complete explanation"}
              </h2>
            </div>
            <span className="hidden items-center gap-1.5 pt-1 font-sans text-[11px] font-medium text-[#627784] sm:flex dark:text-slate-400">
              <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
              About {minutes} min with examples
            </span>
          </div>
        </header>

        <div className="bg-[radial-gradient(circle_at_top_left,rgba(232,242,248,0.32),transparent_28%),#fffefa] px-5 py-8 sm:px-8 sm:py-9 lg:px-12 dark:bg-none dark:bg-slate-950">
          <article className="mx-auto max-w-[790px]" data-testid="deep-dive-article">
            <ArticleToc items={tocItems} />

            {markdown && (
              <div className="deep-dive-copy font-serif [&>h2:first-child]:pt-0 [&>h3:first-child]:pt-0 [&_.not-prose]:font-sans [&_pre]:font-mono [&_table]:font-sans">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
                  components={articleComponents as never}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            )}

            {hasConclusion && (
              <section className="mt-10 border-t border-[#d7e3e9] pt-7 dark:border-slate-800" aria-labelledby="deep-dive-followups">
                <h3 id="deep-dive-followups" className="font-display text-[21px] font-bold tracking-[-0.018em] text-[#17324d] dark:text-slate-100">
                  Check your understanding
                </h3>

                {practiceSections.map((section) => (
                  <aside key={`${section.sectionTitle}-${section.sectionOrder}`} className="mt-5 border-l-[3px] border-amber-400 bg-[#fff9ed] px-5 py-4 dark:border-amber-500/70 dark:bg-amber-950/15">
                    <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#8a5a12] dark:text-amber-300">
                      {section.sectionTitle || "Try it yourself"}
                    </p>
                    <div className="mt-2 font-serif text-[16px] leading-[1.72] text-[#4b5965] dark:text-slate-300 [&_p]:my-0">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={articleComponents as never}>
                        {section.content}
                      </ReactMarkdown>
                    </div>
                  </aside>
                ))}

                {hasFollowups && (
                  <>
                    <p className="mt-5 font-sans text-[13.5px] leading-relaxed text-[#637782] dark:text-slate-400">
                      Answer these without looking back at the article.
                    </p>
                    <ol className="mt-4 list-decimal space-y-2.5 pl-6 marker:font-semibold marker:text-blue-700/75 dark:marker:text-blue-300/75">
                      {followupQuestions!.map((followup) => (
                        <li key={followup} className="pl-1 font-serif text-[16px] leading-[1.68] text-[#43515f] dark:text-slate-300">
                          {followup}
                        </li>
                      ))}
                    </ol>
                  </>
                )}
              </section>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}

export default DeepDiveArticle;
