/**
 * resume.mjs — Resume skill extraction + readiness scoring (dependency-free).
 *
 * Maps resume text onto the concept registry (the same concepts the Director
 * and dashboard use). Paste-first UX: PDF/docx parsing is a documented seam
 * (needs pdfjs/mammoth when deps are installable); .txt uploads work today.
 */

import { tokenize, canon, stemMatch } from './text.mjs';

/**
 * Extract skills from resume text against the registry.
 * registry: concepts[] {id, label, topics} from the lean index.
 * Returns { matched: [{id,label,evidence}], byDomain: {domain: [ids]} }
 */
export function extractSkills(resumeText, registry, topicIndex) {
  const text = String(resumeText ?? '');
  const tokens = tokenize(text);
  const tokenSet = new Set(tokens);
  // bigram set for two-word concepts ("garbage collection")
  const bigrams = new Set();
  for (let i = 0; i < tokens.length - 1; i++) bigrams.add(tokens[i] + ' ' + tokens[i + 1]);

  const matched = [];
  const seen = new Set();
  for (const c of registry ?? []) {
    if (seen.has(c.id)) continue;
    const labelToks = tokenize(c.label).filter((w) => w.length > 2);
    if (!labelToks.length) continue;
    let matches = 0;
    for (const t of labelToks) {
      let hit = tokenSet.has(t);
      if (!hit && labelToks.length >= 2) {
        // check adjacent pair as a bigram
        for (const b of bigrams) {
          if (b.split(' ').includes(t)) { hit = true; break; }
        }
      }
      if (!hit) {
        // stem-tolerant scan
        for (const tk of tokenSet) {
          if (stemMatch(t, tk)) { hit = true; break; }
        }
      }
      if (hit) matches++;
    }
    const ratio = matches / labelToks.length;
    if (ratio >= 0.75) {
      seen.add(c.id);
      matched.push({ id: c.id, label: c.label });
    }
  }

  // aggregate to domains via the topics that carry each concept
  const byDomain = {};
  for (const m of matched) {
    const topics = topicIndex?.[m.id]?.topics ?? [];
    for (const t of topics) {
      const dom = t.split('/')[0];
      (byDomain[dom] ??= new Set()).add(m.id);
    }
  }
  for (const d of Object.keys(byDomain)) byDomain[d] = [...byDomain[d]];

  return { matched, byDomain };
}

/**
 * Readiness vs a target domain: importance-weighted concept coverage.
 * domainQuestionIds: from byDomain map; conceptsOf(domain): registry view.
 */
export function readiness(domain, conceptIdsForDomain, evidence) {
  const ids = conceptIdsForDomain ?? [];
  if (!ids.length) return null;
  const strengths = ids.map((id) => evidence?.[id] ?? 0);
  const covered = strengths.filter((s) => s >= 40).length;
  const partial = strengths.filter((s) => s > 0 && s < 40).length;
  const ratio = ids.length ? (covered + 0.5 * partial) / ids.length : 0;
  return {
    domain,
    conceptCount: ids.length,
    covered,
    partial,
    missing: ids.length - covered - partial,
    ratio: +ratio.toFixed(2),
    score: Math.round(ratio * 100),
  };
}

/**
 * Deterministic hygiene checks (no models).
 */
export function hygieneCheck(resumeText) {
  const text = String(resumeText ?? '');
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const bullets = lines.filter((l) => /^[-•*]/.test(l));
  const bulletTexts = bullets.length ? bullets : lines;
  const quantified = bulletTexts.filter((l) => /\d+\s*(%|k\b|x\b|users|ms|s\b|days|weeks|months|people|requests|rps|qps)/i.test(l));
  const actionVerbs = ['led', 'built', 'designed', 'implemented', 'shipped', 'migrated', 'reduced', 'improved', 'automated', 'optimized', 'launched', 'owned', 'drove', 'scaled', 'refactored'];
  const withVerbs = bulletTexts.filter((l) => actionVerbs.some((v) => new RegExp(`\\b${v}`, 'i').test(l)));
  const longBullets = bulletTexts.filter((l) => l.split(/\s+/).length > 40);
  const hasContact = /@|linkedin\.com|github\.com|\+?\d[\d\s-]{7,}/i.test(text);
  const sections = ['experience', 'education', 'skills', 'projects'].filter((s) =>
    new RegExp(`^#{0,3}\\s*${s}`, 'im').test(text)
  );

  const checks = [
    { id: 'quantified', label: 'Quantified achievements', ok: quantified.length >= 3, detail: `${quantified.length} quantified bullets (aim 3+) — numbers make impact credible` },
    { id: 'action-verbs', label: 'Strong action verbs', ok: withVerbs.length >= Math.ceil(bulletTexts.length * 0.5), detail: `${withVerbs.length}/${bulletTexts.length} bullets start with action verbs` },
    { id: 'bullet-length', label: 'Bullet length discipline', ok: longBullets.length <= Math.ceil(bulletTexts.length * 0.2), detail: `${longBullets.length} over-long bullets (>40 words)` },
    { id: 'contact', label: 'Contact / links present', ok: hasContact, detail: hasContact ? 'email or profile links found' : 'no email/LinkedIn/GitHub detected' },
    { id: 'sections', label: 'Core sections found', ok: sections.length >= 3, detail: `detected: ${sections.join(', ') || 'none'}` },
  ];
  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
  return { score, checks };
}
