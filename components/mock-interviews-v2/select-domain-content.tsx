'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Code2, Database, Cloud, Layers, GitBranch, CheckCircle2, ChevronRight,
  ArrowLeft, Sparkles, Target, Zap, Radio, Video, MessageSquare,
  BookOpen, Boxes
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { Tag } from '@/components/ui/tag';
import { Badge } from '@/components/ui/badge';

// Helper function to get icon based on domain name
function getDomainIcon(domainName: string) {
  const name = domainName.toLowerCase();
  if (name.includes('java') || name.includes('backend')) return Code2;
  if (name.includes('react') || name.includes('frontend')) return Layers;
  if (name.includes('system') || name.includes('design')) return GitBranch;
  if (name.includes('sql') || name.includes('database')) return Database;
  if (name.includes('aws') || name.includes('cloud')) return Cloud;
  if (name.includes('dsa') || name.includes('algorithm')) return Zap;
  return BookOpen;
}

// Helper function to get color based on index
function getDomainColor(index: number) {
  const colors = [
    { color: 'from-primary to-primary', bgColor: 'bg-primary/10' },
    { color: 'from-primary to-primary', bgColor: 'bg-primary/10' },
    { color: 'from-primary to-primary', bgColor: 'bg-primary/10' },
    { color: 'from-sky-500 to-sky-600', bgColor: 'bg-sky-500/10' },
    { color: 'from-teal-500 to-teal-600', bgColor: 'bg-teal-500/10' },
    { color: 'from-primary to-primary', bgColor: 'bg-primary/10' },
    { color: 'from-primary to-primary', bgColor: 'bg-primary/10' },
    { color: 'from-primary to-primary', bgColor: 'bg-primary/10' },
  ];
  return colors[index % colors.length];
}

const mockTypeDetails = {
  audio: {
    title: 'AI Voice Interview',
    icon: Radio,
    description: 'Speak naturally with AI interviewer',
    questions: '5-7 questions',
    duration: '12-18 min',
  },
  'partial-mock': {
    title: 'Partial Mock Interview',
    icon: MessageSquare,
    description: 'Quick practice session',
    questions: '5-7 questions',
    duration: '15-25 min',
  },
  'full-mock': {
    title: 'Full Mock Interview',
    icon: Video,
    description: 'Complete interview simulation',
    questions: '12-15 questions',
    duration: '45-60 min',
  },
};

export function SelectDomainContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mockType = (searchParams?.get('type') || 'partial-mock') as keyof typeof mockTypeDetails;
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'medium' | 'high' | 'mixed'>('mixed');
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mockInfo = mockTypeDetails[mockType] || mockTypeDetails['partial-mock'];

  // Fetch domains from JSON content (no Spring Boot for content)
  useEffect(() => {
    async function fetchDomains() {
      try {
        const response = await fetch('/api/content/all-domains');
        if (!response.ok) throw new Error('Failed to fetch domains');

        const data = await response.json();

        const transformedDomains = (data as any[]).map((domain, index: number) => {
          const colors = getDomainColor(index);
          const icon = getDomainIcon(domain.name || domain.slug);

          return {
            id: domain.slug,
            name: domain.name || domain.slug,
            slug: domain.slug,
            icon: icon,
            color: colors.color,
            bgColor: colors.bgColor,
            questionCount: domain.questionCount || 0,
            difficulty: domain.levelLabel || 'All Levels',
            topics: domain.stacks?.slice(0, 5).map((s: any) => s.name || s.slug) || [],
          };
        });

        setDomains(transformedDomains);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching domains:', err);
        setError('Failed to load domains');
        setLoading(false);
      }
    }

    fetchDomains();
  }, []);

  const handleStartMock = () => {
    if (!selectedDomain) {
      alert('Please select a domain first');
      return;
    }

    if (mockType === 'audio') {
      router.push(`/mock-interviews/audio?domain=${selectedDomain}&difficulty=${difficulty}`);
    } else {
      router.push(`/mock-interviews/start?type=${mockType}&domain=${selectedDomain}&difficulty=${difficulty}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950/40 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          <CardSkeleton className="p-8 h-40" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} className="p-6 h-44" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950/40 flex items-center justify-center p-6">
        <ErrorState
          title="Error Loading Domains"
          description={error}
          retryLabel="Go back"
          onRetry={() => router.push('/mock-interviews')}
          className="max-w-2xl w-full"
        />
      </div>
    );
  }

  if (domains.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950/40 flex items-center justify-center p-6">
        <EmptyState
          icon={<Boxes className="h-12 w-12" />}
          title="No Domains Available"
          description="No interview domains found in the system"
          actionText="Go back"
          onAction={() => router.push('/mock-interviews')}
          className="max-w-2xl w-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950/40  ">
      {/* Header */}
      <div className="bg-surface border border-default text-white">
        <div className="w-full min-w-0 px-6 lg:px-12 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/mock-interviews"
              className="inline-flex items-center gap-2 text-sm font-semibold mb-6 opacity-90 hover:opacity-100 transition-opacity"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Mock Interviews
            </Link>

            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 bg-background/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <mockInfo.icon className="h-10 w-10" />
              </div>
              <div className="flex-1">
                <h1 className="type-display text-4xl font-extrabold mb-2">{mockInfo.title}</h1>
                <p className="text-lg opacity-90 mb-4">{mockInfo.description}</p>
                <div className="flex items-center gap-6 text-sm font-bold">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {mockInfo.questions}
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {mockInfo.duration}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full min-w-0 px-6 lg:px-12 -mt-8 pb-20">
        {/* Step 1: Select Domain */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background rounded-2xl border-2 border-border shadow-lg p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-foreground font-extrabold">
              1
            </div>
            <h2 className="text-2xl font-extrabold text-foreground">Select Your Domain</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((domain, index) => (
              <motion.button
                key={domain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedDomain(domain.slug)}
                className={cn(
                  "relative text-left p-6 rounded-2xl border-2 transition-colors duration-200 ease-out",
                  selectedDomain === domain.slug
                    ? "bg-gradient-to-br " + domain.bgColor + " border-primary ring-2 ring-ring"
                    : "bg-background border-border hover:border-primary"
                )}
              >
                {selectedDomain === domain.slug && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className="h-6 w-6 text-primary dark:text-primary" />
                  </div>
                )}

                <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4", domain.color)}>
                  <domain.icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="text-lg font-extrabold text-foreground mb-2">{domain.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {domain.questionCount > 0 ? `${domain.questionCount} questions` : 'Multiple questions'} • {domain.difficulty}
                </p>

                <div className="flex flex-wrap gap-1">
                  {domain.topics.slice(0, 3).map((topic: string, i: number) => (
                    <Tag key={i} variant="default" className="text-xs">
                      {topic}
                    </Tag>
                  ))}
                  {domain.topics.length > 3 && (
                    <Tag variant="outline" className="text-xs">
                      +{domain.topics.length - 3}
                    </Tag>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Step 2: Select Difficulty */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background rounded-2xl border-2 border-border shadow-lg p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-foreground font-extrabold">
              2
            </div>
            <h2 className="text-2xl font-extrabold text-foreground">Select Question Difficulty</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setDifficulty('medium')}
              aria-pressed={difficulty === 'medium'}
              className={cn(
                "p-6 rounded-2xl border-2 transition-colors duration-200 ease-out text-left",
                difficulty === 'medium'
                  ? "bg-success/10 border-success ring-2 ring-success/40"
                  : "bg-background border-border hover:border-success/40"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-extrabold text-foreground">Medium</h3>
                {difficulty === 'medium' && <CheckCircle2 className="h-6 w-6 text-success" />}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Solid understanding required, practical scenarios
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-success" />
                </div>
                <span className="text-xs font-bold text-muted-foreground">5-7 questions</span>
              </div>
            </button>

            <button
              onClick={() => setDifficulty('high')}
              aria-pressed={difficulty === 'high'}
              className={cn(
                "p-6 rounded-2xl border-2 transition-colors duration-200 ease-out text-left",
                difficulty === 'high'
                  ? "bg-destructive/10 border-destructive ring-2 ring-destructive/40"
                  : "bg-background border-border hover:border-destructive/40"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-extrabold text-foreground">High</h3>
                {difficulty === 'high' && <CheckCircle2 className="h-6 w-6 text-destructive" />}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Advanced topics, complex problem-solving required
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-destructive" />
                </div>
                <span className="text-xs font-bold text-muted-foreground">5-7 questions</span>
              </div>
            </button>

            <button
              onClick={() => setDifficulty('mixed')}
              aria-pressed={difficulty === 'mixed'}
              className={cn(
                "p-6 rounded-2xl border-2 transition-colors duration-200 ease-out text-left",
                difficulty === 'mixed'
                  ? "bg-primary/10 border-primary ring-2 ring-ring"
                  : "bg-background border-border hover:border-primary"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-extrabold text-foreground">Mixed</h3>
                {difficulty === 'mixed' && <CheckCircle2 className="h-6 w-6 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Combination of medium and high difficulty questions
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-5/6 bg-surface " />
                </div>
                <span className="text-xs font-bold text-muted-foreground">5-7 questions</span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Summary & Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border-2 border-default dark:border-default/20 rounded-2xl shadow-lg p-8"
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-extrabold text-foreground mb-4">Ready to Start?</h3>
              {selectedDomain ? (
                <div className="space-y-2 text-sm text-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="font-semibold">
                      Domain: {domains.find(d => d.slug === selectedDomain)?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="font-semibold">
                      Difficulty: <Badge variant="outline" className="ml-1">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</Badge>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="font-semibold">
                      Questions: 5-7 random questions from selected domain
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a domain to continue
                </p>
              )}
            </div>

            <Button
              onClick={handleStartMock}
              disabled={!selectedDomain}
              size="lg"
              className="font-bold text-lg px-8 py-6 bg-surface border border-default transition-colors duration-200 ease-out disabled:opacity-50 shadow-lg"
            >
              Start Mock Interview
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
