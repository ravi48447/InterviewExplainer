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
    <div className="relative min-h-[calc(100vh-80px)] w-full bg-[#000000] overflow-hidden flex items-start justify-center font-sans text-slate-200 selection:bg-blue-500/30 pt-4 lg:pt-8">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-[120px]" />
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
          <div className="absolute bottom-20 left-20 w-48 h-32 bg-slate-800 rounded-lg border border-zinc-700/50 shadow-2xl transform -rotate-12 flex items-center justify-center">
            <div className="text-blue-400 font-mono text-2xl opacity-50">&lt;/&gt;</div>
          </div>
          <div className="absolute bottom-10 left-10 w-32 h-6 bg-indigo-900/40 rounded border border-indigo-700/30 transform -rotate-12" />
          <div className="absolute bottom-14 left-8 w-32 h-6 bg-purple-900/40 rounded border border-purple-700/30 transform -rotate-12" />
          <div className="absolute bottom-32 left-60 w-16 h-20 bg-blue-900/30 rounded-full border border-blue-700/30 transform rotate-12 flex items-center justify-center">
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
              color: "from-fuchsia-500 to-purple-500",
              shadow: "shadow-purple-500/20"
            },
            {
              icon: Terminal,
              title: "Tech Stack Specific Questions",
              desc: "Practice interview questions tailored for Java, Python, React, Spring Boot, DevOps, DSA, SQL, AI/ML, Cloud and more.",
              color: "from-blue-500 to-indigo-500",
              shadow: "shadow-blue-500/20"
            },
            {
              icon: BarChart3,
              title: "Smart Progress Analytics",
              desc: "Track completion, weak topics, accuracy, study streaks and improve your interview readiness with powerful analytics.",
              color: "from-emerald-400 to-teal-500",
              shadow: "shadow-emerald-500/20"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative bg-[#111111]/40 backdrop-blur-md rounded-2xl p-5 border border-zinc-800/60 hover:border-zinc-700/80 transition-all duration-300 shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-[1px] mb-4 shadow-lg ${feature.shadow}`}>
                <div className="w-full h-full bg-[#111111] rounded-xl flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{feature.desc}</p>
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
            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl rounded-3xl border border-zinc-800/80 shadow-2xl overflow-hidden">
              <div className="p-8 sm:p-10">
                {/* Progress Indicator */}
                <div className="flex flex-col items-center justify-center mb-8">
                   <div className="flex items-center gap-2 mb-3">
                     <div className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-slate-800'}`} />
                     <div className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-slate-800'}`} />
                   </div>
                   <span className="text-[10px] font-medium tracking-widest text-zinc-400 uppercase">
                     Step {step} of 2
                   </span>
                </div>

                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    {step === 1 ? 'Join the Community' : 'Personalize Your Path'}
                  </h1>
                  <p className="text-sm text-zinc-400">
                    {step === 1 
                      ? 'Create an account to start tracking your interview readiness' 
                      : 'Help us tailor the interview preparation to your specific goals'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 text-sm font-medium text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">
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
                              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800" /></div>
                              <div className="relative flex justify-center text-[10px] font-medium tracking-widest uppercase"><span className="bg-[#0A0A0A] px-4 text-zinc-500">Or continue with email</span></div>
                            </div>
                          </>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-xs text-slate-300 font-medium ml-1">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                            <Input
                              id="name"
                              placeholder="Your full name"
                              value={formData.name}
                              onChange={handleChange}
                              className="pl-11 h-11 bg-zinc-900/50 border-zinc-800 text-slate-100 placeholder:text-zinc-500 rounded-xl focus-visible:ring-blue-500/50"
                              autoFocus
                              autoComplete="name"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs text-slate-300 font-medium ml-1">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="name@example.com"
                              value={formData.email}
                              onChange={handleChange}
                              className="pl-11 h-11 bg-zinc-900/50 border-zinc-800 text-slate-100 placeholder:text-zinc-500 rounded-xl focus-visible:ring-blue-500/50"
                              autoComplete="email"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-xs text-slate-300 font-medium ml-1">Password</Label>
                          <div className="relative">
                            <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                            <Input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="At least 6 characters"
                              value={formData.password}
                              onChange={handleChange}
                              onKeyUp={(e) => setCapsLock(e.getModifierState('CapsLock'))}
                              onKeyDown={(e) => setCapsLock(e.getModifierState('CapsLock'))}
                              className="pl-11 pr-11 h-11 bg-zinc-900/50 border-zinc-800 text-slate-100 placeholder:text-zinc-500 rounded-xl focus-visible:ring-blue-500/50"
                              autoComplete="new-password"
                              minLength={6}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((s) => !s)}
                              className="absolute right-3.5 top-3 text-zinc-400 hover:text-slate-200 transition-colors"
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
                            <Compass className="h-4 w-4 text-blue-400" />
                            <Label className="text-slate-200">Choose your focus path(s)</Label>
                          </div>
                          <p className="text-xs text-zinc-400">
                            A focus path tailors every answer and your whole dashboard to the exact
                            interview you&apos;re preparing for. Build one from three choices:
                          </p>
                        </div>

                        {/* How to choose — explains each dimension */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <Target className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <div>
                              <p className="text-xs font-bold text-slate-200">1 · Language / Role</p>
                              <p className="text-[11px] text-zinc-400 leading-relaxed">
                                The tech you&apos;ll be interviewed on — e.g. Java, Python, Go or Frontend.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Layers className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <div>
                              <p className="text-xs font-bold text-slate-200">2 · Track</p>
                              <p className="text-[11px] text-zinc-400 leading-relaxed">
                                Your specialization — e.g. Backend, Full-Stack or Frontend.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <GraduationCap className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <div>
                              <p className="text-xs font-bold text-slate-200">3 · Experience Level</p>
                              <p className="text-[11px] text-zinc-400 leading-relaxed">
                                <strong>Fresher (0–2 yrs)</strong> for fundamentals, or <strong>Intermediate (2–5 yrs)</strong>
                                {' '}for deeper, system-level answers.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 border-t border-zinc-800/80 pt-3 mt-1">
                            <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <p className="text-[11px] text-zinc-400 leading-relaxed">
                              <strong>Add one or more</strong> paths. The first one is your primary. You can change or add paths anytime.
                            </p>
                          </div>
                        </div>

                        {picked.length > 0 && (
                          <div className="flex flex-wrap gap-2 py-2">
                            {picked.map((p, i) => (
                              <span
                                key={p.slug}
                                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 pl-3 pr-1.5 py-1.5 text-xs font-semibold text-emerald-400"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                                {p.name}
                                {i === 0 && <span className="text-[9px] font-bold uppercase text-emerald-400/80 bg-emerald-400/10 px-1.5 rounded-sm ml-1">Primary</span>}
                                <button
                                  type="button"
                                  onClick={() => removePicked(p.slug)}
                                  className="ml-0.5 rounded-full p-1 hover:bg-emerald-500/20 transition-colors"
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
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-4">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-indigo-400" />
                            <Label className="text-sm text-slate-200">Set a goal (optional)</Label>
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="targetRole" className="text-[11px] text-zinc-400 uppercase tracking-wider">Target role</Label>
                            <Input
                              id="targetRole"
                              placeholder="e.g. Senior Backend Engineer"
                              value={targetRole}
                              onChange={(e) => setTargetRole(e.target.value)}
                              className="h-10 bg-zinc-900/50 border-zinc-800 text-slate-200 placeholder:text-slate-600 rounded-lg"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="interviewDate" className="text-[11px] text-zinc-400 uppercase tracking-wider">Interview date</Label>
                            <Input
                              id="interviewDate"
                              type="date"
                              value={interviewDate}
                              onChange={(e) => setInterviewDate(e.target.value)}
                              className="h-10 bg-zinc-900/50 border-zinc-800 text-slate-200 rounded-lg [color-scheme:dark]"
                            />
                            <p className="text-[10px] text-zinc-500 mt-1">
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
                        className="w-1/3 h-12 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50"
                      >
                        Back
                      </Button>
                    )}
                    <Button 
                      type="submit" 
                      className="group relative flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] overflow-hidden hover:-translate-y-0.5"
                      disabled={isSubmitting || (step === 1 && !step1Valid)}
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
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
                  <p className="text-[11px] text-zinc-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
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
                 <div key={i} className="flex flex-col items-center text-center p-3 rounded-xl bg-[#111111]/40 border border-zinc-800/40 backdrop-blur-sm">
                   <badge.icon className="w-4 h-4 text-blue-400 mb-1.5" />
                   <h4 className="text-[11px] font-semibold text-slate-200 mb-0.5">{badge.title}</h4>
                   <p className="text-[10px] text-zinc-500">{badge.desc}</p>
                 </div>
               ))}
            </div>
            
            <div className="mt-8 text-center flex flex-col items-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 mb-1">
                <Shield className="w-3.5 h-3.5" /> Trusted by thousands of developers.
              </div>
              <p className="text-[10px] text-slate-600">
                Your privacy comes first. <a href="#" className="text-zinc-400 hover:text-slate-300 underline underline-offset-2">Privacy Policy</a>
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
            className="relative bg-[#111111]/40 backdrop-blur-md rounded-2xl p-6 border border-zinc-800/60 shadow-xl text-center overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <motion.div 
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-4 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            >
              <Rocket className="w-8 h-8 text-indigo-400" />
            </motion.div>
            
            <h3 className="text-xl font-bold text-white mb-2">Join fellow<br />Developers</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Prepare smarter with structured explanations, personalized learning paths, and progress tracking designed for modern developers.
            </p>
            
            <div className="flex flex-col items-center justify-center pt-4 border-t border-zinc-800/60">
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
              <span className="text-[10px] text-zinc-500 font-medium">Happy Developers</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: FileText, num: "450+", label: "QA Pairs", color: "text-blue-400", bg: "bg-blue-500/10 dark:bg-blue-500/20", border: "border-blue-500/20" },
              { icon: GitBranch, num: "12+", label: "Learning Paths", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                whileHover={{ y: -2 }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl bg-[#111111]/40 backdrop-blur-md border border-zinc-800/60 transition-colors`}
              >
                 <stat.icon className={`w-4 h-4 ${stat.color} mb-1.5`} />
                 <div className="text-sm font-bold text-slate-200">{stat.num}</div>
                 <div className="text-[9px] text-zinc-500 text-center uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          
          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-[#111111]/40 backdrop-blur-md rounded-2xl p-5 border border-zinc-800/60 shadow-xl relative mt-3"
          >
            <div className="text-amber-400 text-xs tracking-widest mb-2">★★★★★</div>
            <p className="text-xs text-slate-300 italic leading-relaxed mb-3">
              &quot;The personalized roadmap saved weeks of preparation. Exactly the questions I was asked.&quot;
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-800 overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=15" alt="" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-slate-200 flex items-center gap-1">
                  Sarah J. <CheckCircle2 className="w-3 h-3 text-blue-400" />
                </div>
                <div className="text-[9px] text-zinc-500">Senior Engineer</div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
