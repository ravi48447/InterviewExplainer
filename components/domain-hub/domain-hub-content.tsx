"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, BookOpen, Users, Clock, Layers } from "lucide-react";
import { Tag } from "@/components/ui/tag";
import { ErrorState } from "@/components/ui/error-state";

const domainData: Record<string, {
  name: string;
  description: string;
  totalQuestions: number;
  roles: Array<{ id: string; name: string; desc: string; tech: string[]; questions: number }>;
  experiences: Array<{ id: string; label: string; desc: string; questions: number }>;
  previewTopics: Record<string, Record<string, string[]>>;
}> = {
  java: {
    name: "Java",
    description: "Backend-focused interview preparation covering Core Java, JVM internals, concurrency, Spring, SQL, and system interactions.",
    totalQuestions: 450,
    roles: [
      { id: "backend", name: "Backend Engineer", desc: "Java, JVM, concurrency, Spring, databases, and backend system design.", tech: ["Java", "Spring", "SQL", "JVM"], questions: 320 },
      { id: "fullstack", name: "Fullstack Engineer", desc: "Java backend fundamentals plus frontend integration and APIs.", tech: ["Java", "Spring", "REST", "React"], questions: 280 },
    ],
    experiences: [
      { id: "0-1", label: "0-1 years", desc: "Entry-level / Freshers", questions: 120 },
      { id: "1-3", label: "1-3 years", desc: "Early professional", questions: 180 },
      { id: "3-5", label: "3-5 years", desc: "Mid-level", questions: 150 },
      { id: "5+", label: "5+ years", desc: "Senior / Lead", questions: 100 },
    ],
    previewTopics: {
      backend: {
        "0-1": ["Core Java Basics", "OOP Concepts", "Collections Intro", "Basic SQL", "Spring Boot Intro"],
        "1-3": ["Core Java", "Collections Framework", "Multithreading Basics", "Spring Boot", "SQL & Indexing"],
        "3-5": ["Advanced Concurrency", "JVM Internals", "Spring Security", "System Design Basics", "Hibernate Advanced"],
        "5+": ["Architecture Patterns", "Performance Tuning", "Distributed Systems", "Leadership Scenarios"],
      },
      fullstack: {
        "0-1": ["Java Basics", "HTML/CSS", "REST APIs", "Basic React"],
        "1-3": ["Spring REST", "React Hooks", "Database Design", "API Integration", "Testing"],
        "3-5": ["Microservices", "Frontend Architecture", "CI/CD", "Performance", "Security"],
        "5+": ["System Design", "Team Leadership", "Architecture Decisions"],
      },
    },
  },
  python: {
    name: "Python",
    description: "Python interview preparation for backend, scripting, data processing, and automation roles.",
    totalQuestions: 380,
    roles: [
      { id: "backend", name: "Backend Engineer", desc: "Django, FastAPI, databases, and Python backend patterns.", tech: ["Python", "Django", "FastAPI", "PostgreSQL"], questions: 260 },
      { id: "data-analyst", name: "Data Analyst", desc: "Pandas, SQL, data manipulation, and analytical thinking.", tech: ["Python", "Pandas", "SQL", "NumPy"], questions: 200 },
    ],
    experiences: [
      { id: "0-1", label: "0-1 years", desc: "Entry-level", questions: 100 },
      { id: "1-3", label: "1-3 years", desc: "Early professional", questions: 150 },
      { id: "3-5", label: "3-5 years", desc: "Mid-level", questions: 130 },
      { id: "5+", label: "5+ years", desc: "Senior", questions: 80 },
    ],
    previewTopics: {
      backend: {
        "0-1": ["Python Basics", "Data Types", "Functions", "OOP", "Basic SQL"],
        "1-3": ["Django Models", "REST APIs", "Database Design", "Testing", "Async Python"],
        "3-5": ["Architecture", "Celery", "Caching", "Security", "Performance"],
        "5+": ["System Design", "Scalability", "Team Leadership"],
      },
      "data-analyst": {
        "0-1": ["Python Basics", "Pandas Intro", "SQL Basics", "Data Types"],
        "1-3": ["Advanced Pandas", "SQL Joins", "Data Viz", "Statistics", "ETL"],
        "3-5": ["Complex Queries", "Data Modeling", "Analytics", "Automation"],
        "5+": ["Architecture", "Data Strategy", "Leadership"],
      },
    },
  },
  devops: {
    name: "DevOps",
    description: "Interview preparation for DevOps roles covering Linux, Docker, Kubernetes, CI/CD, cloud platforms, and monitoring.",
    totalQuestions: 320,
    roles: [
      { id: "devops", name: "DevOps Engineer", desc: "Linux, containers, orchestration, CI/CD, and cloud infrastructure.", tech: ["Docker", "K8s", "AWS", "Terraform"], questions: 320 },
    ],
    experiences: [
      { id: "1-3", label: "1-3 years", desc: "Early professional", questions: 140 },
      { id: "3-5", label: "3-5 years", desc: "Mid-level", questions: 120 },
      { id: "5+", label: "5+ years", desc: "Senior / Lead", questions: 60 },
    ],
    previewTopics: {
      devops: {
        "1-3": ["Linux Basics", "Docker", "CI/CD Pipelines", "AWS Basics", "Monitoring"],
        "3-5": ["Kubernetes", "Terraform", "Security", "Performance", "Architecture"],
        "5+": ["Platform Strategy", "SRE Practices", "Team Scaling"],
      },
    },
  },
  frontend: {
    name: "Frontend",
    description: "Comprehensive frontend interview prep covering React, TypeScript, CSS, performance, and accessibility.",
    totalQuestions: 410,
    roles: [
      { id: "frontend", name: "Frontend Engineer", desc: "React, TypeScript, CSS, browser APIs, and UI architecture.", tech: ["React", "TypeScript", "CSS", "Next.js"], questions: 310 },
      { id: "fullstack", name: "Fullstack Engineer", desc: "Frontend + backend integration, APIs, and full-stack patterns.", tech: ["React", "Node.js", "REST", "SQL"], questions: 270 },
    ],
    experiences: [
      { id: "0-1", label: "0-1 years", desc: "Entry-level", questions: 110 },
      { id: "1-3", label: "1-3 years", desc: "Early professional", questions: 160 },
      { id: "3-5", label: "3-5 years", desc: "Mid-level", questions: 140 },
      { id: "5+", label: "5+ years", desc: "Senior", questions: 90 },
    ],
    previewTopics: {
      frontend: {
        "0-1": ["HTML/CSS", "JavaScript Basics", "React Intro", "DOM APIs"],
        "1-3": ["React Hooks", "State Mgmt", "TypeScript", "CSS-in-JS", "Testing"],
        "3-5": ["Performance", "A11y", "Architecture", "Design Systems", "SSR"],
        "5+": ["System Design", "Team Scaling", "Platform Strategy"],
      },
      fullstack: {
        "0-1": ["HTML/CSS", "JavaScript", "React Basics", "REST APIs"],
        "1-3": ["React + Node", "Database Design", "Auth", "Testing", "Deployment"],
        "3-5": ["Microservices", "Performance", "CI/CD", "Security"],
        "5+": ["Architecture", "Scalability", "Leadership"],
      },
    },
  },
  "system-design": {
    name: "System Design",
    description: "System design interview questions covering load balancing, caching, databases, microservices, and distributed systems.",
    totalQuestions: 280,
    roles: [
      { id: "backend", name: "Backend Engineer", desc: "Scalable backend architectures, databases, and distributed systems.", tech: ["Caching", "LB", "DB", "Queues"], questions: 200 },
      { id: "fullstack", name: "Fullstack Engineer", desc: "End-to-end system design including frontend considerations.", tech: ["CDN", "APIs", "DB", "Caching"], questions: 180 },
    ],
    experiences: [
      { id: "3-5", label: "3-5 years", desc: "Mid-level", questions: 160 },
      { id: "5+", label: "5+ years", desc: "Senior / Lead", questions: 120 },
    ],
    previewTopics: {
      backend: {
        "3-5": ["URL Shortener", "Rate Limiter", "Chat System", "News Feed", "File Storage"],
        "5+": ["Distributed DB", "Search Engine", "Video Streaming", "Payment System"],
      },
      fullstack: {
        "3-5": ["E-commerce", "Social Media", "Dashboard", "Real-time App"],
        "5+": ["Global Scale", "Multi-tenant SaaS", "Data Pipeline"],
      },
    },
  },
  "data-sql": {
    name: "Data & SQL",
    description: "Data-focused interview prep covering joins, subqueries, indexing, normalization, transactions, and analytics.",
    totalQuestions: 290,
    roles: [
      { id: "data-analyst", name: "Data Analyst", desc: "SQL, analytics, data modeling, and visualization.", tech: ["SQL", "Pandas", "Viz", "ETL"], questions: 200 },
      { id: "backend", name: "Backend Engineer", desc: "Database design, optimization, and data access patterns.", tech: ["PostgreSQL", "Redis", "ORM", "Indexing"], questions: 180 },
    ],
    experiences: [
      { id: "0-1", label: "0-1 years", desc: "Entry-level", questions: 90 },
      { id: "1-3", label: "1-3 years", desc: "Early professional", questions: 120 },
      { id: "3-5", label: "3-5 years", desc: "Mid-level", questions: 80 },
    ],
    previewTopics: {
      "data-analyst": {
        "0-1": ["SELECT Basics", "Joins Intro", "WHERE Clauses", "Aggregation"],
        "1-3": ["Window Functions", "CTEs", "Subqueries", "Data Modeling", "ETL"],
        "3-5": ["Optimization", "Complex Analytics", "Data Pipelines"],
      },
      backend: {
        "0-1": ["SQL Basics", "Joins", "Schema Design"],
        "1-3": ["Indexing", "Normalization", "Transactions", "ORM", "Query Tuning"],
        "3-5": ["Replication", "Sharding", "Performance", "Migration"],
      },
    },
  },
};

export function DomainHubContent({ slug }: { slug: string }) {
  const domain = domainData[slug];
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedExp, setSelectedExp] = useState<string | null>(null);

  if (!domain) {
    return (
      <div className="w-full min-w-0 px-4 py-16">
        <ErrorState
          title="Domain not found"
          description="This domain is being prepared."
          retryLabel="Back to domains"
          onRetry={() => { if (typeof window !== "undefined") window.location.href = "/domains"; }}
        />
      </div>
    );
  }

  const previewTopics = selectedRole && selectedExp
    ? domain.previewTopics[selectedRole]?.[selectedExp] || []
    : [];

  const canProceed = selectedRole && selectedExp;

  return (
    <div className="w-full min-w-0 px-4 py-8 lg:px-6">
      {/* Breadcrumb */}
      <FadeInUp>
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/domains" className="hover:text-foreground transition-colors">Domains</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{domain.name}</span>
        </nav>
      </FadeInUp>

      {/* Domain Header */}
      <FadeInUp delay={0.05}>
        <div className="mb-8">
          <h1 className="type-display text-2xl tracking-tight text-foreground sm:text-3xl">
            {domain.name} Interviews
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {domain.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 text-[11px] text-muted-foreground">
              <BookOpen className="h-3 w-3" /> {domain.totalQuestions} questions
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 text-[11px] text-muted-foreground">
              <Users className="h-3 w-3" /> {domain.roles.length} roles
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 text-[11px] text-muted-foreground">
              <Layers className="h-3 w-3" /> {domain.experiences.length} experience levels
            </span>
          </div>
        </div>
      </FadeInUp>

      {/* Role Selection */}
      <FadeInUp delay={0.1}>
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-foreground mb-1.5">Select your role</h2>
          <p className="text-xs text-muted-foreground mb-4">Content will adapt to your chosen role.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {domain.roles.map((role) => (
              <motion.button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.15 }}
                className={`relative flex flex-col items-start rounded-xl border p-4 text-left transition-colors duration-200 ease-out cursor-pointer ${
                  selectedRole === role.id
                    ? "border-primary/40 bg-primary/[0.04] glow-primary"
                    : "border-border/40 bg-card hover:border-border hover:glow-soft"
                }`}
              >
                {selectedRole === role.id && (
                  <motion.div
                    layoutId="role-selected"
                    className="absolute inset-0 rounded-xl border-2 border-primary/30"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <h3 className="text-sm font-semibold text-foreground mb-1">{role.name}</h3>
                <p className="text-xs text-muted-foreground mb-2.5 leading-relaxed">{role.desc}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {role.tech.map((t) => (
                    <Tag key={t} className="text-[10px]">{t}</Tag>
                  ))}
                </div>
                <span className="text-[11px] text-muted-foreground tabular-nums">{role.questions} questions</span>
              </motion.button>
            ))}
          </div>
        </div>
      </FadeInUp>

      {/* Experience Selection */}
      <FadeInUp delay={0.15}>
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-foreground mb-1.5">Select your experience level</h2>
          <p className="text-xs text-muted-foreground mb-4">Questions will be filtered to match your experience.</p>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {domain.experiences.map((exp) => (
              <motion.button
                key={exp.id}
                type="button"
                onClick={() => setSelectedExp(exp.id)}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.15 }}
                className={`relative flex flex-col items-start rounded-xl border p-3.5 text-left transition-colors duration-200 ease-out cursor-pointer ${
                  selectedExp === exp.id
                    ? "border-primary/40 bg-primary/[0.04] glow-primary"
                    : "border-border/40 bg-card hover:border-border hover:glow-soft"
                }`}
              >
                {selectedExp === exp.id && (
                  <motion.div
                    layoutId="exp-selected"
                    className="absolute inset-0 rounded-xl border-2 border-primary/30"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <span className="text-sm font-semibold text-foreground">{exp.label}</span>
                <span className="text-[11px] text-muted-foreground">{exp.desc}</span>
                <span className="text-[10px] text-muted-foreground/70 mt-1 tabular-nums">{exp.questions} questions</span>
              </motion.button>
            ))}
          </div>
        </div>
      </FadeInUp>

      {/* Learning Scope Preview */}
      <AnimatePresence>
        {canProceed && previewTopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-8"
          >
            <div className="rounded-xl border border-border/40 bg-card p-5 glow-soft">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {"You'll study"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {previewTopics.map((topic, i) => (
                  <motion.span
                    key={topic}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                  >
                    <Tag className="px-3 py-1.5 text-xs">{topic}</Tag>
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <FadeInUp delay={0.2}>
        <div className="flex items-center gap-3">
          <Button
            size="lg"
            disabled={!canProceed}
            className="h-10 gap-1.5 rounded-xl px-6 text-sm font-medium shadow-lg shadow-primary/15 transition-colors duration-200 ease-out hover:shadow-xl hover:shadow-primary/25 disabled:opacity-40 disabled:shadow-none"
          >
            Continue to Learning Path
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          {!canProceed && (
            <span className="text-xs text-muted-foreground">
              Select a role and experience level to continue
            </span>
          )}
        </div>
      </FadeInUp>
    </div>
  );
}
