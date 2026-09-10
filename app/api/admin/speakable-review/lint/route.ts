/**
 * GET /api/admin/speakable-review/lint
 *
 * Runs `python scripts/audit_speakable.py --check <file> --json` on the
 * complete-qa.json that owns the requested question, then filters the
 * output down to that question only. Used by the admin review detail
 * page to surface the lint score above the side-by-side renderer.
 *
 * Query params:
 *   ?key=<SPEAKABLE_ADMIN_KEY>  (required)
 *   ?question_slug=<slug>       (required)
 */

import { spawn } from "child_process";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { checkAdminKey } from "@/lib/admin/speakable-review-auth";
import {
  listQuestionsWithV2,
  relPath,
} from "@/lib/admin/speakable-review-fs";

export const dynamic = "force-dynamic";

const REPO_ROOT = path.resolve(process.cwd(), "..");
const SCRIPT_PATH = path.join(REPO_ROOT, "scripts", "audit_speakable.py");

interface LintResultJson {
  identifier?: string;
  question_slug?: string;
  status?: string;
  score?: number;
  archetype?: string;
  pillar?: string;
  violations?: Array<{ rule: string; severity: string; message: string }>;
}

export async function GET(req: NextRequest) {
  const auth = checkAdminKey(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: 401 });
  }
  const slug = req.nextUrl.searchParams.get("question_slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing ?question_slug=..." }, { status: 400 });
  }
  const all = listQuestionsWithV2();
  const found = all.find((q) => q.slug === slug);
  if (!found) {
    return NextResponse.json({ error: `Slug not found in any complete-qa.json: ${slug}` }, { status: 404 });
  }

  let stdout = "";
  let stderr = "";
  let exitCode: number | null = null;
  try {
    await new Promise<void>((resolve) => {
      const proc = spawn(
        "python3",
        [SCRIPT_PATH, "--check", found.filePath, "--json", "--fail-on", "fail"],
        { cwd: REPO_ROOT },
      );
      proc.stdout.on("data", (chunk) => (stdout += chunk.toString()));
      proc.stderr.on("data", (chunk) => (stderr += chunk.toString()));
      proc.on("close", (code) => {
        exitCode = code;
        resolve();
      });
      proc.on("error", () => {
        exitCode = -1;
        resolve();
      });
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to spawn lint",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }

  let parsed: LintResultJson[] = [];
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return NextResponse.json(
      {
        error: "Lint output was not JSON",
        exitCode,
        stderr: stderr.slice(0, 4000),
        stdout: stdout.slice(0, 4000),
      },
      { status: 500 },
    );
  }
  const match =
    parsed.find((r) => (r.question_slug ?? r.identifier ?? "").includes(slug)) ?? parsed[0];
  return NextResponse.json({
    file: relPath(found.filePath),
    questionSlug: slug,
    exitCode,
    result: match ?? null,
    raw: parsed,
  });
}
