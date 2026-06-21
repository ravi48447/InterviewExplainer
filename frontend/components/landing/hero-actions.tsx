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
            className="group px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-lg rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <TrendingUp className="h-6 w-6" />
            Go to Dashboard
          </Link>
        ) : (
          <button
            onClick={() => setShowWizard(true)}
            className="group px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-lg rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <Play className="h-6 w-6" />
            Start Free Practice
          </button>
        )}
        <Link
          href="/domains"
          className="px-10 py-5 bg-white border-2 border-slate-300 text-slate-700 font-bold text-lg rounded-2xl hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          Browse All Paths
          <ChevronRight className="h-5 w-5" />
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
          className="px-12 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-xl rounded-2xl hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300"
        >
          Continue Learning →
        </Link>
      ) : (
        <Link
          href="/signup"
          className="px-12 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-xl rounded-2xl hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300"
        >
          Start Free Practice Now
        </Link>
      )}
      <Link
        href="/domains"
        className="px-12 py-6 bg-white border-2 border-slate-300 text-slate-700 font-bold text-xl rounded-2xl hover:border-blue-400 hover:bg-blue-50 hover:shadow-xl transition-all"
      >
        Browse All Domains
      </Link>
    </div>
  );
}
