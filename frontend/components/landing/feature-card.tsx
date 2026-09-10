"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function FeatureCard({ href, children, className }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col h-full bg-card border border-border rounded-xl p-6",
        "transition-all duration-[250ms] ease-out transform-gpu will-change-transform",
        "hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-primary/10",
        "hover:border-primary/40 hover:-translate-y-[6px]",
        className
      )}
    >
      {children}
    </Link>
  );
}

interface FeatureCardIconProps {
  icon: React.ReactNode;
  gradient: string;
}

export function FeatureCardIcon({ icon, gradient }: FeatureCardIconProps) {
  return (
    <div
      className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-5",
        "bg-gradient-to-br transition-transform duration-[250ms] ease-out",
        "group-hover:scale-[1.12]",
        gradient
      )}
    >
      {icon}
    </div>
  );
}

export function FeatureCardHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xl font-bold text-foreground mb-2.5 group-hover:text-primary transition-colors duration-[250ms]">
      {children}
    </h3>
  );
}

export function FeatureCardDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14.5px] text-muted-foreground leading-relaxed mb-6 flex-1">
      {children}
    </p>
  );
}

interface FeatureCardFooterProps {
  stat: string;
}

export function FeatureCardFooter({ stat }: FeatureCardFooterProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
      <span className="text-xs font-bold text-primary tracking-wide uppercase">
        {stat}
      </span>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1.5 transition-all duration-[250ms]" />
    </div>
  );
}
