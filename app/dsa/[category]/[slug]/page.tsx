import { permanentRedirect, notFound } from "next/navigation";
import { getDSAProblem } from "@/lib/contentV2";

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
 */

type PageParams = { category: string; slug: string };

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
