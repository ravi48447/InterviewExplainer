/**
 * POST /api/admin/speakable-review/approve
 *
 * Mutates `speakable_v2.speakable_status` for one question and writes
 * the owning complete-qa.json atomically. Decisions:
 *   - "approve"   → speakable_status = "approved"
 *   - "reject"    → speakable_status = "pending_handcraft" (with notes)
 *   - "send_back" → speakable_status = "pending_review"   (with notes)
 *
 * Body shape:
 *   { question_slug: string,
 *     decision: "approve" | "reject" | "send_back",
 *     notes?: string }
 *
 * Auth via ?key=<SPEAKABLE_ADMIN_KEY> as on the GET routes.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkAdminKey } from "@/lib/admin/speakable-review-auth";
import {
  listQuestionsWithV2,
  setSpeakableStatus,
  type SpeakableStatus,
} from "@/lib/admin/speakable-review-fs";

export const dynamic = "force-dynamic";

type Decision = "approve" | "reject" | "send_back";

const NEXT_STATUS: Record<Decision, SpeakableStatus> = {
  approve: "approved",
  reject: "pending_handcraft",
  send_back: "pending_review",
};

interface ApproveBody {
  question_slug?: string;
  decision?: Decision;
  notes?: string;
}

export async function POST(req: NextRequest) {
  const auth = checkAdminKey(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: 401 });
  }
  let body: ApproveBody;
  try {
    body = (await req.json()) as ApproveBody;
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }
  const slug = body.question_slug;
  const decision = body.decision;
  if (!slug || !decision) {
    return NextResponse.json(
      { error: "Body must contain question_slug + decision." },
      { status: 400 },
    );
  }
  if (!(decision in NEXT_STATUS)) {
    return NextResponse.json({ error: `Unknown decision: ${decision}` }, { status: 400 });
  }
  if (decision !== "approve" && !(body.notes && body.notes.trim())) {
    return NextResponse.json(
      { error: "Reject and send_back decisions require a notes field." },
      { status: 400 },
    );
  }
  const all = listQuestionsWithV2();
  const found = all.find((q) => q.slug === slug);
  if (!found) {
    return NextResponse.json({ error: `Slug not found: ${slug}` }, { status: 404 });
  }
  try {
    const result = setSpeakableStatus({
      filePath: found.filePath,
      questionSlug: slug,
      newStatus: NEXT_STATUS[decision],
      notes: body.notes,
    });
    return NextResponse.json({
      ok: true,
      slug,
      decision,
      previous_status: result.oldStatus,
      new_status: result.newStatus,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
