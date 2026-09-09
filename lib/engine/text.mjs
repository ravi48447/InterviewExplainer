/**
 * text.js — normalization + tokenization + TF-IDF/BM25 corpus math.
 * Pure ESM, zero deps. Node 18+ and Next (allowJs) both import it.
 */

const STOP = new Set(`a an the and or but if then than that this these those is are was were be been being
am do does did doing have has had having will would shall should can could may might must of in on at to
for with without from by as into onto about over under again further once here there when where why how
all any both each few more most other some such no nor not only own same so too very just also it its
it's i me my we our you your he she they them their what which who whom whose`.split(/\s+/));

export function normalize(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[`*_~]/g, '')                    // md noise
    .replace(/([a-z])([A-Z])/g, '$1 $2')       // camelCase split
    .replace(/[^a-z0-9\s'-]/g, ' ')            // strip punct (keep ' and -)
    .replace(/-{2,}/g, ' ')
    .replace(/'/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(s) {
  return normalize(s).split(' ').filter(w => w.length > 1 && !STOP.has(w));
}

/** Canonicalize hyphen/camel/space variants into one slug-ish key. */
export function canon(s) {
  return normalize(s).replace(/[\s-]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Expand a term into its known surface forms for matching. */
export function variants(term) {
  const c = canon(term);
  const out = new Set([c]);
  const flat = c.replace(/-/g, '');
  if (flat && flat !== c) out.add(flat);            // "n-plus-one" -> "nplusone"
  const parts = c.split('-').filter(Boolean);
  if (parts.length > 1) out.add(parts.join(''));   // dependency-injection -> dependencyinjection
  return out;
}

/** TF map for a doc. */
export function termFreq(tokens) {
  const tf = new Map();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  return tf;
}

/** TF-IDF vector {term: weight} over a corpus of token lists. */
export function tfidf(tokens, corpusStats) {
  const tf = termFreq(tokens);
  const N = corpusStats.N || 1;
  const vec = {};
  for (const [t, c] of tf) {
    const df = corpusStats.df.get(t) ?? 0;
    const idf = Math.log((N + 1) / (df + 1)) + 1;   // smoothed idf
    vec[t] = (1 + Math.log(c)) * idf;
  }
  return vec;
}

/** Cosine similarity of two {term:weight} objects. */
export function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (const t in a) { na += a[t] * a[t]; if (b[t]) dot += a[t] * b[t]; }
  for (const t in b) nb += b[t] * b[t];
  if (!na || !nb) return 0;
  return dot / Math.sqrt(na * nb);
}

/** BM25-ish lexical score: candidate answer tokens vs a multi-passage corpus. */
export function bm25(queryTokens, passages, k1 = 1.2, b = 0.75) {
  // passages: [{tokens, len, tf: Map}]
  if (!passages?.length || !queryTokens?.length) return { score: 0, matches: [] };
  const N = passages.length;
  const avgdl = passages.reduce((s, p) => s + p.len, 0) / N;
  let score = 0;
  const matches = [];
  for (const q of new Set(queryTokens)) {
    let containing = 0;
    for (const p of passages) if (p.tf.has(q)) containing++;
    const idf = Math.log(1 + (N - containing + 0.5) / (containing + 0.5));
    let s = 0;
    for (const p of passages) {
      const f = p.tf.get(q) ?? 0;
      if (!f) continue;
      s += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * (p.len / avgdl)));
    }
    score += s;
    if (s > 0) matches.push(q);
  }
  return { score, matches: matches.slice(0, 12) };
}

export const STOPWORDS = STOP;

// ---------------- light stemming ----------------
const SUFFIXES = ['ies', 'ing', 'ed', 'es', 's', 'ion', 'ment', 'ness', 'ity', 'ance', 'ence', 'al'];

/** Light stem: plural + common suffix strip (keep >= 4 chars). */
export function stem(w) {
  if (w.length < 5) return w;
  for (const suf of SUFFIXES) {
    if (w.length - suf.length >= 4 && w.endsWith(suf)) {
      if (suf === 'ies') return w.slice(0, -3) + 'y';
      return w.slice(0, -suf.length);
    }
  }
  return w;
}

/** Do two tokens match after stemming? (prefix rule for y/ency-type extensions) */
export function stemMatch(a, b) {
  if (a === b) return true;
  const sa = stem(a);
  const sb = stem(b);
  if (sa === sb) return true;
  const [short, long] = sa.length <= sb.length ? [sa, sb] : [sb, sa];
  if (short.length >= 4 && long.startsWith(short)) {
    const remainder = long.slice(short.length);
    if (remainder.length <= 4 && SUFFIXES.some((s) => remainder.endsWith(s) || remainder === 'y' || remainder === 'ency' || remainder === 'ancy')) {
      return true;
    }
  }
  return false;
}

// ---------------- light stemming ----------------
