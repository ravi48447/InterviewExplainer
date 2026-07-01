"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check,
    ChevronLeft,
    Layout,
    Server,
    Database,
    Zap,
    Palette,
    X,
    Sparkles,
    Trophy,
    Target,
    Compass,
    Briefcase,
    Code2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TechIcon } from "./tech-icon";
import { EXPERIENCE_LEVELS, LEVEL_KEYS, type ExperienceLevelKey } from "@/lib/levels";
import { type ContentDomain } from "@/lib/types/content-domain";

interface Track {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon?: any;
    color?: string;
}

interface LanguageOption {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    iconUrl?: string | null;
}

function deriveTracksFromDomains(domains: ContentDomain[], languageSlug?: string): Track[] {
    const filtered = languageSlug ? domains.filter(d => d.languageSlug === languageSlug) : domains;
    const seen = new Set<string>();
    return filtered
        .filter(d => { if (seen.has(d.trackSlug)) return false; seen.add(d.trackSlug); return true; })
        .map((d, i) => ({ id: i, name: d.track, slug: d.trackSlug, description: null }));
}

function deriveLanguagesFromDomains(domains: ContentDomain[], trackSlug?: string): LanguageOption[] {
    const filtered = trackSlug ? domains.filter(d => d.trackSlug === trackSlug) : domains;
    const seen = new Set<string>();
    return filtered
        .filter(d => { if (seen.has(d.languageSlug)) return false; seen.add(d.languageSlug); return true; })
        .map((d, i) => ({ id: i, name: d.language, slug: d.languageSlug }));
}


const trackTheme: Record<string, any> = {
    frontend: { icon: Palette, color: "from-blue-50 dark:from-blue-950/400 to-cyan-400" },
    backend: { icon: Server, color: "from-green-50 dark:from-green-950/400 to-emerald-400" },
    fullstack: { icon: Layout, color: "from-purple-50 dark:from-purple-950/400 to-pink-400" },
    data: { icon: Database, color: "from-orange-50 dark:from-orange-950/400 to-yellow-400" },
    business: { icon: Compass, color: "from-blue-600 to-indigo-400" },
};

const expTheme: Record<ExperienceLevelKey, { subtitle: string; icon: any; color: string }> = {
    beginner:     { subtitle: "Junior Tier",  icon: Sparkles, color: "from-emerald-50 dark:from-emerald-950/400 to-teal-400" },
    intermediate: { subtitle: "Pro Tier",     icon: Trophy,   color: "from-purple-50 dark:from-purple-950/400 to-pink-400"  },
};

// Hardcoded themes for visual flair, but data is dynamic

interface SelectionWizardProps {
    onClose?: () => void;
}

export default function SelectionWizard({ onClose }: SelectionWizardProps) {
    const [step, setStep] = useState(0); // 0=Discovery Mode, 1=Primary, 2=Secondary, 3=Exp
    const [discoveryMode, setDiscoveryMode] = useState<"role" | "tech" | null>(null);
    const [loading, setLoading] = useState(false);
    const [allDomains, setAllDomains] = useState<ContentDomain[]>([]);
    const [data, setData] = useState<{
        tracks: Track[];
        languages: LanguageOption[];
    }>({
        tracks: [],
        languages: [],
    });

    const [selections, setSelections] = useState({
        track: "",
        trackName: "",
        language: "",
        languageSlug: "",
        experienceKey: "" as ExperienceLevelKey | "",
    });
    const router = useRouter();

    useEffect(() => {
        fetch("/api/content/all-domains")
            .then(r => r.ok ? r.json() : [])
            .then((domains: ContentDomain[]) => {
                setAllDomains(domains);
                setData({
                    tracks: deriveTracksFromDomains(domains),
                    languages: deriveLanguagesFromDomains(domains),
                });
            })
            .catch(err => console.error("Failed to load wizard data", err));
    }, []);

    const filterLanguagesForTrack = (trackSlug: string) => {
        setData(prev => ({ ...prev, languages: deriveLanguagesFromDomains(allDomains, trackSlug) }));
    };

    const filterTracksForLanguage = (languageSlug: string) => {
        setData(prev => ({ ...prev, tracks: deriveTracksFromDomains(allDomains, languageSlug) }));
    };

    const handleSelection = (key: string, value: any) => {
        if (key === "mode") {
            setDiscoveryMode(value);
            setStep(1);
        } else if (key === "track") {
            setSelections(prev => ({ ...prev, track: value.slug, trackName: value.name }));
            if (discoveryMode === "role") {
                filterLanguagesForTrack(value.slug);
                setStep(2);
            } else {
                setStep(3);
            }
        } else if (key === "language") {
            setSelections(prev => ({ ...prev, language: value.name, languageSlug: value.slug }));
            if (discoveryMode === "tech") {
                filterTracksForLanguage(value.slug);
                setStep(2);
            } else {
                setStep(3);
            }
        } else if (key === "experience") {
            setSelections(prev => ({ ...prev, experienceKey: value.key as ExperienceLevelKey }));
        }
    };

    const currentStepData = () => {
        switch (step) {
            case 0:
                return {
                    title: "Preparation Discovery",
                    subtitle: "How would you like to build your mastery path?",
                    options: [
                        { id: 1, name: "Role-First", slug: "role", icon: Briefcase, desc: "Find path via Career Track (e.g. Backend)" },
                        { id: 2, name: "Tech-First", slug: "tech", icon: Code2, desc: "Find path via Language (e.g. Java)" }
                    ]
                };
            case 1:
                if (discoveryMode === "role") {
                    return {
                        title: "Select Career Track",
                        subtitle: "Where do you want to dominate?",
                        options: data.tracks.map(t => ({
                            ...t,
                            ...trackTheme[t.slug as keyof typeof trackTheme]
                        })),
                    };
                } else {
                    return {
                        title: "Select Technology",
                        subtitle: "What language are you mastering?",
                        options: data.languages,
                    };
                }
            case 2:
                if (discoveryMode === "role") {
                    return {
                        title: "Choose Your Weapon",
                        subtitle: `Precision tools for the ${selections.trackName} landscape`,
                        options: data.languages,
                    };
                } else {
                    return {
                        title: "Choose Your Track",
                        subtitle: `Targeted roles for ${selections.language} developers`,
                        options: data.tracks.map(t => ({
                            ...t,
                            ...trackTheme[t.slug as keyof typeof trackTheme]
                        })),
                    };
                }
            case 3:
                return {
                    title: "Career Tier Selection",
                    subtitle: "Our USP: Tailored insights for your professional stage",
                    options: LEVEL_KEYS.map(key => ({
                        key,
                        label: EXPERIENCE_LEVELS[key].label,
                        range: EXPERIENCE_LEVELS[key].range,
                        ...expTheme[key],
                    })),
                };
            default:
                return { title: "", subtitle: "", options: [] };
        }
    };

    const { title, subtitle, options } = currentStepData();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-background/80 backdrop-blur-2xl"
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-4xl glass-strong border-white/10 rounded-[2rem] sm:rounded-[3rem] p-5 sm:p-8 md:p-14 shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden"
            >
                <div className="bg-blob bg-primary/10 top-[-30%] left-[-30%] scale-[2] blur-[120px]" />
                <div className="bg-blob bg-purple-500 dark:bg-purple-800/10 bottom-[-30%] right-[-30%] scale-[2] blur-[120px]" />

                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 sm:top-10 sm:right-10 p-2 sm:p-4 rounded-2xl glass hover:bg-background/10 transition-all z-20 group"
                    >
                        <X className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground group-hover:text-white transition-colors" />
                    </button>
                )}

                <div className="relative z-10">
                    {/* Compact Progress Indicator */}
                    <div className="flex justify-center mb-6 sm:mb-12 space-x-2 sm:space-x-4">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center">
                                <div
                                    className={cn(
                                        "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-700 font-bold text-xs sm:text-sm",
                                        step === i ? "bg-primary text-foreground scale-110 shadow-[0_0_30px_rgba(0,242,254,0.4)]" :
                                            step > i ? "bg-background/20 text-white" : "bg-background/5 text-muted-foreground border border-white/5"
                                    )}
                                >
                                    {step > i ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : i + 1}
                                </div>
                                {i < 3 && <div className={cn("w-4 sm:w-8 h-[2px] mx-1 sm:mx-2 rounded-full transition-colors duration-700", step > i ? "bg-primary" : "bg-background/10")} />}
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                            className="text-center"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter mb-2 sm:mb-4 leading-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">{title}</h2>
                            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-6 sm:mb-12 max-w-lg mx-auto font-medium">{subtitle}</p>

                            <div className={cn(
                                "grid gap-3 lg:gap-4",
                                step === 0 ? "grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto" :
                                    (step === 1 && discoveryMode === "role") || (step === 2 && discoveryMode === "tech") ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" :
                                        (step === 1 && discoveryMode === "tech") || (step === 2 && discoveryMode === "role") ? "grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6" :
                                            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                            )}>
                                {step === 0 && options.map((opt: any) => (
                                    <button
                                        key={opt.slug}
                                        onClick={() => handleSelection("mode", opt.slug)}
                                        className="group relative p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-white/5 bg-background/5 hover:bg-background/10 hover:border-primary/30 transition-all flex flex-col items-center gap-3 sm:gap-4 text-center"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <opt.icon className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">{opt.name}</h3>
                                            <p className="text-xs text-muted-foreground">{opt.desc}</p>
                                        </div>
                                    </button>
                                ))}

                                {((step === 1 && discoveryMode === "role") || (step === 2 && discoveryMode === "tech")) && options.map((track: any) => (
                                    <button
                                        key={track.slug}
                                        onClick={() => handleSelection("track", track)}
                                        className={cn(
                                            "group relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center text-center gap-3",
                                            selections.track === track.slug
                                                ? "bg-primary/10 border-primary ring-1 ring-primary/50 shadow-[0_0_20px_rgba(0,242,254,0.15)] scale-105"
                                                : "bg-background/5 border-white/5 hover:border-white/10 hover:bg-background/10"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                                            selections.track === track.slug ? "bg-primary text-foreground scale-110" : "bg-background/5 text-muted-foreground group-hover:scale-110"
                                        )}>
                                            {track.icon ? <track.icon className="h-5 w-5" /> : <Layout className="h-5 w-5" />}
                                        </div>
                                        <span className={cn(
                                            "text-xs font-bold tracking-wider uppercase",
                                            selections.track === track.slug ? "text-primary" : "text-muted-foreground"
                                        )}>
                                            {track.name}
                                        </span>
                                    </button>
                                ))}

                                {((step === 1 && discoveryMode === "tech") || (step === 2 && discoveryMode === "role")) && (
                                    <>
                                        {loading && <div className="col-span-full py-10 text-primary animate-pulse">Scanning ecosystem...</div>}
                                        {!loading && options.map((opt: any) => (
                                            <button
                                                key={opt.slug}
                                                onClick={() => handleSelection("language", opt)}
                                                className={cn(
                                                    "group relative py-4 px-2 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-2",
                                                    selections.languageSlug === opt.slug
                                                        ? "bg-primary/10 border-primary ring-1 ring-primary/50 shadow-[0_0_15px_rgba(0,242,254,0.1)] scale-105"
                                                        : "bg-background/5 border-white/5 hover:border-white/10"
                                                )}
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-background/5 flex items-center justify-center group-hover:bg-background/10 transition-colors">
                                                    <TechIcon name={opt.iconUrl || opt.slug} className={cn(
                                                        "h-5 w-5 transition-transform duration-300",
                                                        selections.languageSlug === opt.slug ? "scale-110 opacity-100" : "opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110"
                                                    )} />
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] font-bold tracking-tight uppercase transition-colors",
                                                    selections.languageSlug === opt.slug ? "text-primary" : "text-muted-foreground group-hover:text-white"
                                                )}>
                                                    {opt.name}
                                                </span>
                                            </button>
                                        ))}
                                    </>
                                )}

                                {step === 3 && options.map((opt: any) => (
                                    <button
                                        key={opt.key}
                                        onClick={() => handleSelection("experience", opt)}
                                        className={cn(
                                            "relative group p-6 rounded-3xl glass-strong text-center transition-all duration-500 border border-white/5 flex flex-col items-center",
                                            selections.experienceKey === opt.key
                                                ? "border-primary/50 bg-primary/10 scale-105 shadow-[0_0_30px_rgba(0,242,254,0.1)]"
                                                : "hover:border-white/20 hover:bg-background/5"
                                        )}
                                    >
                                        <div className={cn("inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br mb-4 shadow-xl group-hover:scale-110 transition-transform", opt.color || "from-blue-50 dark:from-blue-950/400 to-cyan-400")}>
                                            {opt.icon ? <opt.icon className="h-6 w-6 text-foreground" /> : <Sparkles className="h-6 w-6 text-foreground" />}
                                        </div>
                                        <span className="text-2xl font-black bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent mb-1">{opt.label}</span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{opt.range}</span>
                                        <span className="text-[9px] uppercase tracking-tighter opacity-40 mt-1">{opt.subtitle}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-16 flex justify-between items-center max-w-md mx-auto">
                                {step > 0 ? (
                                    <Button variant="ghost" onClick={() => setStep(step - 1)} className="text-muted-foreground hover:text-primary rounded-xl h-12 px-6">
                                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                                    </Button>
                                ) : <div />}

                                {step === 3 && selections.experienceKey && (
                                    <Button
                                        size="lg"
                                        className="rounded-2xl h-14 px-10 bg-primary text-foreground font-black uppercase tracking-[0.15em] hover:scale-105 transition-all shadow-[0_20px_50px_rgba(0,242,254,0.4)] relative overflow-hidden group"
                                        onClick={() => {
                                            const slug = `${selections.languageSlug}-${selections.track}-${selections.experienceKey}`;
                                            router.push(`/${slug}`);
                                            if (onClose) onClose();
                                        }}
                                    >
                                        <span className="relative z-10 flex items-center">
                                            Initialize Path <Zap className="ml-2 h-5 w-5 fill-current" />
                                        </span>
                                        <div className="absolute inset-0 bg-background/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
