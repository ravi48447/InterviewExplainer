/**
 * skills.mjs — the Skill Dictionary: curated technical terms for resume
 * matching and dashboard skills UI. Distinct from rubric conceptLabels
 * (per-question checklists used by AVE), this dictionary contains only
 * TERM-SHAPED entries: 1-4 words, no sentence verbs, technical surface.
 *
 * Built at index time from: key_point nuclei, comparison row labels,
 * topic titles (cleaned), and a curated alias map.
 */

import { tokenize, canon } from './text.mjs';

/** curated aliases: resume surface form -> dictionary term */
/** Core tech terms that must always be matchable (proper nouns / stack staples). */
export const CORE_TECH = [
  'ruby', 'ruby on rails', 'rails', 'sinatra', 'sidekiq', 'rspec', 'minitest', 'bundler', 'rake', 'puma', 'activerecord', 'active record',
  'postgresql', 'mysql', 'sqlite', 'redis', 'mongodb', 'elasticsearch', 'kafka', 'rabbitmq', 'sidekiq',
  'go', 'golang', 'gin', 'echo', 'chi', 'fiber', 'gorm', 'goroutines', 'channels', 'cobra',
  'java', 'spring', 'spring boot', 'spring security', 'spring data jpa', 'hibernate', 'maven', 'gradle', 'jvm', 'jpa', 'kafka', 'jenkins',
  'python', 'django', 'flask', 'fastapi', 'pytest', 'celery', 'sqlalchemy', 'pandas', 'numpy',
  'javascript', 'typescript', 'react', 'next js', 'angular', 'vue', 'node js', 'express', 'css', 'html', 'tailwind', 'redux', 'react hooks',
  'docker', 'kubernetes', 'terraform', 'aws', 'gcp', 'azure', 'jenkins', 'git', 'github actions', 'graphql', 'grpc', 'rest api', 'oauth', 'jwt', 'prometheus', 'grafana',
  'unit testing', 'integration testing', 'mocking', 'n plus one', 'eager loading', 'authentication', 'authorization', 'caching', 'database indexes', 'sql injection', 'xss', 'csrf',
];

export const SKILL_ALIASES = {
 ror: 'ruby on rails',
  rb: 'ruby',
  golang: 'go',
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  pg: 'postgresql',
  pgsql: 'postgresql',
  psql: 'postgresql',
  k8s: 'kubernetes',
  oop: 'object oriented programming',
  dsa: 'data structures algorithms',
  ci: 'continuous integration',
  cd: 'continuous deployment',
  tdd: 'test driven development',
  ar: 'active record',
  orm: 'active record',
  auth: 'authentication',
  authz: 'authorization',
  sso: 'single sign on',
  rest: 'rest api',
  graphql: 'graphql',
  grpc: 'grpc',
  jwt: 'jwt',
  oauth: 'oauth',
  nplusone: 'n plus one',
  sidekiq: 'sidekiq',
  rspec: 'rspec',
  minitest: 'minitest',
  jest: 'jest',
  docker: 'docker',
  kubernetes: 'kubernetes',
  redis: 'redis',
  kafka: 'kafka',
  rabbitmq: 'rabbitmq',
  jenkins: 'jenkins',
  jvm: 'jvm',
  spring: 'spring',
  jpa: 'jpa',
  hibernate: 'hibernate',
  servlet: 'servlets',
  mybatis: 'mybatis',
  lombok: 'lombok',
  stream: 'streams',
  streams: 'streams',
  virtualthread: 'virtual threads',
  virtualthreads: 'virtual threads',
  gin: 'gin',
  echo: 'echo',
  chi: 'chi',
  fiber: 'fiber',
  goroutine: 'goroutines',
  goroutines: 'goroutines',
  channel: 'channels',
  channels: 'channels',
  defer: 'defer',
  panic: 'panic',
  slice: 'slices',
  slices: 'slices',
  map: 'hashmaps',
  hashmap: 'hashmaps',
  hashmaps: 'hashmaps',
  mutex: 'mutex',
  semaphore: 'semaphore',
  waitgroup: 'wait group',
  closure: 'closures',
  closures: 'closures',
  promise: 'promises',
  promises: 'promises',
  asyncawait: 'async await',
  eventloop: 'event loop',
  dom: 'dom',
  react: 'react',
  nextjs: 'next js',
  angular: 'angular',
  vue: 'vue',
  css: 'css',
  html: 'html',
  tailwind: 'tailwind',
  radix: 'radix',
  hook: 'react hooks',
  hooks: 'react hooks',
  usestate: 'react hooks',
  ssr: 'server side rendering',
  csr: 'client side rendering',
};

// sentence-verb patterns to reject (these are takeaway sentences, not terms)
const VERBISH = /^(is|are|was|were|be|being|been|has|have|had|does|do|did|will|would|can|could|should|must|may|might|uses|using|used|makes|make|made|gets|get|got|gives|give|gave|takes|take|took|means|mean|refers|refer|allows|allow|supports|support|provides|provide|prevents|prevent|happens|happen|works|work|runs|run|starts|start|begins|begin|begun)\b/i;
const FRAG_END = /\b(a|an|the|is|are|to|of|in|on|for|with|and|or|that|which|by|as|it|its|db|via|into|from|at|be|can|you|your)$/i;

/**
 * Build the skill dictionary from the CIS index.
 * Returns { terms: [{id, label, topics[], domains[]}], aliasIndex: Map }
 */
export function buildSkillDictionary(index) {
  const byId = new Map();

  const add = (label, topicId, domain) => {
    const t = String(label ?? '').trim();
    if (!t) return;
    const words = t.split(/\s+/);
    // term shape gate: 1-4 words, no trailing fragment words, not verb-initial
    if (words.length < 1 || words.length > 4) return;
    if (FRAG_END.test(t)) return;
    if (VERBISH.test(t)) return;
    if (/^(a|an|the)\s/i.test(t)) return;
    if (t.length < 3 || t.length > 42) return;
    // reject pure generic words
    const GENERIC = ['error','errors','context','interfaces','data','test','tests','testing','code','app','application','system','systems','framework','tool','tools','method','function','class','scenarios','scenario based','comparisons','basics','overview','intro','fundamentals','core','advanced','patterns','example','examples','usage','notes'];
    if (GENERIC.includes(t.toLowerCase())) return;
    if (/\b(and|vs|with|for|to|of|in|on)\b/i.test(t) && words.length === 2) return;  // 'services and di' style fragments
    if (words.length === 2 && /^(built in|forms template|route parameters|data binding)$/i.test(t)) { /* allow known-good */ }
    else if (words.length === 2 && /(based|driven|specific|handling|management|understanding|introduction|working)$/i.test(t)) return;
    const id = canon(t);
    if (!id || id.length < 3) return;
    const rec = byId.get(id) ?? { id, label: t, topics: new Set(), domains: new Set() };
    rec.topics.add(topicId);
    rec.domains.add(domain);
    byId.set(id, rec);
  };

  for (const q of index.questions ?? []) {
    // cleaned topic title (strongest signal)
    let t = q.topic.replace(/^\d+-/, '');
    t = t.replace(/-(basics|intro|fundamentals|overview|core|advanced|deep-dive|deep|in-ruby|in-go|in-java|in-python|ruby|go|java|python)$/g, '');
    t = t.replace(/-/g, ' ').trim();
    if (t.length >= 3) add(t, q.id, q.domain);
    // comparison row labels (short by construction)
    for (const row of q.tradeoffs ?? []) {
      if (row?.[0]) add(String(row[0]), q.id, q.domain);
    }
    // 1-3 word nuclei from key_point labels — the rubric concepts are richer; only term-shaped ones enter the dictionary
    for (const label of q.conceptLabels ?? []) {
      const words = label.split(/\s+/);
      if (words.length <= 4) add(label, q.id, q.domain);
    }
  }

  // CORE_TECH: always present; attach to topics whose corpus mentions them (best-effort)
  for (const label of CORE_TECH) {
    const id = canon(label);
    if (byId.has(id)) continue;
    byId.set(id, { id, label, topics: new Set(), domains: new Set(), core: true });
  }

  const terms = [...byId.values()].map((t) => ({
    id: t.id,
    label: t.label,
    topics: [...t.topics],
    domains: [...t.domains],
  }));

  // alias index: surface form -> term id
  const aliasIndex = new Map();
  for (const term of terms) {
    const c = canon(term.label);
    aliasIndex.set(c, term.id);
    const flat = c.replace(/-/g, '');
    if (flat !== c) aliasIndex.set(flat, term.id);
  }
  for (const [surface, termLabel] of Object.entries(SKILL_ALIASES)) {
    const tid = byId.get(canon(termLabel))?.id;
    if (tid) aliasIndex.set(canon(surface), tid);
  }

  return { terms, aliasIndex };
}

/**
 * Extract skills from resume text using the dictionary.
 * Returns { matched: [{id,label,evidence}], topicIds: Set }
 */
export function matchSkills(resumeText, dict) {
  const text = String(resumeText ?? '').toLowerCase();
  const matched = new Map();
  for (const term of dict.terms) {
    const c = term.label.toLowerCase();
    // word-boundary containment for multi-word; stem-tolerant single words
    let found = false;
    const esc = c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (c.includes(' ')) {
      found = new RegExp(`\\b${esc}\\b`).test(text);
    } else {
      const re = new RegExp(`\\b${esc}(s|es|ing|ed)?\\b`, 'i');
      found = re.test(text);
    }
    if (found) matched.set(term.id, { id: term.id, label: term.label, topics: term.topics });
  }
  // alias pass
  for (const [surface, tid] of dict.aliasIndex) {
    if (matched.has(tid)) continue;
    const s = surface.replace(/-/g, ' ');
    const sesc = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (s.length >= 2 && new RegExp(`\\b${sesc}\\b`).test(text)) {
      const term = dict.terms.find((t) => t.id === tid);
      if (term) matched.set(tid, { id: tid, label: term.label, topics: term.topics });
    }
  }
  return { matched: [...matched.values()], topicIds: new Set([...matched.values()].flatMap((m) => m.topics)) };
}
