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
                    <div className="w-full h-full bg-surface border border-default p-5 overflow-hidden relative">

                        {/* Mac Window Header */}
                        <div className="h-8 dark:bg-surface/50 backdrop-blur-sm rounded-t-lg flex items-center px-3 mb-3 gap-3 border-b border-border/50">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500 dark:bg-red-800" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 dark:bg-yellow-800" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 dark:bg-green-800" />
                            </div>
                            <div className="flex-1 max-w-sm mx-auto h-6 bg-slate-100 dark:bg-slate-800/50 rounded-md flex items-center px-3 gap-2 text-xs text-muted-foreground">
                                <Lock className="w-3 h-3 text-emerald-500 dark:text-emerald-300" />
                                <span className="font-medium text-foreground dark:text-muted-foreground">interviewexplainer.com</span>
                                <span className="text-muted-foreground">/dashboard</span>
                            </div>
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </div>

                        {/* Dashboard Content */}
                        <div className="h-[calc(100%-56px)] grid grid-cols-12 gap-3">

                            {/* Left Sidebar - User Info */}
                            <div className="col-span-3 space-y-3">
                                {/* Welcome Card */}
                                <div className="bg-surface border border-border/50 rounded-lg p-3">
                                    <div className="text-[9px] text-muted-foreground uppercase tracking-wide mb-1">Welcome Back,</div>
                                    <div className="text-lg font-bold text-foreground mb-2">Dear User</div>
                                    <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                                        <span className="px-2 py-0.5 bg-blue-500 dark:bg-blue-800/20 text-white dark:text-primary rounded border border-default dark:border-default/30 font-semibold">Java Backend</span>
                                        <span>1-3 Yrs</span>
                                    </div>
                                </div>

                                {[
                                    { label: 'Questions', value: '247', icon: Target, iconClass: 'text-blue-500' },
                                    { label: 'Study Time', value: '42h', icon: Clock, iconClass: 'text-blue-500' },
                                    { label: 'Accuracy', value: '85%', icon: Award, iconClass: 'text-emerald-500' },
                                    { label: 'Streak', value: '12d', icon: Zap, iconClass: 'text-amber-500' }
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.05 }}
                                        className="bg-card border border-border/50 rounded-lg p-2.5 hover:border-blue-500/30 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5">{stat.label}</div>
                                                <div className="text-xl font-bold text-foreground">{stat.value}</div>
                                            </div>
                                            <stat.icon className={`w-7 h-7 ${stat.iconClass} opacity-80`} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Main Content - Analytics */}
                            <div className="col-span-9 space-y-3">

                                {/* Top Row - Activity & Performance */}
                                <div className="grid grid-cols-2 gap-3 h-[45%]">
                                    {/* Weekly Activity */}
                                    <div className="bg-card border border-border/50 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Weekly Activity</div>
                                            <div className="flex items-center gap-1 text-[9px] text-emerald-500 dark:text-emerald-300 font-semibold">
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
                                                    className="flex-1 bg-primary/90 border-primary dark:bg-primary dark:border-primary border rounded-t hover:opacity-80 transition-opacity"
                                                />
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-[8px] text-muted-foreground">
                                            <span>14 days ago</span>
                                            <span>Today</span>
                                        </div>
                                    </div>

                                    {/* Difficulty Breakdown */}
                                    <div className="bg-card border border-border/50 rounded-lg p-3">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-3">Performance by Difficulty</div>
                                        <div className="space-y-2.5">
                                            {[
                                                { level: 'Easy', solved: 120, total: 135, percent: 89, dotClass: 'bg-emerald-500', barClass: 'bg-emerald-500' },
                                                { level: 'Medium', solved: 95, total: 140, percent: 68, dotClass: 'bg-amber-500', barClass: 'bg-amber-500' },
                                                { level: 'Hard', solved: 32, total: 85, percent: 38, dotClass: 'bg-red-500', barClass: 'bg-red-500' }
                                            ].map((item, i) => (
                                                <div key={item.level}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${item.dotClass}`} />
                                                            <span className="text-[11px] font-semibold text-foreground dark:text-muted-foreground">{item.level}</span>
                                                        </div>
                                                        <div className="text-[11px] text-muted-foreground">
                                                            <span className="font-bold text-foreground dark:text-muted-foreground">{item.solved}</span>/{item.total}
                                                        </div>
                                                    </div>
                                                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
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
                                    <div className="bg-card border border-border/50 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Technology Stack</div>
                                            <Code2 className="w-4 h-4 text-primary dark:text-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                                { name: 'Spring Boot', domain: 'Framework', score: 92, color: 'from-emerald-400 to-emerald-500' },
                                                { name: 'Microservices', domain: 'Architecture', score: 88, color: 'from-blue-400 to-blue-500' },
                                                { name: 'PostgreSQL', domain: 'Database', score: 85, color: 'from-blue-400 to-blue-500' },
                                                { name: 'Docker', domain: 'DevOps', score: 78, color: 'from-slate-400 to-slate-500' },
                                                { name: 'AWS', domain: 'Cloud', score: 72, color: 'from-amber-400 to-amber-500' }
                                            ].map((skill, i) => (
                                                <div key={skill.name}>
                                                    <div className="flex justify-between text-[9px] mb-0.5">
                                                        <div>
                                                            <span className="text-foreground dark:text-muted-foreground font-semibold">{skill.name}</span>
                                                            <span className="text-muted-foreground ml-1.5">• {skill.domain}</span>
                                                        </div>
                                                        <span className="text-foreground dark:text-muted-foreground font-bold">{skill.score}%</span>
                                                    </div>
                                                    <div className="h-1 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
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
                                    <div className="bg-card border border-border/50 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Recent Activity</div>
                                            <Activity className="w-4 h-4 text-primary dark:text-primary" />
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
                                                    className="flex items-start gap-2 p-1.5 rounded hover:bg-surface transition-colors"
                                                >
                                                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${activity.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[9px] font-medium text-foreground dark:text-muted-foreground truncate">{activity.title}</div>
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
                <div className="h-3 bg-surface border border-default rounded-b-2xl shadow-2xl" style={{ transform: "rotateX(-5deg) translateZ(-10px)" }}></div>
                <div className="h-1 bg-slate-950 dark:bg-slate-800 rounded-b-3xl mx-12" style={{ transform: "rotateX(-5deg) translateZ(-12px)" }}></div>
            </motion.div>
        </div>
    );
}