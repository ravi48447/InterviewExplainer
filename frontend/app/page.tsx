"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Terminal,
  Cpu,
  Globe,
  Zap,
  Shield,
  CheckCircle,
  Database,
  Layout,
  Layers,
  BarChart3,
  Briefcase,
  GitBranch
} from "lucide-react";
import SelectionWizard from "@/components/selection-wizard";
import { useState, useEffect } from "react";
import { TechIcon } from "@/components/tech-icon";
import { HeroDashboardVisual } from "@/components/landing/hero-dashboard-visual";
import { fetchDomains, Domain } from "@/lib/api";


const ECOSYSTEM = [
  { name: "Java", icon: "java" },
  { name: "Python", icon: "python" },
  { name: "Go", icon: "go" },
  { name: "Ruby", icon: "ruby" },
  { name: "C++", icon: "c++" },
  { name: "JavaScript", icon: "javascript" },
  { name: "React", icon: "react" },
  { name: "Angular", icon: "angular" },
  { name: "Node.js", icon: "node.js" },
  { name: "Docker", icon: "docker" },
  { name: "AWS", icon: "aws" },
  { name: "SQL", icon: "sql" }
];

const FAMOUS_DOMAINS = [
  { slug: "java-backend-3-5", label: "Java Mastery", icon: "java", color: "from-orange-500 to-red-600" },
  { slug: "python-backend-1-3", label: "Python Expert", icon: "python", color: "from-blue-500 to-cyan-500" },
  { slug: "frontend-react-3-5", label: "React Architect", icon: "react", color: "from-cyan-400 to-blue-500" },
  { slug: "go-backend-3-5", label: "Go Specialist", icon: "go", color: "from-blue-400 to-indigo-500" }
];

const CODE_PREVIEW = `// Premium Studio Content
public class MasterySystem {
    public static void main(String[] args) {
        Engineer user = Engineers.find("You");
        
        user.applyMastery("System Design")
            .practice("Concurrency")
            .verify("Production Ready");

        System.out.println("Status: HIRED");
    }
}`;

function CodeLine({ content }: { content: string }) {
  const highlighted = content
    .replace(/(\/\/.*)/, '<span class="text-green-500/60 font-italic">$1</span>')
    .replace(/(public class|public static void|Engineer|Engineers|System\.out\.println)/g, '<span class="text-primary">$1</span>')
    .replace(/(".*?")/g, '<span class="text-yellow-400">$1</span>')
    .replace(/(find|applyMastery|practice|verify)/g, '<span class="text-cyan-400">$1</span>');

  return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
}

export default function HomePage() {
  const [showWizard, setShowWizard] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [domains, setDomains] = useState<Domain[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchDomains().then(setDomains).catch(console.error);
  }, []);

  if (!mounted) return null;

  const featured = domains.slice(0, 6);

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section - Premium 2-Column Layout */}
      <section className="relative z-10 pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-primary/10 text-xs font-bold tracking-widest uppercase text-primary mb-8"
              >
                <Zap className="h-3.5 w-3.5" />
                V3 Studio Edition Now Live
              </motion.div>

              <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tight leading-[0.9] mb-8">
                Decode <br />
                <span className="text-glow bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                  Interviews.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-xl leading-relaxed font-medium">
                The ultimate explanation engine for career mastery.
                Experience-wise depth, architectural decodings, and the "InterviewExplainer" advantage for every career stage.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-8">
                <button
                  onClick={() => setShowWizard(true)}
                  className="group relative px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-black tracking-[0.1em] uppercase text-sm overflow-hidden hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(var(--primary),0.3)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  Get Decoded Now
                </button>
                <Link href="/domains" className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors group">
                  Explore InterviewExplainer <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column: High-Impact 3D Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative aspect-square lg:aspect-auto h-full min-h-[500px] flex items-center justify-center"
            >
              <HeroDashboardVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Mastery Hotspots - NEW */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col items-center text-center mb-16 px-4">
          <h2 className="text-sm font-black tracking-[0.4em] uppercase text-primary mb-4">High-Profile Hotspots</h2>
          <p className="text-3xl md:text-5xl font-black tracking-tight">Famous Mastery Paths</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FAMOUS_DOMAINS.map((hotspot, idx) => (
            <Link href={`/${hotspot.slug}`} key={hotspot.slug} className="group relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="relative overflow-hidden p-8 rounded-[2rem] glass-strong border border-white/5 h-full flex flex-col items-center text-center gap-6"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${hotspot.color} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity animate-pulse`} />

                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${hotspot.color} p-[2px] shadow-2xl group-hover:scale-110 transition-transform`}>
                  <div className="w-full h-full rounded-[1.4rem] bg-background flex items-center justify-center">
                    <TechIcon name={hotspot.icon} className="w-12 h-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">{hotspot.label}</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{hotspot.slug.split('-').join(' ')}</p>
                </div>

                <div className="mt-auto px-6 py-2 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-black transition-all">
                  Direct Access
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* USP Section: The InterviewExplainer Advantage */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Category Wise Depth",
              desc: "Content tailored for your experience level. Whether 0-1 yrs or 5+ yrs, we have the right depth.",
              icon: Layers
            },
            {
              title: "InterviewExplainer Decoding",
              desc: "We don't just dump code. We decode the internal architecture and 'Why' behind every pattern.",
              icon: Zap
            },
            {
              title: "Effortless Mastery",
              desc: "Absorb complex engineering concepts through our studio-grade visual decodings.",
              icon: Shield
            }
          ].map((usp, idx) => (
            <motion.div
              key={usp.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2.5rem] glass border-primary/10 hover:glass-strong transition-all flex flex-col gap-4 text-center items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                <usp.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black tracking-tight">{usp.title}</h3>
              <p className="text-muted-foreground/80 text-sm leading-relaxed">
                {usp.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section >

      {/* Role Discovery - Mid-sized Floating Cards */}
      < section className="container mx-auto px-4 py-20 relative z-10" >
        <div className="flex items-center justify-between mb-16 px-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Select Your Career Path</h2>
            <p className="text-muted-foreground">Premium tracks curated by FAANG mentors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-4">
          {featured.map((domain, idx) => (
            <Link href={`/${domain.slug}`} key={domain.id} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{
                  y: -8,
                  rotateX: 2,
                  rotateY: 2,
                  transition: { duration: 0.3 }
                }}
                className="relative p-5 rounded-2xl glass hover:glass-strong border-border/50 transition-all duration-500 overflow-hidden shadow-lg h-full"
                style={{ perspective: "1000px" }}
              >
                {/* Top Accent Border */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-primary opacity-20 group-hover:opacity-100 transition-opacity`} />

                <div className={`absolute top-0 right-0 w-24 h-24 bg-primary opacity-0 group-hover:opacity-10 blur-3xl transition-opacity`} />

                <div className="flex items-start justify-between mb-6">
                  <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Database className="h-5 w-5 text-primary" />
                  </div>

                  {/* Exp Badge */}
                  <div className="px-2 py-0.5 rounded-md bg-primary/5 border border-primary/10 text-[9px] font-black tracking-widest uppercase text-muted-foreground transition-colors group-hover:text-primary">
                    {domain.experienceLabel || "Mixed Exp"}
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-1.5 group-hover:text-primary transition-colors">{domain.name}</h3>
                <p className="text-muted-foreground/80 text-[13px] mb-6 leading-relaxed line-clamp-2">
                  {domain.description || `${domain.name} mastery series decodings.`}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                  <span className="text-[9px] font-black tracking-widest text-muted-foreground/50 uppercase">{domain.language || "General"}</span>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary group-hover:translate-x-1 transition-transform">
                    <span>Explore Track</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section >

      {/* Ecosystem Section */}
      < section className="py-20 bg-black/40 border-y border-white/5 relative z-10 overflow-hidden" >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary/60 mb-4">Tech Ecosystem</h2>
            <p className="text-2xl md:text-3xl font-bold">Languages & Frameworks We Cover</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 lg:gap-4 max-w-5xl mx-auto px-4">
            {ECOSYSTEM.map((tech, idx) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03 }}
                className="group flex items-center gap-3 px-5 py-2.5 rounded-2xl glass border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-default"
              >
                <TechIcon name={tech.icon} className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground group-hover:text-white transition-colors">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* Code Studio Preview - Mac Style */}
      < section className="container mx-auto px-4 py-32 relative z-10" >
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 text-primary">
              <Code2 className="h-5 w-5" />
              <span className="font-bold tracking-widest uppercase text-xs">Studio Grade Content</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Learn in a <br /> Professional <span className="text-primary italic">IDE Environment</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Don't just read theory. Our explanations are served in a premium,
              colorful IDE environment that replicates modern production workflows.
              Beautiful syntax highlighting, clean typography, and FAANG-grade logic.
            </p>
            <ul className="space-y-4">
              {[
                "Production-ready patterns",
                "Advanced Concurrency & Scalability",
                "Interactive System Design diagrams",
                "Optimized for dark-mode readability"
              ].map(item => (
                <li key={item} className="flex items-center gap-3 font-medium text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-500/20 blur-3xl opacity-50" />

            {/* Mac Window */}
            <div className="relative rounded-[2rem] glass-strong border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="bg-white/5 px-8 py-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F]" />
                </div>
                <div className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
                  engineer_mastery.java
                </div>
                <div className="w-12" />
              </div>
              <div className="p-10 md:p-14 bg-black/40 backdrop-blur-xl">
                <pre className="font-mono text-sm md:text-base leading-relaxed overflow-x-auto selection:bg-primary/30">
                  <code className="text-blue-300">
                    {CODE_PREVIEW.split('\n').map((line, i) => (
                      <div key={i} className="flex gap-6">
                        <span className="text-muted-foreground/30 w-4 text-right select-none">{i + 1}</span>
                        <CodeLine content={line} />
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </section >

      {/* Build Path Button Floating Footer (Optional) */}
      < footer className="py-12 border-t border-white/5 text-center relative z-10" >
        <p className="text-muted-foreground text-sm font-medium">
          © 2026 InterviewExplainer Studio. High-Fidelity Engineering Education.
        </p>
      </footer >

      {showWizard && <SelectionWizard onClose={() => setShowWizard(false)} />
      }
    </div >
  );
}
