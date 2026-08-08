/**
 * Billing / monetization config.
 *
 * The product plan: the personalized dashboard + multi-domain workspace is a
 * paid "Pro" feature priced at ₹1999. During beta we keep everything FREE by
 * leaving `PAYMENTS_ENABLED` off — users can unlock Pro instantly at no cost,
 * and nothing is gated behind a hard paywall. Flip the env flag (or the default
 * below) to true once a real payment provider is wired up.
 *
 * This module is dependency-free so it can be imported from both client
 * components and server route handlers.
 */

export const PAYMENTS_ENABLED =
  (process.env.NEXT_PUBLIC_PAYMENTS_ENABLED ?? 'false').toLowerCase() === 'true';

export const PRO_PRICE_INR = 1999;

export const PRO_PRICE_LABEL = `₹${PRO_PRICE_INR.toLocaleString('en-IN')}`;

export const PRO_FEATURES: string[] = [
  'Personalized dashboard with real progress tracking',
  'Add & switch between multiple focus domains',
  'Bookmarks, completion tracking & study streaks',
  'Skill radar, readiness score & weak-area insights',
  'Activity heatmap and achievement milestones',
];

/**
 * Whether a user (by plan) currently has access to Pro features.
 * While payments are disabled, ALL signed-in users get full access for free.
 */
export function hasProAccess(plan: 'free' | 'pro' | null | undefined): boolean {
  if (!PAYMENTS_ENABLED) return true;
  return plan === 'pro';
}
