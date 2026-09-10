/**
 * Phase 15 — Learning surfaces V2 canonical types.
 *
 * Static catalog hub types for the learning surfaces:
 *   /prep          → prep hub (dynamic, pillar + module cards)
 *   /roadmaps      → roadmaps hub (timeline + domain + DSA plans)
 *   /cheatsheets   → cheatsheets hub (language + concept + tool sheets)
 *   /behavioral    → behavioral hub (STAR + categories + company-specific)
 *   /career        → career hub (sections + articles)
 *
 * The prep/[pillarSlug] route is already V2-canonical (lib/hierarchy) and
 * is not covered here.
 */

import type { LucideIcon } from "lucide-react";

/* ── Roadmaps ── */

export interface DomainRoadmap {
  slug: string;
  name: string;
  levels: string[];
  stacks: string;
  gradient: string;
  weeks: string;
}

export interface DsaPlan {
  slug: string;
  name: string;
  count: number;
  duration: string;
  desc: string;
  tag: string;
  tagColor: string;
}

export interface TimelinePlan {
  duration: string;
  iconKey: string;
  desc: string;
  ideal: string;
  color: string;
  bg: string;
}

/* ── Cheatsheets ── */

export interface CheatsheetEntry {
  slug: string;
  name: string;
  desc: string;
  items?: number;
  iconKey: string;
  color: string;
  bg: string;
}

/* ── Behavioral ── */

export interface BehavioralCategory {
  slug: string;
  name: string;
  count: number;
  desc: string;
  iconKey: string;
  color: string;
  bg: string;
}

export interface CompanySpecific {
  slug: string;
  name: string;
  count: number;
  desc: string;
  tag: string;
  tagColor: string;
}

export interface StarStep {
  letter: string;
  title: string;
  desc: string;
  color: string;
}

/* ── Career ── */

export interface CareerSection {
  slug: string;
  name: string;
  desc: string;
  iconKey: string;
  color: string;
  bg: string;
  articles: number;
  highlight: string;
}

export interface QuickGuide {
  title: string;
  category: string;
  readTime: string;
  slug: string;
  iconKey: string;
}

/* ── Prep hub (dynamic) ── */

export interface ModuleCount {
  entry: import("@/lib/seo-slugs").SeoModuleEntry;
  questionCount: number;
}

export interface PillarWithStats {
  pillar: import("@/lib/seo-pillars").PillarHubEntry;
  moduleCount: number;
  questionCount: number;
}

export type ModulePillarGroup = { pillarName: string; modules: ModuleCount[] };

export interface PrepHubData {
  pillarStats: PillarWithStats[];
  moduleGroups: ModulePillarGroup[];
  jfiGroups: ModulePillarGroup[];
  jbiGroups: ModulePillarGroup[];
  architecturePillars: PillarWithStats[];
  javaPlatformPillars: PillarWithStats[];
  totalModules: number;
  totalQuestions: number;
}

/** Shared icon-key union for all learning surfaces. */
export type LearningIconKey =
  | "map"
  | "book-open"
  | "clock"
  | "target"
  | "code2"
  | "layers"
  | "briefcase"
  | "graduation-cap"
  | "rocket"
  | "calendar"
  | "check-circle"
  | "trending-up"
  | "zap"
  | "file-text"
  | "database"
  | "server"
  | "globe"
  | "network"
  | "shield"
  | "terminal"
  | "git-branch"
  | "cloud"
  | "cpu"
  | "wrench"
  | "workflow"
  | "container"
  | "brain"
  | "message-square"
  | "users"
  | "alert-triangle"
  | "star"
  | "lightbulb"
  | "heart"
  | "award"
  | "dollar-sign"
  | "building-2"
  | "search"
  | "compass"
  | "sparkles";

/** Convenience type for icon-bearing records (kept for component ergonomics). */
export type IconComponent = LucideIcon;
