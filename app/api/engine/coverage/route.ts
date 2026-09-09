/**
 * GET /api/engine/coverage?domain=slug — concept registry + coverage math for
 * the dashboard radar and resume readiness. Server reads the lean index;
 * client sends its mastery evidence (guest-first) to be scored.
 * POST body: { domain, evidence: {conceptId: strength} } -> readiness payload
 */
import { NextRequest, NextResponse } from 'next/server';
import { loadLeanIndex } from '@/lib/engine/server.mjs';
import type { LeanIndex } from '@/lib/engine/server.mjs';
import { readiness } from '@/lib/engine/resume.mjs';

export const dynamic = 'force-dynamic';

function conceptIdsForDomain(lean: LeanIndex, domain: string): string[] {
  const ids = new Set<string>();
  for (const q of lean.questions) {
    if (q.domain === domain) for (const c of q.concepts ?? []) ids.add(String(c));
  }
  return [...ids];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const domain = String(body?.domain ?? '');
    if (!domain) return NextResponse.json({ error: 'missing_domain' }, { status: 400 });
    const lean: LeanIndex = loadLeanIndex();
    if (!lean.byDomain[domain]) return NextResponse.json({ error: 'unknown_domain' }, { status: 404 });

    const conceptIds = conceptIdsForDomain(lean, domain);
    const r = readiness(domain, conceptIds, body?.evidence ?? {});
    const modules = Object.keys(lean.byDomain[domain] ?? {}).map((m) => ({
      slug: m,
      topics: lean.byDomain[domain][m].length,
    }));

    return NextResponse.json({
      domain,
      readiness: r,
      modules,
      conceptCount: conceptIds.length,
      concepts: conceptIds,
    });
  } catch (e) {
    return NextResponse.json({ error: 'coverage_failed', message: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
