'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { KeyRound, ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import apiClient from '@/lib/api-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      // We always show a generic success to avoid leaking which emails exist.
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-4 py-12 bg-surface/50 dark:bg-slate-950/50">
      <div className="w-full max-w-md animate-fade-in-up">
        <Card className="border-border dark:border-border shadow-xl shadow-slate-200/50 dark:shadow-none">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/40 mx-auto mb-4">
              <KeyRound className="h-8 w-8 text-primary dark:text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground dark:text-foreground">
              Reset your password
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your email and we&apos;ll send you a secure reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center py-4">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/20">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm text-muted-foreground dark:text-slate-300 leading-relaxed">
                  If an account exists for <strong>{email}</strong>, a reset link is on its way.
                  Check your inbox (and spam).
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email" type="email" placeholder="name@example.com" value={email}
                      onChange={(e) => setEmail(e.target.value)} className="pl-10" autoFocus required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={busy || !email} className="w-full py-6 bg-surface border border-default text-foreground font-semibold">
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Send reset link
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/login" className="w-full">
              <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
