'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  User as UserIcon, Mail, Crown, Loader2, CheckCircle2, Target, Timer, LogOut, Shield,
} from 'lucide-react';
import { PAYMENTS_ENABLED, PRO_PRICE_LABEL, hasProAccess } from '@/lib/billing';

const LEVELS = ['junior', 'mid', 'senior', 'staff'];

export default function AccountPage() {
  const { user, loading, refreshUser, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace('/login?redirect=/account');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? '');
    setTargetRole(user.targetRole ?? '');
    setInterviewDate(user.interviewDate ?? '');
    setExperienceLevel(user.experienceLevel ?? '');
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isPro = user.plan === 'pro' || (!PAYMENTS_ENABLED && hasProAccess(user.plan));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await apiClient.post('/auth/account', {
        name,
        targetRole: targetRole.trim() || null,
        interviewDate: interviewDate || null,
        experienceLevel: experienceLevel || null,
      });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not save your changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground dark:text-white">Account</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, goal and plan.</p>
      </div>

      {/* Plan card */}
      <Card className="border-border dark:border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Crown className={`h-5 w-5 ${isPro ? 'text-amber-500 dark:text-amber-400' : 'text-muted-foreground'}`} />
            {isPro ? 'Pro' : 'Free'} plan
          </CardTitle>
          <CardDescription>
            {isPro
              ? (user.plan === 'pro'
                  ? 'Your full personalized dashboard is unlocked.'
                  : `Pro (normally ${PRO_PRICE_LABEL}) is free during beta — fully unlocked.`)
              : `Upgrade to Pro (${PRO_PRICE_LABEL}) for the full personalized dashboard.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/pricing">
            <Button variant={isPro ? 'outline' : 'default'} className="gap-2">
              <Crown className="h-4 w-4" />
              {isPro ? 'View plan & benefits' : 'See Pricing'}
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Profile / goal form */}
      <Card className="border-border dark:border-border">
        <CardHeader>
          <CardTitle className="text-lg">Profile & goal</CardTitle>
          <CardDescription>This personalizes your dashboard and readiness countdown.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-100 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-2.5 text-sm font-medium text-red-600 dark:text-red-400">{error}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input value={user.email} disabled className="pl-10 opacity-70" />
              </div>
              <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Shield className="h-3 w-3" />
                Signed in via {user.authProvider ?? 'email'}.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetRole">Target role</Label>
              <div className="relative">
                <Target className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="targetRole" placeholder="e.g. Senior Backend Engineer" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="pl-10" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interviewDate">Interview date</Label>
                <div className="relative">
                  <Timer className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="interviewDate" type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Experience level</Label>
                <select
                  id="level"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full rounded-md border border-border dark:border-border bg-background dark:bg-surface px-3 py-2 text-sm"
                >
                  <option value="">Not set</option>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>{l[0].toUpperCase() + l.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button type="submit" disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save changes
              </Button>
              {saved && (
                <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Saved
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <button
        onClick={logout}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-red-600 dark:text-red-400 transition-colors"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  );
}
