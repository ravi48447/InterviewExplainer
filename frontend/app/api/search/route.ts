import { NextRequest, NextResponse } from "next/server";
import { readStaticAsset } from "@/lib/static-asset";
import { buildSearchIndex, scoreMatch, type SearchResult } from "@/lib/search-index";

export const dynamic = "force-static";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "30", 10), 100);

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  // On Cloudflare Workers (and after the pre-render script runs on Node), the
  // full search index is available as a static asset — read it and score
  // in-memory (cheap, no filesystem access).
  let index: SearchResult[] | null = await readStaticAsset<SearchResult[]>(
    "/api/search-index.json"
  );

  // Fallback: build the index from the filesystem (local dev only — the build
  // container pre-renders this to a static asset before deploy).
  if (!index) {
    index = buildSearchIndex();
  }

  const scored = index
    .map((item) => ({ ...item, score: scoreMatch(query, item.title) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return NextResponse.json(scored);
}
