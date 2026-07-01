"use client";

import { motion } from "framer-motion";
import { Lock, MoreHorizontal, TrendingUp, TrendingDown, Activity, Code2, Target, Clock, Award, Zap } from "lucide-react";

export function HeroDashboardVisual() {
    return (
        <div className="relative w-full h-full min-h-[600px] flex items-center justify-center perspective-[2000px]">
            {/* Mac Laptop - 3D Effect */}
            <motion.div
                initial={{ rotateX: 15, rotateY: -8, scale: 0.88, opacity: 0 }}
                animate={{
                    rotateX: [15, 18, 15],
                    rotateY: [-8, -5, -8],
                    opacity: 1
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", opacity: { duration: 0.8 } }}
                className="relative"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Mac Screen Bezel */}
                <div className="relative w-[750px] h-[470px] bg-slate-950 dark:bg-slate-800 rounded-[18px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border-[10px] border-slate-950 dark:border-slate-700">
                    {/* Inner Screen - Dark Dashboard */}
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 overflow-hidden relative">

                        {/* Mac Window Header */}
                        <div className="h-8 dark:bg-surface/50 backdrop-blur-sm rounded-t-lg flex items-center px-3 mb-3 gap-3 border-b border-border/50">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500 dark:bg-red-800" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 dark:bg-yellow-800" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 dark:bg-green-800" />
                            </div>
                            <div className="flex-1 max-w-sm mx-auto h-6 bg-slate-700 dark:bg-slate-800/50 rounded-md flex items-center px-3 gap-2 text-xs text-muted-foreground">
                                <Lock className="w-3 h-3 text-emerald-400 dark:text-emerald-300" />
                                <span className="font-medium text-muted-foreground">interviewexplainer.com</span>
                                <span className="text-muted-foreground">/dashboard</span>
                            </div>
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </div>

                        {/* Dashboard Content */}
                        <div className="h-[calc(100%-56px)] grid grid-cols-12 gap-3">

                            {/* Left Sidebar - User Info */}
                            <div className="col-span-3 space-y-3">
                                {/* Welcome Card */}
                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-border/50 rounded-lg p-3">
                                    <div className="text-[9px] text-muted-foreground uppercase tracking-wide mb-1">Welcome Back,</div>
                                    <div className="text-lg font-bold text-white mb-2">Dear User</div>
                                    <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                                        <span className="px-2 py-0.5 bg-indigo-500 dark:bg-indigo-800/20 text-white dark:text-indigo-300 rounded border border-indigo-500 dark:border-indigo-700/30 font-semibold">Java Backend</span>
                                        <span>1-3 Yrs</span>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                {[
                                    { label: 'Questions', value: '247', icon: Target, iconClass: 'text-indigo-400 dark:text-indigo-300' },
                                    { label: 'Study Time', value: '42h', icon: Clock, iconClass: 'text-blue-400 dark:text-blue-300' },
                                    { label: 'Accuracy', value: '85%', icon: Award, iconClass: 'text-emerald-400 dark:text-emerald-300' },
                                    { label: 'Streak', value: '12d', icon: Zap, iconClass: 'text-orange-400 dark:text-orange-300' }
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.05 }}
                                        className="dark:bg-surface/50 border border-border/50 rounded-lg p-2.5 hover:dark:bg-surface transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5">{stat.label}</div>
                                                <div className="text-xl font-bold text-white">{stat.value}</div>
                                            </div>
                                            <stat.icon className={`w-7 h-7 ${stat.iconClass} opacity-60`} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Main Content - Analytics */}
                            <div className="col-span-9 space-y-3">

                                {/* Top Row - Activity & Performance */}
                                <div className="grid grid-cols-2 gap-3 h-[45%]">
                                    {/* Weekly Activity */}
                                    <div className="dark:bg-surface/50 border border-border/50 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Weekly Activity</div>
                                            <div className="flex items-center gap-1 text-[9px] text-emerald-400 dark:text-emerald-300 font-semibold">
                                                <TrendingUp className="w-3 h-3" />
                                                +24%
                                            </div>
                                        </div>
                                        <div className="flex items-end gap-1 h-[calc(100%-50px)] mb-2">
                                            {[32, 48, 38, 62, 45, 68, 58, 52, 75, 55, 70, 80, 65, 85].map((h, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ delay: 0.5 + i * 0.02, duration: 0.4 }}
                                                    className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-50 dark:to-indigo-950/400 rounded-t hover:from-indigo-50 dark:from-indigo-950/400 hover:to-indigo-400 transition-all"
                                                />
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-[8px] text-muted-foreground">
                                            <span>14 days ago</span>
                                            <span>Today</span>
                                        </div>
                                    </div>

                                    {/* Difficulty Breakdown */}
                                    <div className="dark:bg-surface/50 border border-border/50 rounded-lg p-3">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-3">Performance by Difficulty</div>
                                        <div className="space-y-2.5">
                                            {[
                                                { level: 'Easy', solved: 120, total: 135, percent: 89, dotClass: 'bg-emerald-400 dark:bg-emerald-800', barClass: 'bg-emerald-500 dark:bg-emerald-800' },
                                                { level: 'Medium', solved: 95, total: 140, percent: 68, dotClass: 'bg-amber-400 dark:bg-amber-800', barClass: 'bg-amber-500 dark:bg-amber-800' },
                                                { level: 'Hard', solved: 32, total: 85, percent: 38, dotClass: 'bg-red-400 dark:bg-red-800', barClass: 'bg-red-500 dark:bg-red-800' }
                                            ].map((item, i) => (
                                                <div key={item.level}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${item.dotClass}`} />
                                                            <span className="text-[11px] font-semibold text-muted-foreground">{item.level}</span>
                                                        </div>
                                                        <div className="text-[11px] text-muted-foreground">
                                                            <span className="font-bold text-muted-foreground">{item.solved}</span>/{item.total}
                                                        </div>
                                                    </div>
                                                    <div className="h-1.5 bg-slate-700 dark:bg-slate-800/50 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${item.percent}%` }}
                                                            transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                                                            className={`h-full ${item.barClass} rounded-full`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Row - Skills & Recent */}
                                <div className="grid grid-cols-2 gap-3 h-[52%]">
                                    {/* Top Skills */}
                                    <div className="dark:bg-surface/50 border border-border/50 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Technology Stack</div>
                                            <Code2 className="w-4 h-4 text-indigo-400 dark:text-indigo-300" />
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                                { name: 'Spring Boot', domain: 'Framework', score: 92, color: 'from-green-50 dark:from-green-950/400 to-emerald-600' },
                                                { name: 'Microservices', domain: 'Architecture', score: 88, color: 'from-blue-50 dark:from-blue-950/400 to-cyan-600' },
                                                { name: 'PostgreSQL', domain: 'Database', score: 85, color: 'from-purple-50 dark:from-purple-950/400 to-pink-600' },
                                                { name: 'Docker', domain: 'DevOps', score: 78, color: 'from-indigo-50 dark:from-indigo-950/400 to-blue-600' },
                                                { name: 'AWS', domain: 'Cloud', score: 72, color: 'from-orange-50 dark:from-orange-950/400 to-red-600' }
                                            ].map((skill, i) => (
                                                <div key={skill.name}>
                                                    <div className="flex justify-between text-[9px] mb-0.5">
                                                        <div>
                                                            <span className="text-muted-foreground font-semibold">{skill.name}</span>
                                                            <span className="text-muted-foreground ml-1.5">• {skill.domain}</span>
                                                        </div>
                                                        <span className="text-muted-foreground font-bold">{skill.score}%</span>
                                                    </div>
                                                    <div className="h-1 bg-slate-700 dark:bg-slate-800/50 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${skill.score}%` }}
                                                            transition={{ delay: 0.8 + i * 0.08, duration: 0.6 }}
                                                            className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div className="dark:bg-surface/50 border border-border/50 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Recent Activity</div>
                                            <Activity className="w-4 h-4 text-indigo-400 dark:text-indigo-300" />
                                        </div>
                                        <div className="space-y-1.5">
                                            {[
                                                { title: 'Spring Boot Annotations', domain: 'Java Backend', time: '5m ago', status: 'completed' },
                                                { title: 'Microservice Design Patterns', domain: 'Architecture', time: '18m ago', status: 'completed' },
                                                { title: 'API Gateway Implementation', domain: 'Spring Cloud', time: '1h ago', status: 'in-progress' },
                                                { title: 'Database Indexing Strategies', domain: 'PostgreSQL', time: '2h ago', status: 'completed' },
                                                { title: 'Docker Multi-Stage Builds', domain: 'DevOps', time: '3h ago', status: 'completed' },
                                                { title: 'AWS Lambda Functions', domain: 'Cloud', time: '5h ago', status: 'in-progress' }
                                            ].map((activity, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.7 + i * 0.05 }}
                                                    className="flex items-start gap-2 p-1.5 rounded hover:bg-slate-700 dark:bg-slate-800/30 transition-colors"
                                                >
                                                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${activity.status === 'completed' ? 'bg-emerald-400 dark:bg-emerald-800' : 'bg-amber-400 dark:bg-amber-800'}`}></div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[9px] font-medium text-muted-foreground truncate">{activity.title}</div>
                                                        <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground">
                                                            <span className="text-muted-foreground">{activity.domain}</span>
                                                            <span>•</span>
                                                            <span>{activity.time}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mac Laptop Base */}
                <div className="h-3 bg-gradient-to-b from-slate-800 to-slate-900 rounded-b-2xl shadow-2xl" style={{ transform: "rotateX(-5deg) translateZ(-10px)" }}></div>
                <div className="h-1 bg-slate-950 dark:bg-slate-800 rounded-b-3xl mx-12" style={{ transform: "rotateX(-5deg) translateZ(-12px)" }}></div>
            </motion.div>
        </div>
    );
}