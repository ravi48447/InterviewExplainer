import { NextResponse } from 'next/server';
import { getUserById, toPublicUser } from '@/lib/server/user-store';
import { getUserIdFromRequest } from '@/lib/server/crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const userId = getUserIdFromRequest(req);
  const user = getUserById(userId);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(toPublicUser(user));
}
