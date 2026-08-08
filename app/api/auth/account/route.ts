import { NextResponse } from 'next/server';
import { updateProfile, toPublicUser, AuthError } from '@/lib/server/user-store';
import { getUserIdFromRequest } from '@/lib/server/crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Update editable profile fields: name, experienceLevel, targetRole, interviewDate. */
export async function POST(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const body = (await req.json().catch(() => ({}))) ?? {};
    const user = updateProfile(userId, {
      name: body.name,
      experienceLevel: body.experienceLevel,
      targetRole: body.targetRole,
      interviewDate: body.interviewDate,
    });
    return NextResponse.json(toPublicUser(user));
  } catch (err) {
    const status = err instanceof AuthError ? err.status : 500;
    return NextResponse.json({ message: (err as Error).message }, { status });
  }
}
