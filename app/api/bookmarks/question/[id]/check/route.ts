import { NextResponse } from 'next/server';
import { isBookmarked } from '@/lib/server/user-store';
import { getUserIdFromRequest } from '@/lib/server/crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json(false);
  const questionId = Number((await params).id);
  if (!Number.isFinite(questionId)) return NextResponse.json(false);
  return NextResponse.json(isBookmarked(userId, questionId));
}
