import { NextResponse } from 'next/server';
import { addBookmark, removeBookmark } from '@/lib/server/user-store';
import { getUserIdFromRequest } from '@/lib/server/crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const questionId = Number((await params).id);
  if (!Number.isFinite(questionId)) return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
  addBookmark(userId, questionId);
  return NextResponse.json({ bookmarked: true });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const questionId = Number((await params).id);
  if (!Number.isFinite(questionId)) return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
  removeBookmark(userId, questionId);
  return NextResponse.json({ bookmarked: false });
}
