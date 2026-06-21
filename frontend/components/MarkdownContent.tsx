"use client";

import { Marked } from 'marked';
import MermaidDiagram from './MermaidDiagram';
import CodeLanguageTabs from './CodeLanguageTabs';
import { useContentTheme } from './question/ThemeContext';

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

function buildRendererOptions(theme: 'dark' | 'light') {
  const d = theme === 'dark';

  return {
    gfm: true,
    breaks: false,
    renderer: {
      heading(this: any, token: any) {
        const { tokens, depth } = token;
        const text = this.parser.parseInline(tokens);
        const tag = `h${depth}`;
        const cls: Record<number, string> = d
          ? {
              1: 'text-[22px] font-black text-slate-100 mt-8 mb-4 first:mt-0 pb-2.5 border-b border-slate-700/60 tracking-tight leading-tight',
              2: 'text-[19px] font-bold text-slate-100 mt-8 mb-3 first:mt-0 pb-1.5 border-b border-slate-700/40 tracking-tight leading-snug',
              3: 'text-[16.5px] font-bold text-slate-100 mt-7 mb-2.5 first:mt-0 leading-snug pl-3 border-l-[3px] border-blue-500/60',
              4: 'text-[12.5px] font-bold text-slate-400 uppercase tracking-[0.12em] mt-5 mb-1.5',
            }
          : {
              1: 'text-[22px] font-black text-slate-900 mt-8 mb-4 first:mt-0 pb-2.5 border-b border-slate-200 tracking-tight leading-tight',
              2: 'text-[19px] font-bold text-slate-900 mt-8 mb-3 first:mt-0 pb-1.5 border-b border-slate-200 tracking-tight leading-snug',
              3: 'text-[16.5px] font-bold text-slate-800 mt-7 mb-2.5 first:mt-0 leading-snug pl-3 border-l-[3px] border-blue-500/70',
              4: 'text-[12.5px] font-bold text-slate-500 uppercase tracking-[0.12em] mt-5 mb-1.5',
            };
        return `<${tag} class="${cls[depth] ?? ''}">${text}</${tag}>`;
      },

      paragraph(this: any, token: any) {
        const { tokens } = token;
        const text = this.parser.parseInline(tokens);
        const cls = d
          ? 'text-[15.5px] leading-[1.78] text-slate-200 mb-5 last:mb-0'
          : 'text-[15.5px] leading-[1.78] text-slate-700 mb-5 last:mb-0';
        return `<p class="${cls}">${text}</p>`;
      },

      blockquote(this: any, token: any) {
        const { tokens } = token;
        const body = this.parser.parse(tokens);
        const cls = d
          ? 'border-l-4 border-blue-500/60 pl-4 py-2 my-4 bg-blue-950/30 rounded-r-lg text-slate-300 italic'
          : 'border-l-4 border-blue-400/60 pl-4 py-2 my-4 bg-blue-50 rounded-r-lg text-slate-600 italic';
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
              const badgeCls = d
                ? 'mt-[3px] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-slate-700/70 text-[11px] font-bold text-slate-200 border border-slate-600/60'
                : 'mt-[3px] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-slate-100 text-[11px] font-bold text-slate-700 border border-slate-200';
              const textCls = d
                ? 'flex-1 text-[15.5px] leading-[1.78] text-slate-200 min-w-0 [&>p]:mb-2 [&>p:last-child]:mb-0'
                : 'flex-1 text-[15.5px] leading-[1.78] text-slate-700 min-w-0 [&>p]:mb-2 [&>p:last-child]:mb-0';
              return `<li class="flex items-start gap-3"><span class="${badgeCls}">${num}</span><div class="${textCls}">${body}</div></li>`;
            }
            const dotCls = d
              ? 'mt-[9px] h-[7px] w-[7px] rounded-full bg-blue-400 shrink-0'
              : 'mt-[9px] h-[7px] w-[7px] rounded-full bg-blue-500 shrink-0';
            const textCls = d
              ? 'flex-1 text-[15.5px] leading-[1.78] text-slate-200 min-w-0 [&>p]:mb-2 [&>p:last-child]:mb-0'
              : 'flex-1 text-[15.5px] leading-[1.78] text-slate-700 min-w-0 [&>p]:mb-2 [&>p:last-child]:mb-0';
            return `<li class="flex items-start gap-3"><span class="${dotCls}"></span><div class="${textCls}">${body}</div></li>`;
          })
          .join('');
        return `<${tag} class="${listCls}">${itemsHtml}</${tag}>`;
      },

      strong(token: any) {
        const { text } = token;
        const cls = d ? 'font-bold text-white' : 'font-bold text-slate-900';
        return `<strong class="${cls}">${text}</strong>`;
      },

      em(token: any) {
        const { text } = token;
        const cls = d ? 'italic text-slate-300' : 'italic text-slate-600';
        return `<em class="${cls}">${text}</em>`;
      },

      codespan(token: any) {
        const { text } = token;
        const cls = d
          ? 'bg-blue-950/60 text-blue-200 rounded px-[6px] py-[2px] text-[0.86em] font-mono font-medium border border-blue-800/50'
          : 'bg-blue-50 text-blue-700 rounded px-[6px] py-[2px] text-[0.86em] font-mono font-medium border border-blue-200/70';
        return `<code class="${cls}">${text}</code>`;
      },

      code(token: any) {
        const { text, lang } = token;
        // Code blocks always dark (like GitHub) — hljs applies syntax colours on client.
        const language = (lang || 'plaintext').toString();
        const safe = escapeHtml(text || '');
        return `<pre class="rounded-lg overflow-x-auto max-w-full my-5 text-[13.5px] leading-[1.7] p-0"><code class="hljs language-${language} text-[13.5px] font-mono whitespace-pre block px-4 py-4 rounded-lg">${safe}</code></pre>`;
      },

      hr() {
        const cls = d ? 'border-slate-700/60 my-6' : 'border-slate-200 my-6';
        return `<hr class="${cls}" />`;
      },

      link(token: any) {
        const { href, text } = token;
        const cls = d
          ? 'text-blue-400 hover:text-blue-300 underline underline-offset-2 font-medium'
          : 'text-blue-600 hover:text-blue-700 underline underline-offset-2 font-medium';
        return `<a href="${href ?? ''}" target="_blank" rel="noopener noreferrer" class="${cls}">${text}</a>`;
      },

      table(this: any, token: any) {
        const { header, rows } = token;
        const thCls = d
          ? 'px-4 py-3 bg-slate-800 font-bold text-slate-200 border-b border-slate-700/60 text-left text-[11.5px] uppercase tracking-[0.08em]'
          : 'px-4 py-3 bg-slate-50 font-bold text-slate-700 border-b border-slate-200 text-left text-[11.5px] uppercase tracking-[0.08em]';
        const tdCls = d
          ? 'px-4 py-3 border-b border-slate-700/40 text-slate-300 text-[14px] leading-[1.6] align-top'
          : 'px-4 py-3 border-b border-slate-100 text-slate-700 text-[14px] leading-[1.6] align-top';
        const trEvenCls = d ? 'bg-slate-800/30' : 'bg-slate-50/50';
        const containerCls = d
          ? 'overflow-x-auto my-6 rounded-lg border border-slate-700/60'
          : 'overflow-x-auto my-6 rounded-lg border border-slate-200';
        const theadCls = d ? 'bg-slate-800' : 'bg-slate-50';

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

// Two module-level instances — one per theme. Created once, never recreated.
const markedDark = new Marked();
markedDark.use(buildRendererOptions('dark') as any);

const markedLight = new Marked();
markedLight.use(buildRendererOptions('light') as any);

export default function MarkdownContent({
  content,
  stripTopHeading = false,
  className = '',
  inline = false,
}: MarkdownContentProps) {
  // Falls back to "dark" when used outside a ContentThemeProvider.
  const { theme } = useContentTheme();
  const instance = theme === 'light' ? markedLight : markedDark;

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
