"use client";

import { useState } from "react";
import { CheckCircle2, Target, Trophy, Clock, PlayCircle, BookCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface InterviewCoachProps {
    timeToAnswer: string;
    interviewerExpects: string;
}

export function InterviewCoach({ timeToAnswer, interviewerExpects }: InterviewCoachProps) {
    const [checklist, setChecklist] = useState([
        { id: 1, text: "Read the explanation", completed: false },
        { id: 2, text: "Understand core concepts", completed: false },
        { id: 3, text: "Review the code snippet", completed: false },
        { id: 4, text: "Practice speakable answer", completed: false },
    ]);

    const toggleCheck = (id: number) => {
        setChecklist(prev => prev.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const expectationLines = interviewerExpects.split('\n').filter(line => line.trim().startsWith('•'));
    const cleanExpectations = expectationLines.length > 0
        ? expectationLines.map(line => line.replace('•', '').trim())
        : [interviewerExpects];

    return (
        <div className="flex flex-col h-full glass border-l border-border/50 p-6 space-y-8 overflow-y-auto custom-scrollbar">
            {/* Target Response Time */}
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Target Response</span>
                </div>
                <p className="text-xl font-bold tracking-tight text-foreground">{timeToAnswer || "2-3 Minutes"}</p>
            </div>

            {/* Interviewer Expectations */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest">Answer Goals</h3>
                </div>
                <ul className="space-y-3">
                    {cleanExpectations.map((goal, idx) => (
                        <li key={idx} className="flex gap-3 text-xs leading-relaxed group">
                            <div className="mt-0.5 shrink-0 uppercase font-black text-[9px] text-primary/40 group-hover:text-primary transition-colors">0{idx + 1}</div>
                            <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">{goal}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Practice Checklist */}
            <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <BookCheck className="h-4 w-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest">Practice Checklist</h3>
                </div>
                <div className="space-y-2">
                    {checklist.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => toggleCheck(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left border",
                                item.completed
                                    ? "bg-green-500/5 border-green-500/20 text-green-500 font-bold"
                                    : "bg-foreground/5 border-border/50 text-muted-foreground hover:border-border"
                            )}
                        >
                            <div className={cn(
                                "h-4 w-4 rounded-full border flex items-center justify-center transition-all",
                                item.completed ? "bg-green-500 border-green-500" : "border-white/20"
                            )}>
                                {item.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                            </div>
                            <span className="text-[11px] font-semibold">{item.text}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Reward/XP */}
            <div className="space-y-4 pt-8 mt-auto">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                        <Trophy className="h-12 w-12 text-yellow-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-yellow-600 mb-1">Potential Reward</p>
                        <div className="text-3xl font-black text-foreground">+50 XP</div>
                        <p className="text-[10px] font-medium text-muted-foreground mt-2">Awarded on topic mastery</p>
                    </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all group">
                    <PlayCircle className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                    Start Mock Practice
                </button>
            </div>
        </div>
    );
}
