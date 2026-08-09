import { NextResponse } from "next/server";
import { listAllQuestionParams, getVisibleStackSlugs } from "@/lib/content-reader";
import { EXPERIENCE_LEVELS } from "@/lib/levels";
import { SEO_MODULES, getSeoSlugForModule } from "@/lib/seo-slugs";
import { PILLAR_HUB_SLUGS } from "@/lib/seo-pillars";

// Pre-render the sitemap at build time. The handlers below walk the content
// filesystem (listAllQuestionParams / getVisibleStackSlugs), which only
// exists at build time — not on Cloudflare Workers. `force-static` freezes
// the build-time output so the worker serves the snapshot without re-running.
export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";
const NOW = new Date().toISOString().split("T")[0];

const JAVA_TRACKS = ["backend", "fullstack"];
const LEVELS = ["beginner", "intermediate"] as const;

function xmlUrl(loc: string, priority: number, freq = "weekly") {
  return `  <url><loc>${loc}</loc><lastmod>${NOW}</lastmod><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`;
}

export async function GET() {
  const urls: string[] = [];

  // ── SEO prep category index + pillar hubs ──────────────────────────────
  // /prep is the top-level Quick-Links index; pillar hubs (/cloud, /spring,
  // etc.) are curated prep categories. These carry the highest priority
  // because they're the primary SEO landing surfaces.
  urls.push(xmlUrl(`${SITE_URL}/prep`, 1.0));
  for (const pillarSlug of PILLAR_HUB_SLUGS) {
    urls.push(xmlUrl(`${SITE_URL}/${pillarSlug}`, 0.95));
  }

  // ── Module SEO landing pages — /{seoSlug} ──────────────────────────────
  // e.g. /spring-boot-interview-questions, /kafka-interview-questions.
  // One per canonical slug; alt slugs are not emitted (they 301 to canonical).
  for (const m of SEO_MODULES) {
    urls.push(xmlUrl(`${SITE_URL}/${m.seoSlug}`, 0.9));
  }

  // Lang + track + level hub pages
  for (const track of JAVA_TRACKS) {
    urls.push(xmlUrl(`${SITE_URL}/interview/java/${track}`, 0.9));
    for (const level of LEVELS) {
      const domainSlug = `java-${track}-${level}`;
      urls.push(xmlUrl(`${SITE_URL}/interview/java/${track}/${level}`, 0.85));
      const stacks = getVisibleStackSlugs(domainSlug);
      for (const stack of stacks) {
        urls.push(xmlUrl(`${SITE_URL}/interview/java/${track}/${level}/${stack}`, 0.8));
      }
    }
  }

  // Question pages
  try {
    const questions = listAllQuestionParams();
    for (const { domainSlug, stackSlug, questionSlug } of questions) {
      if (!domainSlug.startsWith("java-")) continue;
      const parts = domainSlug.split("-");
      if (parts.length >= 3) {
        const track = parts[1];
        const levelSuffix = parts.slice(2).join("-");
        const levelKey = Object.entries(EXPERIENCE_LEVELS).find(([, v]) =>
          v.legacyDirs.includes(levelSuffix)
        )?.[0];
        if (levelKey) {
          urls.push(xmlUrl(`${SITE_URL}/interview/java/${track}/${levelKey}/${stackSlug}/${questionSlug}`, 0.6, "monthly"));
        }
      }
      urls.push(xmlUrl(`${SITE_URL}/${domainSlug}/${stackSlug}/${questionSlug}`, 0.5, "monthly"));

      // ── SEO URL question detail — /{seoSlug}/{questionSlug} ──────────
      // Only the intermediate level (our SEO default) gets a question-
      // level SEO URL so we don't emit duplicate content across levels.
      if (domainSlug.endsWith("-intermediate")) {
        const seoSlug = getSeoSlugForModule(domainSlug, stackSlug);
        if (seoSlug) {
          urls.push(xmlUrl(`${SITE_URL}/${seoSlug}/${questionSlug}`, 0.7, "monthly"));
        }
      }
    }
  } catch { /* skip */ }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
  });
}
