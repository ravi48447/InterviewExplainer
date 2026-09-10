import { NextResponse } from 'next/server';
import { getUserById } from '@/lib/server/user-store';
import { getUserIdFromRequest } from '@/lib/server/crypto';
import { buildSummary } from '@/lib/server/dashboard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const user = getUserById(getUserIdFromRequest(req));
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(buildSummary(user));
}
