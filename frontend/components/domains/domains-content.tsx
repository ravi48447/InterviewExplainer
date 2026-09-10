"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Cloud, Layout, Server, Database, Cpu, Sparkles } from "lucide-react";
import { EXPERIENCE_LEVELS, LEVEL_KEYS, type ExperienceLevelKey } from "@/lib/levels";

const roleFilters = ["All", "Backend", "Frontend", "Fullstack", "DevOps", "Data Analyst"];

const domains = [
  {
    id: 1,
    slug: "java",
    name: "Java",
    specialization: "Backend & Fullstack",
    description: "Core Java, JVM internals, concurrency, Spring, and SQL for backend interviews.",
    roles: ["Backend", "Fullstack"],
    experience: ["beginner", "intermediate", "advanced"] as ExperienceLevelKey[],
    techStack: ["Core Java", "Spring Boot", "JVM", "Concurrency", "Hibernate", "SQL"],
    questions: 450,
    icon: Code2,
    categories: ["OOP", "Collections", "Threading", "Spring", "JDBC", "Design Patterns"],
  },
  {
    id: 2,
    slug: "python",
    name: "Python",
    specialization: "Backend & Data",
    description: "Python for backend, scripting, data processing, and automation roles.",
    roles: ["Backend", "Data Analyst"],
    experience: ["beginner", "intermediate", "advanced"] as ExperienceLevelKey[],
    techStack: ["Django", "FastAPI", "Pandas", "NumPy", "SQLAlchemy", "Celery"],
    questions: 380,
    icon: Cpu,
    categories: ["Core Python", "OOP", "Data Structures", "Django", "APIs", "Testing"],
  },
  {
    id: 3,
    slug: "devops",
    name: "DevOps",
    specialization: "Infrastructure & Cloud",
    description: "Linux, Docker, Kubernetes, CI/CD, cloud platforms, and monitoring.",
    roles: ["DevOps"],
    experience: ["intermediate", "advanced"] as ExperienceLevelKey[],
    techStack: ["Docker", "Kubernetes", "Jenkins", "Terraform", "AWS", "Prometheus"],
    questions: 320,
    icon: Cloud,
    categories: ["Linux", "Containers", "Orchestration", "CI/CD", "Cloud", "Monitoring"],
  },
  {
    id: 4,
    slug: "frontend",
    name: "Frontend",
    specialization: "UI & Interaction",
    description: "React, TypeScript, CSS, performance, accessibility, and browser APIs.",
    roles: ["Frontend", "Fullstack"],
    experience: ["beginner", "intermediate", "advanced"] as ExperienceLevelKey[],
    techStack: ["React", "TypeScript", "Next.js", "CSS-in-JS", "Tailwind", "Testing"],
    questions: 410,
    icon: Layout,
    categories: ["React Core", "Hooks", "State Mgmt", "CSS", "Performance", "A11y"],
  },
  {
    id: 5,
    slug: "system-design",
    name: "System Design",
    specialization: "Architecture & Scale",
    description: "Load balancing, caching, databases, microservices, and distributed systems.",
    roles: ["Backend", "Fullstack"],
    experience: ["intermediate", "advanced"] as ExperienceLevelKey[],
    techStack: ["Load Balancers", "Caching", "Databases", "Message Queues", "CDN", "Microservices"],
    questions: 280,
    icon: Server,
    categories: ["Scalability", "Databases", "Caching", "Messaging", "Design Patterns", "Case Studies"],
  },
  {
    id: 6,
    slug: "data-sql",
    name: "Data & SQL",
    specialization: "Analytics & Queries",
    description: "Joins, subqueries, indexing, normalization, transactions, and analytics.",
    roles: ["Data Analyst", "Backend"],
    experience: ["beginner", "intermediate"] as ExperienceLevelKey[],
    techStack: ["PostgreSQL", "MySQL", "Window Functions", "CTEs", "Indexing", "ETL"],
    questions: 290,
    icon: Database,
    categories: ["Joins", "Aggregation", "Optimization", "Schema Design", "Transactions", "Analytics"],
  },
];

export function DomainsContent() {
  const [activeExp, setActiveExp] = useState<"All" | ExperienceLevelKey>("All");
  const [activeRole, setActiveRole] = useState("All");
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);

  const filteredDomains = domains.filter((d) => {
    const expMatch = activeExp === "All" || d.experience.includes(activeExp);
    const roleMatch = activeRole === "All" || d.roles.includes(activeRole);
    return expMatch && roleMatch;
  });

  return (
    <div className="w-full min-w-0 px-4 py-8 lg:px-6">
      {/* Page header */}
      <FadeInUp>
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
            Choose your interview domain
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground text-pretty leading-relaxed">
            Each domain is structured by role, technology, and experience level.
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            You can switch domains anytime.
          </p>
        </div>
      </FadeInUp>

      {/* Filters */}
      <FadeInUp delay={0.08}>
        <div className="mb-8 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground mr-1.5 w-16 shrink-0">Experience</span>
            {(["All", ...LEVEL_KEYS] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveExp(filter as "All" | ExperienceLevelKey)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  activeExp === filter
                    ? "border-primary/40 bg-primary/8 text-primary"
                    : "border-border/50 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {filter === "All" ? "All" : `${EXPERIENCE_LEVELS[filter].label} (${EXPERIENCE_LEVELS[filter].range})`}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground mr-1.5 w-16 shrink-0">Role</span>
            {roleFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveRole(filter)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  activeRole === filter
                    ? "border-primary/40 bg-primary/8 text-primary"
                    : "border-border/50 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </FadeInUp>

      {/* Domain cards grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeExp}-${activeRole}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12"
        >
          {filteredDomains.map((domain, i) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link href={`/domain/${domain.slug}`}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onHoverStart={() => setHoveredDomain(domain.slug)}
                  onHoverEnd={() => setHoveredDomain(null)}
                  className="group relative flex h-full flex-col rounded-xl border border-border/50 bg-card p-5 cursor-pointer transition-all hover:glow-soft hover:border-primary/15"
                  role="link"
                  tabIndex={0}
                  aria-label={`${domain.name} interview domain, ${domain.questions} questions`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8">
                        <domain.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground leading-none">
                          {domain.name}
                        </h3>
                        <span className="text-[11px] text-muted-foreground">
                          {domain.specialization}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground tabular-nums">
                      {domain.questions}q
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs leading-relaxed text-muted-foreground mb-3">
                    {domain.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="mb-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1.5 font-medium">
                      Tech Stack
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {domain.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Categories preview */}
                  <div className="mb-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1.5 font-medium">
                      Categories
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {domain.categories.slice(0, 4).map((cat) => (
                        <span
                          key={cat}
                          className="rounded bg-accent/50 px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground/70"
                        >
                          {cat}
                        </span>
                      ))}
                      {domain.categories.length > 4 && (
                        <span className="text-[10px] text-muted-foreground/50">
                          +{domain.categories.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Roles + Experience */}
                  <div className="flex items-center gap-3 mb-3 mt-auto">
                    <div className="flex gap-1">
                      {domain.roles.map((role) => (
                        <span
                          key={role}
                          className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                    <div className="h-3 w-px bg-border/50" />
                    <div className="flex gap-1">
                      {LEVEL_KEYS.map((band) => (
                        <span
                          key={band}
                          className={`rounded px-1 py-0.5 text-[10px] font-medium ${
                            domain.experience.includes(band)
                              ? "bg-primary/8 text-primary"
                              : "bg-muted/40 text-muted-foreground/30"
                          }`}
                        >
                          {EXPERIENCE_LEVELS[band].range}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA strip */}
                  <div className="flex items-center justify-end pt-3 border-t border-border/30">
                    <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-all group-hover:opacity-100">
                      Explore Domain
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Decision assist */}
      <FadeInUp>
        <div className="rounded-xl glass p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Not sure where to start?
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4 max-w-sm mx-auto">
            Let us guide you to the right domain based on your role and experience.
          </p>
          <div className="flex items-center justify-center gap-2.5">
            <Button className="h-9 gap-1.5 rounded-lg px-5 text-xs font-medium shadow-lg shadow-primary/15">
              Start Guided Prep
              <ArrowRight className="h-3 w-3" />
            </Button>
            <Button variant="outline" className="h-9 rounded-lg px-5 text-xs font-medium bg-transparent">
              Explore Popular
            </Button>
          </div>
        </div>
      </FadeInUp>
    </div>
  );
}
