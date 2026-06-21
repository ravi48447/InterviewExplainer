/**
 * preview-loader.ts
 *
 * POC loader for the new Markdown-per-answer architecture.
 * Reads a single .md file at content-md/<slug>.md, parses simple YAML
 * frontmatter, and splits the body into the three zones (Quick / Speakable /
 * Deep dive) by the top-level `## ` headings.
 *
 * Server-side only.
 */

import fs from 'fs';
import path from 'path';

export interface PreviewMeta {
  slug: string;
  title: string;
  question: string;
  domain?: string;
  stack?: string;
  topic?: string;
  difficulty?: string;
  importance?: string;
  last_updated?: string;
  reading_time_minutes?: number;
  order?: number;
  company_tags?: string[];
  followup_questions?: string[];
  interviewer_intent?: {
    testing?: string;
    common_mistake?: string;
    to_stand_out?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface PreviewArticle {
  meta: PreviewMeta;
  /** Body as written in the .md file, frontmatter stripped. */
  body: string;
  /** Body split by top-level ## headings; lowercase keys: quick / speakable / deep dive */
  zones: {
    quick?: string;
    speakable?: string;
    deepDive?: string;
  };
}

const PREVIEW_ROOT = path.join(process.cwd(), '..', 'content-md');

/**
 * Tiny YAML frontmatter parser tuned for our schema. Handles:
 *  - scalar values: `key: value`
 *  - block scalars on next line are treated as scalars
 *  - inline arrays: `key: [a, b, c]`
 *  - block list items: `key:\n  - a\n  - b`
 *  - nested objects (one level): `key:\n  child: value`
 *
 * It is deliberately small — no anchors, no flow-style mappings, no quoted-key
 * gymnastics. Our frontmatter is hand-written by us; we control the shape.
 */
function parseFrontmatter(raw: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = raw.split('\n');

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) {
      i++;
      continue;
    }

    // top-level `key: value` or `key:` (then nested / list)
    const topMatch = line.match(/^([a-zA-Z0-9_]+)\s*:\s*(.*)$/);
    if (!topMatch) {
      i++;
      continue;
    }
    const key = topMatch[1];
    const inline = topMatch[2];

    if (inline === '') {
      // Look ahead for indented children.
      const block: string[] = [];
      let j = i + 1;
      while (j < lines.length && /^\s+/.test(lines[j])) {
        block.push(lines[j]);
        j++;
      }
      if (block.length === 0) {
        result[key] = '';
        i++;
        continue;
      }
      // List?
      if (block.every((b) => /^\s*-\s+/.test(b))) {
        result[key] = block.map((b) => stripQuotes(b.replace(/^\s*-\s+/, '').trim()));
      } else {
        // Nested object
        const nested: Record<string, string> = {};
        for (const b of block) {
          const m = b.match(/^\s+([a-zA-Z0-9_]+)\s*:\s*(.*)$/);
          if (m) nested[m[1]] = stripQuotes(m[2].trim());
        }
        result[key] = nested;
      }
      i = j;
      continue;
    }

    // Inline value
    if (inline.startsWith('[') && inline.endsWith(']')) {
      const inner = inline.slice(1, -1).trim();
      result[key] = inner === ''
        ? []
        : inner.split(',').map((s) => stripQuotes(s.trim()));
    } else {
      result[key] = stripQuotes(inline);
    }
    i++;
  }

  return result;
}

function stripQuotes(s: string): string {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function splitFrontmatter(source: string): { fm: string; body: string } {
  if (!source.startsWith('---')) return { fm: '', body: source };
  const end = source.indexOf('\n---', 3);
  if (end === -1) return { fm: '', body: source };
  const fm = source.slice(3, end).replace(/^\n/, '');
  const after = source.slice(end + 4); // skip '\n---'
  return { fm, body: after.replace(/^\n/, '') };
}

function splitZones(body: string): PreviewArticle['zones'] {
  // Find top-level `## ` headings. We split by them to get chunks.
  const zones: PreviewArticle['zones'] = {};
  const re = /^##\s+(.+)$/gm;
  const matches: Array<{ name: string; start: number; bodyStart: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    matches.push({
      name: m[1].trim().toLowerCase(),
      start: m.index,
      bodyStart: m.index + m[0].length,
    });
  }
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const next = matches[i + 1];
    const chunk = body.slice(cur.bodyStart, next ? next.start : undefined).trim();
    const key = cur.name;
    if (key === 'quick') zones.quick = chunk;
    else if (key === 'speakable') zones.speakable = chunk;
    else if (key === 'deep dive' || key === 'deep-dive' || key === 'deepdive') zones.deepDive = chunk;
  }
  return zones;
}

export function loadPreviewArticle(slug: string): PreviewArticle | null {
  const filePath = path.join(PREVIEW_ROOT, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { fm, body } = splitFrontmatter(raw);
  const meta = parseFrontmatter(fm) as unknown as PreviewMeta;
  const zones = splitZones(body);
  return { meta, body, zones };
}

export function listPreviewSlugs(): string[] {
  if (!fs.existsSync(PREVIEW_ROOT)) return [];
  return fs
    .readdirSync(PREVIEW_ROOT)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}
