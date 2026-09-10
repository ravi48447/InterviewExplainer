#!/usr/bin/env node

/**
 * Autonomous Answer Generation Pipeline
 *
 * Usage:
 *   node scripts/generators/answerPipeline.js <path-to-complete-qa.json> [--dry-run] [--resume]
 *
 * Examples:
 *   node scripts/generators/answerPipeline.js content/interview/java/backend/intermediate/spring-boot/complete-qa.json
 *   node scripts/generators/answerPipeline.js content/interview/java/backend/intermediate/core-java/complete-qa.json --dry-run
 *
 * Environment:
 *   ANTHROPIC_API_KEY=sk-ant-...
 *
 * Stages per question:
 *   1. Classify (archetype + complexity)
 *   2. Generate (4-layer prompt)
 *   3. Gate 1: Structural validation (deterministic)
 *   4. Gate 2: AI Content Judge (7 dimensions)
 *   5. Fix loop (up to 3 attempts) or Accept
 */

const Anthropic = require('@anthropic-ai/sdk');
const { Portkey } = require('portkey-ai');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const ROOT = path.join(__dirname, '../..');
const EXEMPLAR_DIR = path.join(ROOT, 'content/exemplars');
const REPORT_DIR = path.join(ROOT, 'content/generation-reports');
const QUARANTINE_DIR = path.join(ROOT, 'content/quarantine');
const SPEC_PATH = path.join(ROOT, 'content/ANSWER_QUALITY_SPEC.md');
const GUIDE_PATH = path.join(ROOT, 'content/ANSWER_WRITING_GUIDE.md');

const MAX_ATTEMPTS = 3;
const CONCURRENCY = 2;
const MODEL = 'claude-sonnet-4-20250514';
const JUDGE_MODEL = 'claude-sonnet-4-20250514';

// ─── Init ────────────────────────────────────────────────────────────────────

let aiClient;
if (process.env.PORTKEY_API_KEY) {
  const portkeyConfig = {
    apiKey: process.env.PORTKEY_API_KEY,
  };
  if (process.env.PORTKEY_VIRTUAL_KEY) {
    portkeyConfig.virtualKey = process.env.PORTKEY_VIRTUAL_KEY;
  }
  aiClient = new Portkey(portkeyConfig);
  console.log('Using Portkey gateway' + (process.env.PORTKEY_VIRTUAL_KEY ? ' with virtual key' : ''));
} else {
  aiClient = new Anthropic.default({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  });
  console.log('Using Anthropic SDK directly');
}

// Unified wrapper — both Portkey and Anthropic SDK expose messages.create()
const anthropic = aiClient;

const qualitySpec = fs.readFileSync(SPEC_PATH, 'utf8');
const writingGuide = fs.readFileSync(GUIDE_PATH, 'utf8');

const exemplarCache = {};
function loadExemplars(archetype) {
  if (exemplarCache[archetype]) return exemplarCache[archetype];
  const filePath = path.join(EXEMPLAR_DIR, `${archetype}.json`);
  if (fs.existsSync(filePath)) {
    exemplarCache[archetype] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return exemplarCache[archetype];
  }
  const fallbacks = ['comparison', 'direct-concept', 'moderate-concept'];
  for (const fb of fallbacks) {
    const fbPath = path.join(EXEMPLAR_DIR, `${fb}.json`);
    if (fs.existsSync(fbPath)) {
      exemplarCache[archetype] = JSON.parse(fs.readFileSync(fbPath, 'utf8'));
      return exemplarCache[archetype];
    }
  }
  return { archetype, exemplars: [] };
}

// ─── Stage 1: Classifier ────────────────────────────────────────────────────

const ARCHETYPES = [
  'direct-concept', 'comparison', 'internals', 'how-to-recipe',
  'system-design', 'tool-config', 'debugging-pattern', 'architecture', 'moderate-concept'
];

async function classifyQuestions(questions) {
  const questionSummaries = questions.map((q, i) => (
    `${i}. "${q.question}" [difficulty: ${q.difficulty || 'medium'}, layout: ${q.layout_type || 'unknown'}]`
  )).join('\n');

  const prompt = `You are classifying interview questions for a content generation pipeline.

For each question below, assign:
1. archetype: one of [${ARCHETYPES.join(', ')}]
2. complexity: integer 1-5 where:
   - 1 = single shallow concept (== vs equals)
   - 2 = moderate concept (String vs StringBuilder)
   - 3 = substantial topic with multiple concepts (Exceptions, Clean Architecture)
   - 4 = deep internals/algorithms (HashMap, GC, JVM memory)
   - 5 = system design or exhaustive multi-concept topic (Rate Limiter, API Gateway)

Archetype guide:
- direct-concept: "What is X?" or "What is the difference between X and Y?" (simple)
- comparison: Explicit comparison with a table-worthy answer
- internals: "How does X work internally?" — requires diving into implementation
- how-to-recipe: "How do you do X?" — step-by-step with code
- system-design: "Design X" — architecture, algorithms, trade-offs
- tool-config: "How do you configure/use X?" — tool/framework setup
- debugging-pattern: "How do you solve/prevent X?" — problem → diagnosis → fix
- architecture: "What is X architecture/pattern?" — layers, principles, rules
- moderate-concept: Multi-faceted concept that isn't a simple comparison

Questions:
${questionSummaries}

Respond with ONLY a JSON array. Each element: {"index": 0, "archetype": "...", "complexity": 3}`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    temperature: 0,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text;
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('Classifier returned no JSON array');
  return JSON.parse(match[0]);
}

// ─── Stage 2: Generator ─────────────────────────────────────────────────────

const ARCHETYPE_INSTRUCTIONS = {
  'internals': {
    blueprint: 'overview (one-sentence mental model of the mechanism) → phase (step 1 of the journey) → phase (step 2) → phase (step 3) → code_example (production pattern or bug demo)',
    sectionTypeNote: 'Use PHASE sections, not step. Phase = walkthrough of how something already works. Step = recipe for doing something. "How does HashMap work" is a phase walkthrough.',
    openingHook: 'The FIRST sentence of speakable_answer must be the key mental model stated as a fact — not "HashMap is a data structure" but "HashMap is a Node[] bucket array where the slot index is derived from hashCode." Concrete nouns, not category labels.',
    verdict: 'The speakable must end by connecting the internals to a real production consequence. Something you have seen or would warn a teammate about. "I\'ve seen this cause p99 latency spikes" — not a textbook note.',
  },
  'comparison': {
    blueprint: 'overview (key difference in ONE sentence) → comparison_table (side-by-side, all important dimensions) → step or when_to_use (practical guidance: when to pick each)',
    sectionTypeNote: 'A comparison_table section is REQUIRED. Do not compare two things without a table.',
    openingHook: 'The FIRST sentence of speakable_answer must state the key difference as a single decisive sentence. "String is immutable, StringBuilder is mutable — that one difference drives every other decision."',
    verdict: 'NON-NEGOTIABLE: Give a personal recommendation. "My default is X. I reach for Y only when Z." A neutral listing with no opinion is a failed comparison answer.',
  },
  'debugging-pattern': {
    blueprint: 'problem_statement (what breaks, why it\'s subtle) → before_code (the broken code) → diagnosis (what\'s actually wrong and how to detect it) → after_code (the fixed code)',
    sectionTypeNote: 'Use problem_statement, before_code, diagnosis, after_code. Do NOT use step or phase. This is forensic, not sequential.',
    openingHook: 'Open with the failure: what breaks, and why it\'s easy to miss. Make the reader feel the pain of the bug before you give the solution.',
    verdict: 'End with the preventive pattern — the systemic change that eliminates this class of bug permanently.',
  },
  'system-design': {
    blueprint: 'overview (quantify the scale challenge with real math) → step or phase sections (component by component) → comparison_table (algorithm or approach trade-offs)',
    sectionTypeNote: 'Start with real numbers. "10M/day ÷ 86,400s ≈ 115 req/sec average, peaks at 10–50×." Then design to those numbers.',
    openingHook: 'The FIRST sentence of speakable_answer must quantify the scale. Numbers first. Design second.',
    verdict: 'State your design decisions explicitly with the trade-offs you accepted. Cover failure modes: what happens when this system itself fails?',
  },
  'how-to-recipe': {
    blueprint: 'overview (the end goal and why it matters) → step (each step explains WHY, not just what) → code_example (complete, runnable) → step (production warnings and gotchas)',
    sectionTypeNote: 'Use STEP sections, not phase. Steps are sequential actions you take. Each step must explain its reasoning.',
    openingHook: 'Open with the end goal and the problem it solves. Then walk through the steps.',
    verdict: 'REQUIRED: At least one "Never do X in production because Y" warning with a specific consequence.',
  },
  'tool-config': {
    blueprint: 'overview (what problem this tool solves — not a feature list) → step (installation/setup) → step (key configuration with WHY each option exists and what to avoid) → step (production hardening)',
    sectionTypeNote: 'Every config option must explain its purpose AND its danger. "Never use include: \'*\' — it exposes /env (your passwords) and /heapdump."',
    openingHook: 'Open with the problem this tool exists to solve. Not "Spring Boot Actuator provides endpoints..." but "Actuator gives you production visibility without deploying a separate monitoring agent."',
    verdict: 'Every tool has at least one production footgun. State it explicitly with the consequence.',
  },
  'architecture': {
    blueprint: 'overview (the fundamental problem this architecture solves — WHY, not WHAT) → component (one section per layer/principle) → code_example (the dependency rule violated and then enforced)',
    sectionTypeNote: 'Use COMPONENT sections for layers, not step. Architecture layers are structural roles, not sequential actions.',
    openingHook: 'Open with WHY. "Business rules change slowly, frameworks change rapidly — Clean Architecture is the structural response to that asymmetry."',
    verdict: 'Pick ONE payoff and make it concrete: testability, replaceability, or maintainability. Don\'t list all three vaguely — show what it enables with a specific example.',
  },
  'direct-concept': {
    blueprint: 'overview (key distinction in 1–2 sentences) → comparison_table (if side-by-side makes sense) → code_example (one brief example)',
    sectionTypeNote: 'MAXIMUM 3 sections for complexity 1–2 topics. Simple questions get short answers. Padding a simple topic is a quality failure.',
    openingHook: 'One sentence that captures the entire distinction. Then the answer is essentially done.',
    verdict: 'Give a clear verdict. "I use equals() for every object comparison. == is only correct for enums and identity checks." No hedge without a follow-up.',
  },
  'moderate-concept': {
    blueprint: 'overview (titled "The Problem" — what breaks when people misunderstand this) → phase or step (the mechanics, built around the bug) → code_example (broken → fixed → best practice, three versions)',
    sectionTypeNote: 'Teach through bugs, not theory. Show the broken code first. Then explain why it breaks. Then fix it.',
    openingHook: 'Open with "The Problem." Not the definition. "The Java Memory Model doesn\'t describe what your code does — it describes the minimum guarantees the JVM must honor. Everything else is undefined behavior."',
    verdict: 'The three-version code progression IS the verdict: wrong → corrected → idiomatic. Show all three.',
  },
  'architecture-fallback': {
    blueprint: 'overview → step or phase sections → code_example',
    sectionTypeNote: 'Choose section types that match the question\'s nature.',
    openingHook: 'Open with the key mental model immediately.',
    verdict: 'Give a clear recommendation or practical takeaway.',
  },
};

function getArchetypeInstructions(archetype) {
  return ARCHETYPE_INSTRUCTIONS[archetype] || ARCHETYPE_INSTRUCTIONS['architecture-fallback'];
}

function buildGenerationPrompt(question, archetype, complexity, exemplarData) {
  const complexityGuide = {
    1: { words: '500-650', sections: '2-3' },
    2: { words: '650-900', sections: '3-4' },
    3: { words: '900-1200', sections: '3-5' },
    4: { words: '1100-1500', sections: '4-6' },
    5: { words: '1500-2000', sections: '5-8' },
  };

  const guide = complexityGuide[complexity] || complexityGuide[3];
  const archetypeInstr = getArchetypeInstructions(archetype);

  const exemplarSection = exemplarData.exemplars.slice(0, 2).map((ex, i) => (
    `--- EXEMPLAR ${i + 1}: "${ex.question}" (complexity ${ex.complexity}) ---\n${JSON.stringify(ex.answer, null, 2)}`
  )).join('\n\n');

  return `You are a world-class technical content writer for an interview preparation platform.

=== CONTENT QUALITY CONSTITUTION ===
${qualitySpec}

=== WRITING CRAFT GUIDE ===
${writingGuide}

=== ARCHETYPE: "${archetype}" — COMPLEXITY: ${complexity}/5 ===
Target deep dive: ${guide.words} words across ${guide.sections} sections.

SECTION BLUEPRINT FOR THIS ARCHETYPE:
${archetypeInstr.blueprint}

SECTION TYPE RULE:
${archetypeInstr.sectionTypeNote}

OPENING HOOK REQUIREMENT (this is evaluated by the judge — get it right):
${archetypeInstr.openingHook}

VERDICT REQUIREMENT (this is evaluated by the judge — mandatory):
${archetypeInstr.verdict}

=== GOLD STANDARD EXEMPLARS ===
These represent the exact quality level required. Study the section types used, the opening line of the speakable, and whether/how a verdict is given:

${exemplarSection}

=== YOUR TASK ===
Generate a complete answer for this specific question.

Question: "${question.question}"
Difficulty: ${question.difficulty || 'medium'}
Interviewer Intent: ${JSON.stringify(question.interviewer_intent || {})}
Direct Answer: ${question.direct_answer || ''}

MANDATORY CHECKS before returning:
1. Does your speakable_answer OPEN with the key mental model (not a preamble)?
2. Does your speakable_answer END with a verdict or practical recommendation?
3. Are your deep dive sections using the RIGHT section types for this archetype (${archetypeInstr.blueprint.split('→')[0].trim().replace(/[()]/g, '')}...)?
4. Is this answer specific to THIS question — or could it be swapped with a similar question?
5. Every code block has inline comments on important lines?
6. Key points have 4–6 bullets, each = bold concept + why it matters?

Return ONLY a JSON object:
{
  "sections": [
    {"type": "overview", "title": "...", "content": "..."},
    ...deep dive sections using the archetype blueprint above...,
    {"type": "key_points", "title": "Key Points", "content": "- **Concept** — why it matters\\n- ..."},
    {"type": "speakable_answer", "title": "How to Answer This Verbally", "content": "..."}
  ]
}

No text outside the JSON object.`;
}

async function generateAnswer(question, archetype, complexity) {
  const exemplarData = loadExemplars(archetype);
  const prompt = buildGenerationPrompt(question, archetype, complexity, exemplarData);

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8000,
    temperature: 1,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Generator returned no JSON object');
  return JSON.parse(match[0]);
}

// ─── Stage 3: Gate 1 — Structural Validator ──────────────────────────────────

function validateStructure(answer, complexity) {
  const failures = [];
  const sections = answer.sections || [];

  const keyPointsSections = sections.filter(s => s.type === 'key_points');
  const speakableSections = sections.filter(s => s.type === 'speakable_answer');
  const deepSections = sections.filter(s =>
    s.type !== 'key_points' && s.type !== 'speakable_answer'
  );

  // Structural presence
  if (keyPointsSections.length !== 1) {
    failures.push(`Must have exactly 1 key_points section (found ${keyPointsSections.length})`);
  }
  if (speakableSections.length !== 1) {
    failures.push(`Must have exactly 1 speakable_answer section (found ${speakableSections.length})`);
  }
  if (deepSections.length < 2) {
    failures.push(`Must have at least 2 deep dive sections (found ${deepSections.length})`);
  }

  // Empty sections
  sections.forEach((s, i) => {
    if (!s.content || s.content.trim().length < 80) {
      failures.push(`Section ${i} ("${s.title || s.type}") is too short (${(s.content || '').length} chars, min 80)`);
    }
  });

  // Key points bullet count
  if (keyPointsSections.length === 1) {
    const kp = keyPointsSections[0].content || '';
    const bullets = (kp.match(/^- /gm) || []).length;
    if (bullets < 4) failures.push(`Key points has ${bullets} bullets (min 4). Each must start with "- "`);
    if (bullets > 10) failures.push(`Key points has ${bullets} bullets (max 10)`);
  }

  // Deep dive word count vs complexity
  const deepText = deepSections.map(s => s.content || '').join(' ');
  const deepWords = deepText.split(/\s+/).filter(w => w.length > 0).length;
  const targets = { 1: [250, 900], 2: [350, 1200], 3: [400, 1600], 4: [650, 2000], 5: [900, 2600] };
  const [minW, maxW] = targets[complexity] || targets[3];
  if (deepWords < minW) failures.push(`Deep dive too short: ${deepWords} words (min ${minW} for complexity ${complexity})`);
  if (deepWords > maxW) failures.push(`Deep dive too long: ${deepWords} words (max ${maxW} for complexity ${complexity})`);

  // Speakable vs deep dive ratio
  if (speakableSections.length === 1 && deepWords > 0) {
    const speakWords = (speakableSections[0].content || '').split(/\s+/).filter(w => w.length > 0).length;
    const ratio = speakWords / deepWords;
    if (ratio > 0.6) failures.push(`Speakable answer too long relative to deep dive (ratio ${ratio.toFixed(2)}, max 0.6)`);
    if (ratio < 0.1) failures.push(`Speakable answer too short relative to deep dive (ratio ${ratio.toFixed(2)}, min 0.1)`);
  }

  // Speakable should not have fenced code blocks
  if (speakableSections.length === 1) {
    const sp = speakableSections[0].content || '';
    if (sp.includes('```')) {
      failures.push('Speakable answer contains fenced code blocks — only inline `code` allowed');
    }
    const boldCount = (sp.match(/\*\*[^*]+\*\*/g) || []).length;
    if (boldCount < 2) failures.push(`Speakable answer has too few bold terms (${boldCount}, min 3)`);
  }

  // Code blocks should have comments
  const allContent = sections.map(s => s.content || '').join('\n');
  const codeBlocks = allContent.match(/```[\s\S]*?```/g) || [];
  const uncommented = codeBlocks.filter(cb => !cb.match(/\/\/|#\s|--\s|\/\*/));
  if (codeBlocks.length > 0 && uncommented.length > codeBlocks.length * 0.5) {
    failures.push(`${uncommented.length}/${codeBlocks.length} code blocks lack inline comments`);
  }

  // No single section dominates
  deepSections.forEach(s => {
    const sWords = (s.content || '').split(/\s+/).length;
    if (deepWords > 0 && sWords / deepWords > 0.5) {
      failures.push(`Section "${s.title || s.type}" is ${Math.round(sWords / deepWords * 100)}% of deep dive — too dominant, split it`);
    }
  });

  return {
    pass: failures.length === 0,
    failures,
    stats: { deepWords, sectionCount: deepSections.length, complexity }
  };
}

// ─── Stage 4: Gate 2 — AI Content Judge ──────────────────────────────────────

async function judgeAnswer(question, answer, archetype, complexity) {
  const exemplarData = loadExemplars(archetype);
  const exemplarSnippet = exemplarData.exemplars.slice(0, 1).map(ex =>
    `"${ex.question}" (complexity ${ex.complexity}):\n${JSON.stringify(ex.answer.sections.slice(0, 2), null, 2)}\n...(${ex.answer.sections.length} total sections)`
  ).join('\n');

  const archetypeInstr = getArchetypeInstructions(archetype);

  const prompt = `You are a senior technical content reviewer for an interview preparation platform.
You are reviewing a generated answer to decide if it meets the quality bar.

=== QUALITY CONSTITUTION ===
${qualitySpec}

=== EXEMPLAR (gold standard for this archetype) ===
${exemplarSnippet}

=== THE QUESTION ===
"${question.question}"
Archetype: ${archetype}, Complexity: ${complexity}/5
Interviewer intent: ${JSON.stringify(question.interviewer_intent || {})}

=== ARCHETYPE REQUIREMENTS FOR THIS ANSWER ===
Expected section blueprint: ${archetypeInstr.blueprint}
Opening hook requirement: ${archetypeInstr.openingHook}
Verdict requirement: ${archetypeInstr.verdict}

=== THE GENERATED ANSWER TO REVIEW ===
${JSON.stringify(answer, null, 2)}

=== YOUR TASK ===
Score this answer on 7 dimensions (each 0-100). Be strict — this content is used for real interview prep.

1. topic_fit (0-100)
   - Does the depth match this specific question?
   - Does it cover exactly what the interviewer wants, not adjacent topics?
   - Score 40 or below if the answer would work equally well for a different question.

2. speakable_naturalness (0-100)
   - Read the speakable aloud mentally. Senior engineer over coffee, or reading documentation?
   - SCORE PENALTIES (apply each that is true):
     * Opening sentence is a textbook definition, not a mental model insight → -20
     * Uses "Furthermore," "Additionally," "It is important to note," "It should be noted" → -15 per instance
     * No personal opinion/recommendation/verdict ("my rule is", "I've seen", "I use") → -20
     * Closing sentence does not give a rule of thumb, verdict, or practical tip → -15
     * Sounds like it was written to be read, not said aloud → -25

3. deep_dive_teaching (0-100)
   - Can someone learn the full topic from zero? Explanation-first? Progressive?
   - Uses section types appropriate for this archetype (${archetypeInstr.blueprint.split('→')[0].trim()}...)?
   - Names at least one common trap or mistake explicitly?
   - Section titles are descriptive stories, not labels like "Step 1 — Overview"?

4. code_quality (0-100)
   - Every code block has inline comments on non-obvious lines?
   - Each code block has prose introduction and/or follow-up?
   - No section is 80%+ code (code dump)?
   - Code is practical and realistic, not toy examples?
   - Score 0 if there are code blocks with no prose context at all.

5. key_points_usefulness (0-100)
   - Are these the 5 things you'd write on a napkin 10 minutes before the interview?
   - Each bullet = bold concept + non-obvious consequence (not just a label)?
   - Would scanning these for 30 seconds genuinely refresh your memory?
   - Score 40 or below if bullets are things every developer already knows.

6. uniqueness (0-100)
   - Is this answer specific to THIS question's exact angle?
   - Contains at least one detail, example, or consequence that is unique to this specific question?
   - Score 40 or below if any paragraph could be moved to a similar question without anyone noticing.

7. completeness_balance (0-100)
   - All important concepts covered for this question's complexity level?
   - No filler sentences that add length without value?
   - Simple question → short answer? Complex question → deep answer?
   - Score 40 or below if there is obvious padding OR obvious missing content.

Return ONLY a JSON object:
{
  "scores": {
    "topic_fit": 85,
    "speakable_naturalness": 70,
    "deep_dive_teaching": 90,
    "code_quality": 80,
    "key_points_usefulness": 85,
    "uniqueness": 75,
    "completeness_balance": 80
  },
  "overall": 81,
  "pass": true,
  "failures": ["dimension_name: specific quoted text from the answer that failed"],
  "feedback": "Specific, actionable. Quote the exact sentence that fails and say what to replace it with. Not 'improve the speakable' but 'The opening line \\"X\\" is a definition — replace with the mental model like \\"Y\\"'."
}

Rules:
- overall = average of all 7 scores
- pass = true if overall >= 80 AND no single dimension < 60
- failures = dimensions that scored < 70, with the specific offending text quoted
- feedback = 2-3 sentences max, each with a quoted problem and a concrete replacement direction`;

  const response = await anthropic.messages.create({
    model: JUDGE_MODEL,
    max_tokens: 1500,
    temperature: 0,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Judge returned no JSON');
  const result = JSON.parse(match[0]);

  const scores = result.scores || {};
  const vals = Object.values(scores);
  result.overall = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  result.pass = result.overall >= 80 && vals.every(v => v >= 60);

  if (!result.failures) result.failures = [];
  Object.entries(scores).forEach(([dim, score]) => {
    if (score < 70 && !result.failures.some(f => f.includes(dim))) {
      result.failures.push(`${dim}: scored ${score}`);
    }
  });

  return result;
}

// ─── Stage 5: Fix Loop ──────────────────────────────────────────────────────

async function fixAnswer(question, answer, judgeFeedback, archetype, complexity) {
  const exemplarData = loadExemplars(archetype);
  const prompt = `You are fixing a generated interview answer based on reviewer feedback.

=== QUALITY CONSTITUTION ===
${qualitySpec}

=== ORIGINAL QUESTION ===
"${question.question}"
Archetype: ${archetype}, Complexity: ${complexity}/5

=== CURRENT ANSWER (needs fixes) ===
${JSON.stringify(answer, null, 2)}

=== REVIEWER FEEDBACK ===
Failures: ${judgeFeedback.failures.join('; ')}
Feedback: ${judgeFeedback.feedback}
Scores: ${JSON.stringify(judgeFeedback.scores)}

=== EXEMPLAR FOR REFERENCE ===
${JSON.stringify(exemplarData.exemplars[0]?.answer?.sections?.slice(0, 2), null, 2)}

=== YOUR TASK ===
Fix ONLY the dimensions that failed. Do NOT rewrite sections that scored well.
Return the complete corrected answer as a JSON object:
{
  "sections": [...]
}

No text outside the JSON object.`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Fix returned no JSON');
  return JSON.parse(match[0]);
}

// ─── Pipeline Orchestration ──────────────────────────────────────────────────

async function processQuestion(question, classification, questionIndex) {
  const { archetype, complexity } = classification;
  const slug = question.slug || question.id || `q${questionIndex}`;

  const report = {
    slug,
    question: question.question,
    archetype,
    complexity,
    attempts: 0,
    gate1Results: [],
    gate2Results: [],
    finalStatus: 'pending',
    finalScore: 0,
  };

  console.log(`\n  [${slug}] archetype=${archetype} complexity=${complexity}`);

  let currentAnswer = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    report.attempts = attempt;
    console.log(`    Attempt ${attempt}/${MAX_ATTEMPTS}...`);

    try {
      // Generate or fix
      if (attempt === 1) {
        console.log(`    → Generating...`);
        currentAnswer = await generateAnswer(question, archetype, complexity);
      } else {
        const lastJudge = report.gate2Results[report.gate2Results.length - 1];
        const lastGate1 = report.gate1Results[report.gate1Results.length - 1];
        const feedback = lastJudge || { failures: lastGate1?.failures || [], feedback: 'Fix structural issues.' };
        console.log(`    → Fixing based on feedback...`);
        currentAnswer = await fixAnswer(question, currentAnswer, feedback, archetype, complexity);
      }

      // Gate 1: Structural validation
      console.log(`    → Gate 1 (structural)...`);
      const gate1 = validateStructure(currentAnswer, complexity);
      report.gate1Results.push(gate1);

      if (!gate1.pass) {
        console.log(`    ✗ Gate 1 FAIL: ${gate1.failures.slice(0, 2).join('; ')}`);
        if (attempt === MAX_ATTEMPTS) {
          report.finalStatus = 'quarantined';
          report.finalAnswer = currentAnswer;
          break;
        }
        report.gate2Results.push({ failures: gate1.failures, feedback: gate1.failures.join('. '), scores: {}, overall: 0, pass: false });
        continue;
      }
      console.log(`    ✓ Gate 1 passed (${gate1.stats.deepWords} words, ${gate1.stats.sectionCount} sections)`);

      // Gate 2: AI Content Judge
      console.log(`    → Gate 2 (AI judge)...`);
      const gate2 = await judgeAnswer(question, currentAnswer, archetype, complexity);
      report.gate2Results.push(gate2);

      if (gate2.pass) {
        console.log(`    ✓ Gate 2 PASSED — score: ${gate2.overall}/100`);
        report.finalStatus = 'accepted';
        report.finalScore = gate2.overall;
        report.finalAnswer = currentAnswer;
        break;
      } else {
        console.log(`    ✗ Gate 2 FAIL — score: ${gate2.overall}/100`);
        console.log(`      Failures: ${gate2.failures.slice(0, 3).join('; ')}`);
        if (attempt === MAX_ATTEMPTS) {
          if (gate2.overall >= 65) {
            console.log(`    → Accepting at ${gate2.overall} after max attempts`);
            report.finalStatus = 'accepted-marginal';
            report.finalScore = gate2.overall;
            report.finalAnswer = currentAnswer;
          } else {
            report.finalStatus = 'quarantined';
            report.finalAnswer = currentAnswer;
            report.finalScore = gate2.overall;
          }
        }
      }
    } catch (err) {
      console.error(`    ✗ Error on attempt ${attempt}: ${err.message}`);
      report.gate1Results.push({ pass: false, failures: [`Error: ${err.message}`] });
      if (attempt === MAX_ATTEMPTS) {
        report.finalStatus = 'error';
      }
    }
  }

  return report;
}

async function processFile(filePath, dryRun = false, resume = false) {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`Processing: ${filePath}`);
  console.log(`${'═'.repeat(70)}`);

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const questions = data.questions || [];
  const fileName = path.basename(path.dirname(filePath));

  // Check which questions already have quality answers (for resume)
  const needsProcessing = questions.map((q, i) => {
    if (!resume) return { q, i, skip: false };
    const hasKP = (q.answer?.sections || []).some(s => s.type === 'key_points');
    const hasSA = (q.answer?.sections || []).some(s => s.type === 'speakable_answer');
    const deepSections = (q.answer?.sections || []).filter(s =>
      s.type !== 'key_points' && s.type !== 'speakable_answer'
    );
    const deepChars = deepSections.reduce((a, s) => a + (s.content || '').length, 0);
    const skip = hasKP && hasSA && deepChars > 1500;
    if (skip) console.log(`  Skipping "${q.slug}" — already has quality answer`);
    return { q, i, skip };
  });

  const toProcess = needsProcessing.filter(x => !x.skip);
  if (toProcess.length === 0) {
    console.log('All questions already have quality answers. Nothing to do.');
    return;
  }

  console.log(`\nClassifying ${toProcess.length} questions...`);
  const classifications = await classifyQuestions(toProcess.map(x => x.q));
  console.log('Classifications:');
  classifications.forEach(c => {
    const q = toProcess[c.index];
    console.log(`  ${q.i}. [${c.archetype}|${c.complexity}] ${q.q.slug || q.q.question.substring(0, 50)}`);
  });

  if (dryRun) {
    console.log('\n[DRY RUN] Would process these questions. Exiting.');
    return;
  }

  // Process questions with limited concurrency
  const reports = [];
  for (let batch = 0; batch < toProcess.length; batch += CONCURRENCY) {
    const batchItems = toProcess.slice(batch, batch + CONCURRENCY);
    const batchResults = await Promise.all(
      batchItems.map(item => {
        const cls = classifications.find(c => c.index === toProcess.indexOf(item));
        if (!cls) return Promise.resolve(null);
        return processQuestion(item.q, cls, item.i);
      })
    );

    batchResults.forEach((report, bi) => {
      if (!report) return;
      reports.push(report);
      const item = batchItems[bi];

      // Write accepted answers back to the data
      if ((report.finalStatus === 'accepted' || report.finalStatus === 'accepted-marginal') && report.finalAnswer) {
        data.questions[item.i].answer = report.finalAnswer;
        // Save incrementally
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`  💾 Saved ${report.slug} (score: ${report.finalScore})`);
      }
    });
  }

  // Generate report
  const reportData = {
    file: filePath,
    timestamp: new Date().toISOString(),
    summary: {
      total: toProcess.length,
      accepted: reports.filter(r => r.finalStatus === 'accepted').length,
      acceptedMarginal: reports.filter(r => r.finalStatus === 'accepted-marginal').length,
      quarantined: reports.filter(r => r.finalStatus === 'quarantined').length,
      errors: reports.filter(r => r.finalStatus === 'error').length,
      avgScore: Math.round(reports.reduce((a, r) => a + r.finalScore, 0) / reports.length) || 0,
    },
    questions: reports.map(r => ({
      slug: r.slug,
      question: r.question,
      archetype: r.archetype,
      complexity: r.complexity,
      attempts: r.attempts,
      finalStatus: r.finalStatus,
      finalScore: r.finalScore,
      gate2Scores: r.gate2Results.length > 0 ? r.gate2Results[r.gate2Results.length - 1].scores : {},
    })),
  };

  const reportPath = path.join(REPORT_DIR, `${fileName}.report.json`);
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));

  // Quarantine failed questions
  const quarantined = reports.filter(r => r.finalStatus === 'quarantined' || r.finalStatus === 'error');
  if (quarantined.length > 0) {
    const qPath = path.join(QUARANTINE_DIR, `${fileName}-quarantine.json`);
    fs.writeFileSync(qPath, JSON.stringify(quarantined.map(r => ({
      slug: r.slug,
      question: r.question,
      archetype: r.archetype,
      complexity: r.complexity,
      lastAnswer: r.finalAnswer,
      lastScore: r.finalScore,
      gate2Results: r.gate2Results,
    })), null, 2));
  }

  // Print summary
  console.log(`\n${'─'.repeat(70)}`);
  console.log(`RESULTS: ${filePath}`);
  console.log(`${'─'.repeat(70)}`);
  console.log(`  Accepted:          ${reportData.summary.accepted}`);
  console.log(`  Accepted-marginal: ${reportData.summary.acceptedMarginal}`);
  console.log(`  Quarantined:       ${reportData.summary.quarantined}`);
  console.log(`  Errors:            ${reportData.summary.errors}`);
  console.log(`  Average score:     ${reportData.summary.avgScore}/100`);
  console.log(`  Report:            ${reportPath}`);

  reports.forEach(r => {
    const icon = r.finalStatus.startsWith('accepted') ? '✓' : r.finalStatus === 'quarantined' ? '⚠' : '✗';
    console.log(`  ${icon} ${r.slug} — ${r.finalStatus} (${r.finalScore}/100, ${r.attempts} attempt(s))`);
  });

  return reportData;
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const filePath = args.find(a => !a.startsWith('--'));
  const dryRun = args.includes('--dry-run');
  const resume = args.includes('--resume');

  if (!filePath) {
    console.log(`
Usage: node scripts/generators/answerPipeline.js <path> [--dry-run] [--resume]

Examples:
  node scripts/generators/answerPipeline.js content/interview/java/backend/intermediate/spring-boot/complete-qa.json
  node scripts/generators/answerPipeline.js content/interview/java/backend/intermediate/core-java/complete-qa.json --dry-run
  node scripts/generators/answerPipeline.js content/interview/java/backend/intermediate/core-java/complete-qa.json --resume

Options:
  --dry-run   Classify questions but don't generate answers
  --resume    Skip questions that already have quality answers
    `);
    process.exit(1);
  }

  if (!process.env.PORTKEY_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    console.error('ERROR: No API key found. Set either:');
    console.error('  PORTKEY_API_KEY=xp1+...  (recommended — uses Portkey gateway)');
    console.error('  ANTHROPIC_API_KEY=sk-ant-...  (direct Anthropic access)');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`ERROR: File not found: ${filePath}`);
    process.exit(1);
  }

  await processFile(filePath, dryRun, resume);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
