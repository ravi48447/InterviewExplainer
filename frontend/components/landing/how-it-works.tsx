"use client";

import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";
import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "Choose your role", description: "Select your domain and experience level" },
  { number: "02", title: "Practice targeted questions", description: "Focus on what actually gets asked" },
  { number: "03", title: "Track mastery", description: "See exactly where you stand" },
  { number: "04", title: "Nail the interview", description: "Walk in confident and prepared" },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-16 sm:py-20 lg:px-6">
      <div className="mx-auto max-w-6xl">
        <FadeInUp>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
              How it works
            </h2>
            <p className="mt-2 text-muted-foreground">
              Four simple steps to interview confidence
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="relative flex flex-col items-start rounded-xl border border-border/30 bg-card/50 p-5"
              >
                <span className="text-3xl font-bold text-primary/10 mb-2 leading-none">
                  {step.number}
                </span>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden h-px w-3.5 -translate-y-1/2 translate-x-full bg-border/50 lg:block" />
                )}
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
