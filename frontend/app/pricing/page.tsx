'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Crown, Sparkles, Loader2, ArrowRight, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import apiClient from '@/lib/api-client';
import { PRO_PRICE_LABEL, PAYMENTS_ENABLED, PRO_FEATURES } from '@/lib/billing';
import { cn } from '@/lib/utils';

const FREE_FEATURES = [
  'Read every interview question & answer',
  'Browse all domains, tracks & levels',
  'Search and explore all content',
  'No account required',
];

export default function PricingPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPro = user?.plan === 'pro';

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/signup?redirect=/pricing');
      return;
    }
    if (PAYMENTS_ENABLED) {
      // A real checkout (Razorpay/Stripe) would be launched here.
      setError('Online payments are coming soon. Please contact support to upgrade.');
      return;
    }
    setUpgrading(true);
    setError(null);
    try {
      await apiClient.post('/auth/upgrade');
      await refreshUser();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not unlock Pro. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-surface/60 dark:bg-slate-950/40 px-4 py-14">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950/20 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-400 mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Free during beta
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground dark:text-white">
            Simple, honest pricing
          </h1>
          <p className="mt-3 text-muted-foreground dark:text-slate-400 max-w-xl mx-auto">
            All learning content is free forever. The personalized dashboard, multi-domain
            workspace and progress tracking are part of <strong>Pro</strong> — and it&apos;s
            unlocked free for everyone while we&apos;re in beta.
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-6 p-3 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg border border-default dark:border-default/20 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free tier */}
          <div className="rounded-2xl border border-border bg-background dark:bg-surface dark:border-border p-7 flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-bold text-foreground dark:text-white">Free</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">Everything you need to read and learn.</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-foreground dark:text-white">₹0</span>
              <span className="text-muted-foreground text-sm"> / forever</span>
            </div>
            <ul className="space-y-3 flex-1">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground dark:text-slate-300">
                  <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/domains"
              className="mt-7 inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-lg border border-border dark:border-border text-foreground dark:text-slate-200 font-semibold text-sm hover:bg-surface dark:hover:bg-surface transition-colors"
            >
              Start Reading <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Pro tier */}
          <div className="relative rounded-2xl border-2 border-default dark:border-default/30 bg-gradient-to-b  to-white dark:to-slate-900 p-7 flex flex-col shadow-lg shadow-sm">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-amber-500 dark:bg-amber-800 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                Most popular
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              <h2 className="text-lg font-bold text-foreground dark:text-white">Pro</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">Your personalized prep command center.</p>
            <div className="mb-6 flex items-end gap-2">
              <span className="text-4xl font-black text-foreground dark:text-white">{PRO_PRICE_LABEL}</span>
              <span className="text-muted-foreground text-sm mb-1">one-time</span>
              {!PAYMENTS_ENABLED && (
                <span className="ml-1 mb-1.5 rounded-md bg-emerald-100 dark:bg-emerald-950/20 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  Free in beta
                </span>
              )}
            </div>
            <ul className="space-y-3 flex-1">
              {PRO_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-foreground dark:text-slate-200">
                  <Check className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={upgrading || isPro}
              className={cn(
                'mt-7 inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-lg font-semibold text-sm transition-colors',
                isPro
                  ? 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 cursor-default'
                  : 'bg-amber-500 dark:bg-amber-800 text-white hover:bg-amber-600 dark:bg-amber-800',
              )}
            >
              {upgrading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Unlocking…</>
              ) : isPro ? (
                <><Check className="h-4 w-4" /> You&apos;re on Pro</>
              ) : !user ? (
                <>Sign up & unlock free <ArrowRight className="h-4 w-4" /></>
              ) : !PAYMENTS_ENABLED ? (
                <>Unlock Pro — Free <Sparkles className="h-4 w-4" /></>
              ) : (
                <>Get Pro — {PRO_PRICE_LABEL} <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
            {!PAYMENTS_ENABLED && !isPro && (
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                No card required while in beta. Cancel anytime.
              </p>
            )}
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Questions about pricing?{' '}
          <a href="mailto:support@interviewexplainer.com" className="text-primary dark:text-primary hover:underline font-medium">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
