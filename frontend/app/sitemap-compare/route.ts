import { NextResponse } from "next/server";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";
const NOW = new Date().toISOString().split("T")[0];
const COMPARISONS = [
  "kafka-vs-rabbitmq","sql-vs-nosql","redis-vs-memcached","mysql-vs-postgresql",
  "docker-vs-kubernetes","rest-vs-graphql","microservices-vs-monolith","aws-vs-gcp-vs-azure",
  "spring-boot-vs-quarkus","django-vs-fastapi","maven-vs-gradle","junit-vs-testng",
  "grpc-vs-rest","mongodb-vs-postgresql","celery-vs-rq","airflow-vs-prefect",
  "react-vs-vue-vs-angular","nextjs-vs-nuxtjs","kubernetes-vs-docker-swarm",
  "terraform-vs-ansible","sync-vs-async","jwt-vs-session","sql-vs-orm","unit-vs-integration-testing",
];
export async function GET() {
  const lines = [
    `  <url><loc>${SITE_URL}/compare</loc><lastmod>${NOW}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
    ...COMPARISONS.map(c =>
      `  <url><loc>${SITE_URL}/compare/${c}</loc><lastmod>${NOW}</lastmod><changefreq>monthly</changefreq><priority>0.85</priority></url>`
    ),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join("\n")}\n</urlset>`;
  return new NextResponse(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
}
