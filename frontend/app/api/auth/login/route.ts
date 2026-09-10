import { NextResponse } from 'next/server';
import { authenticate, mergeGuestData, toPublicUser, AuthError } from '@/lib/server/user-store';
import { signToken } from '@/lib/server/crypto';
import { attachSession } from '@/lib/server/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) ?? {};
    const { email, password } = body;
    const user = authenticate(email, password);
    if (body?.guest) {
      mergeGuestData(user.id, { bookmarks: body.guest.bookmarks, completed: body.guest.completed });
    }
    const token = signToken(user.id, user.email);
    return attachSession(NextResponse.json({ token, user: toPublicUser(user) }), token);
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    // eslint-disable-next-line no-console
    console.error('[auth/login] error:', err);
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
