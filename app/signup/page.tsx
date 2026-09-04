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
  GraduationCap, Layers, Lightbulb, MapPinned, Terminal, LineChart, GitBranch, Shield, Star, Cloud, FileText, Rocket
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
    <div className="relative min-h-[calc(100vh-80px)] w-full bg-background overflow-hidden flex items-start justify-center font-sans text-foreground selection:bg-blue-50 dark:bg-blue-950/30 pt-4 lg:pt-8">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:32px_32px] opacity-50" />

        {/* Subtle Developer Workspace Illustration (Bottom Left) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] hidden lg:block"
          style={{
            background: 'radial-gradient(circle at center, rgba(37,99,235,0.4) 0%, transparent 70%)',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))'
          }}
        >
          <div className="absolute bottom-20 left-20 w-48 h-32 bg-slate-800 rounded-lg border border-border shadow-2xl transform -rotate-12 flex items-center justify-center">
            <div className="text-primary font-mono text-2xl opacity-50">&lt;/&gt;</div>
          </div>
          <div className="absolute bottom-10 left-10 w-32 h-6 bg-blue-900/40 rounded border border-default/30 transform -rotate-12" />
          <div className="absolute bottom-14 left-8 w-32 h-6 bg-blue-900/40 rounded border border-default/30 transform -rotate-12" />
          <div className="absolute bottom-32 left-60 w-16 h-20 bg-blue-900/30 rounded-full border border-default/30 transform rotate-12 flex items-center justify-center">
             <div className="w-8 h-2 bg-blue-400/20 rounded-full" />
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* Left Side: Product Benefits */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-6 justify-center mt-12 lg:pr-4">
          {[
            {
              icon: MapPinned,
              title: "Personalized Learning Roadmap",
              desc: "Generate a customized interview roadmap based on your experience, target roles, and preferred tech stack.",
              color: "from-blue-500/20 to-blue-500/10 dark:from-blue-500/40 dark:to-blue-500/10",
              shadow: "shadow-sm"
            },
            {
              icon: Terminal,
              title: "Tech Stack Specific Questions",
              desc: "Practice interview questions tailored for Java, Python, React, Spring Boot, DevOps, DSA, SQL, AI/ML, Cloud and more.",
              color: "from-emerald-500/20 to-emerald-500/10 dark:from-emerald-500/40 dark:to-emerald-500/10",
              shadow: "shadow-sm"
            },
            {
              icon: BarChart3,
              title: "Smart Progress Analytics",
              desc: "Track completion, weak topics, accuracy, study streaks and improve your interview readiness with powerful analytics.",
              color: "from-amber-500/20 to-amber-500/10 dark:from-amber-500/40 dark:to-amber-500/10",
              shadow: "shadow-sm"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative bg-surface/40 backdrop-blur-md rounded-2xl p-5 border border-border hover:border-border transition-all duration-200 shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-[1px] mb-4 shadow-lg ${feature.shadow}`}>
                <div className="w-full h-full bg-surface rounded-xl flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-foreground" />
                </div>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Center: Sign-Up Form */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg mt-8 lg:mt-0"
          >
            <div className="bg-surface/80 backdrop-blur-xl rounded-3xl border border-border shadow-2xl overflow-hidden">
              <div className="p-8 sm:p-10">
                {/* Progress Indicator */}
                <div className="flex flex-col items-center justify-center mb-8">
                   <div className="flex items-center gap-2 mb-3">
                     <div className={`h-1.5 w-12 rounded-full transition-colors duration-200 ${step >= 1 ? 'bg-blue-50 dark:bg-blue-950/200 shadow-sm' : 'bg-slate-800'}`} />
                     <div className={`h-1.5 w-12 rounded-full transition-colors duration-200 ${step >= 2 ? 'bg-blue-50 dark:bg-blue-950/200 shadow-sm' : 'bg-slate-800'}`} />
                   </div>
                   <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                     Step {step} of 2
                   </span>
                </div>

                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">
                    {step === 1 ? 'Join the Community' : 'Personalize Your Path'}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {step === 1
                      ? 'Create an account to start tracking your interview readiness'
                      : 'Help us tailor the interview preparation to your specific goals'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/10 rounded-xl border border-default/20">
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
                            <div className="relative my-6">
                              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                              <div className="relative flex justify-center text-[10px] font-medium tracking-widest uppercase"><span className="bg-[#0A0A0A] px-4 text-muted-foreground">Or continue with email</span></div>
                            </div>
                          </>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-xs text-foreground/90 font-medium ml-1">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="name"
                              placeholder="Your full name"
                              value={formData.name}
                              onChange={handleChange}
                              className="pl-11 h-11 bg-background/50 border-border text-foreground placeholder:text-muted-foreground rounded-xl focus-visible:ring-ring/50"
                              autoFocus
                              autoComplete="name"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs text-foreground/90 font-medium ml-1">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="name@example.com"
                              value={formData.email}
                              onChange={handleChange}
                              className="pl-11 h-11 bg-background/50 border-border text-foreground placeholder:text-muted-foreground rounded-xl focus-visible:ring-ring/50"
                              autoComplete="email"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-xs text-foreground/90 font-medium ml-1">Password</Label>
                          <div className="relative">
                            <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="At least 6 characters"
                              value={formData.password}
                              onChange={handleChange}
                              onKeyUp={(e) => setCapsLock(e.getModifierState('CapsLock'))}
                              onKeyDown={(e) => setCapsLock(e.getModifierState('CapsLock'))}
                              className="pl-11 pr-11 h-11 bg-background/50 border-border text-foreground placeholder:text-muted-foreground rounded-xl focus-visible:ring-ring/50"
                              autoComplete="new-password"
                              minLength={6}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((s) => !s)}
                              className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground transition-colors"
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              tabIndex={-1}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {capsLock && (
                            <p className="flex items-center gap-1.5 text-[11px] font-medium text-amber-500 mt-1.5 ml-1">
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
                        <div className="space-y-1 mb-4">
                          <div className="flex items-center gap-2">
                            <Compass className="h-4 w-4 text-primary" />
                            <Label className="text-foreground">Choose your focus path(s)</Label>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            A focus path tailors every answer and your whole dashboard to the exact
                            interview you&apos;re preparing for. Build one from three choices:
                          </p>
                        </div>

                        {/* How to choose — explains each dimension */}
                        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <Target className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                            <div>
                              <p className="text-xs font-bold text-foreground">1 · Language / Role</p>
                              <p className="text-[11px] text-muted-foreground leading-relaxed">
                                The tech you&apos;ll be interviewed on — e.g. Java, Python, Go or Frontend.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Layers className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                            <div>
                              <p className="text-xs font-bold text-foreground">2 · Track</p>
                              <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Your specialization — e.g. Backend, Full-Stack or Frontend.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <GraduationCap className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <div>
                              <p className="text-xs font-bold text-foreground">3 · Experience Level</p>
                              <p className="text-[11px] text-muted-foreground leading-relaxed">
                                <strong>Fresher (0–2 yrs)</strong> for fundamentals, or <strong>Intermediate (2–5 yrs)</strong>
                                {' '}for deeper, system-level answers.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 border-t border-border pt-3 mt-1">
                            <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              <strong>Add one or more</strong> paths. The first one is your primary. You can change or add paths anytime.
                            </p>
                          </div>
                        </div>

                        {picked.length > 0 && (
                          <div className="flex flex-wrap gap-2 py-2">
                            {picked.map((p, i) => (
                              <span
                                key={p.slug}
                                className="inline-flex items-center gap-1.5 rounded-full border border-default/20 bg-emerald-100 dark:bg-emerald-900/30 pl-3 pr-1.5 py-1.5 text-xs font-semibold text-emerald-600"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                                {p.name}
                                {i === 0 && <span className="text-[9px] font-bold uppercase text-emerald-400/80 bg-emerald-400/10 px-1.5 rounded-sm ml-1">Primary</span>}
                                <button
                                  type="button"
                                  onClick={() => removePicked(p.slug)}
                                  className="ml-0.5 rounded-full p-1 hover:bg-emerald-50 dark:bg-emerald-950/20 transition-colors"
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
                          <p className="text-[11px] text-amber-400/90 font-medium py-1">
                            → Optional — not sure yet? Skip this and just press
                            &ldquo;Complete Registration&rdquo;; you can pick a path later.
                          </p>
                        )}

                        {/* Goal-driven onboarding (optional) */}
                        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            <Label className="text-sm text-foreground">Set a goal (optional)</Label>
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="targetRole" className="text-[11px] text-muted-foreground uppercase tracking-wider">Target role</Label>
                            <Input
                              id="targetRole"
                              placeholder="e.g. Senior Backend Engineer"
                              value={targetRole}
                              onChange={(e) => setTargetRole(e.target.value)}
                              className="h-10 bg-background/50 border-border text-foreground placeholder:text-muted-foreground rounded-lg"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="interviewDate" className="text-[11px] text-muted-foreground uppercase tracking-wider">Interview date</Label>
                            <Input
                              id="interviewDate"
                              type="date"
                              value={interviewDate}
                              onChange={(e) => setInterviewDate(e.target.value)}
                              className="h-10 bg-background/50 border-border text-foreground rounded-lg [color-scheme:dark]"
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">
                              We&apos;ll show a readiness countdown and a daily focus plan on your dashboard.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3 pt-6">
                    {step === 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep(1)}
                        className="w-1/3 h-12 rounded-xl text-foreground/90 hover:text-foreground hover:bg-slate-800/50"
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      type="submit"
                      className="group relative flex-1 h-12 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1d4ed8] hover:to-[#6d28d9] text-white font-semibold transition-all duration-200 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.23)] hover:-translate-y-0.5 overflow-hidden"
                      disabled={isSubmitting || (step === 1 && !step1Valid)}
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out" />
                      <span className="relative flex items-center justify-center">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          <>
                            {step === 1 ? 'Continue' : 'Complete Registration'}
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                    </Button>
                  </div>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-[11px] text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:text-primary font-medium transition-colors">
                      Sign in instead
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
               {[
                 { icon: Shield, title: "Secure Registration", desc: "Your data is encrypted." },
                 { icon: Star, title: "Curated by Experts", desc: "Questions reviewed by engineers." },
                 { icon: Cloud, title: "Save Your Progress", desc: "Resume from any device." }
               ].map((badge, i) => (
                 <div key={i} className="flex flex-col items-center text-center p-3 rounded-xl bg-surface/40 border border-border backdrop-blur-sm">
                   <badge.icon className="w-4 h-4 text-primary mb-1.5" />
                   <h4 className="text-[11px] font-semibold text-foreground mb-0.5">{badge.title}</h4>
                   <p className="text-[10px] text-muted-foreground">{badge.desc}</p>
                 </div>
               ))}
            </div>

            <div className="mt-8 text-center flex flex-col items-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Shield className="w-3.5 h-3.5" /> Trusted by thousands of developers.
              </div>
              <p className="text-[10px] text-muted-foreground">
                Your privacy comes first. <a href="#" className="text-muted-foreground hover:text-foreground/90 underline underline-offset-2">Privacy Policy</a>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Motivation Panel */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-6 justify-center mt-12 lg:pl-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-surface/40 backdrop-blur-md rounded-2xl p-6 border border-border shadow-xl text-center overflow-hidden group"
          >
            <div className="absolute inset-0 bg-surface /5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border border-default/30 mb-4 shadow-sm"
            >
              <Rocket className="w-8 h-8 text-primary" />
            </motion.div>

            <h3 className="text-xl font-bold text-foreground mb-2">Join fellow<br />Developers</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              Prepare smarter with structured explanations, personalized learning paths, and progress tracking designed for modern developers.
            </p>

            <div className="flex flex-col items-center justify-center pt-4 border-t border-border">
              <div className="flex -space-x-3 mb-2">
                {[
                  "https://i.pravatar.cc/100?img=11",
                  "https://i.pravatar.cc/100?img=12",
                  "https://i.pravatar.cc/100?img=13",
                  "https://i.pravatar.cc/100?img=14",
                  "https://i.pravatar.cc/100?img=15"
                ].map((url, i) => (
                  <img key={i} src={url} alt="User" className="w-8 h-8 rounded-full border-2 border-[#0A0A0A]" />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">Happy Developers</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: FileText, num: "450+", label: "QA Pairs", color: "text-primary", bg: "bg-blue-500/10 dark:bg-blue-500/20", border: "border-default/20" },
              { icon: GitBranch, num: "12+", label: "Learning Paths", color: "text-primary", bg: "bg-blue-100 dark:bg-blue-900/30", border: "border-default/20" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                whileHover={{ y: -2 }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl bg-surface/40 backdrop-blur-md border border-border transition-colors`}
              >
                 <stat.icon className={`w-4 h-4 ${stat.color} mb-1.5`} />
                 <div className="text-sm font-bold text-foreground">{stat.num}</div>
                 <div className="text-[9px] text-muted-foreground text-center uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-surface/40 backdrop-blur-md rounded-2xl p-5 border border-border shadow-xl relative mt-3"
          >
            <div className="text-amber-400 text-xs tracking-widest mb-2">★★★★★</div>
            <p className="text-xs text-foreground/90 italic leading-relaxed mb-3">
              &quot;The personalized roadmap saved weeks of preparation. Exactly the questions I was asked.&quot;
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-800 overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=15" alt="" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-foreground flex items-center gap-1">
                  Sarah J. <CheckCircle2 className="w-3 h-3 text-primary" />
                </div>
                <div className="text-[9px] text-muted-foreground">Senior Engineer</div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
