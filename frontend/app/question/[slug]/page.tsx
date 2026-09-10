import { redirect, notFound } from "next/navigation";
import { fetchPagePayload } from "@/lib/api";
import { listAllQuestionParams } from "@/lib/content-reader";
import { parseDomainSlug } from "@/lib/domain-display";

/**
 * Legacy /question/[slug] route.
 * Redirects permanently (301) to the canonical /{domainSlug}/{stackSlug}/{questionSlug} URL
 * to avoid duplicate content and consolidate SEO equity.
 *
 * Resolution order:
 *   1. Local content tree scan (no backend required)
 *   2. Spring Boot API fallback (for DB-backed questions)
 *
 * Fully static (SSG): every slug is enumerated at build time (the build
 * container has a filesystem). `dynamicParams = false` makes an unknown slug
 * 404 instead of rendering on-demand, which would call `listAllQuestionParams`
 * (which walks `fs`) at request time — unavailable on Cloudflare Workers.
 */

// Pre-render every legacy question slug at build time. Unknown slugs 404
// rather than scanning the filesystem at request time.
export const dynamicParams = false;
export const dynamic = "force-static";

export async function generateStaticParams() {
  return listAllQuestionParams().map(({ questionSlug }) => ({ slug: questionSlug }));
}

export default async function LegacyQuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Try local content first — avoids a network round-trip and works
  //    even when the Spring Boot backend is not running.
  const allParams = listAllQuestionParams();
  const localMatch = allParams.find((p) => p.questionSlug === slug);
  if (localMatch) {
    const p = parseDomainSlug(localMatch.domainSlug);
    const strippedStack = localMatch.stackSlug.replace(/^\d+-/, "");
    if (p) {
      redirect(`/interview/${p.langSlug}/${p.trackSlug}/${p.levelKey}/${strippedStack}/${slug}`);
    }
    redirect(`/${localMatch.domainSlug}/${localMatch.stackSlug}/${slug}`);
  }

  // 2. Fall back to API (DB-backed questions not in local content tree)
  let data;
  try {
    data = await fetchPagePayload(slug);
  } catch {
    notFound();
  }

  if (data.domainSlug && data.stackSlug) {
    const p = parseDomainSlug(data.domainSlug);
    const strippedStack = (data.stackSlug as string).replace(/^\d+-/, "");
    if (p) {
      redirect(`/interview/${p.langSlug}/${p.trackSlug}/${p.levelKey}/${strippedStack}/${slug}`);
    }
    redirect(`/${data.domainSlug}/${data.stackSlug}/${slug}`);
  }

  // If domain/stack info is unavailable, fall back gracefully to /domains
  redirect("/domains");
}
