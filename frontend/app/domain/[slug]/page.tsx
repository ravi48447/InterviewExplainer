"use client";

import React, { useEffect, useState } from "react";
import {
  fetchDomain,
  fetchCategoriesForDomain,
  Domain,
  DomainCategory,
  TechStack,
} from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Layers, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function DomainPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [domain, setDomain] = useState<Domain | null>(null);
  const [categories, setCategories] = useState<DomainCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [d, cats] = await Promise.all([
          fetchDomain(slug),
          fetchCategoriesForDomain(slug),
        ]);
        setDomain(d);
        setCategories(cats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary),0.06),transparent_70%)] pointer-events-none" />

      <main className="relative z-10 container py-20 max-w-5xl mx-auto px-6">
        <Link href="/domains"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary mb-12 transition-all group">
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          All Paths
        </Link>

        <header className="mb-16">
          <div className="flex flex-wrap gap-2 mb-4">
            {domain.language && (
              <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {domain.language}
              </span>
            )}
            {domain.track && (
              <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 text-muted-foreground border border-white/10">
                {domain.track}
              </span>
            )}
            {domain.experienceLabel && (
              <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 text-muted-foreground border border-white/10">
                {domain.experienceLabel}
              </span>
            )}
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-4">
            {domain.name}
          </h1>
          {domain.description && (
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              {domain.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-muted-foreground/50">
            <Layers className="h-3.5 w-3.5" />
            <span>{categories.reduce((acc, c) => acc + c.stacks.length, 0)} tech stacks</span>
          </div>
        </header>

        <div className="space-y-16">
          {categories.map((category) => (
            <section key={category.id}>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary/80 whitespace-nowrap">
                  {category.name}
                </h2>
                <div className="h-px w-full bg-white/5" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {category.stacks.map((stack, idx) => (
                  <StackCard key={stack.id} stack={stack} index={idx} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-sm">No stacks found for this domain yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function StackCard({ stack, index }: { stack: TechStack; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/stack/${stack.slug}`}>
        <div className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-300 h-full flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors mb-2">
              {stack.name}
            </h3>
            {stack.description && (
              <p className="text-xs text-muted-foreground/60 leading-relaxed line-clamp-2">
                {stack.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/50">
              <BookOpen className="h-3 w-3" />
              <span>{stack.questionCount} questions</span>
            </div>
            <ChevronRight className="h-4 w-4 text-primary/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
