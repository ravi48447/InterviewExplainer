"use client";

import { useAuth } from "@/context/auth-context";
import { SiteHeader } from "@/components/site-header";
import { motion } from "framer-motion";
import { User, Mail, Shield, Zap, Target } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        if (user) {
            apiClient.get('/dashboard/summary')
                .then(res => setStats(res.data))
                .catch(err => console.error("Failed to fetch profile stats", err));
        }
    }, [user]);

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
    if (!user) return <div className="min-h-screen bg-background flex items-center justify-center">Please login to view profile.</div>;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SiteHeader />
            <main className="container mx-auto px-4 py-24 mt-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="glass-strong rounded-[2.5rem] p-8 md:p-12 border-white/5 relative overflow-hidden mb-8">
                        {/* Background blobs */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] -z-10" />

                        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-xl shadow-primary/20">
                                <User className="h-16 w-16 text-black" />
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">{user.name}</h1>
                                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 text-lg">
                                    <Mail className="h-4 w-4" /> {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <Shield className="h-6 w-6 text-primary mb-4" />
                                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Status</div>
                                <div className="text-xl font-bold">Premium Beta</div>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <Zap className="h-6 w-6 text-yellow-400 mb-4" />
                                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">XP Points</div>
                                <div className="text-xl font-bold">{stats?.completedQuestions * 50 || 0} XP</div>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <Target className="h-6 w-6 text-purple-400 mb-4" />
                                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Questions Done</div>
                                <div className="text-xl font-bold">{stats?.completedQuestions || 0}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="glass rounded-[2rem] p-8 border-white/5">
                            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                            <div className="space-y-4">
                                <button className="w-full text-left px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                    Change Password
                                </button>
                                <button className="w-full text-left px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                    Email Preferences
                                </button>
                                <button className="w-full text-left px-6 py-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors border border-red-500/20">
                                    Deactivate Account
                                </button>
                            </div>
                        </section>

                        <section className="glass rounded-[2rem] p-8 border-white/5">
                            <h2 className="text-2xl font-bold mb-6">Learning Path</h2>
                            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
                                <div className="text-xs uppercase tracking-widest text-primary mb-2">Active Domain</div>
                                <div className="text-2xl font-black tracking-tight mb-4">
                                    {stats?.stackPerformance?.[0]?.label ? "Mastery Path Enabled" : "No Domain Selected"}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    You are currently specializing in your selected career track. Complete assessments to unlock higher tiers.
                                </p>
                            </div>
                        </section>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
