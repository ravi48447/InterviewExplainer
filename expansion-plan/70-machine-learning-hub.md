# 70 — Machine Learning Hub Rollout

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** hub feature work + cross-tree content aggregation. Pulls from PML (playbook 39) and new ML-cross-cutting modules introduced here.
> **Depends on:** 39 (Python ML/AI track), 41 (interview-qa-hub rollout pattern), 44 (system-design hub — for cross-link to `/system-design/machine-learning`).

## TL;DR

- **Goal:** A single browsable hub for **machine learning + AI engineering** content — classical ML, deep learning, LLMs / GenAI, MLOps, ML system design, applied research patterns. One URL for "ml engineer interview questions", "llm interview questions", "mlops interview questions", "deep learning interview questions".
- **Action:** Add `frontend/lib/hubs/machine-learning.ts` aggregator, build `/machine-learning` index + up to 9 category pages, scaffold `content/ml-cross-cutting/` for content that does not live cleanly under PML (theoretical foundations, LLM evals, RAG patterns, model-eval methodology, responsible-ai).
- **Output:** `/machine-learning` returns 200 with grouped content; ≥ 350 ML cards across categories; hub URLs in `sitemap.xml`; nav link added.

## Hard prerequisites

- [ ] Playbook 39 (Python ML/AI track) at least scaffolded.
- [ ] Playbook 41 (interview-qa-hub rollout) DONE.
- [ ] Playbook 44 (system-design hub) DONE — `/system-design/machine-learning` category exists.
- [ ] `frontend/lib/launch-config.ts` has `ENABLED_HUBS.machineLearning` (add if missing; default `false`).

## Why this matters

ML engineering and applied LLM roles are the fastest-growing senior compensation segment in 2026 (Levels.fyi staff ML engineer: $400-650k total), and the interview surface fragmented dramatically after the GenAI wave — classical ML, deep-learning theory, MLOps, LLM ops, RAG, evals, agents. A consolidated hub that separates theory (math, classical ML) from applied (LLMs, MLOps) and from architecture (ML system design) lets candidates triage to the right depth and lets the platform own multiple search verticals at once.

## Background

This hub aggregates from the following content trees:

| Content tree | Role | Key tools covered |
|---|---|---|
| `content/python-ml-ai/` (playbook 39) | Primary | scikit-learn, PyTorch, TensorFlow/Keras, Hugging Face Transformers, MLflow, Kubeflow, vLLM/TGI, LangChain, LlamaIndex |
| `content/ml-cross-cutting/` (new, this playbook) | Cross-cutting | ML theory, DL foundations, LLM evals, RAG patterns, prompt engineering, eval methodology, responsible AI, safety/red-teaming |

The hub LINKS to PML for all code-bearing content (PyTorch, scikit-learn, vLLM). The cross-cutting tree holds only theory, methodology, and conceptual patterns.

Real anchors: PyTorch 2.3, scikit-learn 1.5, Hugging Face Transformers 4.41, MLflow 2.13, Kubeflow 1.8, vLLM 0.5 (inference engine), SGLang 0.2 (emerging alternative), LangChain 0.2, LlamaIndex 0.10. RAG (Retrieval-Augmented Generation) is the dominant architecture pattern for applying LLMs to private data.

## Search phrases to own

| Search phrase | Target page |
|---|---|
| `machine learning interview questions` | `/machine-learning` |
| `ml engineer interview questions` | `/machine-learning` |
| `deep learning interview questions` | `/machine-learning/deep-learning` |
| `nlp interview questions` | `/machine-learning/nlp-and-language-models` |
| `llm interview questions` | `/machine-learning/llms-and-genai` |
| `rag interview questions` | `/machine-learning/llms-and-genai` (RAG sub-section) |
| `prompt engineering interview questions` | `/machine-learning/llms-and-genai` |
| `mlops interview questions` | `/machine-learning/mlops` |
| `ml system design interview` | `/machine-learning/system-design` |
| `model evaluation interview questions` | `/machine-learning/evaluation-and-metrics` |
| `statistics for ml interview questions` | `/machine-learning/theory-and-statistics` |
| `responsible ai interview questions` | `/machine-learning/responsible-ai` |

## Current state

- PML content lives (or will live) under `content/python-ml-ai/` (playbook 39).
- No cross-cutting LLM-evals / RAG-patterns / theory tree exists today.
- `/machine-learning` route does NOT exist today.

## Target state (measurable)

- Up to 10 hub pages return 200 (`/machine-learning` + up to 9 categories below).
- Hub aggregator returns ≥ 350 ML cards.
- All hub URLs appear in `sitemap.xml`.

## Categories (canonical — launch with 7 minimum, up to 9 if budget allows)

| Category slug | Pulls from… |
|---|---|
| `theory-and-statistics` | `python-ml-ai/ml-foundations`, `python-ml-ai/probability-and-statistics`, `ml-cross-cutting/ml-theory-essentials` |
| `classical-ml` | `python-ml-ai/scikit-learn`, `python-ml-ai/feature-engineering`, `python-ml-ai/model-selection` |
| `deep-learning` | `python-ml-ai/pytorch-deep`, `python-ml-ai/tensorflow-keras`, `python-ml-ai/cv-and-vision`, `ml-cross-cutting/dl-fundamentals` |
| `nlp-and-language-models` | `python-ml-ai/nlp-fundamentals`, `python-ml-ai/transformers-from-scratch`, `python-ml-ai/llm-fine-tuning` |
| `llms-and-genai` | `python-ml-ai/llm-applications`, `python-ml-ai/rag-systems`, `python-ml-ai/agent-frameworks`, `ml-cross-cutting/llm-evals`, `ml-cross-cutting/rag-patterns`, `ml-cross-cutting/prompt-engineering` |
| `mlops` | `python-ml-ai/mlflow`, `python-ml-ai/kubeflow`, `python-ml-ai/model-serving-vllm-tgi`, `python-ml-ai/feature-stores`, `python-ml-ai/model-monitoring` |
| `evaluation-and-metrics` | `python-ml-ai/eval-classical-ml`, `python-ml-ai/eval-llms`, `ml-cross-cutting/eval-methodology` |
| `system-design` | `python-ml-ai/ml-system-design-cases` + cross-link to `/system-design/machine-learning` |
| `responsible-ai` | `ml-cross-cutting/responsible-ai`, `ml-cross-cutting/safety-and-red-teaming` |

**Minimum 7 frozen at launch.** `evaluation-and-metrics` and `responsible-ai` may ship as follow-up playbooks if the launch budget is tight. Once the category set is chosen at launch it is frozen — adding a 10th requires its own playbook.

---

## Step 1 — Scaffold the cross-cutting module

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
mkdir -p content/ml-cross-cutting
cat > content/ml-cross-cutting/_index.json <<EOF
{
  "level": "ml-cross-cutting",
  "modules": [],
  "pillar_groups": []
}
EOF

for M in ml-theory-essentials dl-fundamentals llm-evals rag-patterns prompt-engineering eval-methodology responsible-ai safety-and-red-teaming; do
  mkdir -p "content/ml-cross-cutting/$M"
done
```

Target counts per cross-cutting module: ~20-30 cards each, ~180 total.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f content/ml-cross-cutting/_index.json && echo "OK index" || echo "MISSING index"
for M in ml-theory-essentials dl-fundamentals llm-evals rag-patterns prompt-engineering eval-methodology responsible-ai safety-and-red-teaming; do
  test -d "content/ml-cross-cutting/$M" && echo "OK $M" || echo "MISSING $M"
done
```
Expected: 9 `OK` lines.

---

### Step 2 — Aggregator

`frontend/lib/hubs/machine-learning.ts`:

```typescript
export type MLCategory =
  | 'theory-and-statistics'
  | 'classical-ml'
  | 'deep-learning'
  | 'nlp-and-language-models'
  | 'llms-and-genai'
  | 'mlops'
  | 'evaluation-and-metrics'
  | 'system-design'
  | 'responsible-ai';

export interface MLCard {
  id:        string;
  title:     string;
  domain:    string;
  module:    string;
  topic:     string;
  href:      string;
  category:  MLCategory;
  difficulty:'easy' | 'medium' | 'hard';
  topicTags: string[];   // e.g. ["pytorch", "transformers", "rag"]
}

export const ML_CATEGORY_FEEDS: Record<MLCategory, string[]> = {
  'theory-and-statistics': [
    'python-ml-ai/ml-foundations',
    'python-ml-ai/probability-and-statistics',
    'ml-cross-cutting/ml-theory-essentials',
  ],
  'classical-ml': [
    'python-ml-ai/scikit-learn',
    'python-ml-ai/feature-engineering',
    'python-ml-ai/model-selection',
  ],
  'deep-learning': [
    'python-ml-ai/pytorch-deep',
    'python-ml-ai/tensorflow-keras',
    'python-ml-ai/cv-and-vision',
    'ml-cross-cutting/dl-fundamentals',
  ],
  'nlp-and-language-models': [
    'python-ml-ai/nlp-fundamentals',
    'python-ml-ai/transformers-from-scratch',
    'python-ml-ai/llm-fine-tuning',
  ],
  'llms-and-genai': [
    'python-ml-ai/llm-applications',
    'python-ml-ai/rag-systems',
    'python-ml-ai/agent-frameworks',
    'ml-cross-cutting/llm-evals',
    'ml-cross-cutting/rag-patterns',
    'ml-cross-cutting/prompt-engineering',
  ],
  'mlops': [
    'python-ml-ai/mlflow',
    'python-ml-ai/kubeflow',
    'python-ml-ai/model-serving-vllm-tgi',
    'python-ml-ai/feature-stores',
    'python-ml-ai/model-monitoring',
  ],
  'evaluation-and-metrics': [
    'python-ml-ai/eval-classical-ml',
    'python-ml-ai/eval-llms',
    'ml-cross-cutting/eval-methodology',
  ],
  'system-design': ['python-ml-ai/ml-system-design-cases'],
  'responsible-ai': [
    'ml-cross-cutting/responsible-ai',
    'ml-cross-cutting/safety-and-red-teaming',
  ],
};
```

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f frontend/lib/hubs/machine-learning.ts && echo "OK aggregator" || echo "MISSING aggregator"
grep -c 'ML_CATEGORY_FEEDS' frontend/lib/hubs/machine-learning.ts
```
Expected: `OK aggregator`; count ≥ 1.

---

### Step 3 — Pages

- `/machine-learning` — index of active categories with card counts.
- `/machine-learning/<category>` — filterable card list; topic-tag pill badges.
- Card click goes to existing module URLs — hub LINKS only.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for F in \
  frontend/app/machine-learning/page.tsx \
  "frontend/app/machine-learning/[category]/page.tsx" \
  frontend/components/MLCard.tsx; do
  test -f "$F" && echo "OK $F" || echo "MISSING $F"
done
```

---

### Step 4 — Category intros (250 words each)

Same shape as playbook 44 step 3. The `llms-and-genai` intro explicitly names the four sub-pillars (applications, RAG, agents, prompt engineering) and the decision rule: "Use RAG when the knowledge changes frequently or is proprietary; use fine-tuning when you need consistent behavior or domain-specific tone." The MLOps intro names MLflow 2.13 for experiment tracking, Kubeflow 1.8 for pipeline orchestration, and vLLM 0.5 for serving.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
INTRO_COUNT=$(find content/ml-cross-cutting -name 'intro.md' | wc -l)
echo "Intro count: $INTRO_COUNT (want ≥ 7)"
```

---

### Step 5 — Flip flag

```typescript
ENABLED_HUBS: {
  ...,
  machineLearning: true,
}
```

Commit: `launch: enable machineLearning hub`.

**Verify:**
```bash
grep -c 'machineLearning: *true' \
  /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend/lib/launch-config.ts
```
Expected: ≥ 1.

---

### Step 6 — Smoke

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build 2>&1 | tail -20

npm run dev &
DEV_PID=$!
sleep 5

for url in \
  /machine-learning \
  /machine-learning/theory-and-statistics \
  /machine-learning/classical-ml \
  /machine-learning/deep-learning \
  /machine-learning/nlp-and-language-models \
  /machine-learning/llms-and-genai \
  /machine-learning/mlops \
  /machine-learning/evaluation-and-metrics \
  /machine-learning/system-design \
  /machine-learning/responsible-ai; do
  printf "%-55s -> " "${url}"
  curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000${url}"
done

kill ${DEV_PID}
```

Expected: all `200` (skip any categories deferred to follow-up playbooks).

---

## Files and code to touch

| Path | Change |
|---|---|
| `frontend/lib/launch-config.ts` | add `machineLearning` flag |
| `frontend/lib/hubs/machine-learning.ts` | NEW — aggregator |
| `frontend/app/machine-learning/page.tsx` | NEW — index |
| `frontend/app/machine-learning/[category]/page.tsx` | NEW — category page |
| `frontend/components/MLCard.tsx` | NEW — card with topic-tag badges |
| `frontend/components/site-header.tsx` | add Machine Learning nav link |
| `scripts/build_sitemap.py` | enumerate ML hub URLs |
| `content/ml-cross-cutting/` | NEW directory + 8 modules |

## Content rules

- Hub LINKS, never duplicates PML content.
- Cross-cutting tree holds only content that is not language-specific (theory, methodology, eval, RAG patterns, responsible AI). All code-bearing PyTorch / scikit-learn / vLLM content lives in PML.
- Card topic tags reflect concrete tools (e.g. `["pytorch", "transformers", "lora"]`) — used for client-side filtering.
- A topic appears in **only one** category (no double-counting; e.g. "vLLM serving" goes in `mlops`, not `llms-and-genai`).
- The most common mistake is routing vLLM/TGI content into `llms-and-genai` because it's LLM-related — it goes in `mlops` because the question is about serving infrastructure, not model logic.
- The category set is **frozen** at launch — adding a new one requires its own playbook.

## SEO and URLs

- Canonical: `/machine-learning`, `/machine-learning/<category>`.
- JSON-LD: `BreadcrumbList` + `CollectionPage` per category.
- Title format: `<Category> Interview Questions — Machine Learning Hub | InterviewExplainer`.

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| All active category hub pages return 200 | all of them | smoke loop (all `200`) |
| Hub aggregator returns ≥ 350 cards | ≥ 350 | `console.log(listCards().length)` in aggregator; `npm run build` |
| `llms-and-genai` category ≥ 80 cards | ≥ 80 | `console.log(listCards('llms-and-genai').length)` |
| `mlops` category ≥ 50 cards | ≥ 50 | `console.log(listCards('mlops').length)` |
| Each active category intro ≥ 200 words | all intros | `for F in content/ml-cross-cutting/*-intro.md; do wc -w < "$F"; done` all ≥ 200 |
| Sitemap includes all ML hub URLs | count matches active categories + 1 | `grep -c '/machine-learning' frontend/public/sitemap.xml` |
| `npm run build` exit 0 | 0 | `cd frontend && npm run build; echo $?` |
| Topic tags present on every card | ≥ 95 % | `rg 'topicTags=\{' frontend/components/MLCard.tsx` ≥ 1 |
| Existing PML pages: zero regression | manual | open one PyTorch + one LLM topic |
| Site-header has Machine Learning link | grep | `grep -c 'href="/machine-learning"' frontend/components/site-header.tsx` ≥ 1 |
| Cross-link to `/system-design/machine-learning` resolves | manual | click from `/machine-learning/system-design` |

## Failure modes & rollback

- **Card count < 350**: PML content gap — do not flip flag. Generate more in the thinnest pillar before launch.
- **`llms-and-genai` < 80 cards**: this is the keyword-magnet pillar — do not launch until it hits target. It is the primary search attractor.
- **MLOps tooling drift** (vLLM → SGLang, MLflow → newer alternative): pin content to specific versions; the hub aggregator is version-agnostic but the underlying cards must name the version (e.g. "vLLM 0.5 serves transformer models without batching overhead at the Python level; SGLang 0.2 adds structured output guarantees via FSM decoding").
- **Topic tags inconsistent across sources** (e.g. `pytorch` vs `PyTorch` vs `torch`): aggregator should lowercase + deduplicate. Add a `TAG_CANONICAL_MAP` if drift becomes a problem.
- **Responsible AI section too thin**: acceptable to launch with a "coming soon" notice; track as a follow-up.
- **Rollback:** `ENABLED_HUBS.machineLearning = false`.

## Definition of Done

- [ ] `grep -c 'machineLearning: *true' frontend/lib/launch-config.ts` ≥ 1
- [ ] Smoke loop — all active category pages return 200
- [ ] `console.log(listCards().length)` ≥ 350
- [ ] `console.log(listCards('llms-and-genai').length)` ≥ 80
- [ ] `console.log(listCards('mlops').length)` ≥ 50
- [ ] `for F in content/ml-cross-cutting/*-intro.md; do wc -w < "$F"; done` — all ≥ 200
- [ ] `grep -c '/machine-learning' frontend/public/sitemap.xml` ≥ active-category-count + 1
- [ ] `grep -c 'href="/machine-learning"' frontend/components/site-header.tsx` ≥ 1
- [ ] `cd frontend && npm run build; echo $?` — exits 0
- [ ] `test -f content/ml-cross-cutting/_index.json && echo OK` — OK

## Estimated effort

- **Ideal:** 22 hours (3h scaffold + 8h cross-cutting content + 8h hub UI + 3h intros + smoke).
- **Hard stop:** 45 hours.
- **Recommended split:** 3 agent sessions:
  1. Steps 1-2 (scaffold cross-cutting + aggregator).
  2. Steps 3-4 (pages + intros + seed cross-cutting to ≥ 120 cards).
  3. Steps 5-6 (flag + smoke + commits + INDEX).