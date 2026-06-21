import { NextResponse } from 'next/server';
import {
  setActiveDomain,
  removeDomain,
  toPublicUser,
  AuthError,
} from '@/lib/server/user-store';
import { getUserIdFromRequest } from '@/lib/server/crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Add and/or switch to a focus domain. Body: { slug, name } */
export async function POST(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const { slug, name } = (await req.json().catch(() => ({}))) ?? {};
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ message: 'A domain slug is required.' }, { status: 400 });
    }
    const user = setActiveDomain(userId, { slug, name: name || slug });
    return NextResponse.json(toPublicUser(user));
  } catch (err) {
    const status = err instanceof AuthError ? err.status : 500;
    return NextResponse.json({ message: (err as Error).message }, { status });
  }
}

/** Remove a domain from the workspace. Query: ?slug=... */
export async function DELETE(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const slug = new URL(req.url).searchParams.get('slug');
    if (!slug) return NextResponse.json({ message: 'A domain slug is required.' }, { status: 400 });
    const user = removeDomain(userId, slug);
    return NextResponse.json(toPublicUser(user));
  } catch (err) {
    const status = err instanceof AuthError ? err.status : 500;
    return NextResponse.json({ message: (err as Error).message }, { status });
  }
}
