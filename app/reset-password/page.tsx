'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { KeyRound, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import apiClient from '@/lib/api-client';

function ResetForm() {
  const token = useSearchParams().get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setBusy(true);
    setError(null);
    try {
      const res = await apiClient.post('/auth/reset-password', { token, password });
      if (res.data?.token) localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'This reset link is invalid or has expired.');
      setBusy(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4 py-4">
        <p className="text-sm text-muted-foreground">This reset link is missing or invalid.</p>
        <Link href="/forgot-password" className="text-sm font-semibold text-primary dark:text-primary hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-default dark:border-default/20 bg-red-50 dark:bg-red-500/10 p-2.5 text-sm font-medium text-red-600 dark:text-red-400">{error}</div>
      )}
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password" type={show ? 'text' : 'password'} placeholder="At least 6 characters"
            value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" autoFocus required minLength={6}
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-3 text-muted-foreground hover:text-muted-foreground" tabIndex={-1} aria-label="Toggle password">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm password</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirm" type={show ? 'text' : 'password'} placeholder="Re-enter password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)} className="pl-10" required minLength={6}
          />
        </div>
      </div>
      <Button type="submit" disabled={busy} className="w-full py-6 bg-surface border border-default text-foreground font-semibold">
        {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Reset password & sign in
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-4 py-12 bg-surface/50 dark:bg-slate-950/50">
      <div className="w-full max-w-md animate-fade-in-up">
        <Card className="border-border dark:border-border shadow-xl shadow-slate-200/50 dark:shadow-none">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground dark:text-foreground">
              Choose a new password
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Set a new password for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="py-6 text-center text-sm text-muted-foreground">Loading…</div>}>
              <ResetForm />
            </Suspense>
            <Link href="/login" className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
