'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import apiClient from '@/lib/api-client';
import { hasGuestData } from '@/lib/guest-progress';
import { X, Mail, KeyRound, User, Loader2, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SocialButtons } from './social-buttons';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

type Tab = 'login' | 'signup';

export function AuthModal({ open, onClose, onSuccess, title, subtitle }: AuthModalProps) {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<Tab>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const willSync = hasGuestData();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (tab === 'login') await login(email, password);
      else await signup({ name, email, password, domains: [] });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const sendMagic = async () => {
    if (!email) { setError('Enter your email first.'); return; }
    setBusy(true);
    setError(null);
    try {
      await apiClient.post('/auth/magic-link', { email, name });
      setMagicSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not send the link.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 dark:bg-surface/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-background dark:bg-surface border border-border dark:border-border shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground hover:bg-surface dark:hover:bg-surface hover:text-muted-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          {magicSent ? (
            <div className="text-center py-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/20">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-foreground dark:text-white">Check your inbox</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                We sent a secure sign-in link to <strong>{email}</strong>.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-foreground dark:text-white">
                {title ?? (tab === 'login' ? 'Welcome back' : 'Save your progress')}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {subtitle ?? (tab === 'login'
                  ? 'Sign in to sync your bookmarks and progress.'
                  : 'Create a free account — your reading stays personalized.')}
              </p>

              {willSync && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 dark:bg-indigo-950/30 px-3 py-2 text-xs font-medium text-indigo-700 dark:text-indigo-400 dark:text-indigo-300">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  Your saved items will sync to your account automatically.
                </div>
              )}

              <div className="mt-4">
                <SocialButtons />
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border dark:border-border" /></div>
                <div className="relative flex justify-center text-[11px] uppercase">
                  <span className="bg-background dark:bg-surface px-2 text-muted-foreground">or with email</span>
                </div>
              </div>

              {error && (
                <div className="mb-3 rounded-lg border border-red-100 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-2.5 text-xs font-medium text-red-600 dark:text-red-400">{error}</div>
              )}

              <form onSubmit={submit} className="space-y-3">
                {tab === 'signup' && (
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-border dark:border-border bg-background dark:bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 dark:border-indigo-700"
                      autoComplete="name"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full rounded-lg border border-border dark:border-border bg-background dark:bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 dark:border-indigo-700"
                    autoComplete="email"
                  />
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPwd ? 'text' : 'password'} placeholder={tab === 'signup' ? 'Password (6+ chars)' : 'Password'}
                    value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                    className="w-full rounded-lg border border-border dark:border-border bg-background dark:bg-surface py-2 pl-9 pr-9 text-sm outline-none focus:border-indigo-400 dark:border-indigo-700"
                    autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                  />
                  <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-muted-foreground" tabIndex={-1} aria-label="Toggle password">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <button
                  type="submit" disabled={busy}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-60"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {tab === 'login' ? 'Sign In' : 'Create Free Account'}
                </button>
              </form>

              <div className="mt-3 flex items-center justify-between text-xs">
                <button onClick={sendMagic} disabled={busy} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                  Email me a sign-in link
                </button>
                <button
                  onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setError(null); }}
                  className="font-medium text-muted-foreground hover:text-foreground"
                >
                  {tab === 'login' ? 'New here? Sign up' : 'Have an account? Sign in'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
