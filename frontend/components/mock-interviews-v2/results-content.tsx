'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Trophy, Target, TrendingUp, Clock, CheckCircle2, AlertCircle,
  Code2, GitBranch, MessageSquare, ArrowRight, Download, Share2,
  ThumbsUp, Lightbulb, BookOpen, Zap, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { Tag } from '@/components/ui/tag';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/page-container';
import { ScoreRing } from '@/components/ui/score-ring';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer
} from 'recharts';

export function MockInterviewResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const score = parseInt(searchParams?.get('score') || '0');
  const mockType = searchParams?.get('type') || 'audio';
  const domainSlug = searchParams?.get('domain');

  const [resultsData, setResultsData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [parseError, setParseError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const storedResults = sessionStorage.getItem('mockResults');
    if (storedResults) {
      try {
        const parsed = JSON.parse(storedResults);
        setResultsData(parsed);
      } catch (err) {
        console.error('Error parsing results:', err);
        setParseError(true);
      }
    }
  }, [mounted]);

  const mockData = resultsData || {
    overallScore: score,
    passStatus: score >= 70 ? 'pass' : 'fail',
    completionTime: '42 min 18 sec',
    questionsAnswered: 3,
    totalQuestions: 3,
    improvement: '+12%',
    breakdown: {
      coding: { score: 82, feedback: 'Strong problem-solving approach with good code quality.' },
      systemDesign: { score: 75, feedback: 'Good architectural thinking but could elaborate more on trade-offs.' },
      behavioral: { score: 68, feedback: 'Clear communication but examples could use more specific metrics.' },
    },
    skillsRadar: [
      { skill: 'Problem Solving', score: 85 },
      { skill: 'Code Quality', score: 78 },
      { skill: 'Communication', score: 72 },
      { skill: 'System Thinking', score: 75 },
      { skill: 'Time Management', score: 80 },
      { skill: 'Technical Depth', score: 73 },
    ],
    questionDetails: [
      {
        question: 'Longest substring without repeating characters',
        type: 'coding',
        score: 82,
        timeSpent: '18 min',
        strengths: [
          'Optimal O(n) time complexity solution',
          'Clean code with good variable naming',
          'Handled edge cases correctly',
        ],
        improvements: [
          'Could add more inline comments',
          'Consider discussing space-time tradeoffs',
        ],
      },
      {
        question: 'Design URL shortening service',
        type: 'system-design',
        score: 75,
        timeSpent: '16 min',
        strengths: [
          'Good database schema design',
          'Considered load balancing',
          'Discussed caching strategy',
        ],
        improvements: [
          'Need more detail on collision handling',
          'Could elaborate on monitoring and alerting',
          'Missing discussion of rate limiting',
        ],
      },
      {
        question: 'Dealing with difficult team member',
        type: 'behavioral',
        score: 68,
        timeSpent: '8 min',
        strengths: [
          'Used STAR method effectively',
          'Showed empathy and leadership',
        ],
        improvements: [
          'Add specific metrics or outcomes',
          'Elaborate on the resolution process',
          'Discuss what you learned from the experience',
        ],
      },
    ],
    recommendations: [
      { title: 'Practice System Design Patterns', icon: GitBranch, priority: 'high' },
      { title: 'Work on Behavioral Examples', icon: MessageSquare, priority: 'medium' },
      { title: 'Review Data Structures', icon: Code2, priority: 'low' },
    ],
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getBarClass = (score: number) => {
    if (score >= 75) return 'bg-success';
    if (score >= 50) return 'bg-warning';
    return 'bg-destructive';
  };

  const QUESTION_ICONS: Record<string, any> = {
    'coding': Code2,
    'system-design': GitBranch,
    'behavioral': MessageSquare,
  };

  if (parseError) {
    return (
      <div className="bg-background">
        <PageContainer className="py-20">
          <ErrorState
            title="Could not load results"
            description="Your saved interview results could not be read. Please try taking another mock interview."
            retryLabel="Back to mock interviews"
            onRetry={() => router.push('/mock-interviews')}
            className="max-w-2xl mx-auto"
          />
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Hero — token-based, readable colors. ScoreRing instead of flat 8xl number */}
      <div className="border-b border-border bg-surface">
        <PageContainer className="py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card">
              {mockData.passStatus === 'pass' ? (
                <>
                  <Trophy className="h-4 w-4 text-success" />
                  <span className="text-sm font-bold text-foreground">Interview Complete</span>
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 text-warning" />
                  <span className="text-sm font-bold text-foreground">Keep Practicing</span>
                </>
              )}
            </div>

            <ScoreRing
              value={mockData.overallScore}
              size={168}
              stroke={10}
              label="overall score"
              ariaLabel={`Overall interview score ${mockData.overallScore} out of 100`}
            />

            <div>
              <h1 className="type-title text-foreground mb-2">
                {mockData.passStatus === 'pass' ? 'Great Performance!' : 'Keep Improving!'}
              </h1>
              <p className="text-base text-muted-foreground max-w-md">
                {mockData.passStatus === 'pass'
                  ? 'You demonstrated strong interview skills'
                  : 'Focus on the areas below to improve your performance'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-foreground">{mockData.completionTime}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-foreground">{mockData.questionsAnswered}/{mockData.totalQuestions} Questions</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-foreground">{mockData.improvement} vs Last</span>
              </div>
            </div>
          </motion.div>
        </PageContainer>
      </div>

      <PageContainer className="-mt-6 pb-20">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          <Button variant="outline" size="lg" className="font-semibold">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" size="lg" className="font-semibold">
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
          <Button size="lg" asChild className="font-semibold">
            <Link href="/mock-interviews">
              <Zap className="h-4 w-4 mr-2" />
              Try Another Mock
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Detailed Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Radar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-border bg-card p-6 sm:p-8"
            >
              <h2 className="type-section text-foreground mb-6">Skills Assessment</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={mockData.skillsRadar}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fontWeight: 600, fill: 'hsl(var(--muted-foreground))' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <Radar
                      name="Your Score"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.5}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
  </div>
            </motion.div>

            {/* Question-by-Question Breakdown */}
            {mockData.questionDetails.map((q: any, idx: number) => {
              const QIcon = QUESTION_ICONS[q.type] || Code2;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="rounded-xl border border-border bg-card p-6 sm:p-8"
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
                        <QIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="type-label text-muted-foreground mb-1.5">
                          Question {idx + 1} • <Badge variant="outline" className="ml-1">{q.type?.replace('-', ' ') || 'technical'}</Badge>
                        </p>
                        <h3 className="text-lg font-bold text-foreground mb-1.5">{q.question || q.title}</h3>
                        <p className="text-sm text-muted-foreground">Time spent: {q.timeSpent || 'N/A'}</p>

                        {q.reviewUrl && q.score < 80 && (
                          <Link
                            href={q.reviewUrl}
                            className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary text-xs font-bold hover:bg-primary/10 transition-colors"
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                            Review Full Answer & Explanation
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={cn("text-3xl font-bold tabular-nums", getScoreColor(q.score))}>
                        {q.score}
                      </div>
                      <p className="type-label text-muted-foreground">SCORE</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="p-4 rounded-lg border border-border bg-surface">
                      <div className="flex items-center gap-2 mb-3">
                        <ThumbsUp className="h-4 w-4 text-success" />
                        <h4 className="text-sm font-bold text-foreground">What Went Well</h4>
                      </div>
                      <ul className="space-y-2">
                        {q.strengths.map((strength: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div className="p-4 rounded-lg border border-border bg-surface">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="h-4 w-4 text-warning" />
                        <h4 className="text-sm font-bold text-foreground">Areas to Improve</h4>
                      </div>
                      <ul className="space-y-2">
                        {q.improvements.map((improvement: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Summary & Recommendations */}
          <div className="space-y-6">
            {/* Score Breakdown by Category */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-xl border border-border bg-card p-6 lg:sticky lg:top-6"
            >
              <h3 className="type-section text-foreground mb-5">Category Scores</h3>
              <div className="space-y-4">
                {Object.entries(mockData.breakdown).map(([category, data]: [string, any]) => {
                  const CatIcon = category === 'coding' ? Code2 : category === 'systemDesign' ? GitBranch : MessageSquare;
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CatIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground capitalize">
                            {category.replace(/([A-Z])/g, ' $1')}
                          </span>
                        </div>
                        <span className={cn("text-sm font-bold tabular-nums", getScoreColor(data.score))}>
                          {data.score}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${data.score}%` }}
                          transition={{ delay: 0.8, duration: 0.8 }}
                          className={cn("h-full rounded-full transition-[width] duration-700 ease-out", getBarClass(data.score))}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{data.feedback}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h3 className="type-section text-foreground mb-5">Recommended Practice</h3>
              <div className="space-y-3">
                {mockData.recommendations.map((rec: any, idx: number) => (
                  <Link
                    key={idx}
                    href="/domains"
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface hover:border-primary/30 transition-colors duration-200 ease-out group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card">
                        <rec.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{rec.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{rec.priority} priority</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="rounded-xl border border-primary/30 bg-primary/5 p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-card">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <h3 className="type-section text-foreground">Keep Going!</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Consistent practice is key to interview success. Take another mock to track your improvement.
              </p>
              <Button asChild className="w-full font-semibold">
                <Link href="/mock-interviews">
                  Start New Mock
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
