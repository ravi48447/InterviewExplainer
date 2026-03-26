"use client";

import React, { useEffect, useState } from "react";
import { fetchCategoriesForDomain, TechStack } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Layers,
    ChevronRight,
    Zap,
    Cpu
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryPage({
    params
}: {
    params: Promise<{ slug: string; categoryId: string }>
}) {
    const { slug, categoryId } = React.use(params);
    const [stacks, setStacks] = useState<TechStack[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategoriesForDomain(slug)
            .then(categories => {
                const category = categories.find(c => c.slug === categoryId || c.id.toString() === categoryId);
                setStacks(category ? category.stacks : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [slug, categoryId]);

    if (loading) return (
        <div className="container py-20 max-w-5xl mx-auto space-y-12">
            <Skeleton className="h-10 w-48" />
            <div className="space-y-6">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-3xl glass" />)}
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen bg-background">
            <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-10" />

            <main className="container relative z-10 py-12 max-w-5xl mx-auto">
                <Link href={`/domain/${slug}`} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-12 transition-all">
                    <div className="p-2 rounded-xl glass group-hover:bg-primary/20 transition-all">
                        <ArrowLeft className="h-4 w-4" />
                    </div>
                    <span>Back to Domain</span>
                </Link>

                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-4 text-primary font-bold tracking-widest uppercase text-xs">
                        <Cpu className="h-4 w-4" />
                        <span>Available Specializations</span>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight mb-4">Choose Your Stack</h1>
                    <p className="text-xl text-muted-foreground flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        High-performance paths for this category
                    </p>
                </div>

                <div className="relative space-y-6">
                    <div className="absolute left-10 top-10 bottom-10 w-0.5 bg-border/30 hidden md:block" />

                    {stacks.map((stack, idx) => (
                        <motion.div
                            key={stack.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link href={`/stack/${stack.slug}`}>
                                <div className="group relative ml-0 md:ml-10 p-8 rounded-3xl glass hover:glass-strong border-white/5 flex items-center justify-between transition-all duration-300">
                                    <div className="flex items-center gap-6">
                                        <div className="hidden md:flex absolute -left-[50px] w-10 h-10 rounded-full glass items-center justify-center font-bold text-sm text-primary border-primary/20 z-20 group-hover:bg-primary group-hover:text-white transition-all">
                                            {idx + 1}
                                        </div>

                                        <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-all">
                                            <Layers className="h-6 w-6" />
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{stack.name}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Master {stack.name} with targeted roadmap content</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-xl glass group-hover:bg-primary/20 transition-all">
                                            <ChevronRight className="h-5 w-5" />
                                        </div>
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

