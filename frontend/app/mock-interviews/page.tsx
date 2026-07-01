'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mic, Code2, GitBranch, MessageSquare, Play, Clock, Target, Star,
  TrendingUp, Award, CheckCircle2, ArrowRight, Video, FileText, Zap, Radio,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockTypes = [
  {
    id: 'partial-mock',
    title: 'Quick Practice Round',
    description: 'Answer 5–7 timed questions from your chosen domain. Review your answers against expert responses.',
    icon: Zap,
    duration: '15–20 min',
    difficulty: 'All Levels',
    sections: ['Timed questions', 'Self-review against sample answers', 'Domain-specific content'],
    gradient: 'from-purple-50 dark:from-purple-950/400 to-pink-600',
    bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
    recommended: true,
    badge: 'POPULAR',
  },
  {
    id: 'full-mock',
    title: 'Full Practice Session',
    description: 'A longer self-paced session covering multiple topic areas with a review at the end.',
    icon: Video,
    duration: '40–60 min',
    difficulty: 'All Levels',
    sections: ['Multiple topic areas', 'Timed per question', 'End-of-session review'],
    gradient: 'from-pink-50 dark:from-pink-950/400 to-rose-600',
    bgGradient: 'from-pink-50 dark:from-pink-950/40 to-rose-50 dark:to-rose-950/40',
  },
  {
    id: 'coding-mock',
    title: 'Technical Deep-Dive',
    description: 'Focus on the technical concepts that matter most for engineering interviews.',
    icon: Code2,
    duration: '20–30 min',
    difficulty: 'Easy to Hard',
    sections: ['Core technical questions', 'Concept-focused', 'Compare with expert answers'],
    gradient: 'from-blue-50 dark:from-blue-950/400 to-cyan-600',
    bgGradient: 'from-blue-50 dark:from-blue-950/40 to-cyan-50 dark:to-cyan-950/40',
  },
  {
    id: 'system-design-mock',
    title: 'System Design Practice',
    description: 'Work through system design scenarios and compare your approach with structured guidance.',
    icon: GitBranch,
    duration: '25–40 min',
    difficulty: 'Mid to Senior',
    sections: ['Architecture questions', 'Scalability scenarios', 'Guided review'],
    gradient: 'from-purple-50 dark:from-purple-950/400 to-indigo-600',
    bgGradient: 'from-purple-50 dark:from-purple-950/40 to-indigo-50 dark:to-indigo-950/40',
  },
  {
    id: 'behavioral-mock',
    title: 'Behavioural Practice',
    description: 'Practise STAR-format answers to common behavioural questions.',
    icon: MessageSquare,
    duration: '15–25 min',
    difficulty: 'All Levels',
    sections: ['STAR framework prompts', 'Leadership & conflict scenarios', 'Self-review checklist'],
    gradient: 'from-orange-50 dark:from-orange-950/400 to-amber-600',
    bgGradient: 'from-orange-50 dark:from-orange-950/40 to-amber-50 dark:to-amber-950/40',
  },
];

const features = [
  {
    icon: Target,
    title: 'Timed Practice',
    description: 'Each question has a target time limit to simulate real interview pacing.',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Progress',
    description: 'Optionally sign in to save your results and see how your answers improve over time.',
  },
  {
    icon: Award,
    title: 'Domain-Specific Questions',
    description: 'Questions are drawn from our curated Java and Python content library — not generic lists.',
  },
  {
    icon: CheckCircle2,
    title: 'Self-Review Against Expert Answers',
    description: 'After each answer, compare your response against a structured sample answer and key points.',
  },
];

const platformPillars = [
  { label: 'Self-paced', icon: '⏱️' },
  { label: 'Domain-specific', icon: '🎯' },
  { label: 'Structured review', icon: '✅' },
];

function MockInterviewsContent() {
  const startHref = (mockId: string) => `/mock-interviews/select-domain?type=${mockId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950/40 via-blue-50/30 dark:via-blue-950/40 to-indigo-50/20 dark:to-indigo-950/40  ">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white">
        <div className="w-full min-w-0 px-6 lg:px-12 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/20 backdrop-blur-sm mb-6">
              <Mic className="h-4 w-4" />
              <span className="text-sm font-bold">Structured Mock Practice</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Practise Under Real Conditions
            </h1>
            <p className="text-lg opacity-90 mb-8">
              Answer timed, domain-specific questions and review your responses against structured expert answers — building confidence before the real thing.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-bold">
              {platformPillars.map(p => (
                <div key={p.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/20 backdrop-blur-sm">
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full min-w-0 px-6 lg:px-12 -mt-8 pb-20">

        {/* Mock Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {mockTypes.map((mock, index) => (
            <motion.div
              key={mock.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={startHref(mock.id)}
                className={cn(
                  "relative overflow-hidden rounded-2xl border-2 border-border bg-background p-8 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group block",
                  mock.recommended && "ring-2 ring-purple-500"
                )}
              >
                {mock.recommended && (
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 dark:from-purple-950/400 to-pink-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {mock.badge || 'Recommended'}
                    </div>
                  </div>
                )}

                <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6", mock.gradient)}>
                  <mock.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-2xl font-black text-foreground mb-2">{mock.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{mock.description}</p>

                <div className="flex items-center gap-4 mb-6 text-xs font-bold text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {mock.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {mock.difficulty}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {mock.sections.map((section, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{section}</span>
                    </div>
                  ))}
                </div>

                <div className={cn(
                  "w-full py-3 rounded-xl bg-gradient-to-r text-white font-bold text-sm flex items-center justify-center gap-2 group-hover:scale-105 transition-transform shadow-lg",
                  mock.gradient
                )}>
                  <Play className="h-4 w-4" />
                  Start Mock Interview
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-background rounded-2xl border border-border p-8 shadow-sm mb-16">
          <h2 className="text-2xl font-black text-foreground mb-8 text-center">What You Get from Mock Practice</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 dark:from-blue-950/50 to-indigo-100 dark:to-indigo-950/50 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-black text-foreground mb-2">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/mock-interviews/history">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 dark:from-slate-950/40 to-blue-50 dark:to-blue-950/40 border border-border hover:shadow-lg transition-all group  ">
              <div className="flex items-start justify-between mb-4">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-black text-foreground mb-2">View Mock History</h3>
              <p className="text-sm text-muted-foreground">Review past interviews and track your progress over time</p>
            </div>
          </Link>

          <Link href="/dashboard">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-500/20 hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-4">
                <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-black text-foreground mb-2">Performance Analytics</h3>
              <p className="text-sm text-muted-foreground">Detailed insights and recommendations on your dashboard</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MockInterviewsPage() {
  return <MockInterviewsContent />;
}