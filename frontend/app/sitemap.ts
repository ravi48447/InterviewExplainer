/**
 * Sitemap Index — points to per-hub sitemap files.
 * Each hub has its own sitemap for clean crawl budget management.
 */
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

import { SEO_MODULES } from "@/lib/seo-slugs";
import { PILLAR_HUBS } from "@/lib/seo-pillars";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Primary static hub pages — highest priority
  const hubs: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/interview`, lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/prep`, lastModified, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/dsa`, lastModified, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/tools`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/topics`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/compare`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/companies`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/domains`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/support`, lastModified, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/cookies`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Pillar hubs — standalone topic landings that rank independently of the
  // JBI track (e.g. /spring, /java, /distributed-systems). These are the
  // most important SEO surfaces after the homepage and are served at root-
  // level URLs via proxy.ts rewrite.
  const pillarHubs: MetadataRoute.Sitemap = PILLAR_HUBS.map((p) => ({
    url: `${SITE_URL}/${p.pillarSlug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.95,
  }));

  // SEO module landing pages — one per content module (/spring-boot-interview-
  // questions, /core-java-interview-questions, …). Alt slugs are intentionally
  // omitted since they 301 to the canonical and must not appear here.
  const seoHubs: MetadataRoute.Sitemap = SEO_MODULES.map((m) => ({
    url: `${SITE_URL}/${m.seoSlug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...hubs, ...pillarHubs, ...seoHubs];
}
