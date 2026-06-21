'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Trophy, Target, TrendingUp, Clock, CheckCircle2, AlertCircle, XCircle,
  Code2, GitBranch, MessageSquare, Star, ArrowRight, Download, Share2,
  ThumbsUp, ThumbsDown, Lightbulb, BookOpen, Zap, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

function MockInterviewResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const score = parseInt(searchParams?.get('score') || '0');
  const mockType = searchParams?.get('type') || 'audio';
  const domainSlug = searchParams?.get('domain');

  const [showConfetti, setShowConfetti] = useState(false);
  const [resultsData, setResultsData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Try to load real results from sessionStorage
    const storedResults = sessionStorage.getItem('mockResults');
    if (storedResults) {
      try {
        const parsed = JSON.parse(storedResults);
        setResultsData(parsed);
      } catch (err) {
        console.error('Error parsing results:', err);
      }
    }
  }, [mounted]);

  useEffect(() => {
    if (score >= 75) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [score]);

  // Fallback mock data if no real results available
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
    if (score >= 80) return 'text-emerald-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-600';
    if (score >= 70) return 'from-blue-500 to-cyan-600';
    if (score >= 60) return 'from-orange-500 to-amber-600';
    return 'from-red-500 to-rose-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-emerald-50 to-green-50';
    if (score >= 70) return 'from-blue-50 to-cyan-50';
    if (score >= 60) return 'from-orange-50 to-amber-50';
    return 'from-red-50 to-rose-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section */}
      <div className={cn("bg-gradient-to-r", getScoreGradient(mockData.overallScore), "text-white")}>
        <div className="w-full min-w-0 px-6 lg:px-12 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              {mockData.passStatus === 'pass' ? (
                <>
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm font-bold">Interview Complete</span>
                </>
              ) : (
                <>
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-bold">Keep Practicing</span>
                </>
              )}
            </div>

            <div className="mb-6">
              <div className="relative inline-block">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-8xl font-black mb-2"
                >
                  {mockData.overallScore}
                </motion.div>
                <div className="absolute -top-4 -right-8">
                  {mockData.passStatus === 'pass' && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4, type: 'spring' }}
                    >
                      <CheckCircle2 className="h-12 w-12 text-white" />
                    </motion.div>
                  )}
                </div>
              </div>
              <p className="text-2xl font-black mb-2">
                {mockData.passStatus === 'pass' ? 'Great Performance!' : 'Keep Improving!'}
              </p>
              <p className="text-lg opacity-90">
                {mockData.passStatus === 'pass'
                  ? 'You demonstrated strong interview skills'
                  : 'Focus on the areas below to improve your performance'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm font-bold">
              <div className="flex flex-col items-center">
                <Clock className="h-6 w-6 mb-1" />
                <span>{mockData.completionTime}</span>
              </div>
              <div className="flex flex-col items-center">
                <Target className="h-6 w-6 mb-1" />
                <span>{mockData.questionsAnswered}/{mockData.totalQuestions} Questions</span>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp className="h-6 w-6 mb-1" />
                <span>{mockData.improvement} vs Last</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full min-w-0 px-6 lg:px-12 -mt-8 pb-20">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <Button variant="outline" size="lg" className="font-semibold bg-white shadow-lg">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" size="lg" className="font-semibold bg-white shadow-lg">
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
          <Button size="lg" asChild className="font-bold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-lg">
            <Link href="/mock-interviews">
              <Zap className="h-4 w-4 mr-2" />
              Try Another Mock
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Detailed Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Radar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-8"
            >
              <h2 className="text-2xl font-black text-slate-900 mb-6">Skills Assessment</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={mockData.skillsRadar}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Your Score"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.5}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Question-by-Question Breakdown */}
            {mockData.questionDetails.map((q, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      q.type === 'coding' && "bg-gradient-to-br from-blue-500 to-cyan-600",
                      q.type === 'system-design' && "bg-gradient-to-br from-purple-500 to-indigo-600",
                      q.type === 'behavioral' && "bg-gradient-to-br from-orange-500 to-amber-600"
                    )}>
                      {q.type === 'coding' && <Code2 className="h-6 w-6 text-white" />}
                      {q.type === 'system-design' && <GitBranch className="h-6 w-6 text-white" />}
                      {q.type === 'behavioral' && <MessageSquare className="h-6 w-6 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Question {idx + 1} • {q.type?.replace('-', ' ') || 'technical'}
                      </p>
                      <h3 className="text-xl font-black text-slate-900 mb-2">{q.question || q.title}</h3>
                      <p className="text-sm text-slate-600">Time spent: {q.timeSpent || 'N/A'}</p>

                      {/* Link to review full answer if available */}
                      {q.reviewUrl && q.score < 80 && (
                        <Link
                          href={q.reviewUrl}
                          className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                        >
                          <BookOpen className="h-3 w-3" />
                          Review Full Answer & Explanation
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn("text-4xl font-black mb-1", getScoreColor(q.score))}>
                      {q.score}
                    </div>
                    <p className="text-xs font-bold text-slate-500">SCORE</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-3">
                      <ThumbsUp className="h-5 w-5 text-emerald-600" />
                      <h4 className="text-sm font-black text-emerald-900">What Went Well</h4>
                    </div>
                    <ul className="space-y-2">
                      {q.strengths.map((strength, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-5 w-5 text-orange-600" />
                      <h4 className="text-sm font-black text-orange-900">Areas to Improve</h4>
                    </div>
                    <ul className="space-y-2">
                      {q.improvements.map((improvement, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-orange-800">
                          <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Summary & Recommendations */}
          <div className="space-y-6">
            {/* Score Breakdown by Category */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-6 sticky top-6"
            >
              <h3 className="text-lg font-black text-slate-900 mb-4">Category Scores</h3>
              <div className="space-y-4">
                {Object.entries(mockData.breakdown).map(([category, data]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {category === 'coding' && <Code2 className="h-4 w-4 text-blue-600" />}
                        {category === 'systemDesign' && <GitBranch className="h-4 w-4 text-purple-600" />}
                        {category === 'behavioral' && <MessageSquare className="h-4 w-4 text-orange-600" />}
                        <span className="text-sm font-bold text-slate-700 capitalize">
                          {category.replace(/([A-Z])/g, ' $1')}
                        </span>
                      </div>
                      <span className={cn("text-lg font-black", getScoreColor(data.score))}>
                        {data.score}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.score}%` }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className={cn("h-full bg-gradient-to-r", getScoreGradient(data.score))}
                      />
                    </div>
                    <p className="text-xs text-slate-600">{data.feedback}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-6"
            >
              <h3 className="text-lg font-black text-slate-900 mb-4">Recommended Practice</h3>
              <div className="space-y-3">
                {mockData.recommendations.map((rec, idx) => (
                  <Link
                    key={idx}
                    href="/domains"
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:scale-[1.02] group",
                      rec.priority === 'high' && "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 hover:border-red-400",
                      rec.priority === 'medium' && "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 hover:border-orange-400",
                      rec.priority === 'low' && "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-400"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        rec.priority === 'high' && "bg-gradient-to-br from-red-500 to-rose-600",
                        rec.priority === 'medium' && "bg-gradient-to-br from-orange-500 to-amber-600",
                        rec.priority === 'low' && "bg-gradient-to-br from-blue-500 to-cyan-600"
                      )}>
                        <rec.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{rec.title}</p>
                        <p className="text-xs text-slate-600 capitalize">{rec.priority} priority</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Keep Going!</h3>
              </div>
              <p className="text-sm text-slate-700 mb-4">
                Consistent practice is key to interview success. Take another mock to track your improvement.
              </p>
              <Button asChild className="w-full font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link href="/mock-interviews">
                  Start New Mock
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function MockInterviewResultsPage() {
  return <MockInterviewResultsContent />;
}
