"use client";

import { Marked } from 'marked';
import MermaidDiagram from './MermaidDiagram';
import CodeLanguageTabs from './CodeLanguageTabs';

// Syntax highlighting intentionally runs on the CLIENT, not here.
//
// Previously `marked` called `hljs.highlight()` during server render, which
// blew up every code block into hundreds of `<span class="hljs-...">` tags
// that were then serialized into the RSC payload. For system-design pages
// with many fenced blocks this pushed per-navigation RSC from ~60 KB to
// ~450 KB — the single biggest cause of the "click next, app feels stuck"
// behaviour.
//
// Emitting plain `<code class="language-...">rawText</code>` keeps the SSR
// response small; the browser-side `<CodeHighlighter>` component (mounted
// once per question page) highlights all code blocks after hydration.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface MarkdownContentProps {
  content: string;
  stripTopHeading?: boolean;
  className?: string;
  inline?: boolean;
}

// ─── Mermaid extraction ──────────────────────────────────────────────────────

const MERMAID_SENTINEL_PREFIX = '\n\n@@MERMAID_BLOCK_';
const MERMAID_SENTINEL_SUFFIX = '@@\n\n';

function extractMermaidBlocks(input: string): { stripped: string; blocks: string[] } {
  const blocks: string[] = [];
  const fenceRe = /```mermaid\s*\n([\s\S]*?)```/g;
  const stripped = input.replace(fenceRe, (_, code: string) => {
    const idx = blocks.length;
    blocks.push(code.trim());
    return `${MERMAID_SENTINEL_PREFIX}${idx}${MERMAID_SENTINEL_SUFFIX}`;
  });
  return { stripped, blocks };
}

// ─── Language-tab group extraction ──────────────────────────────────────────

const LANG_TAB_SENTINEL_PREFIX = '\n\n@@LANG_TAB_GROUP_';
const LANG_TAB_SENTINEL_SUFFIX = '@@\n\n';

interface LangTabGroup {
  code: Record<string, string>;
}

const FENCE_RE = /```([a-zA-Z0-9_+-]*)\s*\n([\s\S]*?)```/g;

const NON_TABBABLE_LANGS = new Set([
  '',
  'mermaid',
  'text',
  'plaintext',
  'txt',
  'md',
  'markdown',
]);

function extractLangTabGroups(input: string): {
  stripped: string;
  groups: LangTabGroup[];
} {
  const groups: LangTabGroup[] = [];

  const fences: { start: number; end: number; lang: string; body: string }[] = [];
  let m: RegExpExecArray | null;
  FENCE_RE.lastIndex = 0;
  while ((m = FENCE_RE.exec(input)) !== null) {
    fences.push({
      start: m.index,
      end: m.index + m[0].length,
      lang: (m[1] || '').toLowerCase(),
      body: m[2],
    });
  }
  if (fences.length < 2) {
    return { stripped: input, groups: [] };
  }

  const runs: { from: number; to: number }[] = [];
  let i = 0;
  while (i < fences.length) {
    let j = i;
    while (
      j + 1 < fences.length &&
      /^\s*$/.test(input.slice(fences[j].end, fences[j + 1].start))
    ) {
      j++;
    }
    if (j > i) runs.push({ from: i, to: j });
    i = j + 1;
  }

  if (runs.length === 0) return { stripped: input, groups: [] };

  type EditRange = { start: number; end: number; replaceWith: string };
  const edits: EditRange[] = [];

  for (const run of runs) {
    const slice = fences.slice(run.from, run.to + 1);
    const langs = slice.map((f) => f.lang);
    const hasNonTabbable = langs.some((l) => NON_TABBABLE_LANGS.has(l));
    const allSame = langs.every((l) => l === langs[0]);
    if (hasNonTabbable || allSame) continue;

    const code: Record<string, string> = {};
    for (const f of slice) {
      code[f.lang] = f.body.replace(/\s+$/, '');
    }
    const idx = groups.length;
    groups.push({ code });

    edits.push({
      start: slice[0].start,
      end: slice[slice.length - 1].end,
      replaceWith: `${LANG_TAB_SENTINEL_PREFIX}${idx}${LANG_TAB_SENTINEL_SUFFIX}`,
    });
  }

  if (edits.length === 0) return { stripped: input, groups: [] };

  edits.sort((a, b) => b.start - a.start);
  let out = input;
  for (const e of edits) {
    out = out.slice(0, e.start) + e.replaceWith + out.slice(e.end);
  }
  return { stripped: out, groups };
}

// ─── Sentinel splitting ─────────────────────────────────────────────────────

type Part =
  | { kind: 'html'; value: string }
  | { kind: 'mermaid'; idx: number }
  | { kind: 'langtab'; idx: number };

function splitOnSentinels(html: string): Part[] {
  const re = /@@(MERMAID_BLOCK|LANG_TAB_GROUP)_(\d+)@@/g;
  const parts: Part[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ kind: 'html', value: html.slice(lastIndex, match.index) });
    }
    const idx = parseInt(match[2], 10);
    if (match[1] === 'MERMAID_BLOCK') {
      parts.push({ kind: 'mermaid', idx });
    } else {
      parts.push({ kind: 'langtab', idx });
    }
    lastIndex = re.lastIndex;
  }
  if (lastIndex < html.length) {
    parts.push({ kind: 'html', value: html.slice(lastIndex) });
  }
  return parts;
}

function stripTopH1(content: string): string {
  return content.replace(/^#[^\n]*\n+/, '');
}

// ─── Renderer factories ─────────────────────────────────────────────────────
// Two Marked instances are created at module level — one per theme.
// `this` in renderer methods refers to the Marked parser context; TypeScript
// requires it to be the first (phantom) parameter.

function buildRendererOptions() {
  return {
    gfm: true,
    breaks: false,
    renderer: {
      heading(this: any, token: any) {
        const { tokens, depth } = token;
        const text = this.parser.parseInline(tokens);
        const tag = `h${depth}`;
        const cls: Record<number, string> = {
          1: 'text-[22px] font-black text-foreground dark:text-muted-foreground mt-8 mb-4 first:mt-0 pb-2.5 border-b border-border dark:border-border/60 tracking-tight leading-tight',
          2: 'text-[19px] font-bold text-foreground dark:text-muted-foreground mt-8 mb-3 first:mt-0 pb-1.5 border-b border-border dark:border-border/40 tracking-tight leading-snug',
          3: 'text-[16.5px] font-bold text-foreground dark:text-muted-foreground mt-7 mb-2.5 first:mt-0 leading-snug pl-3 border-l-[3px] border-blue-500/70 dark:border-blue-500/60',
          4: 'text-[12.5px] font-bold text-muted-foreground uppercase tracking-[0.12em] mt-5 mb-1.5',
        };
        return `<${tag} class="${cls[depth] ?? ''}">${text}</${tag}>`;
      },

      paragraph(this: any, token: any) {
        const { tokens } = token;
        const text = this.parser.parseInline(tokens);
        const cls = 'text-[15.5px] leading-[1.78] text-foreground dark:text-muted-foreground mb-5 last:mb-0';
        return `<p class="${cls}">${text}</p>`;
      },

      blockquote(this: any, token: any) {
        const { tokens } = token;
        const body = this.parser.parse(tokens);
        const cls = 'border-l-4 border-blue-400/60 dark:border-blue-500/60 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-500/10 dark:bg-blue-950/30 rounded-r-lg text-muted-foreground italic';
        return `<blockquote class="${cls}">${body}</blockquote>`;
      },

      list(this: any, token: any) {
        const { items, ordered, start } = token;
        const tag = ordered ? 'ol' : 'ul';
        const listCls = 'space-y-3 mb-5 pl-0 list-none';
        let counter = typeof start === 'number' ? start : 1;
        const itemsHtml = items
          .map((item: any) => {
            const body = this.parser.parse(item.tokens);
            if (ordered) {
              const num = counter++;
              const badgeCls = 'mt-[3px] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-surface dark:bg-slate-700/70 text-[11px] font-bold text-foreground dark:text-muted-foreground border border-border dark:border-slate-600/60';
              const textCls = 'flex-1 text-[15.5px] leading-[1.78] text-foreground dark:text-muted-foreground min-w-0 [&>p]:mb-2 [&>p:last-child]:mb-0';
              return `<li class="flex items-start gap-3"><span class="${badgeCls}">${num}</span><div class="${textCls}">${body}</div></li>`;
            }
            const dotCls = 'mt-[9px] h-[7px] w-[7px] rounded-full bg-blue-500 dark:bg-blue-400 shrink-0';
            const textCls = 'flex-1 text-[15.5px] leading-[1.78] text-foreground dark:text-muted-foreground min-w-0 [&>p]:mb-2 [&>p:last-child]:mb-0';
            return `<li class="flex items-start gap-3"><span class="${dotCls}"></span><div class="${textCls}">${body}</div></li>`;
          })
          .join('');
        return `<${tag} class="${listCls}">${itemsHtml}</${tag}>`;
      },

      strong(token: any) {
        const { text } = token;
        const cls = 'font-bold text-foreground dark:text-white';
        return `<strong class="${cls}">${text}</strong>`;
      },

      em(token: any) {
        const { text } = token;
        const cls = 'italic text-muted-foreground';
        return `<em class="${cls}">${text}</em>`;
      },

      codespan(token: any) {
        const { text } = token;
        const cls = 'bg-blue-50 dark:bg-blue-500/10 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 dark:text-blue-200 rounded px-[6px] py-[2px] text-[0.86em] font-mono font-medium border border-blue-200/70 dark:border-blue-800/50';
        return `<code class="${cls}">${text}</code>`;
      },

      code(token: any) {
        const { text, lang } = token;
        // Code blocks always dark (like GitHub) — hljs applies syntax colours on client.
        const language = (lang || 'plaintext').toString();
        const safe = escapeHtml(text || '');
        return `<pre class="rounded-lg overflow-x-auto max-w-full my-5 text-[13.5px] leading-[1.7] p-0"><code class="hljs language-${language} text-[13.5px] font-mono whitespace-pre block px-4 py-4 rounded-lg">${safe}</code></pre>`;
      },

      del(token: any) {
        const { text } = token;
        const cls = 'line-through text-slate-400 dark:text-slate-500';
        return `<del class="${cls}">${text}</del>`;
      },

      hr() {
        const cls = 'border-border dark:border-border/60 my-6';
        return `<hr class="${cls}" />`;
      },

      link(token: any) {
        const { href, text } = token;
        const isExternal = href.startsWith('http');
        const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        const cls = 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-4 decoration-blue-600/30 dark:decoration-blue-400/30 hover:decoration-blue-700 dark:hover:decoration-blue-300 transition-colors';
        return `<a href="${href}"${target} class="${cls}">${text}</a>`;
      },

      table(this: any, token: any) {
        const { header, rows } = token;
        const thCls = 'px-4 py-3 bg-surface dark:bg-surface font-bold text-foreground dark:text-muted-foreground border-b border-border dark:border-border/60 text-left text-[11.5px] uppercase tracking-[0.08em]';
        const tdCls = 'px-4 py-3 border-b border-slate-100 dark:border-slate-800/60 dark:border-border/40 text-foreground dark:text-muted-foreground text-[14px] leading-[1.6] align-top';
        const trEvenCls = 'bg-surface/50 dark:bg-surface/30';
        const containerCls = 'overflow-x-auto my-6 rounded-lg border border-border dark:border-border/60';
        const theadCls = 'bg-surface dark:bg-surface';

        const headerCells = (header as any[])
          .map((cell: any) => `<th class="${thCls}">${this.parser.parseInline(cell.tokens)}</th>`)
          .join('');

        const bodyHtml = (rows as any[][])
          .map((row: any[], rowIdx) => {
            const cells = row
              .map((cell: any) => `<td class="${tdCls}">${this.parser.parseInline(cell.tokens)}</td>`)
              .join('');
            return `<tr class="${rowIdx % 2 === 1 ? trEvenCls : ''}">${cells}</tr>`;
          })
          .join('');

        return `<div class="${containerCls}"><table class="min-w-full border-collapse"><thead class="${theadCls}"><tr>${headerCells}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
      },
    },
  };
}

// A single module-level instance. Created once, never recreated.
const markedInstance = new Marked();
markedInstance.use(buildRendererOptions() as any);

export default function MarkdownContent({
  content,
  stripTopHeading = false,
  className = '',
  inline = false,
}: MarkdownContentProps) {
  const instance = markedInstance;

  const raw = content ?? '';
  const text = stripTopHeading ? stripTopH1(raw) : raw;

  if (inline) {
    const html = instance.parseInline(text) as string;
    return (
      <span
        className={`markdown-body-inline ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  const mermaid = extractMermaidBlocks(text);
  const tabs = extractLangTabGroups(mermaid.stripped);

  const html = instance.parse(tabs.stripped) as string;

  if (mermaid.blocks.length === 0 && tabs.groups.length === 0) {
    return (
      <div
        className={`markdown-body ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  const parts = splitOnSentinels(html);

  return (
    <div className={`markdown-body ${className}`}>
      {parts.map((part, i) => {
        if (part.kind === 'html') {
          return <div key={`html-${i}`} dangerouslySetInnerHTML={{ __html: part.value }} />;
        }
        if (part.kind === 'mermaid') {
          return <MermaidDiagram key={`mer-${i}`} chart={mermaid.blocks[part.idx]} />;
        }
        return (
          <CodeLanguageTabs
            key={`lang-${i}`}
            code={tabs.groups[part.idx].code}
          />
        );
      })}
    </div>
  );
}
