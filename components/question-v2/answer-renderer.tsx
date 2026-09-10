/**
 * answer-renderer.tsx — Canonical answer renderer (P06-T120..T160).
 *
 * Iterates the structured AnswerSection[] and renders each section using the
 * Phase 01 content primitives (CodeBlock, Callout, TableWrapper, Prose).
 * This is the reading experience: calm, readable, one column, reading width.
 *
 * Design (P06-T120..T160):
 *   - Prose sections use the Prose component (scoped .prose-v2 styles)
 *   - Code blocks use CodeBlock (header + copy + overflow, highlight-free)
 *   - Callouts use Callout (5 variants)
 *   - Tables use TableWrapper (overflow)
 *   - Headings render as real h2/h3/h4 within the reading flow
 *   - Reading width is constrained to --reading-width (42rem)
 *
 * Server component — no client JS.
 */

import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/ui/code-block";
import { Callout } from "@/components/ui/callout";
import { TableWrapper } from "@/components/ui/table-wrapper";
import { Figure } from "@/components/ui/figure";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen } from "lucide-react";
import type { AnswerSection } from "@/lib/question";

export interface AnswerRendererProps {
  sections: AnswerSection[];
}

export function AnswerRenderer({ sections }: AnswerRendererProps) {
  if (sections.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="h-6 w-6" />}
        title="No answer yet"
        description="This question does not have an answer written yet."
      />
    );
  }

  return (
    <div className="reading-container space-y-6">
      {sections.map((section) => (
        <AnswerSectionView key={section.id} section={section} />
      ))}
    </div>
  );
}

function AnswerSectionView({ section }: { section: AnswerSection }) {
  switch (section.type) {
    case "heading":
      return <AnswerHeading section={section} />;
    case "prose":
      return (
        <div
          className="prose-v2 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content ?? "") }}
        />
      );
    case "code":
      return (
        <CodeBlock
          language={section.language}
          filename={section.language}
        >
          {section.code ?? ""}
        </CodeBlock>
      );
    case "callout":
      return (
        <Callout
          variant={section.calloutVariant ?? "note"}
          title={section.calloutTitle}
        >
          <div
            className="prose-v2 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content ?? "") }}
          />
        </Callout>
      );
    case "table":
      return (
        <TableWrapper>
          {section.tableHeaders && (
            <thead>
              <tr>
                {section.tableHeaders.map((h, i) => (
                  <th key={i} className="px-3 py-2 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {section.tableRows?.map((row, i) => (
              <tr key={i} className="border-t border-border">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </TableWrapper>
      );
    case "figure":
      return (
        <Figure caption={section.figureCaption}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={section.figureSrc ?? ""}
            alt={section.figureAlt ?? ""}
            className="w-full"
          />
        </Figure>
      );
    default:
      return null;
  }
}

function AnswerHeading({ section }: { section: AnswerSection }) {
  const level = section.level ?? 2;
  const className = cn(
    "font-semibold text-foreground",
    level === 2 && "type-section mt-8",
    level === 3 && "text-lg mt-6",
    level === 4 && "text-base mt-4"
  );

  if (level === 2) return <h2 className={className}>{section.heading}</h2>;
  if (level === 3) return <h3 className={className}>{section.heading}</h3>;
  return <h4 className={className}>{section.heading}</h4>;
}

/**
 * Minimal markdown-to-HTML renderer for prose sections.
 * Handles: headings, bold, italic, code, links, lists, paragraphs.
 * This is deliberately simple — the canonical CodeBlock/Callout/TableWrapper
 * handle their own content; prose is the only inline-markdown path.
 */
function renderMarkdown(md: string): string {
  let html = md;

  // Escape HTML first.
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Inline code.
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Bold.
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Italic.
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  // Links.
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-primary underline underline-offset-2">$1</a>'
  );

  // Lists (simple: lines starting with - or *).
  const lines = html.split("\n");
  const out: string[] = [];
  let inList = false;
  for (const line of lines) {
    if (/^\s*[-*]\s+/.test(line)) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${line.replace(/^\s*[-*]\s+/, "")}</li>`);
    } else {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      if (line.trim()) out.push(`<p>${line}</p>`);
    }
  }
  if (inList) out.push("</ul>");

  return out.join("\n");
}
