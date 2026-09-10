/**
 * Speakable review — filesystem walk helpers (server-only).
 *
 * Used by the Phase 1.8 admin API routes to find every question whose
 * v2 carries `speakable_status === "pending_review"` (or any other
 * filter), and to mutate the `speakable_status` field in place.
 *
 * No DB. JSON-on-disk only. Atomic writes via temp file + rename so a
 * power-loss midway never corrupts a `complete-qa.json`.
 */

import fs from "fs";
import path from "path";
import os from "os";

const REPO_ROOT = path.resolve(process.cwd(), "..");
export const CONTENT_ROOT = path.join(REPO_ROOT, "content");

export type SpeakableStatus =
  | "legacy"
  | "pending_handcraft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "deprecated";

export interface QuestionRecord {
  slug: string;
  title: string;
  pillar: string | null;
  archetype: string | null;
  status: SpeakableStatus | null;
  filePath: string;
  questionId: string | number | null;
}

export interface FileLoad {
  data: { questions?: unknown[] } & Record<string, unknown>;
  text: string;
}

export function readJsonFile(filePath: string): FileLoad {
  const text = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(text);
  return { data, text };
}

/**
 * Walk content/ and yield every complete-qa.json absolute path.
 * Skips the .archive directory (snapshots, not live content).
 */
export function listCompleteQaFiles(): string[] {
  const out: string[] = [];
  if (!fs.existsSync(CONTENT_ROOT)) return out;
  const stack: string[] = [CONTENT_ROOT];
  while (stack.length) {
    const dir = stack.pop()!;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (e.isDirectory()) {
        if (e.name.startsWith(".")) continue;
        if (e.name === "node_modules") continue;
        stack.push(path.join(dir, e.name));
      } else if (e.isFile() && e.name === "complete-qa.json") {
        out.push(path.join(dir, e.name));
      }
    }
  }
  return out.sort();
}

interface RawQuestion {
  id?: string | number;
  slug?: string;
  title?: string;
  question?: string;
  speakable_v2?: {
    archetype?: string;
    pillar?: string;
    speakable_status?: SpeakableStatus;
  };
}

/**
 * Walk the entire content tree and emit one record per question that
 * carries a `speakable_v2` block. Cheap enough to call on each request
 * — the audit lint runs over the same tree in <2s on a cold cache.
 */
export function listQuestionsWithV2(): QuestionRecord[] {
  const out: QuestionRecord[] = [];
  for (const file of listCompleteQaFiles()) {
    let data: { questions?: RawQuestion[] };
    try {
      data = JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {
      continue;
    }
    const questions = Array.isArray(data.questions) ? data.questions : [];
    for (const q of questions) {
      if (!q || !q.speakable_v2) continue;
      out.push({
        slug: q.slug ?? String(q.id ?? ""),
        title: q.title ?? q.question ?? q.slug ?? "(untitled)",
        pillar: q.speakable_v2.pillar ?? null,
        archetype: q.speakable_v2.archetype ?? null,
        status: q.speakable_v2.speakable_status ?? null,
        filePath: file,
        questionId: q.id ?? q.slug ?? null,
      });
    }
  }
  return out;
}

/**
 * Mutate `speakable_v2.speakable_status` for one question and write the
 * file atomically. Optionally appends notes into a sibling
 * `speakable_v2.review_notes` array (each entry timestamped).
 *
 * Returns the new status. Throws if the question can't be located.
 */
export function setSpeakableStatus(opts: {
  filePath: string;
  questionSlug: string;
  newStatus: SpeakableStatus;
  notes?: string;
}): { newStatus: SpeakableStatus; oldStatus: SpeakableStatus | null } {
  const text = fs.readFileSync(opts.filePath, "utf-8");
  const data = JSON.parse(text);
  const questions: RawQuestion[] = Array.isArray(data.questions) ? data.questions : [];
  const idx = questions.findIndex((q) => (q.slug ?? String(q.id ?? "")) === opts.questionSlug);
  if (idx < 0) {
    throw new Error(`Question slug not found: ${opts.questionSlug}`);
  }
  const q = questions[idx];
  if (!q.speakable_v2) {
    throw new Error(`Question ${opts.questionSlug} has no speakable_v2 block.`);
  }
  const oldStatus: SpeakableStatus | null = q.speakable_v2.speakable_status ?? null;
  q.speakable_v2.speakable_status = opts.newStatus;
  if (opts.notes && opts.notes.trim()) {
    const noteEntry = {
      at: new Date().toISOString(),
      from: oldStatus,
      to: opts.newStatus,
      note: opts.notes.trim(),
    };
    const v2 = q.speakable_v2 as Record<string, unknown>;
    const existing = Array.isArray(v2.review_notes) ? (v2.review_notes as unknown[]) : [];
    v2.review_notes = [...existing, noteEntry];
  }

  // Atomic write: temp file in same directory, then rename.
  const dir = path.dirname(opts.filePath);
  const tmp = path.join(dir, `.complete-qa.${process.pid}.${Date.now()}.tmp`);
  const serialized = JSON.stringify(data, null, 2) + "\n";
  fs.writeFileSync(tmp, serialized, "utf-8");
  fs.renameSync(tmp, opts.filePath);
  return { newStatus: opts.newStatus, oldStatus };
}

/**
 * Cross-platform path helper for surfacing relative file paths to the
 * UI without leaking absolute machine paths.
 */
export function relPath(absolute: string): string {
  return path.relative(REPO_ROOT, absolute).split(path.sep).join("/");
}

/**
 * Lookup the temp dir Node prefers (used by the lint runner if it needs
 * to spit a temp JSON file). Centralised so callers don't import os.
 */
export function tempDir(): string {
  return os.tmpdir();
}
