"use client";

import React, { useEffect, useState } from "react";
import {
  fetchStack,
  fetchQuestionsForStack,
  TechStack,
  QuestionSummary,
  difficultyColor,
  difficultyLabel,
} from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, ChevronRight, Play, BookCheck, Clock, Target, Zap, CheckCircle2, BookMarked, ArrowUpRight, BarChart2, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function StackPage({ params }: { params: Promise<{ domainSlug: string; stackSlug: string }> }) {
  const { domainSlug, stackSlug } = React.use(params);
  const [stack, setStack] = useState<TechStack | null>(null);
  const [questions, setQuestions] = useState<QuestionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [s, q] = await Promise.all([
          fetchStack(stackSlug),
          fetchQuestionsForStack(stackSlug),
        ]);
        setStack(s);
        setQuestions(q);
      } catch (err) {
        console.error("Failed to load stack data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [stackSlug]);

  if (loading) return (
    <div className="container py-24 max-w-4xl mx-auto space-y-12">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-16 w-1/2 rounded-2xl" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
      </div>
    </div>
  );

  if (!stack) return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Stack not found.
    </div>
  );

  const firstQuestion = questions[0];
  const avgTime = questions.length > 0
    ? Math.round(questions.reduce((s, q) => s + (q.estimatedReadTime || 5), 0) / questions.length)
    : 5;
  const totalTime = questions.reduce((s, q) => s + (q.estimatedReadTime || 5), 0);
  const easyCt = questions.filter(q => q.difficulty === 'easy').length;
  const medCt  = questions.filter(q => q.difficulty === 'medium').length;
  const hardCt = questions.filter(q => q.difficulty === 'hard').length;

  const studyTips = [
    { icon: "🎯", text: "Go through questions in order — they build on each other." },
    { icon: "🗣️", text: "Practice saying your answer out loud before reading the full solution." },
    { icon: "⚡", text: "Mark questions you struggled with to revisit in a second pass." },
  ];

  const advantages = [
    { icon: "🚀", label: "Career Edge", text: "Top skill interviewers test for senior roles." },
    { icon: "🧩", label: "System Thinking", text: "Builds mental models used across all tech interviews." },
    { icon: "🎙️", label: "Speak Clearly", text: "Learn to explain concepts confidently out loud." },
    { icon: "📈", label: "Compound Learning", text: "Each question prepares you for harder follow-ups." },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-slate-800 selection:bg-blue-200">
      <div className="max-w-[1300px] mx-auto bg-white min-h-screen shadow-sm border-x border-slate-100 flex">

        {/* ─── LEFT SIDEBAR — Why This Stack ─── */}
        <nav className="hidden lg:flex w-[220px] shrink-0 flex-col sticky top-0 h-screen overflow-y-auto border-r border-slate-100 py-10 px-5 gap-5">
          
          {/* Back link */}
          <Link href={`/${domainSlug}`} className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#2e64e5] flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="h-3 w-3" /> All Stacks
          </Link>

          {/* Stack identity */}
          <div className="rounded-[10px] bg-[#2e64e5]/5 border border-[#2e64e5]/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-4 w-4 text-[#2e64e5] shrink-0" />
              <span className="text-[12px] font-bold text-[#2e64e5] uppercase tracking-widest">This Stack</span>
            </div>
            <p className="text-[13px] font-bold text-slate-800 leading-tight">{stack.name}</p>
            {stack.description && (
              <p className="text-[11.5px] text-slate-500 mt-1.5 leading-relaxed line-clamp-4">{stack.description}</p>
            )}
          </div>

          {/* Advantages */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Why Master This?</p>
            <div className="flex flex-col gap-3">
              {advantages.map((a) => (
                <div key={a.label} className="flex items-start gap-2.5">
                  <span className="text-[14px] leading-none mt-0.5 shrink-0">{a.icon}</span>
                  <div>
                    <p className="text-[11.5px] font-bold text-slate-700 leading-tight">{a.label}</p>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{a.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills you'll gain */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Skills You'll Gain</p>
            <div className="flex flex-wrap gap-1.5">
              {["Concept clarity", "Answer structure", "Edge cases", "Comparison thinking", "Real-world usage"].map(skill => (
                <span key={skill} className="text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1 leading-none">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto">
            {firstQuestion && (
              <Link href={`/${domainSlug}/${stackSlug}/${firstQuestion.slug}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#2e64e5] text-white font-bold text-[12px] tracking-wide hover:bg-blue-700 transition-colors shadow-sm">
                <Play className="h-3.5 w-3.5 fill-current" />
                Start Now
              </Link>
            )}
          </div>
        </nav>

        {/* ─── MAIN COLUMN ─── */}
        <main className="flex-1 min-w-0 px-6 sm:px-10 py-10">
          <Link href={`/${domainSlug}`}
            className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-400 hover:text-[#2e64e5] mb-8 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Roadmap
          </Link>

          {/* Header */}
          <header className="mb-10 rounded-[12px] border border-slate-200 bg-[#f8f9fa] px-6 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 text-[#2e64e5] font-bold uppercase tracking-widest text-[10px] mb-3">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Skill Mastery Path</span>
            </div>

            <h1 className="text-[1.8rem] font-bold tracking-tight text-slate-900 mb-2">
              {stack.name}
            </h1>

            {stack.description && (
              <p className="text-[14px] text-slate-600 leading-[1.6] mb-4">
                {stack.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
                <BookCheck className="h-3.5 w-3.5 text-slate-400" />
                <span><strong className="text-slate-700">{questions.length}</strong> questions</span>
              </div>
              <div className="h-3 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>~<strong className="text-slate-700">{totalTime}</strong> min total</span>
              </div>
              <div className="h-3 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
                <BarChart2 className="h-3.5 w-3.5 text-slate-400" />
                <span><strong className="text-slate-700">{avgTime}m</strong> avg per question</span>
              </div>
              {firstQuestion && (
                <Link href={`/${domainSlug}/${stackSlug}/${firstQuestion.slug}`}
                  className="ml-auto flex items-center gap-2 px-5 py-2 rounded-[8px] bg-[#2e64e5] text-white font-bold text-[12px] tracking-wide hover:bg-blue-700 transition-colors shadow-sm outline-none focus:ring-2 focus:ring-blue-500/50">
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Start Practicing
                </Link>
              )}
            </div>
          </header>

          {/* Question List */}
          <div className="space-y-2.5 pb-8">
            {questions.map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
              >
                <Link href={`/${domainSlug}/${stackSlug}/${q.slug}`}
                  className="group flex items-center justify-between p-4 rounded-[12px] bg-white border border-slate-200 hover:border-[#2e64e5] hover:shadow-sm transition-all duration-300 outline-none focus:ring-2 focus:ring-[#2e64e5]/50">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="text-[12px] font-bold text-slate-300 min-w-[1.5rem] tabular-nums shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-semibold text-slate-800 group-hover:text-[#2e64e5] transition-colors leading-tight truncate">
                        {q.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                          style={{ 
                            color: difficultyColor(q.difficulty),
                            backgroundColor: difficultyColor(q.difficulty) + '18'
                          }}>
                          {difficultyLabel(q.difficulty)}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {q.estimatedReadTime ?? 5} min
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#2e64e5]/10 group-hover:text-[#2e64e5] text-slate-400 transition-colors shrink-0 ml-3">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {questions.length === 0 && (
            <div className="text-center py-20 text-slate-500 bg-slate-50 rounded-[12px] border border-slate-100">
              <p className="text-[14px]">No questions yet in this stack.</p>
            </div>
          )}

          {/* Completion Banner */}
          {questions.length > 0 && (
            <section className="mt-6 p-8 rounded-[16px] bg-blue-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none">
                <BookCheck className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <h2 className="text-[1.1rem] font-bold text-slate-900 mb-1 tracking-tight">
                  Ready to master all {questions.length} questions?
                </h2>
                <p className="text-[13.5px] text-slate-600 max-w-sm leading-[1.6]">
                  Go sequentially for the best learning experience. Estimated total: ~{totalTime} min.
                </p>
              </div>
              {firstQuestion && (
                <div className="relative z-10 shrink-0">
                  <Link href={`/${domainSlug}/${stackSlug}/${firstQuestion.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-[8px] bg-[#2e64e5] text-white font-bold text-[13px] tracking-wide hover:bg-blue-700 transition-colors shadow-sm outline-none focus:ring-2 focus:ring-blue-500/50">
                    Begin from Start
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </section>
          )}
        </main>

        {/* ─── RIGHT SIDEBAR ─── */}
        <aside className="hidden xl:flex w-[300px] shrink-0 flex-col gap-5 sticky top-0 h-screen overflow-y-auto py-10 pr-7 pl-2">

          {/* Stats at a Glance */}
          <div className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              At a Glance
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 rounded-[10px] p-3 border border-blue-100">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#2e64e5] mb-1">Questions</div>
                <div className="text-[1.4rem] font-bold text-slate-800 leading-none">{questions.length}</div>
              </div>
              <div className="bg-amber-50 rounded-[10px] p-3 border border-amber-100">
                <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1">Total Time</div>
                <div className="text-[1.4rem] font-bold text-slate-800 leading-none">{totalTime}m</div>
              </div>
            </div>
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <div className="flex justify-between text-[13px]">
                <span className="text-slate-500 font-medium">Avg per question</span>
                <span className="font-bold text-slate-800">{avgTime} min</span>
              </div>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-[#2e64e5]" />
              Difficulty Mix
            </h3>
            <div className="space-y-2.5">
              {[
                { label: "Easy", count: easyCt, color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" },
                { label: "Medium", count: medCt, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
                { label: "Hard", count: hardCt, color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
              ].map(({ label, count, color, bg, border }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="text-[10px] font-bold uppercase tracking-widest w-14" style={{ color }}>{label}</div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: questions.length ? `${(count / questions.length) * 100}%` : '0%', backgroundColor: color }}
                    />
                  </div>
                  <span className="text-[12px] font-bold text-slate-600 w-4 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Study Tips */}
          <div className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-[#2e64e5]" />
              Study Tips
            </h3>
            <div className="space-y-3.5">
              {studyTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[15px] leading-none mt-0.5 shrink-0">{tip.icon}</span>
                  <p className="text-[12.5px] text-slate-600 leading-[1.55]">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Nav */}
          <div className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-800 mb-4">Quick Navigation</h3>
            <div className="flex flex-col gap-2">
              <Link href={`/${domainSlug}`} className="flex items-center justify-between text-[13px] font-medium text-slate-600 hover:text-[#2e64e5] transition-colors py-1.5 border-b border-slate-50">
                <span>← Back to Roadmap</span>
              </Link>
              <Link href="/domains" className="flex items-center justify-between text-[13px] font-medium text-slate-600 hover:text-[#2e64e5] transition-colors py-1.5 border-b border-slate-50">
                <span>Browse All Paths</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link href="/dashboard" className="flex items-center justify-between text-[13px] font-medium text-slate-600 hover:text-[#2e64e5] transition-colors py-1.5">
                <span>My Dashboard</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}
