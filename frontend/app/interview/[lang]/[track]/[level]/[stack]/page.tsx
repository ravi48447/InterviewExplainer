import { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadStackHub, buildStackHubMetadata } from "@/lib/curriculum";
import { StackHub } from "@/components/curriculum-v2";
import { listLanguages, listTracks, listLevels, listStacksForPath } from "@/lib/contentV2";
import type { Level } from "@/lib/contentV2-types";

export const revalidate = 3600;
// Fully static: every {lang,track,level,stack} tuple is enumerated by
// generateStaticParams at build time. Unknown tuples 404 rather than
// rendering on-demand — on-demand rendering would call `fs`-based content
// resolvers, which do not exist on Cloudflare Workers.
export const dynamicParams = false;

// Domains fully migrated to the new locked /{domainSlug}/... URL shape —
// for these, the proxy 301s the legacy /interview/... URL to the new one,
// so there's no point prerendering them here. See frontend/proxy.ts.
const MIGRATED_DOMAINS = new Set<string>([
  "java/backend/intermediate",
]);

export async function generateStaticParams() {
  const params: { lang: string; track: string; level: string; stack: string }[] = [];
  for (const lang of listLanguages()) {
    for (const track of listTracks(lang)) {
      for (const level of listLevels(lang, track)) {
        if (MIGRATED_DOMAINS.has(`${lang}/${track}/${level}`)) continue;
        for (const stack of listStacksForPath(lang, track, level as Level)) {
          params.push({ lang, track, level, stack });
        }
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; track: string; level: string; stack: string }> }): Promise<Metadata> {
  const { lang, track, level, stack } = await params;
  const data = loadStackHub(lang, track, level as Level, stack);
  if (!data) return { title: "Not Found" };
  return buildStackHubMetadata(data);
}

export default async function V2StackPage({ params }: { params: Promise<{ lang: string; track: string; level: string; stack: string }> }) {
  const { lang, track, level, stack } = await params;
  const data = loadStackHub(lang, track, level as Level, stack);
  if (!data) notFound();
  return <StackHub data={data} />;
}
