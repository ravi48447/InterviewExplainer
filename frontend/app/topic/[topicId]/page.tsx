"use client";

import React, { useEffect, useState } from "react";
import { fetchQuestionsForStack, QuestionSummary } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    FileText,
    ChevronRight,
    TrendingUp,
    BrainCircuit
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopicPage({ params }: { params: Promise<{ topicId: string }> }) {
    const { topicId } = React.use(params);
    const [questions, setQuestions] = useState<QuestionSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuestionsForStack(topicId)
            .then(data => {
                setQuestions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [topicId]);

    if (loading) return (
        <div className="container py-20 max-w-5xl mx-auto space-y-12">
            <Skeleton className="h-10 w-48" />
            <div className="space-y-6">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20 rounded-3xl glass" />)}
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen bg-background">
            <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-10" />

            <main className="container relative z-10 py-12 max-w-5xl mx-auto">
                <Link href="/domains" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-12 transition-all">
                    <div className="p-2 rounded-xl glass group-hover:bg-primary/20 transition-all">
                        <ArrowLeft className="h-4 w-4" />
                    </div>
                    <span>Back to Explorer</span>
                </Link>

                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-4 text-primary font-bold tracking-widest uppercase text-xs">
                        <BrainCircuit className="h-4 w-4" />
                        <span>Practice Suite</span>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight mb-4">Interview Challenges</h1>
                    <p className="text-xl text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-cyan-500" />
                        Targeted questions to sharpen your edge
                    </p>
                </div>

                <div className="relative space-y-4">
                    {questions.map((q, idx) => (
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Link href={`/question/${q.slug}`}>
                                <div className="group relative p-6 rounded-2xl glass hover:glass-strong border-white/5 flex items-center justify-between transition-all duration-300">
                                    <div className="flex items-center gap-5">
                                        <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-all">
                                            <FileText className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{q.title}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${q.difficulty === 'easy' ? 'text-green-500' :
                                                    q.difficulty === 'medium' ? 'text-yellow-500' :
                                                        'text-red-500'
                                                    }`}>
                                                    {q.difficulty}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                                                    15 Min Read
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-2 rounded-lg glass group-hover:bg-primary/20 transition-all">
                                        <ChevronRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}

