'use client';

import React from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Sparkles } from 'lucide-react';

export function SignupBanner() {
  const { user, loading } = useAuth();

  if (loading || user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 p-8 rounded-2xl bg-zinc-950 dark:bg-zinc-800 border border-zinc-800 dark:border-zinc-700 text-white overflow-hidden relative shadow-md"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 h-64 w-64 bg-zinc-800 dark:bg-zinc-800/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 h-64 w-64 bg-blue-500 dark:bg-blue-800/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 dark:bg-zinc-800 border border-zinc-800 dark:border-zinc-700 text-xs font-semibold text-zinc-300 dark:text-zinc-300">
            <Sparkles className="h-3 w-3 text-blue-400 dark:text-blue-300" />
            <span>Mastery Awaits</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Stop Studying, Start Mastering
          </h2>
          <p className="text-zinc-400 dark:text-zinc-300 text-lg leading-relaxed max-w-xl">
            Join 10,000+ developers tracking their path to top-tier companies. 
            Save questions, monitor progress, and get personalized recommendations.
          </p>
          
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-800 animate-pulse" />
              <span className="text-sm font-medium text-zinc-400 dark:text-zinc-300">Progress Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-800 animate-pulse" />
              <span className="text-sm font-medium text-zinc-400 dark:text-zinc-300">Saved Hotspots</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-800 animate-pulse" />
              <span className="text-sm font-medium text-zinc-400 dark:text-zinc-300">Smart Recommendations</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 w-full md:w-auto min-w-[200px]">
          <Link href="/signup">
            <Button className="w-full bg-white text-zinc-950 dark:text-zinc-400 hover:bg-zinc-100 dark:bg-zinc-950/20 font-semibold py-6 text-base shadow-sm">
              Start Your Journey
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="w-full text-zinc-400 dark:text-zinc-300 hover:text-white hover:bg-zinc-900 dark:bg-zinc-800 font-medium">
              Already a member? Sign In
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
