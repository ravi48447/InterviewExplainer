/**
 * POST /api/engine/resume-upload — multipart file upload (PDF/DOCX/TXT).
 * Parses dependency-free (lib/engine/parse.mjs), grades extraction confidence,
 * runs the same analysis as the paste route, and returns everything together.
 * Low-confidence PDFs (scanned/CID-garbage) return parse.lowConfidence so the
 * UI can offer the paste fallback — never silently analyze garbage.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/server/crypto';
import { saveResume } from '@/lib/server/engine-store';
import { readiness, hygieneCheck } from '@/lib/engine/resume.mjs';
import { matchSkills, buildSkillDictionary } from '@/lib/engine/skills.mjs';
import { tokenize, stemMatch } from '@/lib/engine/text.mjs';
import { parseResumeFile } from '@/lib/engine/parse.mjs';
import { loadLeanIndex } from '@/lib/engine/server.mjs';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData().catch(() => null);
    if (!form) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
    const file = form.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'no_file' }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: 'file_too_large' }, { status: 413 });
    if (!/\.(pdf|docx|txt|md)$/i.test(file.name)) {
      return NextResponse.json({ error: 'unsupported_format' }, { status: 415 });
    }

    const buf = Buffer.from(await file.arrayBuffer());

    // plain text files: read directly
    let parsed;
    if (/\.(txt|md)$/i.test(file.name)) {
      const text = buf.toString('utf8');
      const words = (text.match(/[A-Za-z][A-Za-z'-]*/g) ?? []).length;
      parsed = { text, method: 'txt', words, alphaRatio: 1, confidence: words >= 60 ? 'high' : 'medium' };
    } else {
      parsed = parseResumeFile(buf);
      if (!parsed) return NextResponse.json({ error: 'unsupported_format' }, { status: 415 });
    }

    const { text, method, words, confidence } = parsed;
    if (words < 25) {
      return NextResponse.json({
        parse: { method, words, confidence },
        lowConfidence: true,
        message: 'We could not read enough text from this file. Paste your resume text instead — it always works.',
      });
    }

    // === same analysis pipeline as the paste route ===
    const targetDomain = String(form.get('targetDomain') ?? 'ruby-backend-fresher');
    const lean = loadLeanIndex();
    const dict = buildSkillDictionary(lean);
    const skills = matchSkills(text, dict);
    const byDomain: Record<string, Set<string>> = {};
    for (const m of skills.matched) {
      for (const t of m.topics ?? []) {
        const dom = t.split('/')[0];
        (byDomain[dom] ??= new Set()).add(t);
      }
    }
    const byDomainOut: Record<string, string[]> = {};
    for (const d of Object.keys(byDomain)) byDomainOut[d] = [...(byDomain[d] as Set<string>)];

    const domainConcepts = new Set<string>();
    for (const q of lean.questions) {
      if (q.domain === targetDomain) for (const c of q.concepts ?? []) domainConcepts.add(c);
    }
    const evidence: Record<string, number> = {};
    for (const m of skills.matched) evidence[m.id] = 30;
    const r = targetDomain ? readiness(targetDomain, [...domainConcepts], evidence) : null;

    const matchedSet = new Set<string>(skills.matched.map((m) => m.id));
    const gaps = [];
    if (targetDomain) {
      const byId = Object.fromEntries(lean.conceptIndex.map((c) => [c.id, c]));
      for (const q of lean.questions) {
        if (q.domain !== targetDomain) continue;
        const missing = (q.concepts ?? []).filter((c) => !matchedSet.has(c));
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

    // bridge to registry concept ids (the Director's seeding space)
    const claimedConceptIds = new Set();
    const qById = new Map(lean.questions.map((q) => [q.id, q]));
    for (const m of skills.matched) {
      for (const topicId of m.topics ?? []) {
        const q = qById.get(topicId);
        for (const c of q?.concepts ?? []) claimedConceptIds.add(c);
      }
      if (!m.topics?.length) {
        const termToks = tokenize(m.label);
        for (const c of lean.concepts) {
          const cToks = tokenize(c.label);
          if (!cToks.length || !termToks.length) continue;
          let match = 0;
          for (const t of termToks) if (cToks.some((ct) => ct === t || stemMatch(t, ct))) match++;
          if (match / termToks.length >= 0.75) claimedConceptIds.add(c.id);
        }
      }
    }

    const uid = getUserIdFromRequest(req);
    if (uid) {
      try {
        saveResume(uid, { skills: skills.matched.map((s) => s.label), readiness: r, gaps: gaps.slice(0, 10) });
      } catch {}
    }

    return NextResponse.json({
      parse: { method, words, confidence },
      skills: skills.matched.slice(0, 60),
      skillsByDomain: byDomainOut,
      claimedConceptIds: [...claimedConceptIds],
      targetDomain,
      readiness: r,
      gaps: gaps.slice(0, 15),
      hygiene: hygieneCheck(text),
    });
  } catch (e) {
    return NextResponse.json({ error: 'upload_failed', message: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
