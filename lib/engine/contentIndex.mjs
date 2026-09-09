/**
 * contentIndex.mjs — Content Index Service (CIS).
 * Derives the interview graph + concept registry from the content tree:
 * content/&lt;domain&gt;/&lt;module&gt;/&lt;topic&gt;/complete-qa.json
 *
 * Concepts are MATCHABLE TERMS (not takeaway sentences): the nucleus of each
 * key_point, comparison-row labels, concept_map items, and topic/module anchors.
 * Every term is verifiably present (stem-tolerant) in the expert answer corpus,
 * so coverage scoring is grounded in what experts actually say.
 *
 * Pure ESM, filesystem-only, no deps.
 */

import fs from 'node:fs';
import path from 'node:path';
import { tokenize, canon, termFreq, stemMatch } from './text.mjs';

function sectionOf(q, type) {
  return (q?.answer?.sections ?? []).find((s) => s?.type === type) ?? null;
}
function itemsOf(q, type) {
  const s = sectionOf(q, type);
  return Array.isArray(s?.items) ? s.items.map(String) : [];
}
function contentOf(q, type) {
  const s = sectionOf(q, type);
  return typeof s?.content === 'string' ? s.content : '';
}

function extractConcepts(q, corpusTokens, topic, module) {
  const out = [];
  const corpusSet = new Set(corpusTokens);
  const push = (label, src) => {
    const id = canon(label);
    if (!id || id.length < 3 || out.some((c) => c.id === id)) return;
    const words = label.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
    if (!words.length) return;
    // reject sentence fragments: labels ending in articles/prepositions/conjunctions or starting with 'A '
    const FRAG_END = /^(a|an|the|is|are|to|of|in|on|for|with|and|or|that|which|by|as|it|db)$/;
    const last = words[words.length - 1];
    if (FRAG_END.test(last)) return;
    if (/^(a|an|the)\s/i.test(label.trim())) return;
    // reject code-fragments: labels cut mid-token like 'session[' or 'params[:'
    if (/[\[(=]$/.test(label.trim())) return;
    if (/^\w+\[/.test(label.trim()) && !/\]\s*\??$/.test(label.trim())) return;
    // single-word labels must be technical (>= 4 chars, not generic)
    if (words.length === 1 && words[0].length < 4) return;
    const inCorpus = words.filter((w) => corpusSet.has(w)).length / words.length;
    if (inCorpus >= 0.8) out.push({ id, label: label.trim(), src });
  };

  for (const it of itemsOf(q, 'key_points')) {
    // nucleus = first clause, split on sentence separators; strip trailing punctuation
    let nucleus = it.split(/[:;—]/)[0].trim();
    nucleus = nucleus.replace(/^(Never|Always|Use|Treat|Prefer|Avoid|Remember|Note|Don't|Do not)\s+/i, '');
    // drop a trailing unbalanced/hanging parenthetical: "identifiers (fast" -> "identifiers"
    nucleus = nucleus.replace(/\s*\([^)]*$/, '');
    // strip trailing punctuation/fragments
    nucleus = nucleus.replace(/[,;:.\-–—(]+$/g, '').trim();
    if (nucleus.length >= 3 && nucleus.length <= 48) push(nucleus, 'key_point');
    else {
      const words = nucleus.split(/\s+/).slice(0, 4).join(' ');
      if (words.length >= 8) push(words, 'key_point');
    }
  }
  for (const row of sectionOf(q, 'comparison_table')?.rows ?? []) {
    if (row?.[0]) push(String(row[0]), 'comparison');
  }
  for (const it of itemsOf(q, 'concept_map')) push(String(it), 'concept_map');
  // NOTE: topic/module slug anchors are deliberately NOT scored concepts — they are
  // organizational noise ("strings-symbols" -> "Strings Symbols") that would trivially
  // match question text and produce degenerate grammar when quoted in transitions.
  return out;
}

function extractProbes(q) {
  const ii = q?.interviewer_intent ?? {};
  const probes = [];
  (q?.followup_questions ?? []).forEach((f, i) => probes.push({ kind: 'probe', id: `probe-${i}`, text: f }));
  if (ii.to_stand_out) probes.push({ kind: 'stretch', id: 'stretch-0', text: ii.to_stand_out });
  if (ii.testing) probes.push({ kind: 'intent', id: 'intent-0', text: ii.testing });
  return probes;
}

function extractMistakes(q) {
  const out = itemsOf(q, 'common_mistakes').map(String);
  const ii = q?.interviewer_intent ?? {};
  if (ii.common_mistake && !out.includes(String(ii.common_mistake))) out.push(String(ii.common_mistake));
  return out;
}

export function buildIndex(contentDir) {
  const questions = [];
  const concepts = [];
  const byDomain = {};
  const corpusDocs = [];
  const conceptIndex = new Map();

  const walk = (dir, depth, meta) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.name.startsWith('.') || e.name === 'node_modules') continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        const m = { ...meta };
        if (depth === 0) m.domain = e.name;
        else if (depth === 1) m.module = e.name;
        walk(p, depth + 1, m);
      } else if (e.name === 'complete-qa.json' && meta.domain && meta.module) {
        const topic = path.basename(path.dirname(p));
        let j;
        try {
          j = JSON.parse(fs.readFileSync(p, 'utf8'));
        } catch {
          continue;
        }
        const qs = j?.questions ?? [];
        if (!qs.length) continue;
        const q = qs[0];
        const id = `${meta.domain}/${meta.module}/${topic}`;
        const direct = String(q?.direct_answer ?? '');
        const deep = contentOf(q, 'deep_explanation');
        const spoken = contentOf(q, 'speakable_answer');
        const corpusTokens = tokenize([direct, deep, spoken].filter(Boolean).join(' '));
        const conceptsQ = extractConcepts(q, corpusTokens, topic, meta.module);
        const corpus = [direct, deep, spoken, ...conceptsQ.map((c) => c.label)].filter(Boolean).join(' ');
        const tokens = tokenize(corpus);
        corpusDocs.push(tokens);
        const codeExample = contentOf(q, 'code_example');
        questions.push({
          id,
          domain: meta.domain,
          module: meta.module,
          topic,
          question: String(q?.question ?? ''),
          title: String(q?.title ?? ''),
          difficulty: String(q?.difficulty ?? 'medium'),
          importance: String(q?.importance ?? 'medium'),
          readingMinutes: Number(q?.reading_time_minutes ?? 5),
          concepts: conceptsQ.map((c) => c.id),
          conceptLabels: conceptsQ.map((c) => c.label),
          probes: extractProbes(q),
          mistakes: extractMistakes(q),
          tradeoffs: (sectionOf(q, 'comparison_table')?.rows ?? []).map((r) => r.map(String)),
          tradeoffColumns: sectionOf(q, 'comparison_table')?.columns ?? [],
          spoken,
          deep,
          direct,
          codeExample,
          codeExampleLines: codeExample ? codeExample.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#')).length : 0,
          learnUrl: `/${meta.domain}/${meta.module}/${topic}`,
          tokens,
          len: tokens.length,
          tf: termFreq(tokens),
        });
        byDomain[meta.domain] ??= {};
        byDomain[meta.domain][meta.module] ??= [];
        byDomain[meta.domain][meta.module].push(id);
        for (const c of conceptsQ) {
          const found = concepts.find((x) => x.id === c.id);
          if (found) {
            found.topics.push(id);
            found.domains.add(meta.domain);
          } else {
            concepts.push({ id: c.id, label: c.label, topics: [id], domains: new Set([meta.domain]) });
          }
          const ci = conceptIndex.get(c.id) ?? { topics: [] };
          ci.topics.push(id);
          conceptIndex.set(c.id, ci);
        }
      }
    }
  };

  walk(contentDir, 0, {});

  const df = new Map();
  for (const toks of corpusDocs) for (const t of new Set(toks)) df.set(t, (df.get(t) ?? 0) + 1);

  for (const c of concepts) c.domains = [...c.domains];

  // cross-module links (shared concepts) for Director pivots
  const crossLinks = {};
  const modConcepts = new Map();
  for (const q of questions) {
    const key = `${q.domain}/${q.module}`;
    const set = modConcepts.get(key) ?? new Set();
    q.concepts.forEach((c) => set.add(c));
    modConcepts.set(key, set);
  }
  for (const [m1, s1] of modConcepts) {
    for (const [m2, s2] of modConcepts) {
      if (m1 >= m2) continue;
      let shared = 0;
      for (const c of s1) if (s2.has(c)) shared++;
      if (shared >= 2) (crossLinks[m1] ??= []).push({ to: m2, shared });
    }
  }

  return {
    questions,
    byDomain,
    concepts,
    conceptIndex: [...conceptIndex.entries()].map(([id, v]) => ({ id, ...v })),
    crossLinks,
    corpusStats: { N: corpusDocs.length, df: [...df.entries()] },
  };
}

export async function loadIndex(artifactPath) {
  const j = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  j.corpusStats.df = new Map(j.corpusStats.df);
  return j;
}
