"use client";

import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";
import { motion } from "framer-motion";
import { Route, MessageSquareText, BarChart3, Mic } from "lucide-react";

const features = [
  {
    icon: Route,
    title: "Role-based paths",
    description: "Content adapts to your domain, role, and experience level.",
  },
  {
    icon: MessageSquareText,
    title: "Interview-grade questions",
    description: "Practice with questions from actual interview experiences.",
  },
  {
    icon: BarChart3,
    title: "Mastery tracking",
    description: "Visual progress so you always know where you stand.",
  },
  {
    icon: Mic,
    title: "Mock interviews",
    description: "Timed sessions with real performance feedback.",
  },
];

export function WhySection() {
  return (
    <section className="px-4 py-16 sm:py-20 lg:px-6 bg-muted/20">
      <div className="w-full min-w-0">
        <FadeInUp>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
              Why InterviewExplainer?
            </h2>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-start rounded-xl glass p-5"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
