import { NextResponse } from "next/server";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";
const NOW = new Date().toISOString().split("T")[0];
const COMPANIES: Record<string, string[]> = {
  amazon:    ["overview","dsa","system-design","behavioral","java-backend"],
  google:    ["overview","dsa","system-design","coding-rounds"],
  microsoft: ["overview","dsa","system-design","azure-specific"],
  meta:      ["overview","dsa","system-design","react-specific"],
  netflix:   ["overview","dsa","system-design"],
  apple:     ["overview","dsa","system-design","behavioral"],
  startups:  ["seed-stage","series-a","series-b-plus"],
};
export async function GET() {
  const lines = [
    `  <url><loc>${SITE_URL}/companies</loc><lastmod>${NOW}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
  ];
  for (const [company, types] of Object.entries(COMPANIES)) {
    lines.push(`  <url><loc>${SITE_URL}/companies/${company}</loc><lastmod>${NOW}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`);
    for (const type of types) {
      lines.push(`  <url><loc>${SITE_URL}/companies/${company}/${type}</loc><lastmod>${NOW}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
      // DSA company page
      lines.push(`  <url><loc>${SITE_URL}/dsa/company/${company}</loc><lastmod>${NOW}</lastmod><changefreq>monthly</changefreq><priority>0.85</priority></url>`);
    }
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join("\n")}\n</urlset>`;
  return new NextResponse(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
}
