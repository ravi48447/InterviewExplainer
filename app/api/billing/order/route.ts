import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/server/crypto';
import { getUserById } from '@/lib/server/user-store';
import { PAYMENTS_ENABLED, PRO_PRICE_INR } from '@/lib/billing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Razorpay order scaffold.
 *
 * While `PAYMENTS_ENABLED` is false, this reports free-unlock mode (the client
 * uses /api/auth/upgrade to grant Pro at no cost). When you flip the flag and
 * add RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET, create a real order here and return
 * { mode:'razorpay', orderId, amount, currency, keyId } for Razorpay Checkout.
 */
export async function POST(req: Request) {
  const user = getUserById(getUserIdFromRequest(req));
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  if (!PAYMENTS_ENABLED) {
    return NextResponse.json({ mode: 'free', amount: PRO_PRICE_INR, currency: 'INR' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { message: 'Payments are enabled but Razorpay keys are not configured.' },
      { status: 501 },
    );
  }

  // TODO: create a Razorpay order via their REST API and return checkout params.
  // const order = await createRazorpayOrder({ amount: PRO_PRICE_INR * 100, currency: 'INR' });
  return NextResponse.json(
    { message: 'Razorpay order creation is not implemented yet.' },
    { status: 501 },
  );
}
