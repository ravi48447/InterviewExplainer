"use client";

import React, { useEffect, useState } from "react";
import {
  fetchDomain,
  fetchCategoriesForDomain,
  Domain,
  DomainCategory,
  TechStack,
  fetchQuestionsForStack,
  QuestionSummary,
  difficultyColor,
  difficultyLabel,
} from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Layers, BookOpen, ChevronDown, Clock, Target, Zap, CheckCircle2, TrendingUp, BookMarked, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function DomainPage({ params }: { params: Promise<{ domainSlug: string }> }) {
  const { domainSlug } = React.use(params);
  const { user, refreshUser } = useAuth();
  const [domain, setDomain] = useState<Domain | null>(null);
  const [categories, setCategories] = useState<DomainCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [d, cats] = await Promise.all([
          fetchDomain(domainSlug),
          fetchCategoriesForDomain(domainSlug),
        ]);
        setDomain(d);
        setCategories(cats);

        // If user is logged in, sync this as their primary domain
        if (user && d?.id) {
          import('@/lib/api-client').then(m => {
            m.default.post(`/dashboard/primary-domain/${d.id}`).then(() => {
              refreshUser();
            }).catch(console.error);
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [domainSlug, user]);

  if (loading) return (
    <div className="container py-20 max-w-4xl mx-auto space-y-8">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-20 w-2/3 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
      </div>
    </div>
  );

  if (!domain) return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Domain not found.
    </div>
  );

  const totalStacks = categories.reduce((acc, c) => acc + c.stacks.length, 0);
  const totalQs = categories.reduce((acc, c) => acc + c.stacks.reduce((s, st) => s + st.questionCount, 0), 0);

  const benefits = [
    "Structured interview preparation",
    "Practice real technical questions",
    "Understand what interviewers look for",
    "Build confidence with guided answers",
    "Track your progress across stacks",
  ];

  const tips = [
    { icon: "🎯", text: "Expand any stack, skim questions, then open ones you don't know." },
    { icon: "🧠", text: "Read the Speakable Answer section first to get a quick mental model." },
    { icon: "⚡", text: "Focus on medium difficulty questions — they appear most in interviews." },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-slate-800 selection:bg-blue-200">
      <div className="max-w-[1300px] mx-auto bg-white min-h-screen shadow-sm border-x border-slate-100 flex">
        
        {/* ─── MAIN COLUMN ─── */}
        <main className="flex-1 min-w-0 px-6 sm:px-10 py-10">
          <Link href="/domains"
            className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-400 hover:text-[#2e64e5] mb-8 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            All Paths
          </Link>

          {/* Domain Intro Block */}
          <header className="mb-10 rounded-[12px] border border-slate-200 bg-[#f8f9fa] px-6 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex flex-wrap gap-2 mb-3">
              {domain.language && (
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-blue-50 text-[#2e64e5] border border-blue-100">
                  {domain.language}
                </span>
              )}
              {domain.track && (
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                  {domain.track}
                </span>
              )}
              {domain.experienceLabel && (
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-amber-50 text-amber-600 border border-amber-100">
                  {domain.experienceLabel}
                </span>
              )}
            </div>
            
            <h1 className="text-[1.8rem] font-bold tracking-tight text-slate-900 mb-2">
              {domain.name}
            </h1>
            
            {domain.description ? (
              <p className="text-[14px] text-slate-600 leading-[1.6]">
                {domain.description}
              </p>
            ) : (
              <p className="text-[14px] text-slate-600 leading-[1.6]">
                Master the core concepts and advanced topics required to excel in {domain.name} interviews.
              </p>
            )}

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
                <Layers className="h-3.5 w-3.5 text-slate-400" />
                <span><strong className="text-slate-700">{totalStacks}</strong> stacks</span>
              </div>
              <div className="h-3 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
                <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                <span><strong className="text-slate-700">{totalQs}</strong> questions total</span>
              </div>
              {domain.experienceLabel && (
                <>
                  <div className="h-3 w-px bg-slate-200" />
                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
                    <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
                    <span>{domain.experienceLabel} level</span>
                  </div>
                </>
              )}
            </div>
          </header>

          {/* Categories and Stacks */}
          <div className="space-y-10 pb-16">
            {categories.map((category) => (
              <section key={category.id}>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-[15px] font-bold text-slate-900 tracking-tight flex items-center gap-2 whitespace-nowrap">
                    <div className="w-2 h-2 rounded-full bg-[#2e64e5]" />
                    {category.name}
                  </h2>
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">{category.stacks.length} Stacks</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  {category.stacks.map((stack, idx) => (
                    <StackAccordion key={stack.id} domainSlug={domainSlug} stack={stack} index={idx} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-20 text-slate-500 bg-slate-50 rounded-[12px] border border-slate-100">
              <p className="text-[14px]">No stacks found for this domain yet.</p>
            </div>
          )}
        </main>

        {/* ─── RIGHT SIDEBAR ─── */}
        <aside className="hidden xl:flex w-[320px] shrink-0 flex-col gap-5 sticky top-0 h-screen overflow-y-auto py-10 pr-7 pl-2">


          {/* Quick Stats — FIRST (most important) */}
          <div className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              At a Glance
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-blue-50 rounded-[10px] p-3 border border-blue-100">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#2e64e5] mb-1">Stacks</div>
                <div className="text-[1.4rem] font-bold text-slate-800 leading-none">{totalStacks}</div>
              </div>
              <div className="bg-emerald-50 rounded-[10px] p-3 border border-emerald-100">
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Questions</div>
                <div className="text-[1.4rem] font-bold text-slate-800 leading-none">{totalQs}</div>
              </div>
            </div>
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              {domain?.experienceLabel && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-500 font-medium">Level</span>
                  <span className="font-bold text-slate-800">{domain.experienceLabel}</span>
                </div>
              )}
              {domain?.language && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-500 font-medium">Language</span>
                  <span className="font-bold text-slate-800">{domain.language}</span>
                </div>
              )}
              {domain?.track && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-500 font-medium">Track</span>
                  <span className="font-bold text-slate-800">{domain.track}</span>
                </div>
              )}
            </div>
          </div>

          {/* About this Path — SECOND */}
          <div className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-[#2e64e5]" />
              About this Path
            </h3>
            <p className="text-[13px] text-slate-600 leading-[1.6] mb-4">
              {domain?.description
                ? domain.description
                : `This path is curated specifically for ${domain?.name} interview preparation. Work through each stack sequentially to build solid fundamentals.`}
            </p>
            <div className="space-y-2">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[13px] text-slate-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How to Use This Page */}
          <div className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-[#2e64e5]" />
              How to Study
            </h3>
            <div className="space-y-3.5">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[15px] leading-none mt-0.5">{tip.icon}</span>
                  <p className="text-[12.5px] text-slate-600 leading-[1.55]">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-800 mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link href="/domains" className="flex items-center justify-between text-[13px] font-medium text-slate-600 hover:text-[#2e64e5] transition-colors py-1.5 border-b border-slate-50 last:border-0">
                <span>Browse All Paths</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link href="/dashboard" className="flex items-center justify-between text-[13px] font-medium text-slate-600 hover:text-[#2e64e5] transition-colors py-1.5 border-b border-slate-50 last:border-0">
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

function StackAccordion({ domainSlug, stack, index }: { domainSlug: string; stack: TechStack; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState<QuestionSummary[]>([]);
  const [loadingQs, setLoadingQs] = useState(false);

  useEffect(() => {
    if (isOpen && questions.length === 0) {
      setLoadingQs(true);
      fetchQuestionsForStack(stack.slug)
        .then(setQuestions)
        .catch(console.error)
        .finally(() => setLoadingQs(false));
    }
  }, [isOpen, stack.slug, questions.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`border rounded-[12px] transition-all duration-300 overflow-hidden ${
        isOpen ? "border-[#2e64e5]/30 shadow-md ring-1 ring-[#2e64e5]/5 bg-white" : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md bg-[#f8f9fa]"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-5 text-left hover:bg-slate-50/50 transition-colors focus:outline-none group"
        >
          <div className="flex-1 pr-4 flex gap-3 items-start sm:items-center mb-3 sm:mb-0">
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isOpen ? "bg-[#2e64e5]/10 text-[#2e64e5]" : "bg-white border border-slate-200 text-slate-400 group-hover:bg-[#2e64e5]/5 group-hover:text-[#2e64e5]"
            }`}>
              <Layers className="h-3.5 w-3.5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-800 tracking-tight group-hover:text-[#2e64e5] transition-colors leading-tight mb-0.5">
                {stack.name}
              </h3>
              {stack.description && (
                <p className="text-[13px] text-slate-500 leading-snug line-clamp-1">
                  {stack.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 pl-11 sm:pl-0">
            <div className="flex flex-col sm:items-end gap-0.5 hidden sm:flex">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total</span>
              <span className="text-[12px] font-semibold text-slate-600">{stack.questionCount} Qs</span>
            </div>
          </div>
        </button>

        {/* Dedicated "Go to Stack" action area (separated from accordion toggle logic) */}
        <div className="flex items-center gap-2 p-4 pt-0 sm:pt-4 sm:pl-0 sm:border-l-0 border-slate-100 bg-inherit shrink-0">
          <Link 
            href={`/${domainSlug}/${stack.slug}`} 
            className="flex items-center justify-center h-8 px-3 rounded-md bg-white border border-slate-200 text-[#2e64e5] text-[11px] font-bold uppercase tracking-wider hover:border-[#2e64e5] hover:bg-[#2e64e5]/5 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2e64e5]/30 group/btn"
          >
            Start <ChevronRight className="h-3.5 w-3.5 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#2e64e5]/30 ${
              isOpen ? "border-[#2e64e5] bg-[#2e64e5] text-white" : "border-slate-200 bg-white text-slate-400 hover:border-[#2e64e5]/30 hover:text-[#2e64e5]"
            }`}
          >
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-100 bg-white">
          {loadingQs ? (
             <div className="p-6 flex items-center justify-center gap-2 text-slate-400 text-[13px] font-medium animate-pulse">
               <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animation-delay-100"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animation-delay-200"></div>
             </div>
          ) : questions.length > 0 ? (
             <div className="relative py-3 px-3 sm:px-4">
               {/* Vertical timeline line */}
               <div className="absolute left-[34px] top-6 bottom-6 w-px bg-slate-100 hidden sm:block"></div>
               
               <div className="flex flex-col gap-1.5 relative z-10">
                 {questions.map((q, idx) => (
                    <Link 
                      key={q.id} 
                      href={`/${domainSlug}/${stack.slug}/${q.slug}`}
                      className="group/link flex flex-col sm:flex-row sm:items-center justify-between p-2.5 sm:pr-4 rounded-[8px] hover:bg-[#f8f9fa] transition-all duration-200"
                    >
                       <div className="flex items-start sm:items-center gap-3 mb-2 sm:mb-0 max-w-full overflow-hidden">
                          <div className="shrink-0 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-400 group-hover/link:border-[#2e64e5] group-hover/link:text-[#2e64e5] shadow-sm transition-all sm:ml-2">
                             {idx + 1}
                          </div>
                          <h4 className="text-[13.5px] font-medium text-slate-700 group-hover/link:text-slate-900 transition-colors leading-tight truncate">
                            {q.title}
                          </h4>
                       </div>
                       
                       <div className="flex items-center gap-3 pl-8 sm:pl-0 shrink-0 opacity-80 group-hover/link:opacity-100 transition-opacity">
                          <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded text-white shadow-sm"
                             style={{ backgroundColor: difficultyColor(q.difficulty) }}
                          >
                             {difficultyLabel(q.difficulty)}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 min-w-[45px]">
                             <Clock className="w-3 h-3 text-slate-400" />
                             {q.estimatedReadTime || 5}m
                          </span>
                       </div>
                    </Link>
                 ))}
               </div>
               
               <div className="mt-3 text-center border-t border-slate-100 pt-3">
                  <Link href={`/${domainSlug}/${stack.slug}`} className="text-[#2e64e5] hover:text-blue-700 text-[12px] font-bold tracking-wide flex items-center justify-center gap-1 group/more">
                    See Full Stack Page <ChevronRight className="h-3.5 w-3.5 group-hover/more:translate-x-0.5 transition-transform" />
                  </Link>
               </div>
             </div>
          ) : (
             <div className="p-6 text-center text-slate-400 text-[13px]">No questions available.</div>
          )}
        </div>
      )}
    </motion.div>
  );
}
