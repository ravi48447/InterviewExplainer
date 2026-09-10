import { NextResponse } from "next/server";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";
const NOW = new Date().toISOString().split("T")[0];
const TOOLS = [
  "kafka","redis","docker","kubernetes","aws","gcp","azure","postgresql","mysql","mongodb",
  "elasticsearch","jenkins","github-actions","terraform","ansible","spring-boot","django",
  "fastapi","react","nextjs","graphql","grpc","rabbitmq","airflow","spark","helm",
];
const TOPICS = [
  "system-design","microservices","distributed-systems","databases","caching","api-design",
  "concurrency","security","observability","event-driven-architecture","clean-architecture",
  "domain-driven-design","cap-theorem","data-modeling","cloud-native","devops","testing","performance",
];
export async function GET() {
  const lines = [
    `  <url><loc>${SITE_URL}/tools</loc><lastmod>${NOW}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
    `  <url><loc>${SITE_URL}/topics</loc><lastmod>${NOW}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
    ...TOOLS.map(t => `  <url><loc>${SITE_URL}/tools/${t}</loc><lastmod>${NOW}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`),
    ...TOPICS.map(t => `  <url><loc>${SITE_URL}/topics/${t}</loc><lastmod>${NOW}</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join("\n")}\n</urlset>`;
  return new NextResponse(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
}
