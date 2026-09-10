import { NextRequest, NextResponse } from "next/server";
import {
  listModulesWithStacks,
  resolveStackContent,
} from "@/lib/contentV2";
import type { Level } from "@/lib/contentV2-types";
import { readStaticAsset } from "@/lib/static-asset";

function toDisplayName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lang = searchParams.get("lang") ?? "";
  const track = searchParams.get("track") ?? "";
  const level = (searchParams.get("level") ?? "intermediate") as Level;

  if (!lang || !track) {
    return NextResponse.json([], { status: 400 });
  }

  // On Cloudflare Workers (and after pre-render on Node), serve the static
  // snapshot from the ASSETS binding — no filesystem walk at request time.
  const staticSnapshot = await readStaticAsset(
    `/api/v2/interview-nav/${lang}/${track}/${level}.json`
  );
  if (staticSnapshot) {
    return NextResponse.json(staticSnapshot, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  const modules = listModulesWithStacks(lang, track, level);

  const result = modules.map(mod => ({
    moduleSlug: mod.moduleSlug,
    moduleName: mod.moduleName,
    stacks: mod.stacks.map(slug => {
      const content = resolveStackContent(lang, track, level, slug);
      const questions = (content?.questions ?? [])
        .filter(q => q.slug && typeof q.slug === "string")
        .map(q => ({
          slug: q.slug,
          title: q.title || q.question || toDisplayName(q.slug),
        }));
      return {
        slug,
        name: toDisplayName(slug),
        questionCount: questions.length,
        questions,
      };
    }).filter(s => s.questionCount > 0),
  })).filter(m => m.stacks.length > 0);

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}