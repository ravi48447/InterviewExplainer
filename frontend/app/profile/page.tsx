"use client";

import { useAuth } from "@/context/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { User, Mail, Shield, Zap, Target, BookOpen, Flame, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import Link from "next/link";
import { EXPERIENCE_LEVELS, LEVEL_KEYS, type ExperienceLevelKey, getSavedLevel, saveLevel } from "@/lib/levels";

function ProfileContent() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [selectedLevel, setSelectedLevel] = useState<ExperienceLevelKey>("intermediate");
    const [levelSaved, setLevelSaved] = useState(false);

    useEffect(() => {
        apiClient.get('/dashboard/summary')
            .then(res => setStats(res.data))
            .catch(err => console.error("Failed to fetch profile stats", err));
        setSelectedLevel(getSavedLevel());
    }, []);

    function handleLevelSave(level: ExperienceLevelKey) {
        saveLevel(level);
        setSelectedLevel(level);
        setLevelSaved(true);
        setTimeout(() => setLevelSaved(false), 2500);
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/20 py-12 px-4">
            <div className="w-full min-w-0 animate-fade-in-up">
                {/* Profile card */}
                <div className="bg-background rounded-3xl border border-border shadow-sm p-8 md:p-12 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-50 dark:from-blue-950/400 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <User className="h-12 w-12 text-white" />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-1">{user?.name}</h1>
                            <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                                <Mail className="h-4 w-4" /> {user?.email}
                            </p>
                            {stats?.primaryDomainName && (
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mt-1">
                                    {stats.primaryDomainName}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-5 rounded-2xl bg-surface border border-border text-center">
                            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Status</div>
                            <div className="text-sm font-black text-foreground">Beta User</div>
                        </div>
                        <div className="p-5 rounded-2xl bg-surface border border-border text-center">
                            <Zap className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mx-auto mb-2" />
                            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">XP Points</div>
                            <div className="text-sm font-black text-foreground">{(stats?.completedQuestions ?? 0) * 50} XP</div>
                        </div>
                        <div className="p-5 rounded-2xl bg-surface border border-border text-center">
                            <Target className="h-5 w-5 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Completed</div>
                            <div className="text-sm font-black text-foreground">{stats?.completedQuestions ?? 0}</div>
                        </div>
                        <div className="p-5 rounded-2xl bg-surface border border-border text-center">
                            <Flame className="h-5 w-5 text-orange-500 dark:text-orange-400 mx-auto mb-2" />
                            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Streak</div>
                            <div className="text-sm font-black text-foreground">{stats?.currentStreak ?? 0} days</div>
                        </div>
                    </div>
                </div>

                {/* Two-col layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stack performance */}
                    <div className="bg-background rounded-2xl border border-border shadow-sm p-6">
                        <h2 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            Stack Progress
                        </h2>
                        {stats?.stackPerformance && stats.stackPerformance.length > 0 ? (
                            <div className="space-y-3">
                                {stats.stackPerformance.slice(0, 5).map((sp: any, i: number) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs font-semibold text-foreground mb-1">
                                            <span>{sp.label}</span>
                                            <span>{sp.progress}%</span>
                                        </div>
                                        <div className="h-2 bg-surface rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-blue-50 dark:from-blue-950/400 to-indigo-600"
                                                style={{ width: `${sp.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground py-4 text-center">
                                No progress yet.{" "}
                                <Link href="/domains" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Start learning</Link>
                            </p>
                        )}
                    </div>

                    {/* Account settings */}
                    <div className="bg-background rounded-2xl border border-border shadow-sm p-6">
                        <h2 className="text-lg font-black text-foreground mb-4">Account Settings</h2>
                        <div className="space-y-3">
                            {/* ── Experience Level — the most important profile setting ── */}
                            <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-black text-foreground">Experience Level</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                    Every question answer is tuned to this level.
                                    Changing it redirects all content pages to your chosen depth.
                                </p>
                                <div className="flex gap-2 mb-3">
                                    {LEVEL_KEYS.map(key => {
                                        const meta = EXPERIENCE_LEVELS[key];
                                        const isSelected = selectedLevel === key;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => setSelectedLevel(key)}
                                                className={`flex-1 py-2 rounded-lg border-2 text-xs font-bold transition-all ${
                                                    isSelected
                                                        ? `${meta.colorClass} border-current shadow-sm`
                                                        : "border-border bg-background text-muted-foreground hover:border-border"
                                                }`}
                                            >
                                                <div>{meta.label}</div>
                                                <div className="opacity-70 font-normal">{meta.range}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                                {selectedLevel !== getSavedLevel() ? (
                                    <button
                                        onClick={() => handleLevelSave(selectedLevel)}
                                        className="w-full py-2 bg-blue-600 dark:bg-blue-800 text-white rounded-lg text-xs font-bold hover:bg-blue-700 dark:bg-blue-800 transition-colors"
                                    >
                                        Save — Apply to All Content
                                    </button>
                                ) : levelSaved ? (
                                    <div className="text-center text-xs text-emerald-600 dark:text-emerald-400 font-bold py-1">✓ Saved! Content will now serve {EXPERIENCE_LEVELS[selectedLevel].label} answers.</div>
                                ) : (
                                    <div className="text-center text-xs text-muted-foreground py-1">
                                        Current level: <strong>{EXPERIENCE_LEVELS[selectedLevel].label}</strong>
                                    </div>
                                )}
                            </div>

                            <Link
                                href="/forgot-password"
                                className="block px-4 py-3 rounded-xl bg-surface border border-border text-sm font-medium text-foreground hover:bg-surface transition-colors"
                            >
                                Change Password →
                            </Link>
                            <a
                                href="mailto:support@interviewexplainer.com?subject=Email Preferences"
                                className="block px-4 py-3 rounded-xl bg-surface border border-border text-sm font-medium text-foreground hover:bg-surface transition-colors"
                            >
                                Email Preferences — Contact Support
                            </a>
                            <Link
                                href="/domains"
                                className="block px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-sm font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:bg-blue-950/20 transition-colors"
                            >
                                Browse Learning Paths →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfileContent />
        </ProtectedRoute>
    );
}
