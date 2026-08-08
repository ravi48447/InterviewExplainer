"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Speakable } from "@/components/speakable";
import {
  AlertTriangle,
  BookOpen,
  Clock,
  Compass,
  Copy,
  FileCode2,
  Info,
  Lightbulb,
  Sparkles,
  Star,
  Target,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { PreviewArticle as PreviewArticleData } from "@/lib/preview-loader";
import MermaidDiagram from "@/components/MermaidDiagram";

interface Props {
  article: PreviewArticleData;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────────────────────── */

function difficultyColour(d?: string) {
  switch ((d || "").toLowerCase()) {
    case "beginner":
    case "easy":
      return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-default dark:border-default/20";
    case "advanced":
    case "hard":
      return "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20";
    default:
      return "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-default dark:border-default/20";
  }
}

/**
 * Walk react children to find a string of text. We need this when the user
 * uses fragmented inline children (text + <code> + text). The result is the
 * full visible text content concatenated.
 */
function extractText(node: React.ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return extractText(props.children);
  }
  return "";
}

/**
 * GitHub-style alert detector. See markdown convention in the source files
 * (blank `>` line between the [!kind] tag and the body so they parse as
 * separate paragraphs).
 */
function detectAlert(children: React.ReactNode): {
  kind: "warning" | "tip" | "note" | "info" | null;
  title: string;
  body: React.ReactNode;
} {
  const arr = React.Children.toArray(children);
  let firstPIdx = -1;
  for (let i = 0; i < arr.length; i++) {
    const c = arr[i];
    if (!React.isValidElement(c)) continue;
    const t = c.type as unknown;
    const isP =
      t === baseComponents.p ||
      t === speakableComponents.p ||
      t === quickComponents.p ||
      (typeof t === "string" && t === "p");
    if (isP) {
      firstPIdx = i;
      break;
    }
  }
  if (firstPIdx === -1) return { kind: null, title: "", body: children };

  const firstP = arr[firstPIdx] as React.ReactElement<{ children?: React.ReactNode }>;
  const inner = React.Children.toArray(firstP.props.children);
  const leading = typeof inner[0] === "string" ? (inner[0] as string) : "";
  const match = leading.match(/^\s*\[!(warning|tip|note|info)\]\s*(.*)$/is);
  if (!match) return { kind: null, title: "", body: children };

  const kind = match[1].toLowerCase() as "warning" | "tip" | "note" | "info";
  const titleLeading = match[2];
  const titleNodes: React.ReactNode[] = [];
  if (titleLeading) titleNodes.push(titleLeading);
  for (let i = 1; i < inner.length; i++) titleNodes.push(inner[i]);
  const titleText = titleNodes
    .map((n) => (typeof n === "string" ? n : ""))
    .join("")
    .trim();

  const before = arr.slice(0, firstPIdx);
  const after = arr.slice(firstPIdx + 1);

  return {
    kind,
    title: titleText || "",
    body: (
      <>
        {before}
        {after}
      </>
    ),
  };
}

const ALERT_THEME: Record<
  "warning" | "tip" | "note" | "info",
  {
    border: string;
    bg: string;
    accentLine: string;
    iconCls: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }
> = {
  warning: {
    border: "border-default dark:border-default/20",
    bg: "bg-amber-50 dark:bg-amber-500/10 dark:bg-amber-950/20",
    accentLine: "bg-amber-400 dark:bg-amber-800",
    iconCls: "text-amber-600 dark:text-amber-400",
    icon: AlertTriangle,
    label: "Watch out",
  },
  tip: {
    border: "border-default dark:border-default/20",
    bg: "bg-emerald-50 dark:bg-emerald-500/10 dark:bg-emerald-950/20",
    accentLine: "bg-emerald-400 dark:bg-emerald-800",
    iconCls: "text-emerald-600 dark:text-emerald-400",
    icon: Lightbulb,
    label: "Tip",
  },
  note: {
    border: "border-default dark:border-default/20",
    bg: "bg-blue-50 dark:bg-blue-500/10 dark:bg-blue-950/20",
    accentLine: "bg-blue-400 dark:bg-blue-800",
    iconCls: "text-primary dark:text-primary",
    icon: Info,
    label: "Note",
  },
  info: {
    border: "border-default dark:border-default/20",
    bg: "bg-blue-50 dark:bg-blue-500/10 dark:bg-blue-950/20",
    accentLine: "bg-blue-400 dark:bg-blue-800",
    iconCls: "text-primary dark:text-primary",
    icon: Info,
    label: "Heads up",
  },
};

/* ──────────────────────────────────────────────────────────────────────────
 * rehype plugin: pair adjacent ❌/✅ code blocks into a single .code-pair div
 * so the renderer can lay them out side-by-side on wide screens.
 * ────────────────────────────────────────────────────────────────────────── */

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

function hastText(node: HastNode | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.value || "";
  if (Array.isArray(node.children)) return node.children.map(hastText).join("");
  return "";
}

function firstCommentLine(preNode: HastNode): string {
  const text = hastText(preNode);
  const firstLine = text.split("\n").find((l) => l.trim().length > 0) || "";
  return firstLine.trim();
}

function isWhitespaceTextNode(n: HastNode | undefined): boolean {
  return !!n && n.type === "text" && (n.value || "").trim() === "";
}

function isPre(n: HastNode | undefined): boolean {
  return !!n && n.type === "element" && n.tagName === "pre";
}

export function rehypePairCodeBlocks() {
  return (tree: HastNode) => {
    function walk(node: HastNode) {
      if (!Array.isArray(node.children)) return;
      const next: HastNode[] = [];
      let i = 0;
      while (i < node.children.length) {
        const cur = node.children[i];

        // Find the next non-whitespace sibling.
        let peekIdx = i + 1;
        while (peekIdx < node.children.length && isWhitespaceTextNode(node.children[peekIdx])) {
          peekIdx++;
        }
        const peek = node.children[peekIdx];

        if (isPre(cur) && isPre(peek)) {
          const a = firstCommentLine(cur);
          const b = firstCommentLine(peek);
          const aBad = /❌|wrong|theatre|without|buggy|broken|coupled/i.test(a);
          const bGood = /✅|right|real|correct|^with\b|composition|abstracted/i.test(b);
          if (aBad && bGood) {
            next.push({
              type: "element",
              tagName: "div",
              properties: { className: ["code-pair"] },
              children: [cur, peek],
            });
            i = peekIdx + 1;
            continue;
          }
        }
        if (Array.isArray(cur?.children)) walk(cur);
        next.push(cur);
        i++;
      }
      node.children = next;
    }
    walk(tree);
  };
}

/* ──────────────────────────────────────────────────────────────────────────
 * CodeBlock — the window-style code presenter
 *
 * Detects ❌ / wrong / theatre / without / buggy → red flavour
 * Detects ✅ / right / real / with / correct  → green flavour
 * Otherwise: neutral.
 *
 * Extracts the title from the first `// …` comment if present.
 * ────────────────────────────────────────────────────────────────────────── */

function classifyCode(text: string): {
  flavour: "good" | "bad" | "neutral";
  title: string;
  cleanedCode: string;
} {
  const lines = text.split("\n");
  let title = "";
  let firstCommentLineIdx = -1;

  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i].trim();
    if (line.startsWith("//") || line.startsWith("#")) {
      title = line.replace(/^(\/\/|#)\s?/, "").trim();
      firstCommentLineIdx = i;
      break;
    }
  }

  let flavour: "good" | "bad" | "neutral" = "neutral";
  const lowered = title.toLowerCase();
  if (
    title.includes("❌") ||
    /\b(wrong|theatre|without|buggy|broken|fake|bad|coupled)\b/i.test(lowered) ||
    lowered.includes("trying to model")
  ) {
    flavour = "bad";
  } else if (
    title.includes("✅") ||
    /\b(real|right|correct|with(?:\s|$)|good|composition|abstracted)\b/i.test(lowered) ||
    lowered.includes("polymorphism") ||
    lowered.includes("encapsulation") ||
    lowered.includes("is-a") ||
    lowered.includes("has-a")
  ) {
    flavour = "good";
  }

  // Strip the first comment line + a possibly-empty line after it from the
  // code shown in the editor area.
  let cleanedCode = text;
  if (firstCommentLineIdx >= 0) {
    const linesCopy = [...lines];
    linesCopy.splice(firstCommentLineIdx, 1);
    if (
      linesCopy[firstCommentLineIdx] !== undefined &&
      linesCopy[firstCommentLineIdx].trim() === ""
    ) {
      linesCopy.splice(firstCommentLineIdx, 1);
    }
    cleanedCode = linesCopy.join("\n");
  }

  // Title cleanup — remove leading icons.
  title = title.replace(/^[❌✅✓✗\u2713\u2717]\s*/, "").trim();

  return { flavour, title, cleanedCode };
}

function CodeBlock({
  language,
  code,
  highlightedHtml,
}: {
  language: string;
  code: string;
  highlightedHtml: string;
}) {
  const { flavour, title, cleanedCode } = classifyCode(code);
  const [copied, setCopied] = React.useState(false);

  const accent =
    flavour === "bad"
      ? {
          ring: "border-rose-200 dark:border-rose-500/20",
          headerBg: "bg-gradient-to-r   from-rose-50 dark:from-rose-950/40 to-rose-50/60 dark:to-rose-950/40",
          headerText: "text-rose-700 dark:text-rose-400",
          iconCls: "text-rose-500",
          IconCmp: XCircle,
          dotCls: "bg-rose-400 dark:bg-rose-800",
          tag: "Anti-pattern",
          tagCls: "bg-rose-100 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
        }
      : flavour === "good"
      ? {
          ring: "border-default dark:border-default/20",
          headerBg: "bg-surface ",
          headerText: "text-emerald-700 dark:text-emerald-400",
          iconCls: "text-emerald-500",
          IconCmp: CheckCircle2,
          dotCls: "bg-emerald-400 dark:bg-emerald-800",
          tag: "Recommended",
          tagCls: "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-default dark:border-default/20",
        }
      : {
          ring: "border-border",
          headerBg: "bg-surface",
          headerText: "text-muted-foreground",
          iconCls: "text-muted-foreground",
          IconCmp: FileCode2,
          dotCls: "bg-slate-300 dark:bg-slate-800",
          tag: "",
          tagCls: "",
        };

  const Icon = accent.IconCmp;

  function onCopy() {
    void navigator.clipboard.writeText(cleanedCode).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    });
  }

  const codeHtml = highlightedHtml || escapeHtml(cleanedCode);

  return (
    <div
      className={`group not-prose my-8 rounded-xl border ${accent.ring} bg-background overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.05)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition-shadow code-pair-item`}
    >
      <div className={`flex items-center gap-2.5 px-4 py-2 border-b border-slate-100 dark:border-slate-800/60 ${accent.headerBg}`}>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`h-2 w-2 rounded-full ${accent.dotCls}/70`} />
          <span className={`h-2 w-2 rounded-full ${accent.dotCls}/40`} />
          <span className={`h-2 w-2 rounded-full ${accent.dotCls}/20`} />
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Icon className={`h-3 w-3 ${accent.iconCls}`} />
          <span className={`text-[10px] font-black uppercase tracking-[0.14em] ${accent.headerText}`}>
            {language || "code"}
          </span>
        </div>
        {title && (
          <span className="text-[12px] text-muted-foreground font-medium truncate flex-1">
            {title}
          </span>
        )}
        {!title && <span className="flex-1" />}
        {accent.tag && (
          <span className={`hidden sm:inline-flex text-[9.5px] font-bold uppercase tracking-[0.1em] px-1.5 py-[1px] rounded border ${accent.tagCls}`}>
            {accent.tag}
          </span>
        )}
        <button
          onClick={onCopy}
          className="shrink-0 inline-flex items-center gap-1 text-[10.5px] font-semibold text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5 rounded hover:bg-background/70"
          aria-label="Copy code"
        >
          <Copy className="h-3 w-3" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="m-0 overflow-x-auto bg-code text-muted-foreground text-[13px] leading-[1.65] px-5 py-4">
        <code
          className={`hljs language-${language || "plaintext"} font-mono whitespace-pre`}
          dangerouslySetInnerHTML={{ __html: codeHtml }}
        />
      </pre>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ──────────────────────────────────────────────────────────────────────────
 * Pre / Code overrides
 * ────────────────────────────────────────────────────────────────────────── */

type CodeProps = {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};

function MarkdownCode({ inline, className, children }: CodeProps) {
  if (inline) {
    return (
      <code className="bg-surface text-foreground rounded px-[5px] py-[1px] text-[0.88em] font-mono border border-border/80">
        {children}
      </code>
    );
  }
  return <code className={className}>{children}</code>;
}

function MarkdownPre({ children }: { children?: React.ReactNode }) {
  const child = React.Children.toArray(children)[0];
  if (!React.isValidElement(child)) return <pre>{children}</pre>;

  const codeProps = child.props as { className?: string; children?: React.ReactNode };
  const className = codeProps.className || "";
  const langMatch = className.match(/language-(\w+)/);
  const language = langMatch ? langMatch[1] : "";

  if (language === "mermaid") {
    const text = extractText(codeProps.children);
    return <MermaidDiagram chart={text} />;
  }

  const rawText = extractText(codeProps.children);
  const highlightedHtml = renderToHtml(codeProps.children);
  return <CodeBlock language={language} code={rawText} highlightedHtml={highlightedHtml} />;
}

function renderToHtml(node: React.ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string") return escapeHtml(node);
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(renderToHtml).join("");
  if (React.isValidElement(node)) {
    const props = node.props as { className?: string; children?: React.ReactNode };
    const tag = typeof node.type === "string" ? node.type : "span";
    const cls = props.className ? ` class="${escapeHtml(props.className)}"` : "";
    const inner = renderToHtml(props.children);
    return `<${tag}${cls}>${inner}</${tag}>`;
  }
  return "";
}

/* ──────────────────────────────────────────────────────────────────────────
 * `div` override — handles the .code-pair wrapper from the rehype plugin
 * ────────────────────────────────────────────────────────────────────────── */

function MarkdownDiv({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const cls = className || "";
  if (cls.includes("code-pair")) {
    return (
      <div className="my-8 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:-mx-8 xl:-mx-16 [&>*]:my-0">
        {children}
      </div>
    );
  }
  return <div className={cls}>{children}</div>;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Markdown component overrides — base
 * ────────────────────────────────────────────────────────────────────────── */

export const baseComponents = {
  p({ children }: { children?: React.ReactNode }) {
    return (
      <p className="text-[16px] leading-[1.78] text-foreground my-4 first:mt-0 last:mb-0">
        {children}
      </p>
    );
  },
  h2({ children }: { children?: React.ReactNode }) {
    const id = slugify(extractText(children));
    return (
      <h2 id={id} className="preview-display text-[26px] font-bold text-foreground tracking-[-0.01em] mt-12 mb-4 first:mt-0 scroll-mt-24">
        {children}
      </h2>
    );
  },
  h3({ children }: { children?: React.ReactNode }) {
    const id = slugify(extractText(children));
    return (
      <h3
        id={id}
        className="preview-display text-[20px] font-bold text-foreground tracking-[-0.005em] mt-12 mb-3 first:mt-0 scroll-mt-24 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[8px] before:bottom-[8px] before:w-[3px] before:rounded-full before:bg-slate-200 dark:bg-slate-800"
      >
        {children}
      </h3>
    );
  },
  h4({ children }: { children?: React.ReactNode }) {
    return (
      <h4 className="text-[12.5px] font-bold text-muted-foreground uppercase tracking-[0.12em] mt-7 mb-2">
        {children}
      </h4>
    );
  },
  ul({ children }: { children?: React.ReactNode }) {
    return <ul className="my-5 space-y-2 list-none pl-0">{children}</ul>;
  },
  ol({ children }: { children?: React.ReactNode }) {
    return (
      <ol className="my-5 space-y-2 list-decimal pl-6 marker:text-muted-foreground marker:font-semibold">
        {children}
      </ol>
    );
  },
  li({ children }: { children?: React.ReactNode }) {
    return (
      <li className="flex items-start gap-3 text-[15.5px] leading-[1.72] text-foreground">
        <span className="mt-[9px] h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-800 shrink-0" />
        <span className="flex-1 [&>p]:m-0">{children}</span>
      </li>
    );
  },
  strong({ children }: { children?: React.ReactNode }) {
    return <strong className="font-semibold text-foreground">{children}</strong>;
  },
  em({ children }: { children?: React.ReactNode }) {
    return <em className="italic text-muted-foreground">{children}</em>;
  },
  code: MarkdownCode,
  pre: MarkdownPre,
  div: MarkdownDiv,
  table({ children }: { children?: React.ReactNode }) {
    return (
      <div className="my-7 overflow-x-auto rounded-lg border border-border/80 bg-background">
        <table className="w-full text-[14px] border-collapse">{children}</table>
      </div>
    );
  },
  thead({ children }: { children?: React.ReactNode }) {
    return <thead className="bg-surface/70">{children}</thead>;
  },
  th({ children }: { children?: React.ReactNode }) {
    return (
      <th className="px-4 py-2.5 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-[0.08em] border-b border-border">
        {children}
      </th>
    );
  },
  td({ children }: { children?: React.ReactNode }) {
    return (
      <td className="px-4 py-3 text-foreground align-top border-b border-slate-100 dark:border-slate-800/60 leading-[1.6] [&_code]:text-[12.5px] [&_strong]:text-foreground">
        {children}
      </td>
    );
  },
  tr({ children }: { children?: React.ReactNode }) {
    return <tr className="last:[&>td]:border-b-0 hover:bg-surface/50 transition-colors">{children}</tr>;
  },
  blockquote({ children }: { children?: React.ReactNode }) {
    const { kind, title, body } = detectAlert(children);
    if (kind) {
      const t = ALERT_THEME[kind];
      const Icon = t.icon;
      return (
        <aside className={`my-7 rounded-xl border ${t.border} ${t.bg} pl-5 pr-5 py-4 relative overflow-hidden`}>
          <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${t.accentLine}`} />
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`h-3.5 w-3.5 ${t.iconCls}`} />
            <span className={`text-[10px] font-black uppercase tracking-[0.16em] ${t.iconCls}`}>
              {t.label}
            </span>
          </div>
          {title && (
            <div className="text-[15px] font-semibold text-foreground mb-1.5 leading-snug">{title}</div>
          )}
          <div className="text-[14.5px] leading-[1.7] text-foreground [&_p]:my-1.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_code]:text-[0.88em]">
            {body}
          </div>
        </aside>
      );
    }
    return (
      <blockquote className="my-6 border-l-[3px] border-border pl-4 py-1 italic text-muted-foreground [&>p]:my-1.5">
        {children}
      </blockquote>
    );
  },
  a({ href, children }: { href?: string; children?: React.ReactNode }) {
    return (
      <a
        href={href}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="text-primary dark:text-primary underline underline-offset-[3px] decoration-blue-200 hover:decoration-blue-500 hover:text-primary dark:text-primary font-medium transition-colors"
      >
        {children}
      </a>
    );
  },
  hr() {
    return (
      <div className="my-10 flex items-center justify-center gap-2">
        <span className="h-px w-12 bg-slate-200 dark:bg-slate-800" />
        <span className="text-muted-foreground text-xs tracking-[0.3em] select-none">◇</span>
        <span className="h-px w-12 bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  },
};

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* ──────────────────────────────────────────────────────────────────────────
 * Speakable-zone components: serif, drop cap, larger font, pillar emphasis.
 * ────────────────────────────────────────────────────────────────────────── */

type HastTextLikeNode = {
  type?: string;
  tagName?: string;
  value?: string;
  children?: HastTextLikeNode[];
};

type HastParagraphNode = {
  position?: { start?: { offset?: number } };
  children?: HastTextLikeNode[];
};

function hastNodeText(n: HastTextLikeNode | undefined): string {
  if (!n) return "";
  if (n.type === "text") return n.value || "";
  if (Array.isArray(n.children)) return n.children.map(hastNodeText).join("");
  return "";
}

const speakableComponents = {
  ...baseComponents,
  p({ children, node }: { children?: React.ReactNode; node?: HastParagraphNode }) {
    const firstHastChild = node?.children?.[0];
    const opensWithStrong =
      firstHastChild?.type === "element" && firstHastChild?.tagName === "strong";

    // Pillar paragraphs: render an opener label (the pillar name) above the
    // body via `data-pillar` so CSS can style it with the small caps mark.
    let pillarLabel: string | undefined;
    if (opensWithStrong) {
      const strongText = hastNodeText(firstHastChild).trim();
      // Single-word pillar headers like "Encapsulation" / "Inheritance"
      if (strongText && /^[A-Z][a-z]+$/.test(strongText)) {
        pillarLabel = strongText;
      }
    }

    return (
      <p className="speakable-p" data-pillar={pillarLabel}>
        {children}
      </p>
    );
  },
  strong({ children }: { children?: React.ReactNode }) {
    return <strong>{children}</strong>;
  },
  em({ children }: { children?: React.ReactNode }) {
    return <em>{children}</em>;
  },
  code: MarkdownCode,
};

/* ──────────────────────────────────────────────────────────────────────────
 * Quick-zone components: amber, list-led, scannable.
 * ────────────────────────────────────────────────────────────────────────── */

const quickComponents = {
  ...baseComponents,
  p({ children }: { children?: React.ReactNode }) {
    return (
      <p className="text-[14px] leading-[1.65] text-muted-foreground my-2.5 first:mt-0 italic">
        {children}
      </p>
    );
  },
  ul({ children }: { children?: React.ReactNode }) {
    return <ul className="my-0 space-y-2.5 list-none pl-0">{children}</ul>;
  },
  li({ children }: { children?: React.ReactNode }) {
    return (
      <li className="flex items-start gap-3 text-[15.5px] leading-[1.65] text-foreground quick-li">
        <span className="mt-[8px] h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-800 shrink-0 ring-[3px] ring-ring" />
        <span className="flex-1 [&>p]:m-0">{children}</span>
      </li>
    );
  },
  strong({ children }: { children?: React.ReactNode }) {
    return <strong className="font-semibold text-foreground">{children}</strong>;
  },
  em({ children }: { children?: React.ReactNode }) {
    return <em className="italic text-muted-foreground">{children}</em>;
  },
};

/* ──────────────────────────────────────────────────────────────────────────
 * TOC for Deep dive
 * ────────────────────────────────────────────────────────────────────────── */

export interface TocItem {
  id: string;
  text: string;
}

export function extractTocFromBody(body: string): TocItem[] {
  const items: TocItem[] = [];
  const re = /^###\s+(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    const text = m[1].trim();
    items.push({ id: slugify(text), text });
  }
  return items;
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav className="hidden lg:block sticky top-8 self-start w-[240px] xl:w-[260px] 2xl:w-[280px] shrink-0">
      <div className="text-[10.5px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">
        On this page
      </div>
      <ul className="space-y-1.5 border-l border-border pl-3">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block text-[12.5px] leading-snug text-muted-foreground hover:text-foreground transition-colors py-1"
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
 * Zone-jumper rail (left side, sticky) — quick navigation between zones
 * ────────────────────────────────────────────────────────────────────────── */

function ZoneRail({
  zones,
}: {
  zones: { quick?: boolean; speakable?: boolean; deepDive?: boolean };
}) {
  const items: Array<{ id: string; label: string; sub: string; accent: string }> = [];
  if (zones.quick)
    items.push({ id: "zone-quick", label: "01", sub: "At a glance", accent: "bg-amber-500 dark:bg-amber-800" });
  if (zones.speakable)
    items.push({ id: "zone-speakable", label: "02", sub: "Interview answer", accent: "bg-emerald-500 dark:bg-emerald-800" });
  if (zones.deepDive)
    items.push({ id: "zone-deep", label: "03", sub: "Deep dive", accent: "bg-slate-700 dark:bg-slate-800" });

  return (
    <nav className="hidden xl:flex sticky top-8 self-start flex-col gap-3 w-[140px] 2xl:w-[160px] shrink-0">
      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-1">
        Zones
      </div>
      {items.map((it) => (
        <a
          key={it.id}
          href={`#${it.id}`}
          className="group block py-2 pl-3 border-l-2 border-border hover:border-slate-900 dark:border-slate-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${it.accent}`} />
            <span className="text-[10px] font-black tracking-[0.18em] text-muted-foreground group-hover:text-foreground">
              {it.label}
            </span>
          </div>
          <span className="block mt-0.5 text-[11.5px] font-semibold text-muted-foreground group-hover:text-foreground leading-tight">
            {it.sub}
          </span>
        </a>
      ))}
    </nav>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * The article shell
 * ────────────────────────────────────────────────────────────────────────── */

export default function PreviewArticle({ article }: Props) {
  const { meta, zones } = article;
  const tocItems = zones.deepDive ? extractTocFromBody(zones.deepDive) : [];

  // Direct serif fallback chain — works regardless of next/font.
  // Charter ships on every Mac, Georgia on every Windows machine,
  // so even before Source Serif 4 loads we get a proper magazine serif.
  const PROSE_SERIF =
    "'Source Serif 4', Charter, 'Iowan Old Style', 'Apple Garamond', Palatino, 'Georgia Pro', Georgia, serif";
  const DISPLAY_SERIF =
    "'Crimson Pro', 'Source Serif 4', Charter, 'Iowan Old Style', Palatino, Georgia, serif";

  return (
    <div className="min-h-screen bg-surface-subtle text-foreground">
      {/* Subtle paper texture via gradient — magazine feel */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.22]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <style>{`
        .speakable-prose,
        .speakable-prose p,
        .speakable-prose strong,
        .speakable-prose em,
        .speakable-prose .speakable-p {
          font-family: ${PROSE_SERIF};
          font-feature-settings: "kern", "liga", "calt", "onum";
        }
        .speakable-prose {
          counter-reset: pillar;
        }
        .speakable-prose p {
          font-size: 18px;
          line-height: 1.78;
          color: hsl(var(--text-primary));
          margin-top: 1.4em;
          margin-bottom: 0;
        }
        .speakable-prose p:first-child {
          margin-top: 0;
        }
        .speakable-prose p:first-of-type::first-letter {
          font-family: ${DISPLAY_SERIF};
          float: left;
          font-size: 4.2em;
          line-height: 0.88;
          font-weight: 700;
          padding: 0.35rem 0.7rem 0 0;
          color: hsl(var(--success));
          background: linear-gradient(135deg, #0f766e 0%, #047857 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .speakable-prose p[data-pillar] {
          counter-increment: pillar;
          margin-top: 2.6em;
          margin-bottom: 0;
          padding: 1.4rem 1.5rem 1.4rem 1.6rem;
          border-radius: 12px;
          border: 1px solid var(--pillar-border, rgba(148, 163, 184, 0.25));
          background: var(--pillar-bg, #ffffff);
          position: relative;
        }
        .speakable-prose p[data-pillar]::before {
          content: "";
          position: absolute;
          left: 0;
          top: 18px;
          bottom: 18px;
          width: 3px;
          border-radius: 0 3px 3px 0;
          background: var(--pillar-accent, #10b981);
        }
        /*
          Phase 1.9 — removed the four hardcoded OOP-name CSS rules
          (data-pillar="Encapsulation" / "Inheritance" / "Polymorphism"
          / "Abstraction"). Styling is now driven by archetype + pillar
          + layout from the data, not by string-matching headings. See
          docs/SPEAKABLE-PHASE-1-PROMPT.md §16.4.
        */
        .speakable-prose p[data-pillar] > strong:first-child {
          display: block;
          font-family: ${DISPLAY_SERIF};
          font-size: 24px;
          line-height: 1.2;
          font-weight: 700;
          color: var(--pillar-accent, #064e3b);
          letter-spacing: -0.015em;
          margin-bottom: 0.5rem;
        }
        .speakable-prose p[data-pillar] > strong:first-child::before {
          content: counter(pillar, decimal-leading-zero);
          display: inline-block;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.16em;
          color: var(--pillar-accent, #10b981);
          background: color-mix(in srgb, var(--pillar-accent, #10b981) 10%, transparent);
          padding: 2px 6px;
          border-radius: 4px;
          margin-right: 0.7rem;
          vertical-align: 0.22em;
        }
        .speakable-prose p strong {
          font-weight: 600;
          color: hsl(var(--text-primary));
        }
        .speakable-prose em {
          font-style: italic;
          color: hsl(var(--text-muted));
        }
        .speakable-prose code {
          font-family: var(--font-geist-mono), ui-monospace, monospace;
          font-size: 0.88em;
          color: hsl(var(--code-text));
          background: hsl(var(--code-surface));
          padding: 1px 6px;
          border-radius: 4px;
          border: 1px solid hsl(var(--code-border));
        }
        .quick-prose .quick-li {
          font-family: ${PROSE_SERIF};
          font-feature-settings: "kern", "liga";
        }
        .preview-display {
          font-family: ${DISPLAY_SERIF};
          font-feature-settings: "kern", "liga", "calt";
        }
      `}</style>

      <div className="relative w-full max-w-none mx-auto px-5 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 py-10 sm:py-14">
        <div className="flex justify-center gap-6 lg:gap-8 xl:gap-12 2xl:gap-16">
          {/* Left zone-jumper rail (xl+) */}
          <ZoneRail
            zones={{
              quick: !!zones.quick,
              speakable: !!zones.speakable,
              deepDive: !!zones.deepDive,
            }}
          />

          {/* Main column */}
          <article className="flex-1 min-w-0 max-w-[860px] xl:max-w-[900px] 2xl:max-w-[960px] mx-auto xl:mx-0">
            {/* ── Hero ───────────────────────────────────────────────────── */}
            <header className="mb-10 pb-8 border-b border-border/70">
              <div className="flex items-center gap-2 mb-4 text-[10.5px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                <Compass className="h-3 w-3" />
                <span>Interview Answer</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">Java OOP</span>
              </div>

              <h1 className="preview-display text-[32px] sm:text-[38px] lg:text-[44px] font-black leading-[1.1] tracking-[-0.015em] text-foreground mb-4">
                {meta.title}
              </h1>

              <p className="text-[17px] lg:text-[18px] leading-[1.55] text-muted-foreground mb-6 max-w-[680px] preview-display italic font-normal">
                {meta.question}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px]">
                {meta.difficulty && (
                  <span
                    className={`px-2.5 py-[3px] rounded-md border text-[10.5px] font-bold uppercase tracking-[0.08em] inline-flex items-center gap-1 ${difficultyColour(
                      meta.difficulty
                    )}`}
                  >
                    <Target className="h-3 w-3" />
                    {meta.difficulty}
                  </span>
                )}
                {meta.reading_time_minutes && (
                  <span className="px-2.5 py-[3px] rounded-md bg-surface border border-border text-muted-foreground font-semibold flex items-center gap-1 text-[11.5px]">
                    <Clock className="h-3 w-3" />
                    {meta.reading_time_minutes} min read
                  </span>
                )}
                {meta.last_updated && (
                  <span className="text-muted-foreground text-[11.5px]">Updated {meta.last_updated}</span>
                )}
              </div>

              {meta.company_tags && meta.company_tags.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground mr-1">
                    Asked at
                  </span>
                  {meta.company_tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-[2px] rounded bg-surface border border-border/80 text-[11px] text-muted-foreground font-medium capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* ── Zone 1 · Quick ─────────────────────────────────────────── */}
            {zones.quick && (
              <section id="zone-quick" className="mb-12 scroll-mt-8">
                <ZoneHeader
                  kicker="Zone 1"
                  title="At a glance"
                  subtitle="30-second revision"
                  icon={Sparkles}
                  accent="amber"
                />
                <div className="quick-prose relative rounded-2xl border border-default dark:border-default/20 bg-gradient-to-br from-surface-elevated to-surface px-6 py-6 sm:px-8 sm:py-7 shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-surface border border-default" />
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={quickComponents as never}>
                    {zones.quick}
                  </ReactMarkdown>
                </div>
              </section>
            )}

            {/* ── Zone 2 · Speakable ─────────────────────────────────────── */}
            {/*
              Phase 1.9 — was an inline ReactMarkdown + speakableComponents
              + speakable-prose div. Now goes through the unified Speakable
              wrapper so v2-approved questions automatically upgrade once
              Phase 2/3 ships. Legacy questions render via the preview
              variant of <Legacy>, which preserves the .speakable-prose
              global magazine styling defined just above (drop-cap, serif,
              code styling). The four hardcoded OOP per-name pillar CSS
              rules were removed in this commit per §16.4.
            */}
            {zones.speakable && (
              <section id="zone-speakable" className="mb-14 scroll-mt-8">
                <ZoneHeader
                  kicker="Zone 2"
                  title="The interview answer"
                  subtitle="What you actually say"
                  icon={Star}
                  accent="emerald"
                />
                <div className="rounded-2xl border border-border/80 bg-background px-6 sm:px-10 py-8 sm:py-10 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <Speakable
                    source={{
                      kind: "legacy",
                      legacy: { type: "speakable_answer", content: zones.speakable },
                    }}
                    legacyVariant="preview"
                  />
                  <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2.5">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Star className="h-3 w-3 fill-emerald-500 text-emerald-500 dark:text-emerald-400" />
                    </span>
                    <span className="text-[12.5px] text-muted-foreground italic">
                      Read aloud — aim for a calm 2-3 minute delivery, not a checklist.
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* ── Zone 3 · Deep dive ─────────────────────────────────────── */}
            {zones.deepDive && (
              <section id="zone-deep" className="mb-14 scroll-mt-8">
                <ZoneHeader
                  kicker="Zone 3"
                  title="Deep dive"
                  subtitle="Read top to bottom — full picture"
                  icon={BookOpen}
                  accent="slate"
                />
                <div className="rounded-2xl border border-border/80 bg-background px-6 sm:px-10 py-8 sm:py-10 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[
                      [rehypeHighlight, { detect: true, ignoreMissing: true }],
                      rehypePairCodeBlocks,
                    ]}
                    components={baseComponents as never}
                  >
                    {zones.deepDive}
                  </ReactMarkdown>
                </div>
              </section>
            )}

            {/* ── Follow-up questions ────────────────────────────────────── */}
            {meta.followup_questions && meta.followup_questions.length > 0 && (
              <section className="mb-12">
                <ZoneHeader
                  kicker="What comes next"
                  title="Follow-up questions"
                  subtitle="Be ready for these"
                  icon={Compass}
                  accent="indigo"
                />
                <ol className="rounded-2xl border border-border/80 bg-background px-6 py-6 sm:px-8 sm:py-7 space-y-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  {meta.followup_questions.map((q, i) => (
                    <li key={i} className="flex items-start gap-3.5 group">
                      <span className="mt-[3px] flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-50 dark:bg-blue-500/10 text-primary dark:text-primary text-[11px] font-black border border-default dark:border-default/20">
                        {i + 1}
                      </span>
                      <span className="text-[15.5px] leading-[1.65] text-foreground pt-[1px]">{q}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* ── Footer meta ────────────────────────────────────────────── */}
            <footer className="mt-14 pt-6 border-t border-border/70 text-[11.5px] text-muted-foreground flex flex-wrap items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <span className="inline-block h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-800" />
                Hand-crafted answer · {meta.last_updated}
              </span>
              <span className="font-mono text-[10.5px] text-muted-foreground">{meta.slug}</span>
            </footer>
          </article>

          {/* Right rail TOC */}
          {tocItems.length > 0 && <TableOfContents items={tocItems} />}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Section header — used between zones
 * ────────────────────────────────────────────────────────────────────────── */

export function ZoneHeader({
  kicker,
  title,
  subtitle,
  icon: Icon,
  accent,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: "amber" | "emerald" | "slate" | "indigo";
}) {
  const accentMap: Record<string, { text: string; bg: string; iconBg: string }> = {
    amber: {
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      iconBg: "bg-amber-100/80 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400",
    },
    emerald: {
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      iconBg: "bg-emerald-100/80 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
    },
    slate: {
      text: "text-muted-foreground",
      bg: "bg-surface",
      iconBg: "bg-surface text-muted-foreground",
    },
    indigo: {
      text: "text-primary dark:text-primary",
      bg: "bg-blue-50 dark:bg-blue-500/10",
      iconBg: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
    },
  };
  const a = accentMap[accent];
  return (
    <div className="flex items-end justify-between gap-4 mb-4 px-1">
      <div className="flex items-center gap-3">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${a.iconBg}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${a.text} mb-0.5`}>
            {kicker}
          </div>
          <h2 className="preview-display text-[20px] font-bold tracking-[-0.01em] text-foreground leading-tight">
            {title}
          </h2>
        </div>
      </div>
      {subtitle && (
        <span className="text-[11.5px] text-muted-foreground font-medium italic shrink-0 hidden sm:block pb-0.5">
          {subtitle}
        </span>
      )}
    </div>
  );
}
