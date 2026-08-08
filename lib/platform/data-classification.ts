/**
 * data-classification.ts — Data-sensitivity classification + retention rules
 * (P14-T165..T188). Drives privacy engineering: what we store, for how long,
 * and the purpose statement surfaced in the privacy notice.
 */

import type { DataAsset, DataSensitivity } from "./platform-types";

/** Canonical asset inventory. Mirrors the production data map (P14-T170). */
export const DATA_ASSETS: DataAsset[] = [
  {
    id: "user-account",
    name: "User account record",
    system: "auth",
    sensitivity: "personal",
    retentionDays: 365 * 2,
    purpose: "Identity, authentication, and account preferences.",
  },
  {
    id: "resume",
    name: "Uploaded resume document + parsed profile",
    system: "resume-intelligence",
    sensitivity: "sensitive",
    retentionDays: 365,
    purpose: "Resume intelligence, JD matching, and personalized prep.",
  },
  {
    id: "job-target",
    name: "Saved job description target",
    system: "resume-intelligence",
    sensitivity: "personal",
    retentionDays: 180,
    purpose: "Skill-gap analysis and interview preparation.",
  },
  {
    id: "applications",
    name: "Opportunity application pipeline",
    system: "job-discovery",
    sensitivity: "personal",
    retentionDays: 365 * 2,
    purpose: "Application tracking and outcome analytics.",
  },
  {
    id: "interview-session",
    name: "Mock interview session + transcripts",
    system: "mock-interviews",
    sensitivity: "sensitive",
    retentionDays: 365,
    purpose: "AI interview evaluation and performance feedback.",
  },
  {
    id: "community-contribution",
    name: "Community UGC contribution",
    system: "community",
    sensitivity: "public",
    retentionDays: undefined,
    purpose: "Shared interview intelligence; user-controlled deletion.",
  },
  {
    id: "moderation-log",
    name: "Moderation action log",
    system: "moderation",
    sensitivity: "internal",
    retentionDays: 365,
    purpose: "Audit trail for community moderation decisions.",
  },
  {
    id: "audit-log",
    name: "Security audit log",
    system: "platform",
    sensitivity: "internal",
    retentionDays: 365,
    purpose: "Security investigation and compliance evidence.",
  },
];

const SENSITIVITY_RANK: Record<DataSensitivity, number> = {
  public: 0,
  internal: 1,
  personal: 2,
  sensitive: 3,
};

export function classifySensitivity(input: string): DataSensitivity {
  const s = input.toLowerCase();
  if (s.includes("resume") || s.includes("transcript") || s.includes("pii")) return "sensitive";
  if (s.includes("email") || s.includes("name") || s.includes("application")) return "personal";
  if (s.includes("public") || s.includes("community")) return "public";
  return "internal";
}

/** Whether an asset may be logged in plaintext. P14-T179. */
export function isLoggable(asset: DataAsset): boolean {
  return SENSITIVITY_RANK[asset.sensitivity] < SENSITIVITY_RANK.personal;
}

/** Whether an asset must be purged after its retention window. */
export function hasRetention(asset: DataAsset): boolean {
  return typeof asset.retentionDays === "number" && asset.retentionDays > 0;
}
