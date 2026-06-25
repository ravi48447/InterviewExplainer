'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  KeyRound, Mail, User, Loader2, ArrowRight, Compass, CheckCircle2, X,
  Eye, EyeOff, AlertTriangle, BookOpen, Bookmark, BarChart3, Target,
  GraduationCap, Layers, Lightbulb,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveLevel, type ExperienceLevelKey } from '@/lib/levels';
import { FocusDomainPicker } from '@/components/dashboard/focus-domain-picker';
import { saveFocusDomain } from '@/lib/focus-domain';
import type { ContentDomain } from '@/lib/types/content-domain';
import { SocialButtons } from '@/components/auth/social-buttons';

const SOCIAL_ENABLED =
  !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || !!process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

interface PickedDomain {
  slug: string;
  name: string;
  level: ExperienceLevelKey;
}

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  /* One OR more domains can be selected — each becomes a switchable dashboard. */
  const [picked, setPicked] = useState<PickedDomain[]>([]);
  /* Goal-driven onboarding (optional) — powers the dashboard readiness countdown. */
  const [targetRole, setTargetRole] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const step1Valid =
    formData.name.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.password.length >= 6;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  /* The picker hands back a real ContentDomain — its slug feeds the dashboard,
     and its level doubles as the site-wide experience level. Toggling an
     already-selected domain removes it; otherwise it's added to the list. */
  const handleDomainSelect = (domain: ContentDomain) => {
    const label = `${domain.name} · ${domain.levelLabel}`;
    setPicked(prev => {
      if (prev.some(p => p.slug === domain.slug)) {
        return prev.filter(p => p.slug !== domain.slug);
      }
      const next = [...prev, { slug: domain.slug, name: label, level: domain.level }];
      saveFocusDomain({ slug: domain.slug, name: label });
      return next;
    });
  };

  const removePicked = (slug: string) => setPicked(prev => prev.filter(p => p.slug !== slug));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const primary = picked[0] ?? null;
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        domainSlug: primary?.slug ?? null,
        domainLabel: primary?.name ?? null,
        experienceLevel: primary?.level ?? null,
        domains: picked.map(p => ({ slug: p.slug, name: p.name })),
        targetRole: targetRole.trim() || null,
        interviewDate: interviewDate || null,
      });
      // Persist level to localStorage so the site immediately routes correctly
      if (primary?.level) {
        saveLevel(primary.level as ExperienceLevelKey);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-4 py-12 bg-surface/50 dark:bg-slate-950/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="border-border dark:border-border shadow-xl shadow-slate-200/50 dark:shadow-none">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex space-x-2">
                <div className={`h-2 w-8 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-slate-200 dark:dark:bg-surface'}`} />
                <div className={`h-2 w-8 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-slate-200 dark:dark:bg-surface'}`} />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {step === 1 ? 'Join the Community' : 'Personalize Your Path'}
            </CardTitle>
            <CardDescription className="text-muted-foreground dark:text-slate-400">
              {step === 1 
                ? 'Create an account to start tracking your interview readiness' 
                : 'Help us tailor the interview preparation to your specific goals'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {SOCIAL_ENABLED && (
                      <>
                        <SocialButtons />
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border dark:border-border" /></div>
                          <div className="relative flex justify-center text-[11px] uppercase"><span className="bg-background dark:dark:bg-surface px-2 text-slate-400">or with email</span></div>
                        </div>
                      </>
                    )}

                    {/* Purpose / what this product is */}
                    <div className="rounded-xl border border-blue-100 bg-blue-50/60 dark:border-blue-900/40 dark:bg-blue-950/20 p-3.5">
                      <p className="text-sm font-semibold text-foreground dark:text-slate-100 mb-2">
                        Ace your next tech interview — with answers tuned to <em>you</em>.
                      </p>
                      <ul className="space-y-1.5 text-xs text-secondary dark:text-slate-300">
                        <li className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-blue-500 shrink-0" /> Expert answers across languages, roles & levels — free to read</li>
                        <li className="flex items-center gap-2"><Bookmark className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> Save bookmarks & resume where you left off</li>
                        <li className="flex items-center gap-2"><BarChart3 className="h-3.5 w-3.5 text-violet-500 shrink-0" /> A personalized dashboard that tracks your readiness</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-10"
                          autoFocus
                          autoComplete="name"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10"
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="At least 6 characters"
                          value={formData.password}
                          onChange={handleChange}
                          onKeyUp={(e) => setCapsLock(e.getModifierState('CapsLock'))}
                          onKeyDown={(e) => setCapsLock(e.getModifierState('CapsLock'))}
                          className="pl-10 pr-10"
                          autoComplete="new-password"
                          minLength={6}
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
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Compass className="h-4 w-4 text-blue-600" />
                        <Label>Choose your focus path(s)</Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        A focus path tailors every answer and your whole dashboard to the exact
                        interview you&apos;re preparing for. Build one from three choices:
                      </p>
                    </div>

                    {/* How to choose — explains each dimension */}
                    <div className="rounded-xl border border-border dark:border-border bg-surface/70 dark:dark:bg-surface/40 p-3.5 space-y-3">
                      <div className="flex items-start gap-2.5">
                        <Target className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <p className="text-xs font-bold text-foreground dark:text-slate-100">1 · Language / Role</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            The tech you&apos;ll be interviewed on — e.g. Java, Python, Go or Frontend.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Layers className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <p className="text-xs font-bold text-foreground dark:text-slate-100">2 · Track</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Your specialization — e.g. Backend, Full-Stack or Frontend.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <GraduationCap className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <p className="text-xs font-bold text-foreground dark:text-slate-100">3 · Experience Level</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            <strong>Fresher (0–2 yrs)</strong> for fundamentals, or <strong>Intermediate (2–5 yrs)</strong>
                            {' '}for deeper, system-level answers. Pick the depth that matches the role.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 border-t border-border/70 dark:border-border pt-2.5">
                        <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          <strong>Add one or more</strong> — each path becomes its own switchable dashboard
                          (e.g. prepping for both Java Backend and Frontend). The first one is your
                          primary. You can change or add paths anytime from your dashboard.
                        </p>
                      </div>
                    </div>

                    {picked.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {picked.map((p, i) => (
                          <span
                            key={p.slug}
                            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 pl-3 pr-1.5 py-1 text-sm font-semibold text-emerald-800"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                            {p.name}
                            {i === 0 && <span className="text-[10px] font-bold uppercase text-emerald-600">Primary</span>}
                            <button
                              type="button"
                              onClick={() => removePicked(p.slug)}
                              className="ml-0.5 rounded-full p-0.5 hover:bg-emerald-200/70"
                              aria-label={`Remove ${p.name}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <FocusDomainPicker
                      valueSlug={picked[picked.length - 1]?.slug || null}
                      onSelect={handleDomainSelect}
                      emphasizeLevels
                    />

                    {picked.length === 0 && (
                      <p className="text-xs text-amber-600 font-medium">
                        → Optional — not sure yet? Skip this and just press
                        &ldquo;Complete Registration&rdquo;; you can pick a path later from your dashboard.
                      </p>
                    )}

                    {/* Goal-driven onboarding (optional) */}
                    <div className="rounded-xl border border-border dark:border-border p-3.5 space-y-3">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-indigo-500" />
                        <Label className="text-sm">Set a goal (optional)</Label>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="targetRole" className="text-xs text-muted-foreground">Target role</Label>
                        <Input
                          id="targetRole"
                          placeholder="e.g. Senior Backend Engineer at a product company"
                          value={targetRole}
                          onChange={(e) => setTargetRole(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interviewDate" className="text-xs text-muted-foreground">Interview date</Label>
                        <Input
                          id="interviewDate"
                          type="date"
                          value={interviewDate}
                          onChange={(e) => setInterviewDate(e.target.value)}
                        />
                        <p className="text-[11px] text-slate-400">
                          We&apos;ll show a readiness countdown and a daily focus plan on your dashboard.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4 pt-4">
                {step === 2 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setStep(1)}
                    className="w-1/3"
                  >
                    Back
                  </Button>
                )}
                <Button 
                  type="submit" 
                  className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-primary-foreground dark:text-foreground font-semibold py-6 transition-all duration-200 shadow-lg shadow-blue-500/20`}
                  disabled={isSubmitting || (step === 1 && !step1Valid)}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      {step === 1 ? 'Continue' : 'Complete Registration'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border dark:border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background dark:dark:bg-surface px-2 text-muted-foreground">
                  Already have an account?
                </span>
              </div>
            </div>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full py-6 border-border dark:border-border hover:bg-surface dark:hover:dark:bg-surface">
                Sign In Instead
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
