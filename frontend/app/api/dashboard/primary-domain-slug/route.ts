import { NextResponse } from 'next/server';
import { setActiveDomain, toPublicUser, AuthError } from '@/lib/server/user-store';
import { getUserIdFromRequest } from '@/lib/server/crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Set the user's active focus domain. The slug (and optional display name) come
 * in as query params to match the existing client call shape. Adds the domain
 * to the user's workspace if it isn't already there, then activates it.
 */
export async function POST(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const params = new URL(req.url).searchParams;
    const slug = params.get('slug');
    const name = params.get('name');
    if (!slug) return NextResponse.json({ message: 'A domain slug is required.' }, { status: 400 });
    const user = setActiveDomain(userId, { slug, name: name || slug });
    return NextResponse.json(toPublicUser(user));
  } catch (err) {
    const status = err instanceof AuthError ? err.status : 500;
    return NextResponse.json({ message: (err as Error).message }, { status });
  }
}
