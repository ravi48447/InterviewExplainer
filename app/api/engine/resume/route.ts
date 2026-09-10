/**
 * POST /api/engine/resume — resume analysis (skill map + readiness + hygiene).
 * Body: { text, targetDomain }
 * Paste-first (dependency-free); PDF/docx is a documented seam.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/server/crypto';
import { saveResume } from '@/lib/server/engine-store';
import { loadLeanIndex } from '@/lib/engine/server.mjs';
import { readiness, hygieneCheck } from '@/lib/engine/resume.mjs';
import { matchSkills, buildSkillDictionary } from '@/lib/engine/skills.mjs';
import { tokenize, stemMatch, canon } from '@/lib/engine/text.mjs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = String(body?.text ?? '');
    const targetDomain = String(body?.targetDomain ?? '');
    if (text.length < 40) return NextResponse.json({ error: 'resume_text_too_short' }, { status: 400 });

    const lean = loadLeanIndex();
    const dict = buildSkillDictionary(lean);
    const skills = matchSkills(text, dict);
    // aggregate matched topics to domains
    const byDomain: Record<string, Set<string>> = {};
    for (const m of skills.matched) {
      for (const t of m.topics ?? []) {
        const dom = t.split('/')[0];
        (byDomain[dom] ??= new Set()).add(t);
      }
    }
    const byDomainOut: Record<string, string[]> = {};
    for (const d of Object.keys(byDomain)) byDomainOut[d] = [...(byDomain[d] as Set<string>)];

    // concept ids in the target domain
    const domainConcepts = new Set<string>();
    for (const q of lean.questions) {
      if (q.domain === targetDomain) for (const c of q.concepts ?? []) domainConcepts.add(c);
    }

    // Claimed evidence: matched skills must be converted to the CANONICAL
    // concept ids the readiness model scores against. Skills carry their own
    // label-derived ids (canon('Django') = 'django') while readiness compares
    // rubric concept ids — scoring the raw skill ids produced 0% readiness for
    // resumes that detected every relevant skill correctly.
    // Bridge: (1) topics -> their concepts, (2) topic-less CORE_TECH terms ->
    // registry concepts whose label tokens stem-match (the same bridge the
    // Director seeding uses below, computed once and shared).
    const questionById = new Map(lean.questions.map((q: any) => [q.id, q]));
    const matchedSet = new Set<string>(skills.matched.map((m) => m.id));
    const claimedConceptIds = new Set<string>();
    for (const m of skills.matched) {
      for (const topicId of m.topics ?? []) {
        const q = questionById.get(topicId);
        for (const c of q?.concepts ?? []) claimedConceptIds.add(c);
      }
      if (!m.topics?.length) {
        const termToks = tokenize(m.label);
        for (const c of lean.concepts) {
          const cToks = tokenize(c.label);
          if (!cToks.length || !termToks.length) continue;
          let match = 0;
          for (const t of termToks) {
            if (cToks.some((ct) => ct === t || stemMatch(t, ct))) match++;
          }
          if (match / termToks.length >= 0.75) claimedConceptIds.add(c.id);
        }
      }
    }

    const evidence: Record<string, number> = {};
    for (const c of claimedConceptIds) evidence[c] = 30;

    const r = targetDomain
      ? readiness(targetDomain, [...domainConcepts], evidence)
      : null;

    // gap list: target-domain concepts NOT matched by the resume
    const gaps = [];
    if (targetDomain) {
      const byId = Object.fromEntries(lean.conceptIndex.map((c) => [c.id, c]));
      // concepts credited in `evidence` above are NOT gaps — the raw matchedSet
      // holds skill ids, not concept ids, and would report every concept missing.
      const coveredConcepts = new Set(Object.keys(evidence));
      for (const q of lean.questions) {
        if (q.domain !== targetDomain) continue;
        const missing = (q.concepts ?? []).filter((c) => !coveredConcepts.has(c));
        if (missing.length) {
          gaps.push({
            topicId: q.id,
            topic: q.topic,
            title: q.title,
            importance: q.importance,
            missingConcepts: missing.map((c) => byId[c]?.label ?? c),
            learnUrl: `/${q.domain}/${q.module}/${q.topic}`,
          });
        }
      }
      gaps.sort((a, b) => (a.importance === 'high' ? -1 : 1) - (b.importance === 'high' ? -1 : 1));
    }

    const hygiene = hygieneCheck(text);

    const uid = getUserIdFromRequest(req);
    if (uid) {
      try {
        saveResume(uid, { skills: skills.matched.map((s) => s.label), readiness: r, gaps: gaps.slice(0, 10) });
      } catch {}
    }

    return NextResponse.json({
      claimedConceptIds: [...claimedConceptIds],
      skills: skills.matched.slice(0, 60),
      skillsByDomain: byDomainOut,
      targetDomain: targetDomain || null,
      readiness: r,
      gaps: gaps.slice(0, 15),
      hygiene,
      seam: 'PDF/DOCX parsing available once pdfjs/mammoth deps are added; paste works everywhere today.',
    });
  } catch (e) {
    return NextResponse.json({ error: 'resume_analysis_failed', message: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
