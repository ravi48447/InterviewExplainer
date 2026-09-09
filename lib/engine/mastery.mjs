/**
 * mastery.mjs — Concept Mastery Store (client-side, guest-first).
 *
 * The interconnection unit: every product writes evidence to one ledger.
 *   claimed  (resume says so)              weight 1
 *   studied  (learning content read)       weight 2
 *   spoken   (mock answer, under pressure) weight 4
 * Strength decays over time (SM-2-lite); the store lives in localStorage for
 * guests and merges upward on login (same pattern as lib/guest-progress.ts).
 */

const KEY = 'ie_mastery_v1';
const EVIDENCE_WEIGHT = { claimed: 1, studied: 2, spoken: 4 };
const HALF_LIFE_DAYS = 30;

function read() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
}

function write(store) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(store));
}

/** Record evidence for a set of concept ids. */
export function recordEvidence(conceptIds, type, meta = {}) {
  const store = read();
  const now = Date.now();
  for (const id of conceptIds ?? []) {
    const rec = store[id] ?? { strength: 0, best: null, lastAt: 0, hits: 0 };
    const decay = decayFactor(rec.lastAt, now);
    rec.strength = rec.strength * decay;
    const gain = EVIDENCE_WEIGHT[type] ?? 1;
    rec.strength = Math.min(100, rec.strength + gain * 10 + (rec.best === type ? 0 : 5));
    rec.best = bestOf(rec.best, type);
    rec.lastAt = now;
    rec.hits = (rec.hits ?? 0) + 1;
    store[id] = rec;
  }
  write(store);
}

/** Decay factor in [0,1]: how much strength survives since lastAt. */
function decayFactor(lastAt, now) {
  if (!lastAt) return 1;
  const days = (now - lastAt) / 86400000;
  return Math.pow(0.5, days / HALF_LIFE_DAYS);
}

function bestOf(a, b) {
  const rank = { spoken: 3, studied: 2, claimed: 1 };
  return (rank[b] ?? 0) > (rank[a] ?? 0) ? b : a;
}

/** Strength of one concept right now (with decay applied at read time). */
export function getStrength(conceptId) {
  const rec = read()[conceptId];
  if (!rec) return 0;
  const s = rec.strength * decayFactor(rec.lastAt, Date.now());
  return Math.round(s);
}

/** Coverage snapshot for a list of concepts: { ratio, weak[], strong[], perConcept } */
export function coverageOf(conceptIds) {
  const store = read();
  const per = {};
  const weak = [];
  const strong = [];
  for (const id of conceptIds ?? []) {
    const rec = store[id];
    const s = rec ? Math.round(rec.strength * decayFactor(rec.lastAt, Date.now())) : 0;
    per[id] = s;
    if (s >= 60) strong.push(id);
    else if (s > 0 && s < 35) weak.push(id);
  }
  const scored = (conceptIds ?? []).length;
  const ratio = scored ? strong.length / scored : 0;
  return { ratio, weak, strong, perConcept: per };
}

/** Everything (for account merge / export). */
export function exportAll() {
  return read();
}

/** Merge (on login): combine guest + server stores, max strength wins. */
export function mergeIn(serverStore) {
  const guest = read();
  const out = { ...serverStore };
  for (const [id, rec] of Object.entries(guest)) {
    const o = out[id];
    if (!o || rec.strength * decayFactor(rec.lastAt, Date.now()) > o.strength * decayFactor(o.lastAt, Date.now())) {
      out[id] = rec;
    }
  }
  write(out);
  return out;
}

/** Concept ids the user has any evidence for. */
export function knownConceptIds() {
  return Object.keys(read());
}

/**
 * Next Best Action: same brain as the Director's queue.
 * { domainConcepts: Map<domain, conceptIds>, sessions } -> one CTA
 */
export function nextBestAction(domainConcepts, opts = {}) {
  const best = [];
  for (const [domain, conceptIds] of Object.entries(domainConcepts ?? {})) {
    const cov = coverageOf(conceptIds);
    if (cov.weak.length >= 3) {
      best.push({
        domain,
        kind: 'weakness-drill',
        score: cov.weak.length * (1 - cov.ratio),
        concepts: cov.weak.slice(0, 8),
        cta: `Mock interview targeting ${cov.weak.length} weak concepts in ${prettyDomain(domain)}`,
      });
    }
  }
  best.sort((a, b) => b.score - a.score);
  if (best.length) return best[0];
  // fallback: broaden
  const firstDomain = Object.keys(domainConcepts ?? {})[0];
  if (firstDomain) {
    return {
      domain: firstDomain,
      kind: 'breadth',
      score: 0.5,
      concepts: [],
      cta: `Broad mock interview across ${prettyDomain(firstDomain)}`,
    };
  }
  return null;
}

function prettyDomain(d) {
  return String(d ?? '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
