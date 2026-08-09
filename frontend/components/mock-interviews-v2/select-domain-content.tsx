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
import { PageContainer } from '@/components/page-container';

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
          const icon = getDomainIcon(domain.name || domain.slug);

          return {
            id: domain.slug,
            name: domain.name || domain.slug,
            slug: domain.slug,
            icon: icon,
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
      <div className="bg-background">
        <PageContainer className="py-12">
          <div className="max-w-4xl mx-auto space-y-6" aria-live="polite" aria-busy="true">
            <CardSkeleton className="p-8 h-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} className="p-6 h-44" />
              ))}
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background">
        <PageContainer className="py-12">
          <ErrorState
            title="Error Loading Domains"
            description={error}
            retryLabel="Go back"
            onRetry={() => router.push('/mock-interviews')}
            className="max-w-2xl mx-auto"
          />
        </PageContainer>
      </div>
    );
  }

  if (domains.length === 0) {
    return (
      <div className="bg-background">
        <PageContainer className="py-12">
          <EmptyState
            icon={<Boxes className="h-12 w-12" />}
            title="No Domains Available"
            description="No interview domains found in the system"
            actionText="Go back"
            onAction={() => router.push('/mock-interviews')}
            className="max-w-2xl mx-auto"
          />
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Header — token-based, no raw slate */}
      <div className="border-b border-border bg-surface">
        <PageContainer className="py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/mock-interviews"
              className="inline-flex items-center gap-2 text-sm font-semibold mb-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Mock Interviews
            </Link>

            <div className="flex items-start gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border bg-card">
                <mockInfo.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="type-title text-foreground mb-2">{mockInfo.title}</h1>
                <p className="text-base text-muted-foreground mb-3">{mockInfo.description}</p>
                <div className="flex items-center gap-5 text-sm font-medium">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Target className="h-4 w-4 text-primary" />
                    {mockInfo.questions}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {mockInfo.duration}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </PageContainer>
      </div>

      <PageContainer className="-mt-6 pb-20">
        {/* Step 1: Select Domain */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-6 sm:p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-sm font-bold text-foreground tabular-nums">
              1
            </div>
            <h2 className="text-xl font-bold text-foreground">Select Your Domain</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((domain, index) => (
              <motion.button
                key={domain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedDomain(domain.slug)}
                aria-pressed={selectedDomain === domain.slug}
                className={cn(
                  "relative text-left p-5 rounded-lg border transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  selectedDomain === domain.slug
                    ? "border-primary bg-primary/5 ring-2 ring-ring"
                    : "border-border bg-surface hover:border-primary/30"
                )}
              >
                {selectedDomain === domain.slug && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                )}

                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card mb-4">
                  <domain.icon className="h-5 w-5 text-primary" />
                </div>

                <h3 className="text-base font-bold text-foreground mb-1.5">{domain.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {domain.questionCount > 0 ? `${domain.questionCount} questions` : 'Multiple questions'} · {domain.difficulty}
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
          className="rounded-xl border border-border bg-card p-6 sm:p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-sm font-bold text-foreground tabular-nums">
              2
            </div>
            <h2 className="text-xl font-bold text-foreground">Select Question Difficulty</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setDifficulty('medium')}
              aria-pressed={difficulty === 'medium'}
              className={cn(
                "p-5 rounded-lg border transition-colors duration-200 ease-out text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                difficulty === 'medium'
                  ? "border-success bg-success/5 ring-2 ring-success/30"
                  : "border-border bg-surface hover:border-success/40"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-foreground">Medium</h3>
                {difficulty === 'medium' && <CheckCircle2 className="h-5 w-5 text-success" />}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Solid understanding required, practical scenarios
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                  <div className="h-full w-2/3 bg-success rounded-full" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">5-7 questions</span>
              </div>
            </button>

            <button
              onClick={() => setDifficulty('high')}
              aria-pressed={difficulty === 'high'}
              className={cn(
                "p-5 rounded-lg border transition-colors duration-200 ease-out text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                difficulty === 'high'
                  ? "border-destructive bg-destructive/5 ring-2 ring-destructive/30"
                  : "border-border bg-surface hover:border-destructive/40"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-foreground">High</h3>
                {difficulty === 'high' && <CheckCircle2 className="h-5 w-5 text-destructive" />}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Advanced topics, complex problem-solving required
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                  <div className="h-full w-full bg-destructive rounded-full" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">5-7 questions</span>
              </div>
            </button>

            <button
              onClick={() => setDifficulty('mixed')}
              aria-pressed={difficulty === 'mixed'}
              className={cn(
                "p-5 rounded-lg border transition-colors duration-200 ease-out text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                difficulty === 'mixed'
                  ? "border-primary bg-primary/5 ring-2 ring-ring"
                  : "border-border bg-surface hover:border-primary/30"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-foreground">Mixed</h3>
                {difficulty === 'mixed' && <CheckCircle2 className="h-5 w-5 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Combination of medium and high difficulty questions
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                  <div className="h-full w-5/6 bg-primary rounded-full" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">5-7 questions</span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Summary & Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-surface p-6 sm:p-8"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-4">Ready to Start?</h3>
              {selectedDomain ? (
                <div className="space-y-2.5 text-sm text-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    <span className="font-medium">
                      Domain: {domains.find(d => d.slug === selectedDomain)?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    <span className="font-medium">
                      Difficulty: <Badge variant="outline" className="ml-1">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</Badge>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    <span className="font-medium">
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
              className="font-semibold shrink-0"
            >
              Start Mock Interview
              <ChevronRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </motion.div>
      </PageContainer>
    </div>
  );
}
