"use client";

import { useEffect, useState } from "react";
import { Topic, QuestionSummary } from "@/lib/api";
import { ChevronDown, ChevronRight, CheckCircle2, Circle, BookOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionSidebarProps {
    topics: Topic[];
    activeQuestionId: number;
}

export function QuestionSidebar({ topics, activeQuestionId }: QuestionSidebarProps) {
    const [expandedTopics, setExpandedTopics] = useState<Record<number, boolean>>({});

    useEffect(() => {
        // Automatically expand the topic containing the active question
        const activeTopic = topics.find(topic =>
            topic.questions?.some(q => q.id === activeQuestionId)
        );
        if (activeTopic) {
            setExpandedTopics(prev => ({ ...prev, [activeTopic.id]: true }));
        }
    }, [activeQuestionId, topics]);

    const toggleTopic = (topicId: number) => {
        setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
    };

    const completedCount = 0; // TODO: Integrate with real progress data
    const totalQuestions = topics.reduce((acc, t) => acc + (t.questions?.length || 0), 0);
    const progressPercentage = totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0;

    return (
        <div className="flex flex-col h-full glass border-r border-border/50 overflow-hidden">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold tracking-tight">Curriculum</h2>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Preparation Roadmap</p>
                    </div>
                </div>

                {/* Progress Tracker */}
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-primary">{completedCount}/{totalQuestions} Done</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                        />
                    </div>
                </div>
            </div>

            {/* Navigation Tree */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-1">
                    {topics.map((topic) => (
                        <div key={topic.id} className="space-y-1">
                            <button
                                onClick={() => toggleTopic(topic.id)}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group",
                                    expandedTopics[topic.id] ? "bg-primary/5 text-foreground" : "text-muted-foreground hover:bg-foreground/5"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-1.5 rounded-lg transition-colors",
                                        expandedTopics[topic.id] ? "bg-primary/20 text-primary" : "bg-foreground/5 text-muted-foreground group-hover:bg-foreground/10"
                                    )}>
                                        {expandedTopics[topic.id] ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                                    </div>
                                    <span className="text-xs font-bold tracking-tight text-left">{topic.name}</span>
                                </div>
                                <span className="text-[10px] font-mono opacity-40">{topic.questions?.length || 0}</span>
                            </button>

                            <AnimatePresence>
                                {expandedTopics[topic.id] && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pl-9 pr-2 py-1 space-y-1">
                                            {topic.questions?.map((q) => (
                                                <Link
                                                    key={q.id}
                                                    href={`/question/${q.id}`}
                                                    className={cn(
                                                        "group flex items-center gap-3 p-2.5 rounded-lg text-[11px] font-medium transition-all duration-200",
                                                        q.id === activeQuestionId
                                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                                    )}
                                                >
                                                    {/* Status Icon */}
                                                    <div className="shrink-0">
                                                        {false ? ( // TODO: Use real completion status
                                                            <CheckCircle2 className={cn("h-3.5 w-3.5", q.id === activeQuestionId ? "text-primary-foreground" : "text-primary")} />
                                                        ) : (
                                                            <Circle className={cn("h-3.5 w-3.5 opacity-20", q.id === activeQuestionId ? "text-primary-foreground" : "group-hover:opacity-100 group-hover:text-primary")} />
                                                        )}
                                                    </div>

                                                    <span className="flex-1 line-clamp-2 leading-tight">{q.title}</span>

                                                    {q.id === activeQuestionId && (
                                                        <motion.div
                                                            layoutId="activeQuestion"
                                                            className="w-1 h-3 bg-primary-foreground rounded-full"
                                                        />
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
