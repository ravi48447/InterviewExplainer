/**
 * GET /api/admin/speakable-review/list
 *
 * Returns every question whose `speakable_v2.speakable_status` matches
 * the requested filter (default: `pending_review`). Grouped by pillar
 * client-side.
 *
 * Query params:
 *   ?key=<SPEAKABLE_ADMIN_KEY>            (required — Phase 1 gate)
 *   ?status=pending_review|approved|...  (default pending_review)
 */

import { NextRequest, NextResponse } from "next/server";
import { checkAdminKey } from "@/lib/admin/speakable-review-auth";
import {
  listQuestionsWithV2,
  relPath,
  type SpeakableStatus,
} from "@/lib/admin/speakable-review-fs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = checkAdminKey(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: 401 });
  }
  const status = (req.nextUrl.searchParams.get("status") ?? "pending_review") as SpeakableStatus;
  const all = listQuestionsWithV2();
  const filtered = all.filter((q) => q.status === status);
  return NextResponse.json({
    status,
    total: filtered.length,
    items: filtered.map((q) => ({
      slug: q.slug,
      title: q.title,
      pillar: q.pillar,
      archetype: q.archetype,
      status: q.status,
      filePath: relPath(q.filePath),
      questionId: q.questionId,
    })),
    counts: {
      legacy: all.filter((q) => q.status === "legacy").length,
      pending_handcraft: all.filter((q) => q.status === "pending_handcraft").length,
      pending_review: all.filter((q) => q.status === "pending_review").length,
      approved: all.filter((q) => q.status === "approved").length,
      rejected: all.filter((q) => q.status === "rejected").length,
      deprecated: all.filter((q) => q.status === "deprecated").length,
    },
  });
}
