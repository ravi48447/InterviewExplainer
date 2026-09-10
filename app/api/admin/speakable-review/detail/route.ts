/**
 * GET /api/admin/speakable-review/detail
 *
 * Returns the full speakable_v2 block + the legacy speakable markdown
 * + light metadata for one question, so the admin detail page can
 * render the side-by-side without round-tripping the entire
 * complete-qa.json.
 *
 * Query params:
 *   ?key=<SPEAKABLE_ADMIN_KEY>  (required)
 *   ?question_slug=<slug>       (required)
 */

import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { checkAdminKey } from "@/lib/admin/speakable-review-auth";
import {
  listQuestionsWithV2,
  relPath,
} from "@/lib/admin/speakable-review-fs";

export const dynamic = "force-dynamic";

interface RawQuestion {
  id?: string | number;
  slug?: string;
  title?: string;
  question?: string;
  speakable_answer?: string;
  speakable_v2?: Record<string, unknown>;
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
    return NextResponse.json({ error: `Slug not found: ${slug}` }, { status: 404 });
  }
  let data: { questions?: RawQuestion[] };
  try {
    data = JSON.parse(fs.readFileSync(found.filePath, "utf-8"));
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to read file: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
  const q = (data.questions ?? []).find((x) => (x.slug ?? String(x.id ?? "")) === slug);
  if (!q) {
    return NextResponse.json({ error: `Question not found in file: ${slug}` }, { status: 404 });
  }
  return NextResponse.json({
    file: relPath(found.filePath),
    slug,
    title: q.title ?? q.question ?? slug,
    questionId: q.id ?? slug,
    legacy: {
      type: "speakable_answer",
      content: q.speakable_answer ?? "",
    },
    v2: q.speakable_v2 ?? null,
  });
}
