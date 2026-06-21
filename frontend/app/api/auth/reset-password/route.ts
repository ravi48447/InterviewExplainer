import { NextResponse } from 'next/server';
import { consumeAuthToken, setPassword, getUserById, toPublicUser, AuthError } from '@/lib/server/user-store';
import { signToken } from '@/lib/server/crypto';
import { attachSession } from '@/lib/server/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { token, password } = (await req.json().catch(() => ({}))) ?? {};
    if (!token || !password) {
      return NextResponse.json({ message: 'Token and new password are required.' }, { status: 400 });
    }

    const uid = consumeAuthToken(token, 'reset');
    if (!uid) {
      return NextResponse.json({ message: 'This reset link is invalid or has expired.' }, { status: 400 });
    }

    setPassword(uid, password);
    const user = getUserById(uid);
    if (!user) return NextResponse.json({ message: 'Account not found.' }, { status: 404 });

    // Log the user straight in after a successful reset.
    const session = signToken(user.id, user.email);
    return attachSession(
      NextResponse.json({ token: session, user: toPublicUser(user) }),
      session,
    );
  } catch (err) {
    const status = err instanceof AuthError ? err.status : 500;
    return NextResponse.json({ message: (err as Error).message }, { status });
  }
}
