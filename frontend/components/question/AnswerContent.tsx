"use client";

import { AnswerContent as AnswerContentType } from "@/lib/api";
import { motion } from "framer-motion";
import {
    ChevronDown,
    Lightbulb,
    Code2,
    MessageSquareQuote,
    AlertCircle,
    Zap,
    Copy,
    Check,
    Volume2
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface AnswerContentProps {
    answer: AnswerContentType;
}

export function AnswerContent({ answer }: AnswerContentProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-16 pb-20">
            {/* 1. What the Interviewer Wants to Hear */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                        <MessageSquareQuote className="h-5 w-5" />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400">What the Interviewer Wants to Hear</h2>
                </div>
                <div className="p-8 rounded-[2rem] bg-blue-500/[0.03] border border-blue-500/10 leading-relaxed relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <MessageSquareQuote className="h-12 w-12" />
                    </div>
                    <ul className="relative z-10 space-y-3 text-muted-foreground text-sm font-medium italic">
                        <li>• Clear understanding of the architectural motivation.</li>
                        <li>• Recognition of specific tradeoffs and performance impacts.</li>
                        <li>• Practical examples of where this concept solved a real production bottleneck.</li>
                    </ul>
                </div>
            </section>

            {/* 2. Core Concepts & Implementation */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-5">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                        <Zap className="h-5 w-5" />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary-foreground dark:text-foreground/80">Core Concepts & Deep Dive</h2>
                </div>
                <div className="prose prose-invert prose-p:text-muted-foreground prose-p:leading-[1.8] prose-headings:text-foreground prose-strong:text-primary max-w-none text-[15px] font-medium px-1">
                    <ReactMarkdown>{answer.deepExplanation}</ReactMarkdown>
                </div>
            </section>

            {/* 3. Important Points (Summary Block) */}
            <section className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
                        <Lightbulb className="h-5 w-5" />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-orange-400">Important Points</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {answer.interviewTips.split('•').filter(t => t.trim()).slice(0, 4).map((tip, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-background/[0.03] border border-white/5 flex items-start gap-4 hover:border-orange-500/20 transition-colors">
                            <span className="text-[10px] font-black text-orange-500/40 mt-1">0{idx + 1}</span>
                            <p className="text-xs font-medium text-muted-foreground leading-relaxed">{tip.trim()}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Implementation Pattern (Code Snippet) */}
            {answer.codeSnippet && (
                <section className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500">
                                <Code2 className="h-5 w-5" />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400">Implementation Pattern</h2>
                        </div>
                        <button
                            onClick={() => copyToClipboard(answer.codeSnippet || "")}
                            className="px-4 py-2 rounded-xl glass-strong text-[9px] font-black uppercase tracking-widest hover:bg-background/10 transition-colors flex items-center gap-2"
                        >
                            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copied ? "Copied" : "Copy Code"}
                        </button>
                    </div>
                    <div className="relative group">
                        <pre className="p-10 rounded-[2.5rem] bg-foreground dark:bg-background/40 border border-white/5 overflow-x-auto text-[14px] font-mono text-cyan-500/80 leading-relaxed shadow-inner">
                            <code>{answer.codeSnippet}</code>
                        </pre>
                        <div className="absolute top-6 right-8 text-[9px] font-mono text-muted-foreground/20 uppercase tracking-[0.3em]">IDE Edition</div>
                    </div>
                </section>
            )}

            {/* 5. The Speakable Answer */}
            <section className="pt-10">
                <div className="p-10 rounded-[3rem] bg-gradient-to-br from-primary/10 via-white/[0.01] to-transparent border border-white/10 relative overflow-hidden group">
                    {/* SVG Decor */}
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <Volume2 className="h-20 w-20" />
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-primary text-foreground shadow-lg shadow-primary/20">
                            <Volume2 className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tight text-primary-foreground dark:text-foreground/90 italic">The Speakable Answer</h2>
                            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">Target: {answer.timeToAnswer}</p>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-foreground dark:bg-background/40 backdrop-blur-2xl border border-white/5 font-medium text-lg leading-relaxed text-foreground/90 italic shadow-inner">
                        "{answer.speakableAnswer}"
                    </div>

                    <div className="mt-8 flex items-center justify-between px-2">
                        <div className="flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Mastery Standard</span>
                        </div>
                        <button className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-primary-foreground dark:text-foreground transition-colors">
                            Copy to Revise List
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
