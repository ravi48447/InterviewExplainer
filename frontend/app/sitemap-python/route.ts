import { NextResponse } from "next/server";
import { listAllQuestionParams, getVisibleStackSlugs } from "@/lib/content-reader";
import { EXPERIENCE_LEVELS } from "@/lib/levels";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";
const NOW = new Date().toISOString().split("T")[0];

const PYTHON_TRACKS = ["backend", "fullstack", "data-engineering", "ml-ai"];
const LEVELS = ["beginner", "intermediate"] as const;

function xmlUrl(loc: string, priority: number, freq = "weekly") {
  return `  <url><loc>${loc}</loc><lastmod>${NOW}</lastmod><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`;
}

export async function GET() {
  const urls: string[] = [
    xmlUrl(`${SITE_URL}/interview/python`, 0.95),
  ];

  for (const track of PYTHON_TRACKS) {
    urls.push(xmlUrl(`${SITE_URL}/interview/python/${track}`, 0.9));
    for (const level of LEVELS) {
      const domainSlug = `python-${track}-${level}`;
      urls.push(xmlUrl(`${SITE_URL}/interview/python/${track}/${level}`, 0.85));
      const stacks = getVisibleStackSlugs(domainSlug);
      for (const stack of stacks) {
        urls.push(xmlUrl(`${SITE_URL}/interview/python/${track}/${level}/${stack}`, 0.8));
      }
    }
  }

  try {
    const questions = listAllQuestionParams();
    for (const { domainSlug, stackSlug, questionSlug } of questions) {
      if (!domainSlug.startsWith("python-")) continue;
      const parts = domainSlug.split("-");
      if (parts.length >= 3) {
        const track = parts[1];
        const levelSuffix = parts.slice(2).join("-");
        const levelKey = Object.entries(EXPERIENCE_LEVELS).find(([, v]) =>
          v.legacyDirs?.includes(levelSuffix)
        )?.[0] ?? levelSuffix;
        urls.push(xmlUrl(`${SITE_URL}/interview/python/${track}/${levelKey}/${stackSlug}/${questionSlug}`, 0.6, "monthly"));
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
