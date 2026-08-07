'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  KeyRound, Mail, Loader2, ArrowRight, Eye, EyeOff, Compass,
  BookOpen, AlertTriangle, CheckCircle2,
  Target, Code2, LineChart, Rocket, ShieldCheck, Star, Cloud, Shield
} from 'lucide-react';
import apiClient from '@/lib/api-client';
import { SocialButtons } from '@/components/auth/social-buttons';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showMobileFeatures, setShowMobileFeatures] = useState(false);

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

  const featureCards = [
    {
      icon: Target,
      title: "Personalized Roadmap",
      desc: "Get a customized learning path based on your tech stack and experience level.",
      color: "text-primary",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      border: "border-default/20"
    },
    {
      icon: Code2,
      title: "Domain-Specific Questions",
      desc: "Practice high quality questions that actually match real interviews.",
      color: "text-primary",
      bg: "bg-blue-500/10 dark:bg-blue-500/20",
      border: "border-default/20"
    },
    {
      icon: LineChart,
      title: "Track & Improve",
      desc: "Detailed analytics to track your progress and identify weak areas.",
      color: "text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      border: "border-default/20"
    }
  ];

  const testimonials = [
    {
      quote: "This platform is a game changer!",
      author: "Priya, Software Engineer"
    },
    {
      quote: "The questions are so relevant to real interviews.",
      author: "Arjun, Backend Developer"
    },
    {
      quote: "Helped me crack interviews at top tech companies.",
      author: "Neha, SDE II"
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full bg-background overflow-hidden flex items-start justify-center font-sans text-foreground selection:bg-blue-50 dark:bg-blue-950/30 pt-4 lg:pt-8">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:32px_32px] opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-4 lg:mt-8">
        
        {/* Left Side: Product Benefits (Hidden on Mobile, Collapsible, or standard on Desktop) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-6 justify-center lg:pr-4 lg:mt-10">
          {featureCards.map((feat, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              key={idx}
              className="group relative p-6 rounded-2xl bg-surface/50 dark:bg-surface border-border dark:border-white/10 backdrop-blur-md hover:bg-primary/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feat.bg} ${feat.border} border group-hover:scale-110 transition-transform duration-200`}>
                <feat.icon className={`h-6 w-6 ${feat.color}`} />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{feat.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
          
          {/* Subtle minimal workspace decor */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="absolute bottom-8 left-8 hidden xl:flex gap-4 items-end pointer-events-none"
          >
            <div className="w-24 h-6 bg-primary/10 rounded-t border-t border-x border-border transform -rotate-6 translate-y-2"></div>
            <div className="w-28 h-6 bg-primary/10 rounded-t border-t border-x border-border transform rotate-2"></div>
          </motion.div>
        </div>

        {/* Center: Login Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="col-span-1 md:max-w-md md:mx-auto lg:col-span-4 w-full"
        >
          <div className="relative rounded-3xl bg-surface/80 border border-border p-8 sm:p-10 backdrop-blur-xl shadow-2xl shadow-sm overflow-hidden">
            {/* Soft inner glow */}
            <div className="absolute inset-0 bg-surface /5 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shadow-lg shadow-sm relative group cursor-default">
                   <div className="absolute inset-0 bg-blue-50 dark:bg-blue-950/20 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                   <Code2 className="h-6 w-6 text-primary relative z-10" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
                  Welcome Back
                </h1>
                <p className="text-sm text-muted-foreground mb-4 max-w-[280px] mx-auto">
                  Enter your credentials to access your personalized mastery roadmap
                </p>
                <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  <BookOpen className="h-3.5 w-3.5" />
                  Reading is 100% free — log in only to save your progress
                </div>
              </div>

              {magicSent && (
                <div className="mb-6 flex items-start gap-2 rounded-xl border border-default/30 bg-emerald-100 dark:bg-emerald-900/30 p-4 text-sm font-medium text-emerald-600">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
                  Sign-in link sent to {email}. Check your inbox.
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/10 rounded-xl border border-default/20 flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-medium text-foreground/90">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 bg-surface dark:bg-surface/50 border-input dark:border-white/10 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring/50 rounded-xl transition-all"
                      autoFocus
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-medium text-foreground/90">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-primary hover:text-primary transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyUp={(e) => setCapsLock(e.getModifierState('CapsLock'))}
                      onKeyDown={(e) => setCapsLock(e.getModifierState('CapsLock'))}
                      className="pl-10 pr-10 h-11 bg-surface dark:bg-surface/50 border-input dark:border-white/10 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring/50 rounded-xl transition-all"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground/90 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {capsLock && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-amber-400 mt-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Caps Lock is on
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground font-semibold transition-all duration-200 shadow-[0_4px_14px_0_hsl(var(--primary)/0.39)] hover:shadow-[0_6px_20px_0_hsl(var(--primary)/0.23)] hover:-translate-y-0.5"
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
                  className="flex w-full items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  {magicBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
                  Prefer no password? Email me a sign-in link
                </button>
              </form>

              <div className="my-7 flex items-center">
                <div className="flex-1 border-t border-border"></div>
                <span className="px-4 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">New to InterviewExplainer?</span>
                <div className="flex-1 border-t border-border"></div>
              </div>

              <div className="space-y-4">
                <Link href="/signup" className="block w-full">
                  <Button variant="outline" className="w-full h-11 rounded-xl border-input dark:border-white/10 bg-background hover:bg-surface text-foreground transition-colors">
                    Create an Account
                  </Button>
                </Link>

                <Link
                  href="/domains"
                  className="group flex w-full items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <Compass className="h-4 w-4" />
                  Just browsing? Explore content without an account
                </Link>
              </div>

              {socialEnabled && (
                <div className="mt-7 pt-7 border-t border-border">
                  <SocialButtons />
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-8 grid grid-cols-3 gap-2 p-4 rounded-xl bg-surface/50 dark:bg-surface border-border dark:border-white/10">
                <div className="flex flex-col items-center text-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-semibold text-foreground/90 leading-tight">No Ads</span>
                  <span className="text-[9px] text-muted-foreground leading-tight">Distraction free</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-400" />
                  <span className="text-[10px] font-semibold text-foreground/90 leading-tight">Expert Crafted</span>
                  <span className="text-[9px] text-muted-foreground leading-tight">Curated by top engineers</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <Cloud className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-semibold text-foreground/90 leading-tight">Save Progress</span>
                  <span className="text-[9px] text-muted-foreground leading-tight">Pick up where you left off</span>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-muted-foreground flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Your data is safe with us. We never share your information.
            </div>
            <Link href="/privacy" className="text-primary hover:underline">
              Read our Privacy Policy
            </Link>
          </div>
        </motion.div>

        {/* Right Side: Promo & Testimonials (Hidden on Mobile/Tablet) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-6 justify-center lg:pl-4 lg:mt-10">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 rounded-3xl bg-gradient-to-b from-surface-subtle to-muted dark:from-surface dark:to-background/80 border border-border dark:border-white/10 relative overflow-hidden backdrop-blur-sm"
          >
            {/* Glowing spot */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 dark:bg-blue-950/20 rounded-full blur-2xl" />
            
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 border border-default/20 flex items-center justify-center mb-5 relative z-10"
            >
              <Rocket className="h-6 w-6 text-primary" />
            </motion.div>

            <h3 className="text-base font-bold text-foreground mb-2 relative z-10">
              Master Your<br/>Interview Preparation
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-5 relative z-10">
              Join 50K+ developers who are preparing smarter, not harder.
            </p>

            <div className="flex items-center gap-2 relative z-10">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map((i) => (
                  <img 
                    key={i}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=dev${i}&backgroundColor=1e293b`} 
                    alt="User avatar" 
                    className="w-6 h-6 rounded-full border border-background"
                  />
                ))}
                <div className="w-6 h-6 rounded-full border border-background bg-blue-600 flex items-center justify-center text-[8px] font-bold text-foreground">
                  50K+
                </div>
              </div>
              <span className="text-[10px] font-medium text-foreground/90">Happy Developers</span>
            </div>
          </motion.div>

          <div className="flex flex-col gap-3 mt-2">
            {testimonials.map((test, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + (idx * 0.15) }}
                className={`relative p-3.5 rounded-2xl bg-surface/50 dark:bg-surface border-border dark:border-white/10 backdrop-blur-md max-w-[260px] ${idx % 2 === 1 ? 'self-end' : 'self-start'}`}
              >
                <div className="flex gap-0.5 mb-1.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs font-medium text-foreground mb-1.5 leading-relaxed">"{test.quote}"</p>
                <p className="text-[9px] text-muted-foreground">— {test.author}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Expandable Features (Visible only on small screens) */}
        <div className="lg:hidden col-span-1 md:max-w-md md:mx-auto w-full mt-4">
          <Button 
            variant="outline" 
            onClick={() => setShowMobileFeatures(!showMobileFeatures)}
            className="w-full bg-primary/5 border-border text-foreground/90 hover:bg-primary/10 rounded-xl"
          >
            {showMobileFeatures ? 'Hide Premium Features' : 'View Premium Features'}
          </Button>
          
          <AnimatePresence>
            {showMobileFeatures && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-3 mt-4">
                  {featureCards.map((feat, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-primary/5 border border-border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${feat.bg} border ${feat.border}`}>
                          <feat.icon className={`h-4 w-4 ${feat.color}`} />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">{feat.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
