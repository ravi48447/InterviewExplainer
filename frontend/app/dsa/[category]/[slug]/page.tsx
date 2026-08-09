import { permanentRedirect, notFound } from "next/navigation";
import { getDSAIndex, getDSAProblem } from "@/lib/contentV2";

/**
 * Legacy route. The canonical URL for every DSA problem is
 * `/dsa/problem/<slug>` — it's shorter, matches how we link from modules,
 * sheets, hub, and all editorial copy, and it's what the hero JSON-LD
 * declares.
 *
 * This page used to render its own (duplicate) copy of the problem, which
 * created two self-canonicalising URLs for the same content — a classic
 * duplicate-content trap. We now 301 to the canonical URL whenever the
 * category+slug combination resolves to a real problem, and 404 otherwise.
 *
 * Fully static (SSG): all valid {category, slug} pairs are enumerated at
 * build time (the build container has a filesystem). `dynamicParams = false`
 * makes any unknown pair 404 instead of rendering on-demand, which would
 * require `fs` at runtime — unavailable on Cloudflare Workers.
 */

type PageParams = { category: string; slug: string };

// Pre-render every legacy category/slug pair at build time. Unknown pairs
// 404 rather than hitting the filesystem at request time.
export const dynamicParams = false;
export const dynamic = "force-static";

export async function generateStaticParams() {
  const index = getDSAIndex();
  const params: PageParams[] = [];
  for (const problem of index?.problems ?? []) {
    if (problem.category && problem.slug) {
      params.push({ category: problem.category, slug: problem.slug });
    }
  }
  return params;
}

export default async function RedirectToCanonicalProblem({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { category, slug } = await params;
  const problem = getDSAProblem(category, slug);
  if (!problem) notFound();
  permanentRedirect(`/dsa/problem/${slug}`);
}
