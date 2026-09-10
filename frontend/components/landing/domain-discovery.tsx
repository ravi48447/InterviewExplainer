"use client";

import Link from "next/link";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Cloud, Layout, Server, Database, Cpu } from "lucide-react";

const domains = [
  {
    name: "Java",
    slug: "java",
    tagline: "Backend & Fullstack",
    tech: ["Spring", "JVM", "SQL", "Concurrency"],
    questions: 450,
    icon: Code2,
  },
  {
    name: "Python",
    slug: "python",
    tagline: "Backend & Data",
    tech: ["Django", "FastAPI", "Pandas", "Scripts"],
    questions: 380,
    icon: Cpu,
  },
  {
    name: "DevOps",
    slug: "devops",
    tagline: "Infrastructure & Cloud",
    tech: ["Docker", "K8s", "CI/CD", "AWS"],
    questions: 320,
    icon: Cloud,
  },
  {
    name: "Frontend",
    slug: "frontend",
    tagline: "UI & Interaction",
    tech: ["React", "TypeScript", "CSS", "A11y"],
    questions: 410,
    icon: Layout,
  },
  {
    name: "System Design",
    slug: "system-design",
    tagline: "Architecture & Scale",
    tech: ["Caching", "LB", "Microservices", "DB"],
    questions: 280,
    icon: Server,
  },
  {
    name: "Data & SQL",
    slug: "data-sql",
    tagline: "Analytics & Queries",
    tech: ["Joins", "Indexing", "Normalization", "ETL"],
    questions: 290,
    icon: Database,
  },
];

export function DomainDiscovery() {
  return (
    <section id="domain-discovery" className="px-4 py-16 sm:py-20 lg:px-6">
      <div className="w-full min-w-0">
        <FadeInUp>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
              Explore interview domains
            </h2>
            <p className="mt-2 text-muted-foreground text-pretty">
              Choose what you want to prepare for
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain) => (
            <StaggerItem key={domain.slug}>
              <Link href="/domains">
                <motion.div
                  whileHover={{ y: -3, scale: 1.005 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="group relative flex flex-col rounded-xl border border-border/50 bg-card p-5 transition-all hover:glow-soft hover:border-primary/15 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8">
                      <domain.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground leading-none">
                        {domain.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {domain.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {domain.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-muted/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/30">
                    <span className="text-xs text-muted-foreground">
                      {domain.questions} questions
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5">
                      Explore <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
