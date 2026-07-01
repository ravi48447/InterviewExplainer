'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Code2, GitBranch, MessageSquare, Video, Calendar, Clock, Trophy,
  TrendingUp, TrendingDown, Minus, ChevronRight, Filter, Search,
  Download, BarChart3, Eye, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

// Mock data - in real app this would come from API
const mockHistory = [
  {
    id: '1',
    type: 'full-mock',
    typeName: 'Full Mock Interview',
    score: 85,
    date: '2026-03-25',
    duration: '58 min',
    questionsAnswered: 3,
    totalQuestions: 3,
    breakdown: { coding: 88, systemDesign: 82, behavioral: 85 },
    improvement: '+8%',
  },
  {
    id: '2',
    type: 'coding-mock',
    typeName: 'Coding Interview',
    score: 78,
    date: '2026-03-22',
    duration: '42 min',
    questionsAnswered: 3,
    totalQuestions: 3,
    breakdown: { coding: 78 },
    improvement: '+5%',
  },
  {
    id: '3',
    type: 'system-design-mock',
    typeName: 'System Design Interview',
    score: 72,
    date: '2026-03-20',
    duration: '48 min',
    questionsAnswered: 1,
    totalQuestions: 1,
    breakdown: { systemDesign: 72 },
    improvement: '-3%',
  },
  {
    id: '4',
    type: 'behavioral-mock',
    typeName: 'Behavioral Interview',
    score: 80,
    date: '2026-03-18',
    duration: '24 min',
    questionsAnswered: 3,
    totalQuestions: 3,
    breakdown: { behavioral: 80 },
    improvement: '+12%',
  },
  {
    id: '5',
    type: 'coding-mock',
    typeName: 'Coding Interview',
    score: 73,
    date: '2026-03-15',
    duration: '45 min',
    questionsAnswered: 3,
    totalQuestions: 3,
    breakdown: { coding: 73 },
    improvement: '+2%',
  },
  {
    id: '6',
    type: 'full-mock',
    typeName: 'Full Mock Interview',
    score: 77,
    date: '2026-03-12',
    duration: '62 min',
    questionsAnswered: 3,
    totalQuestions: 3,
    breakdown: { coding: 75, systemDesign: 78, behavioral: 78 },
    improvement: '+15%',
  },
  {
    id: '7',
    type: 'coding-mock',
    typeName: 'Coding Interview',
    score: 68,
    date: '2026-03-10',
    duration: '38 min',
    questionsAnswered: 2,
    totalQuestions: 3,
    breakdown: { coding: 68 },
    improvement: '-5%',
  },
  {
    id: '8',
    type: 'behavioral-mock',
    typeName: 'Behavioral Interview',
    score: 65,
    date: '2026-03-08',
    duration: '22 min',
    questionsAnswered: 3,
    totalQuestions: 3,
    breakdown: { behavioral: 65 },
    improvement: 'first',
  },
];

const progressData = [
  { date: 'Mar 8', score: 65 },
  { date: 'Mar 10', score: 68 },
  { date: 'Mar 12', score: 77 },
  { date: 'Mar 15', score: 73 },
  { date: 'Mar 18', score: 80 },
  { date: 'Mar 20', score: 72 },
  { date: 'Mar 22', score: 78 },
  { date: 'Mar 25', score: 85 },
];

const stats = {
  totalMocks: 8,
  averageScore: 75,
  bestScore: 85,
  completionRate: 96,
  totalTime: '5h 39m',
  improvement: '+20%',
};

function MockInterviewHistoryContent() {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = mockHistory.filter((mock) => {
    const matchesType = filterType === 'all' || mock.type === filterType;
    const matchesSearch = mock.typeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'coding-mock':
        return Code2;
      case 'system-design-mock':
        return GitBranch;
      case 'behavioral-mock':
        return MessageSquare;
      case 'full-mock':
        return Video;
      default:
        return Code2;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'coding-mock':
        return 'from-blue-500 to-cyan-600';
      case 'system-design-mock':
        return 'from-purple-500 to-indigo-600';
      case 'behavioral-mock':
        return 'from-orange-500 to-amber-600';
      case 'full-mock':
        return 'from-pink-500 to-rose-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="w-full min-w-0 px-6 lg:px-12 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-8 w-8" />
              <h1 className="text-4xl font-black">Mock Interview History</h1>
            </div>
            <p className="text-lg opacity-90 mb-8 max-w-2xl">
              Track your progress, analyze your performance, and see how you've improved over time
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-xl bg-background/10 backdrop-blur-sm border border-white/20">
                <p className="text-xs font-bold opacity-75 mb-1">Total Mocks</p>
                <p className="text-2xl font-black">{stats.totalMocks}</p>
              </div>
              <div className="p-4 rounded-xl bg-background/10 backdrop-blur-sm border border-white/20">
                <p className="text-xs font-bold opacity-75 mb-1">Avg Score</p>
                <p className="text-2xl font-black">{stats.averageScore}%</p>
              </div>
              <div className="p-4 rounded-xl bg-background/10 backdrop-blur-sm border border-white/20">
                <p className="text-xs font-bold opacity-75 mb-1">Best Score</p>
                <p className="text-2xl font-black">{stats.bestScore}%</p>
              </div>
              <div className="p-4 rounded-xl bg-background/10 backdrop-blur-sm border border-white/20">
                <p className="text-xs font-bold opacity-75 mb-1">Completion</p>
                <p className="text-2xl font-black">{stats.completionRate}%</p>
              </div>
              <div className="p-4 rounded-xl bg-background/10 backdrop-blur-sm border border-white/20">
                <p className="text-xs font-bold opacity-75 mb-1">Total Time</p>
                <p className="text-2xl font-black">{stats.totalTime}</p>
              </div>
              <div className="p-4 rounded-xl bg-background/10 backdrop-blur-sm border border-white/20">
                <p className="text-xs font-bold opacity-75 mb-1">Improvement</p>
                <p className="text-2xl font-black">{stats.improvement}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full min-w-0 px-6 lg:px-12 -mt-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Progress Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Over Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background rounded-2xl border-2 border-border shadow-lg p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-foreground">Progress Over Time</h2>
                <Button variant="outline" size="sm" className="font-semibold">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fontWeight: 600 }}
                      stroke="#64748b"
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12, fontWeight: 600 }}
                      stroke="#64748b"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontWeight: 600,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#scoreGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Filters and Search */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search mock interviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-border focus:border-blue-500 dark:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all text-sm font-semibold"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 rounded-lg border-2 border-border focus:border-blue-500 dark:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all text-sm font-semibold bg-background"
                >
                  <option value="all">All Types</option>
                  <option value="full-mock">Full Mock</option>
                  <option value="coding-mock">Coding</option>
                  <option value="system-design-mock">System Design</option>
                  <option value="behavioral-mock">Behavioral</option>
                </select>
              </div>
            </div>

            {/* History List */}
            <div className="space-y-4">
              {filteredHistory.map((mock, index) => {
                const Icon = getTypeIcon(mock.type);
                return (
                  <motion.div
                    key={mock.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/mock-interviews/results?id=${mock.id}`}>
                      <div className="group bg-background rounded-2xl border-2 border-border shadow-sm hover:shadow-lg transition-all p-6 hover:scale-[1.01]">
                        <div className="flex items-start gap-6">
                          {/* Icon and Type */}
                          <div className={cn("w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0", getTypeColor(mock.type))}>
                            <Icon className="h-7 w-7 text-white" />
                          </div>

                          {/* Main Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-black text-foreground mb-1">{mock.typeName}</h3>
                                <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(mock.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {mock.duration}
                                  </div>
                                  <div>
                                    {mock.questionsAnswered}/{mock.totalQuestions} questions
                                  </div>
                                </div>
                              </div>

                              {/* Score Badge */}
                              <div className="text-right">
                                <div className={cn("text-3xl font-black mb-1", getScoreColor(mock.score))}>
                                  {mock.score}
                                </div>
                                <div className="flex items-center gap-1 justify-end">
                                  {mock.improvement !== 'first' && (
                                    <>
                                      {mock.improvement.startsWith('+') ? (
                                        <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                      ) : mock.improvement.startsWith('-') ? (
                                        <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                                      ) : (
                                        <Minus className="h-3 w-3 text-muted-foreground" />
                                      )}
                                      <span className={cn(
                                        "text-xs font-bold",
                                        mock.improvement.startsWith('+') && "text-emerald-600 dark:text-emerald-400",
                                        mock.improvement.startsWith('-') && "text-red-600 dark:text-red-400",
                                        !mock.improvement.startsWith('+') && !mock.improvement.startsWith('-') && "text-muted-foreground"
                                      )}>
                                        {mock.improvement}
                                      </span>
                                    </>
                                  )}
                                  {mock.improvement === 'first' && (
                                    <span className="text-xs font-bold text-muted-foreground">First attempt</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Category Breakdown */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {Object.entries(mock.breakdown).map(([category, score]) => (
                                <div key={category} className="p-3 rounded-lg bg-surface border border-border">
                                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 truncate">
                                    {category === 'coding' && 'Coding'}
                                    {category === 'systemDesign' && 'System Design'}
                                    {category === 'behavioral' && 'Behavioral'}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                      <div
                                        className={cn("h-full bg-gradient-to-r", getScoreGradient(score))}
                                        style={{ width: `${score}%` }}
                                      />
                                    </div>
                                    <span className={cn("text-sm font-black", getScoreColor(score))}>
                                      {score}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Arrow */}
                          <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-all shrink-0 mt-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {filteredHistory.length === 0 && (
              <div className="bg-background rounded-2xl border-2 border-border shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-2">No Results Found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={() => { setFilterType('all'); setSearchQuery(''); }} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Right Column: Quick Stats */}
          <div className="space-y-6">
            {/* Recent Achievement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-2xl border-2 border-yellow-400 dark:border-yellow-700 shadow-lg p-6 sticky top-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Latest Achievement</p>
                  <p className="text-lg font-black text-foreground">Best Score Yet!</p>
                </div>
              </div>
              <p className="text-sm text-foreground mb-4">
                You scored <span className="font-black text-emerald-600 dark:text-emerald-400">85%</span> on your latest Full Mock Interview - your highest score to date!
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-700 dark:text-orange-400">
                <Award className="h-4 w-4" />
                <span>Keep up the great work!</span>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-background rounded-2xl border-2 border-border shadow-lg p-6"
            >
              <h3 className="text-lg font-black text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button asChild className="w-full font-bold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
                  <Link href="/mock-interviews">
                    <Video className="h-4 w-4 mr-2" />
                    Start New Mock
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full font-semibold">
                  <Link href="/dashboard">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full font-semibold">
                  <Link href="/domains">
                    <Eye className="h-4 w-4 mr-2" />
                    Practice Questions
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Performance Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-background rounded-2xl border-2 border-border shadow-lg p-6"
            >
              <h3 className="text-lg font-black text-foreground mb-4">Performance Insights</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-sm font-bold text-emerald-900 dark:text-emerald-400">Strongest Area</p>
                  </div>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400">
                    <span className="font-black">Coding Interviews</span> - Average score: 79%
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <p className="text-sm font-bold text-orange-900 dark:text-orange-400">Area to Improve</p>
                  </div>
                  <p className="text-xs text-orange-800 dark:text-orange-400">
                    <span className="font-black">Behavioral Interviews</span> - Average score: 73%
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-400">Most Practiced</p>
                  </div>
                  <p className="text-xs text-blue-800 dark:text-blue-400">
                    You've taken <span className="font-black">3 Coding Mocks</span> in the last 2 weeks
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function MockInterviewHistoryPage() {
  return <MockInterviewHistoryContent />;
}
