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
import { ArrowLeft, TrendingUp, ChevronRight, Play, BookCheck, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function StackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [stack, setStack] = useState<TechStack | null>(null);
  const [questions, setQuestions] = useState<QuestionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [s, q] = await Promise.all([
          fetchStack(slug),
          fetchQuestionsForStack(slug),
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
  }, [slug]);

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary),0.05),transparent_70%)] pointer-events-none" />
      <div className="fixed inset-0 bg-cyber-grid opacity-[0.03] pointer-events-none" />

      <main className="relative z-10 container py-20 max-w-5xl mx-auto px-6">
        <Link href="/domains"
          className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary mb-16 transition-all">
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Roadmap
        </Link>

        {/* Header */}
        <header className="mb-16 grid md:grid-cols-[1fr_280px] gap-12 items-end">
          <div>
            <div className="flex items-center gap-3 text-primary/60 font-black tracking-[0.3em] uppercase text-[10px] mb-6">
              <TrendingUp className="h-4 w-4" />
              <span>Skill Mastery Path</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] text-white mb-6">
              {stack.name.split(' ')[0]}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/40 italic">
                {stack.name.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            {stack.description && (
              <p className="text-muted-foreground/60 max-w-xl text-base font-medium leading-relaxed">
                {stack.description}
              </p>
            )}
          </div>

          <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">Questions</div>
                <div className="text-2xl font-black text-white">{questions.length}</div>
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">Avg Time</div>
                <div className="text-2xl font-black text-white">
                  {questions.length > 0
                    ? Math.round(questions.reduce((s, q) => s + (q.estimatedReadTime || 5), 0) / questions.length)
                    : 5}m
                </div>
              </div>
            </div>
            {firstQuestion && (
              <Link href={`/question/${firstQuestion.slug}`}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-primary text-black font-black uppercase text-[10px] tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20">
                <Play className="h-3.5 w-3.5 fill-current" />
                Start Practice
              </Link>
            )}
          </div>
        </header>

        {/* Question List */}
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.02 }}
            >
              <Link href={`/question/${q.slug}`}
                className="group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-300">
                <div className="flex items-center gap-5">
                  <span className="text-[10px] font-black text-muted-foreground/30 min-w-[1.5rem] tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">
                      {q.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] font-bold uppercase"
                        style={{ color: difficultyColor(q.difficulty) }}>
                        {difficultyLabel(q.difficulty)}
                      </span>
                      <span className="text-[9px] text-muted-foreground/40 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {q.estimatedReadTime ?? 5}m read
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>

        {questions.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-sm">No questions yet in this stack.</p>
          </div>
        )}

        {/* Completion Banner */}
        {questions.length > 0 && (
          <section className="mt-24 p-12 rounded-[3rem] bg-gradient-to-br from-primary/10 via-transparent to-transparent border border-white/10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 scale-150">
              <BookCheck className="h-32 w-32" />
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tighter uppercase text-white">
              Complete All {questions.length} Questions
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Master every concept in this stack to level up your interview readiness.
            </p>
            {firstQuestion && (
              <Link href={`/question/${firstQuestion.slug}`}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl">
                Begin from Start
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
