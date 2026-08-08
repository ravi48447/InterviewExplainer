import { NextResponse } from 'next/server';
import { createUser, mergeGuestData, toPublicUser, AuthError, type SelectedDomain } from '@/lib/server/user-store';
import { signToken } from '@/lib/server/crypto';
import { attachSession } from '@/lib/server/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, password, domainSlug, domainLabel, experienceLevel } = body ?? {};

    // Accept either a single domainSlug (legacy) or a domains[] array.
    const domains: SelectedDomain[] = [];
    if (Array.isArray(body?.domains)) {
      for (const d of body.domains) {
        if (d && typeof d.slug === 'string') domains.push({ slug: d.slug, name: d.name || d.slug });
      }
    }
    if (domainSlug && !domains.some(d => d.slug === domainSlug)) {
      domains.unshift({ slug: domainSlug, name: domainLabel || domainSlug });
    }

    const user = createUser({
      name, email, password, experienceLevel, domains,
      targetRole: body?.targetRole ?? null,
      interviewDate: body?.interviewDate ?? null,
    });

    // Fold any anonymous activity gathered before signup into the new account.
    if (body?.guest) {
      mergeGuestData(user.id, { bookmarks: body.guest.bookmarks, completed: body.guest.completed });
    }

    const token = signToken(user.id, user.email);
    return attachSession(
      NextResponse.json({ token, user: toPublicUser(user) }, { status: 201 }),
      token,
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    // eslint-disable-next-line no-console
    console.error('[auth/signup] error:', err);
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
