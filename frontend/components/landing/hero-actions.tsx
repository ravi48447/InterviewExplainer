"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/auth-context";
import { TrendingUp, Play, ChevronRight } from "lucide-react";

const SelectionWizard = dynamic(
  () => import("@/components/selection-wizard"),
  { ssr: false },
);

export function HeroActions() {
  const { user } = useAuth();
  const [showWizard, setShowWizard] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        {user ? (
          <Link
            href="/dashboard"
            className="group px-8 py-4 bg-surface border border-border text-foreground font-black text-base rounded-xl hover:shadow-2xl hover:shadow-sm hover:scale-105 transition-all duration-[250ms] ease-out flex items-center justify-center gap-2"
          >
            <TrendingUp className="h-5 w-5" />
            Go to Dashboard
          </Link>
        ) : (
          <button
            onClick={() => setShowWizard(true)}
            className="group px-8 py-4 bg-surface border border-border text-foreground font-black text-base rounded-xl hover:shadow-2xl hover:shadow-sm hover:scale-105 transition-all duration-[250ms] ease-out flex items-center justify-center gap-2"
          >
            <Play className="h-5 w-5" />
            Start Free Practice
          </button>
        )}
        <Link
          href="/domains"
          className="px-8 py-4 bg-background border-2 border-border text-foreground font-bold text-base rounded-xl hover:border-primary/50 dark:hover:border-primary/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:shadow-lg transition-all duration-[250ms] ease-out flex items-center justify-center gap-2"
        >
          Browse All Paths
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      {showWizard && <SelectionWizard onClose={() => setShowWizard(false)} />}
    </>
  );
}

export function FinalCTA() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center">
      {user ? (
        <Link
          href="/dashboard"
          className="px-10 py-5 bg-surface border border-border text-foreground font-black text-lg rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-sm transition-all duration-[250ms] ease-out"
        >
          Continue Learning →
        </Link>
      ) : (
        <Link
          href="/signup"
          className="px-10 py-5 bg-surface border border-border text-foreground font-black text-lg rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-sm transition-all duration-[250ms] ease-out"
        >
          Start Free Practice Now
        </Link>
      )}
      <Link
        href="/domains"
        className="px-10 py-5 bg-background border-2 border-border text-foreground font-bold text-lg rounded-xl hover:border-primary/50 dark:hover:border-primary/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:shadow-xl transition-all duration-[250ms] ease-out"
      >
        Browse All Domains
      </Link>
    </div>
  );
}
