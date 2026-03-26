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
      className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500 text-white shadow-xl shadow-blue-500/20 overflow-hidden relative"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -tr-1/4 -translate-y-1/4 h-64 w-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-x-1/4 translate-y-1/4 h-64 w-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            <span>Mastery Awaits</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Stop Studying, Start Mastering
          </h2>
          <p className="text-blue-50 text-lg leading-relaxed max-w-xl">
            Join 10,000+ developers tracking their path to top-tier companies. 
            Save questions, monitor progress, and get personalized recommendations.
          </p>
          
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium text-blue-100">Progress Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-sm font-medium text-blue-100">Saved Hotspots</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-sm font-medium text-blue-100">Smart Recommendations</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 w-full md:w-auto min-w-[200px]">
          <Link href="/signup">
            <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-6 text-lg shadow-lg">
              Start Your Journey
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="w-full text-white hover:bg-white/10 font-medium">
              Already a member? Sign In
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
