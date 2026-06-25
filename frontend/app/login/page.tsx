'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  KeyRound, Mail, Loader2, ArrowRight, Eye, EyeOff, Compass,
  BookOpen, Bookmark, BarChart3, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import apiClient from '@/lib/api-client';
import { SocialButtons } from '@/components/auth/social-buttons';

const OAUTH_ERRORS: Record<string, string> = {
  link_expired: 'That sign-in link has expired. Please request a new one.',
  oauth_unavailable: 'That sign-in method isn’t available right now.',
  oauth_state: 'Sign-in could not be verified. Please try again.',
  oauth_failed: 'We couldn’t sign you in with that provider. Please try again.',
};

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    () => OAUTH_ERRORS[searchParams.get('error') ?? ''] ?? null,
  );
  const [magicBusy, setMagicBusy] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !isSubmitting;
  const socialEnabled = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || !!process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

  const sendMagicLink = async () => {
    if (!email.trim()) { setError('Enter your email first, then tap the link button.'); return; }
    setMagicBusy(true);
    setError(null);
    try {
      await apiClient.post('/auth/magic-link', { email });
      setMagicSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not send the sign-in link.');
    } finally {
      setMagicBusy(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-4 py-12 bg-surface/50 dark:bg-slate-950/50">
      <div className="w-full max-w-md animate-fade-in-up">
        <Card className="border-border dark:border-border shadow-xl shadow-slate-200/50 dark:shadow-none">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground dark:text-slate-400">
              Enter your credentials to access your personalized mastery roadmap
            </CardDescription>
            <div className="flex items-center justify-center gap-1.5 pt-1 text-xs font-medium text-emerald-600">
              <BookOpen className="h-3.5 w-3.5" />
              Reading is 100% free — log in only to save your progress
            </div>
          </CardHeader>
          <CardContent>
            {magicSent && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                Sign-in link sent to {email}. Check your inbox.
              </div>
            )}

            {socialEnabled && (
              <>
                <SocialButtons />
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border dark:border-border" /></div>
                  <div className="relative flex justify-center text-[11px] uppercase"><span className="bg-background dark:dark:bg-surface px-2 text-slate-400">or with email</span></div>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    autoFocus
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={(e) => setCapsLock(e.getModifierState('CapsLock'))}
                    onKeyDown={(e) => setCapsLock(e.getModifierState('CapsLock'))}
                    className="pl-10 pr-10"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-secondary transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {capsLock && (
                  <p className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                    <AlertTriangle className="h-3.5 w-3.5" /> Caps Lock is on
                  </p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-primary-foreground dark:text-foreground font-semibold py-6 transition-all duration-200 shadow-lg shadow-blue-500/20"
                disabled={!canSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={sendMagicLink}
                disabled={magicBusy}
                className="flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-blue-600 transition-colors"
              >
                {magicBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
                Prefer no password? Email me a sign-in link
              </button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border dark:border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background dark:dark:bg-surface px-2 text-muted-foreground">
                  New to InterviewExplainer?
                </span>
              </div>
            </div>
            <Link href="/signup" className="w-full">
              <Button variant="outline" className="w-full py-6 border-border dark:border-border hover:bg-surface dark:hover:dark:bg-surface">
                Create an Account
              </Button>
            </Link>

            {/* Friction-free path: content is readable without an account. */}
            <Link
              href="/domains"
              className="group flex w-full items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-blue-600 transition-colors"
            >
              <Compass className="h-4 w-4" />
              Just browsing? Explore content without an account
              <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
            </Link>

            {/* What logging in unlocks */}
            <div className="w-full rounded-xl border border-slate-100 dark:border-border bg-surface/60 dark:dark:bg-surface/40 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">A free account unlocks</p>
              <ul className="grid grid-cols-1 gap-1.5 text-xs text-secondary dark:text-slate-300">
                <li className="flex items-center gap-2"><Bookmark className="h-3.5 w-3.5 text-blue-500 shrink-0" /> Bookmark questions for later</li>
                <li className="flex items-center gap-2"><BarChart3 className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> Track progress, streaks & readiness</li>
                <li className="flex items-center gap-2"><Compass className="h-3.5 w-3.5 text-violet-500 shrink-0" /> A personalized, switchable dashboard</li>
              </ul>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
