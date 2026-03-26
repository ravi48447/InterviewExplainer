"use client";

import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Database,
    Code2,
    Activity,
    GitCommit,
    Target,
    Zap,
    Trophy,
    Search,
    Lock,
    Globe,
    MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroDashboardVisual() {
    return (
        <div className="relative w-full h-full min-h-[500px] flex items-center justify-center perspective-[2000px]">

            {/* 3D Mac Window Container */}
            <motion.div
                initial={{ rotateX: 10, rotateY: -15, rotateZ: 2, scale: 0.9 }}
                animate={{
                    rotateX: [10, 12, 10],
                    rotateY: [-15, -12, -15],
                    rotateZ: [2, 1, 2]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-[520px] md:w-[680px] aspect-[16/10] bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden flex flex-col border border-white/5 ring-1 ring-white/10"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Mac Window Header / Browser Bar */}
                <div className="h-10 bg-[#2d2d2d] flex items-center px-4 border-b border-white/5 shrink-0 gap-4">
                    {/* Traffic Lights */}
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                        <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                    </div>

                    {/* Address Bar */}
                    <div className="flex-1 max-w-sm mx-auto h-7 bg-[#1e1e1e] rounded-md flex items-center px-3 gap-2 text-[10px] text-muted-foreground border border-white/5 shadow-inner">
                        <Lock className="w-2.5 h-2.5 opacity-50" />
                        <span className="opacity-80 font-medium">interviewexplainer.com/dashboard</span>
                    </div>

                    <div className="w-12 flex justify-end">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground/40" />
                    </div>
                </div>

                {/* Dashboard Body */}
                <div className="flex-1 bg-[#0F0F12] p-4 md:p-6 overflow-hidden relative">
                    {/* Subtle Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                    {/* Main Content Grid */}
                    <div className="relative z-10 grid grid-cols-4 grid-rows-3 gap-4 h-full">

                        {/* Profile & Main Stats (Large Card) */}
                        <div className="col-span-2 row-span-1 bg-[#1A1A1E] rounded-lg border border-white/5 p-4 flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Current Track</div>
                                    <h2 className="text-xl font-bold text-white mb-1">Java Fullstack</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold border border-primary/20">1 - 3 Yrs</span>
                                        <span className="text-[10px] text-muted-foreground">Level 2 / 5</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                    <Database className="w-5 h-5 text-indigo-400" />
                                </div>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "65%" }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                    className="h-full bg-primary"
                                />
                            </div>
                        </div>

                        {/* Skill Radar / Stats (Small Card) */}
                        <div className="col-span-1 row-span-1 bg-[#1A1A1E] rounded-lg border border-white/5 p-3 flex flex-col items-center justify-center relative">
                            <div className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mb-2">Skill Balance</div>
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
                                <div className="absolute inset-2 border-2 border-white/5 rounded-full" />
                                <Zap className="w-6 h-6 text-yellow-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute top-0 left-1/2 w-1 h-1 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute bottom-1 right-2 w-1 h-1 bg-green-400 rounded-full" />
                                <div className="absolute top-4 left-1 w-1 h-1 bg-blue-400 rounded-full" />
                            </div>
                        </div>

                        {/* Velocity / Streak (Small Card) */}
                        <div className="col-span-1 row-span-1 bg-[#1A1A1E] rounded-lg border border-white/5 p-3 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <Activity className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] text-emerald-400 font-bold">+12%</span>
                            </div>
                            <div className="text-[20px] font-bold text-white">850</div>
                            <div className="text-[9px] text-muted-foreground">Weekly XP</div>
                            <div className="flex gap-0.5 items-end h-4 mt-1">
                                {[40, 70, 50, 90, 60, 80, 95].map((h, i) => (
                                    <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 1 + i * 0.1 }} className="w-1 bg-emerald-500/50 rounded-t-[1px]" />
                                ))}
                            </div>
                        </div>


                        {/* Coding Activity Heatmap (Large Bottom Card) */}
                        <div className="col-span-2 row-span-1 bg-[#1A1A1E] rounded-lg border border-white/5 p-4 flex flex-col">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Contribution Graph</span>
                                <div className="flex gap-1 text-[8px] text-muted-foreground">
                                    <span>Less</span>
                                    <div className="w-2 h-2 bg-[#2d2d2d] rounded-[1px]" />
                                    <div className="w-2 h-2 bg-primary/40 rounded-[1px]" />
                                    <div className="w-2 h-2 bg-primary rounded-[1px]" />
                                    <span>More</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-10 gap-1 h-full">
                                {Array.from({ length: 40 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        className={cn(
                                            "rounded-[2px] w-full h-full",
                                            Math.random() > 0.7 ? "bg-primary" : Math.random() > 0.4 ? "bg-primary/30" : "bg-[#2d2d2d]"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>


                        {/* Domain Mastery (Vertical Card) */}
                        <div className="col-span-1 row-span-2 bg-[#1A1A1E] rounded-lg border border-white/5 p-3 flex flex-col gap-3">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider text-center">Mastery</span>
                            <div className="flex-1 flex flex-col gap-2 justify-center">
                                {['System Design', 'Concurrency', 'JVM Internals', 'Microservices'].map((skill, i) => (
                                    <div key={skill} className="space-y-1">
                                        <div className="flex justify-between text-[9px] text-gray-400">
                                            <span>{skill}</span>
                                            <span>{85 - i * 10}%</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${85 - i * 10}%` }}
                                                transition={{ duration: 1, delay: 0.8 + i * 0.2 }}
                                                className={cn("h-full rounded-full",
                                                    i === 0 ? "bg-cyan-400" :
                                                        i === 1 ? "bg-purple-400" :
                                                            i === 2 ? "bg-orange-400" : "bg-blue-400"
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mock Interview Score (Small Card) */}
                        <div className="col-span-1 row-span-1 bg-[#1A1A1E] rounded-lg border border-white/5 p-3 flex flex-col items-center justify-center">
                            <Trophy className="w-5 h-5 text-yellow-500 mb-1" />
                            <div className="text-2xl font-black text-white">9/10</div>
                            <span className="text-[8px] text-muted-foreground uppercase tracking-wider">Mock Score</span>
                        </div>

                        {/* Time Spent (Small Bottom Card) */}
                        <div className="col-span-1 row-span-1 bg-[#1A1A1E] rounded-lg border border-white/5 p-3 flex items-center justify-between relative overflow-hidden">
                            <div className="z-10">
                                <span className="text-[9px] text-muted-foreground block">Hours</span>
                                <span className="text-xl font-bold text-white">124</span>
                            </div>
                            <div className="absolute right-0 bottom-0 w-12 h-12">
                                <svg viewBox="0 0 24 24" className="w-full h-full text-blue-500/20 fill-current">
                                    <path d="M0 20 L5 15 L10 18 L15 10 L20 14 L24 20 Z" />
                                </svg>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Reflection/Shine Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            </motion.div>
        </div>
    );
}
