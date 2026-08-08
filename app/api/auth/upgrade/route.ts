import { NextResponse } from 'next/server';
import { updateUser, toPublicUser, AuthError } from '@/lib/server/user-store';
import { getUserIdFromRequest } from '@/lib/server/crypto';
import { PAYMENTS_ENABLED } from '@/lib/billing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Unlock the Pro plan.
 *
 * While `PAYMENTS_ENABLED` is false (free-during-beta), this grants Pro
 * instantly with no charge. When real payments are wired up, this endpoint
 * should instead verify a completed payment/session before flipping the plan.
 */
export async function POST(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  if (PAYMENTS_ENABLED) {
    // Payment verification would happen here (e.g. Razorpay/Stripe webhook check).
    return NextResponse.json(
      { message: 'Payment verification is required to upgrade.' },
      { status: 402 },
    );
  }

  try {
    const user = updateUser(userId, (u) => { u.plan = 'pro'; });
    return NextResponse.json(toPublicUser(user));
  } catch (err) {
    const status = err instanceof AuthError ? err.status : 500;
    return NextResponse.json({ message: (err as Error).message }, { status });
  }
}
