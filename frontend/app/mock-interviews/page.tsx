'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mic, Code2, GitBranch, MessageSquare, Play, Clock, Target, Star,
  TrendingUp, Award, CheckCircle2, ArrowRight, Video, FileText, Zap, Radio,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';


const mockTypes = [
  {
    id: 'partial-mock',
    title: 'Quick Practice Round',
    description: 'Answer 5–7 timed questions from your chosen domain. Review your answers against expert responses.',
    icon: Zap,
    duration: '15–20 min',
    difficulty: 'All Levels',
    sections: ['Timed questions', 'Self-review against sample answers', 'Domain-specific content'],
    gradient: 'from-blue-500 to-blue-600',
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
    gradient: 'from-blue-600 to-blue-700',
  },
  {
    id: 'coding-mock',
    title: 'Technical Deep-Dive',
    description: 'Focus on the technical concepts that matter most for engineering interviews.',
    icon: Code2,
    duration: '20–30 min',
    difficulty: 'Easy to Hard',
    sections: ['Core technical questions', 'Concept-focused', 'Compare with expert answers'],
    gradient: 'from-blue-500 to-primary',
  },
  {
    id: 'system-design-mock',
    title: 'System Design Practice',
    description: 'Work through system design scenarios and compare your approach with structured guidance.',
    icon: GitBranch,
    duration: '25–40 min',
    difficulty: 'Mid to Senior',
    sections: ['Architecture questions', 'Scalability scenarios', 'Guided review'],
    gradient: 'from-blue-400 to-blue-600',
  },
  {
    id: 'behavioral-mock',
    title: 'Behavioural Practice',
    description: 'Practise STAR-format answers to common behavioural questions.',
    icon: MessageSquare,
    duration: '15–25 min',
    difficulty: 'All Levels',
    sections: ['STAR framework prompts', 'Leadership & conflict scenarios', 'Self-review checklist'],
    gradient: 'from-blue-700 to-blue-800',
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
  const [selectedMock, setSelectedMock] = React.useState<typeof mockTypes[0] | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const startHref = (mockId: string) => `/mock-interviews/select-domain?type=${mockId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950/40  ">

      {/* Hero Section */}
      <div className="dark bg-hero text-foreground border-b border-white/10 relative overflow-hidden">
        <div className="w-full min-w-0 px-6 lg:px-12 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
              <Mic className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Structured Mock Practice</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-foreground">
              Practise Under Real Conditions
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Answer timed, domain-specific questions and review your responses against structured expert answers — building confidence before the real thing.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-bold">
              {platformPillars.map(p => (
                <div key={p.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-foreground">
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
              <div
                onClick={() => { setSelectedMock(mock); setDialogOpen(true); }}
                role="button"
                tabIndex={0}
                className={cn(
                  "relative overflow-hidden rounded-2xl border-2 border-border bg-background p-8 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group block",
                  mock.recommended && "ring-2 ring-ring"
                )}
              >
                {mock.recommended && (
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 rounded-full bg-surface text-foreground text-xs font-black uppercase tracking-wider flex items-center gap-1">
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
              </div>
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
                <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-primary dark:text-primary" />
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
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 dark:from-slate-950/40  border border-border hover:shadow-lg transition-all group  ">
              <div className="flex items-start justify-between mb-4">
                <FileText className="h-8 w-8 text-primary dark:text-primary" />
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-black text-foreground mb-2">View Mock History</h3>
              <p className="text-sm text-muted-foreground">Review past interviews and track your progress over time</p>
            </div>
          </Link>

          <Link href="/dashboard">
            <div className="p-6 rounded-2xl bg-surface border border-default dark:border-default/20 hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-4">
                <Zap className="h-8 w-8 text-primary dark:text-primary" />
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-black text-foreground mb-2">Performance Analytics</h3>
              <p className="text-sm text-muted-foreground">Detailed insights and recommendations on your dashboard</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Onboarding Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ready to practice?</DialogTitle>
            <DialogDescription>
              Before we begin your {selectedMock?.title}, let's review a few quick things to get the most out of this session.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <Mic className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Microphone Check</h4>
                <p className="text-xs text-muted-foreground">You can answer aloud or type your responses. If answering aloud, find a quiet space.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Pacing</h4>
                <p className="text-xs text-muted-foreground">This session takes about {selectedMock?.duration}. Take your time reading each prompt.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Self-Review</h4>
                <p className="text-xs text-muted-foreground">After answering, you'll compare your response against an expert's key points. Be honest with your self-assessment!</p>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            {selectedMock && (
              <Button asChild>
                <Link href={startHref(selectedMock.id)}>
                  Start Session <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default function MockInterviewsPage() {
  return <MockInterviewsContent />;
}