import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";
const NOW = new Date().toISOString().split("T")[0];
const DSA_ROOT = path.join(process.cwd(), "..", "content", "dsa");

const PATTERNS = [
  "two-pointers","sliding-window","hash-map","binary-search","fast-slow-pointers",
  "merge-intervals","cyclic-sort","tree-bfs","tree-dfs","graph-bfs-dfs",
  "dynamic-programming","backtracking","monotonic-stack","heap-top-k","trie","bit-manipulation",
];
const CATEGORIES = ["arrays","strings","linked-lists","trees","graphs","stack-queue","heap","tries","math","backtracking"];
const COMPANIES = ["amazon","google","microsoft","meta","apple"];

function xmlUrl(loc: string, priority: number, freq = "weekly") {
  return `  <url><loc>${loc}</loc><lastmod>${NOW}</lastmod><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`;
}

function getProblemSlugs(): string[] {
  if (!fs.existsSync(DSA_ROOT)) return [];
  const slugs: string[] = [];
  const cats = fs.readdirSync(DSA_ROOT).filter(d => fs.statSync(path.join(DSA_ROOT, d)).isDirectory());
  for (const cat of cats) {
    const files = fs.readdirSync(path.join(DSA_ROOT, cat)).filter(f => f.endsWith(".json") && !f.startsWith("_"));
    for (const f of files) slugs.push(f.replace(".json", ""));
  }
  return slugs;
}

export async function GET() {
  const urls: string[] = [
    xmlUrl(`${SITE_URL}/dsa`, 0.95),
    xmlUrl(`${SITE_URL}/dsa/easy`, 0.85),
    xmlUrl(`${SITE_URL}/dsa/medium`, 0.85),
    xmlUrl(`${SITE_URL}/dsa/hard`, 0.85),
  ];

  for (const p of PATTERNS) urls.push(xmlUrl(`${SITE_URL}/dsa/pattern/${p}`, 0.85));
  for (const c of CATEGORIES) urls.push(xmlUrl(`${SITE_URL}/dsa/category/${c}`, 0.8));
  for (const co of COMPANIES) urls.push(xmlUrl(`${SITE_URL}/dsa/company/${co}`, 0.85));

  for (const slug of getProblemSlugs()) {
    urls.push(xmlUrl(`${SITE_URL}/dsa/problem/${slug}`, 0.7, "monthly"));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
  });
}
