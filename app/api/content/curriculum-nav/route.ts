import { NextRequest, NextResponse } from "next/server";
import {
  getNextCurriculumModule,
  getPreviousCurriculumModule,
  isLockedDomain,
} from "@/lib/content-reader";

export async function GET(request: NextRequest) {
  const domainSlug = request.nextUrl.searchParams.get("domainSlug") ?? "";
  const stackSlug = request.nextUrl.searchParams.get("stackSlug") ?? "";

  if (!domainSlug || !stackSlug) {
    return NextResponse.json(
      { error: "domainSlug and stackSlug are required" },
      { status: 400 },
    );
  }

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
