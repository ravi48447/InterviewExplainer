import { NextRequest, NextResponse } from "next/server";
import {
  getNextCurriculumModule,
  getPreviousCurriculumModule,
  isLockedDomain,
} from "@/lib/content-reader";
import { readStaticAsset } from "@/lib/static-asset";

export async function GET(request: NextRequest) {
  const domainSlug = request.nextUrl.searchParams.get("domainSlug") ?? "";
  const stackSlug = request.nextUrl.searchParams.get("stackSlug") ?? "";

  if (!domainSlug || !stackSlug) {
    return NextResponse.json(
      { error: "domainSlug and stackSlug are required" },
      { status: 400 },
    );
  }

  // On Cloudflare Workers (and after pre-render on Node), serve the static
  // snapshot from the ASSETS binding — no filesystem walk at request time.
  const staticSnapshot = await readStaticAsset<{ previousModule: unknown; nextModule: unknown }>(
    `/api/content/curriculum-nav/${domainSlug}/${stackSlug}.json`
  );
  if (staticSnapshot) return NextResponse.json(staticSnapshot);

  if (!isLockedDomain(domainSlug)) {
    return NextResponse.json({
      previousModule: null,
      nextModule: null,
    });
  }

  const previousModule = getPreviousCurriculumModule(domainSlug, stackSlug);
  const nextModule = getNextCurriculumModule(domainSlug, stackSlug);

  return NextResponse.json({
    previousModule,
    nextModule,
  });
}
