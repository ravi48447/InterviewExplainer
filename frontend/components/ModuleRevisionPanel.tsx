"use client";

import MarkdownContent from "@/components/MarkdownContent";
import { Printer } from "lucide-react";
import { marked } from "marked";
import { cn } from "@/lib/utils";
import type { ModuleRevision } from "@/lib/api";

/**
 * Opens a print-ready browser window with the full module revision laid out
 * as a clean 2–3 page PDF. We deliberately use `window.open` + `print()`
 * over a server-rendered PDF: zero infra, instant, and the user controls
 * paper size / margins via the browser's native dialog.
 */
export function openRevisionPdfWindow(
  stackLabel: string,
  revision: ModuleRevision,
): void {
  const md = [
    `# ${revision.title}`,
    "",
    `*${stackLabel} — interview revision sheet*`,
    "",
    ...revision.sections.map((s) => `## ${s.title}\n\n${s.body}`),
  ].join("\n\n");
  const bodyHtml = marked.parse(md) as string;
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) return;
  const esc = revision.title.replace(/</g, "");
  w.document.write(
    `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${esc}</title>` +
      `<style>body{font-family:ui-sans-serif,system-ui,sans-serif;max-width:44rem;margin:24px;line-height:1.55;color:#111}` +
      `h1{font-size:1.4rem;font-weight:800;margin:0 0 12px}h2{font-size:1.05rem;font-weight:700;margin:22px 0 8px;border-bottom:1px solid #e5e7eb;padding-bottom:4px}p{margin:0 0 10px}code,pre{background:#f4f4f5;border-radius:4px;font-size:0.9em}pre{padding:10px;overflow:auto}ul{padding-left:1.2rem;margin:6px 0 10px}table{border-collapse:collapse;margin:8px 0}th,td{border:1px solid #d4d4d8;padding:4px 8px;font-size:0.95em}th{background:#f4f4f5;text-align:left}</style></head><body>` +
      bodyHtml +
      `</body></html>`,
  );
  w.document.close();
  w.focus();
  w.print();
}

interface ModuleRevisionPanelProps {
  revision: ModuleRevision;
  stackLabel: string;
  className?: string;
}

/**
 * Single-card module revision (the new "Revision" synthetic first topic).
 * 5–6 sections of skim-first markdown + a "Print / PDF" button.
 *
 * Visual hierarchy intentionally mirrors a polished study sheet (white slab
 * inside a slate accordion) so it reads as a *new section type*, not as a
 * decoration on top of the question list.
 */
export function ModuleRevisionPanel({
  revision,
  stackLabel,
  className,
}: ModuleRevisionPanelProps) {
  if (!revision?.sections?.length) return null;

  return (
    <div className={cn("bg-background text-foreground [&_a]:text-blue-700 dark:text-blue-400", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-400">
            Revision sheet
          </p>
          <h3 className="mt-1 text-base font-black leading-tight text-foreground">
            {revision.title}
          </h3>
          {revision.estimatedMinutes != null ? (
            <p className="mt-1 text-[11px] text-muted-foreground">
              ~{revision.estimatedMinutes} min · {revision.sections.length} sections · save as PDF
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-muted-foreground">
              {revision.sections.length} sections · save as PDF below
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => openRevisionPdfWindow(stackLabel, revision)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-[11px] font-bold text-foreground shadow-sm transition-colors hover:border-slate-400 dark:border-slate-700 hover:bg-surface"
        >
          <Printer className="h-3.5 w-3.5" />
          Print / PDF
        </button>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {revision.sections.map((sec, idx) => (
          <div key={sec.id} className="px-5 py-5">
            <div className="mb-2 flex items-baseline gap-2">
              <span className="font-mono text-[10px] font-bold tabular-nums text-muted-foreground">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h4 className="m-0 text-[13px] font-black text-foreground">{sec.title}</h4>
            </div>
            <div className="prose prose-sm max-w-none prose-slate prose-headings:font-black prose-headings:text-foreground [&_p]:text-foreground [&_li]:text-foreground [&_td]:text-foreground [&_th]:text-foreground">
              <MarkdownContent content={sec.body} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
