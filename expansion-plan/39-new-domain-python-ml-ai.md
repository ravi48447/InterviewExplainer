# 39 — New Domain: `python-ml-ai` (FULL SPEC + ROLLOUT)

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** new locked domain — spec + scaffold + content + launch.

## TL;DR

- **Goal:** Highest-growth interview-prep search vertical in 2026 — ML
  / DL / LLM-engineering with Python.
- **Audience:** ML engineers, applied scientists, MLE-tracked
  software engineers, AI engineers building RAG / agents / fine-tuned LLMs.
- **Target Q at launch:** 1000 across 18 modules.
- **Output:** Live at `/interview/python-ml-ai`.

## Why this matters (2 sentences)

ML / AI is the **fastest-growing interview content category in 2024-26**
— LLM/RAG/MLOps queries have 5x'd since 2023 and have **almost no
canonical interview answers online** (most ML content is research blogs
or tutorials, not interview-shaped). Owning this with practitioner-shaped
Q's tuned to MLE / Applied ML / LLM-Engineering loops is the single
biggest TAM bet in the Python rollout.

## Hard prerequisites

- [ ] Playbook 31 done (scaffolding pattern proven).
- [ ] PBI launched.

## Domain metadata

```json
{
  "domainSlug": "python-ml-ai",
  "language": "python",
  "level": "intermediate-to-senior",
  "seoSlug": "machine-learning-interview-questions-python",
  "altSlugs": [
    "ml-engineer-interview-questions",
    "deep-learning-interview-questions",
    "pytorch-interview-questions",
    "scikit-learn-interview-questions",
    "llm-interview-questions",
    "rag-interview-questions",
    "langchain-interview-questions",
    "transformer-interview-questions",
    "ai-engineer-interview-questions",
    "mlops-interview-questions"
  ],
  "label": "Python ML & AI",
  "blurb": "Machine learning and AI engineering interview prep with Python — classical ML, deep learning, transformers, LLMs, RAG, agents, vector DBs, MLOps.",
  "audience": "ML engineers, AI engineers, applied scientists"
}
```

## Module specification (18 modules, ~1000 Q)

| #  | Module slug                                | Pillar | Min Q |
| -- | ------------------------------------------ | ------ | ----- |
| 1  | `ml-fundamentals-and-statistics`           | P01    | 60    |
| 2  | `numpy-and-scientific-python`              | P01    | 40    |
| 3  | `pandas-for-ml`                            | P01    | 35    |
| 4  | `classical-ml-scikit-learn`                | P01    | 70    |
| 5  | `feature-engineering-and-selection`        | P01    | 50    |
| 6  | `evaluation-and-metrics`                   | P08    | 50    |
| 7  | `deep-learning-fundamentals`               | P01    | 50    |
| 8  | `pytorch-deep-dive`                        | P01    | 70    |
| 9  | `tensorflow-and-keras`                     | P01    | 40    |
| 10 | `transformers-and-attention`               | P01    | 60    |
| 11 | `huggingface-ecosystem`                    | P02    | 50    |
| 12 | `llms-and-finetuning`                      | P02    | 60    |
| 13 | `rag-systems`                              | P02    | 60    |
| 14 | `vector-databases-and-embeddings`          | P03    | 50    |
| 15 | `agents-and-tool-use`                      | P02    | 40    |
| 16 | `prompt-engineering`                       | P02    | 40    |
| 17 | `mlops-and-deployment`                     | P09    | 60    |
| 18 | `ml-system-design-cases`                   | P06    | 50    |
| +  | `ml-behavioral`                            | P12    | 65    |

**Total: 1000 Q.**

## Search-phrase keyword map (top)

| Search phrase                                       | Owner                                |
| --------------------------------------------------- | ------------------------------------ |
| `machine learning interview questions`              | (domain landing)                     |
| `ml engineer interview questions`                   | (domain landing)                     |
| `deep learning interview questions`                 | deep-learning-fundamentals           |
| `pytorch interview questions`                       | pytorch-deep-dive                    |
| `tensorflow vs pytorch`                             | tensorflow-and-keras / comparisons   |
| `scikit-learn interview questions`                  | classical-ml-scikit-learn            |
| `transformer interview questions`                   | transformers-and-attention           |
| `attention mechanism interview questions`           | transformers-and-attention           |
| `bert vs gpt`                                       | transformers-and-attention           |
| `llm interview questions`                           | llms-and-finetuning                  |
| `rag interview questions`                           | rag-systems                          |
| `langchain interview questions`                     | rag-systems / agents-and-tool-use    |
| `vector database interview questions`               | vector-databases-and-embeddings      |
| `pinecone vs weaviate vs qdrant`                    | vector-databases-and-embeddings      |
| `embeddings interview questions`                    | vector-databases-and-embeddings      |
| `prompt engineering interview questions`            | prompt-engineering                   |
| `mlops interview questions`                         | mlops-and-deployment                 |
| `feature store interview questions`                 | mlops-and-deployment                 |
| `bias variance tradeoff interview questions`        | ml-fundamentals-and-statistics       |
| `overfitting underfitting interview questions`      | ml-fundamentals-and-statistics       |
| `precision vs recall`                               | evaluation-and-metrics               |

## Money comparison questions (canonical)

1. `Supervised vs unsupervised vs reinforcement learning`
2. `Classification vs regression vs clustering`
3. `Bias vs variance tradeoff`
4. `Underfitting vs overfitting`
5. `L1 vs L2 regularization`
6. `Gradient descent vs SGD vs Adam`
7. `Precision vs recall vs F1`
8. `ROC AUC vs PR AUC`
9. `PyTorch vs TensorFlow`
10. `CNN vs RNN vs Transformer`
11. `BERT vs GPT (encoder vs decoder)`
12. `Fine-tuning vs prompt engineering vs RAG`
13. `LoRA vs full fine-tuning`
14. `Embedding model vs LLM`
15. `Pinecone vs Weaviate vs Qdrant vs pgvector`
16. `Sparse retrieval (BM25) vs dense retrieval (embeddings)`
17. `Chain-of-Thought vs ReAct vs Reflexion prompting`
18. `Greedy decoding vs beam search vs nucleus sampling`
19. `Online vs offline ML system`
20. `Batch inference vs real-time inference`
21. `Feature store online vs offline store`
22. `Model serving via REST vs gRPC vs custom`
23. `MLflow vs Weights & Biases vs Neptune`
24. `Notebook vs script vs pipeline for production ML`

## Per-module highlights

### 39.1 — `ml-fundamentals-and-statistics` (60 Q)

Topics: probability basics, distributions, hypothesis testing,
bias-variance, train/val/test, cross-validation, regularization,
imbalanced data techniques, comparisons, scenario.

### 39.4 — `classical-ml-scikit-learn` (70 Q)

Topics: linear regression, logistic regression, decision trees,
random forest, gradient boosting (XGBoost/LightGBM/CatBoost),
SVM, KNN, K-Means + DBSCAN, PCA, sklearn pipelines, hyperparameter tuning,
comparisons, scenario.

### 39.8 — `pytorch-deep-dive` (70 Q)

Topics:
- `tensors-and-autograd` (10 Q)
- `nn-modules-and-forward-backward` (10 Q)
- `data-loading-and-pipelines` (8 Q): Dataset, DataLoader, samplers
- `training-loop-patterns` (6 Q)
- `mixed-precision-and-amp` (4 Q)
- `distributed-training-pytorch` (8 Q): DDP, FSDP, DeepSpeed integration
- `pytorch-2-compile-and-graph-modes` (5 Q)
- `model-serialization-and-loading` (4 Q)
- `comparisons` (5 Q)
- `scenario` (5 Q)

### 39.10 — `transformers-and-attention` (60 Q)

Topics: self-attention, multi-head attention, positional encodings (rotary,
ALiBi, absolute), encoder vs decoder, BERT family, GPT family, T5,
encoder-decoder models, scaling laws, FlashAttention, comparisons,
scenario.

### 39.12 — `llms-and-finetuning` (60 Q)

Topics:
- `llm-architecture-overview` (8 Q)
- `pretraining-vs-finetuning` (6 Q)
- `supervised-finetuning` (6 Q)
- `instruction-tuning-and-rlhf` (6 Q)
- `parameter-efficient-finetuning` (8 Q): LoRA, QLoRA, prefix tuning, adapters
- `quantization-int4-int8-fp16` (5 Q)
- `evaluation-of-llms` (5 Q)
- `data-curation-for-finetuning` (4 Q)
- `comparisons` (6 Q)
- `scenario` (6 Q)

### 39.13 — `rag-systems` (60 Q)

Topics:
- `rag-fundamentals` (6 Q): retriever + reader, why RAG vs fine-tune
- `embedding-models` (5 Q)
- `chunking-strategies` (6 Q): fixed, semantic, recursive, agentic
- `retrieval-strategies` (6 Q): dense vs sparse vs hybrid, MMR, reranking
- `vector-search-internals` (5 Q): HNSW, IVF, PQ
- `reranking-models` (4 Q)
- `prompt-templates-for-rag` (4 Q)
- `evaluation-of-rag` (6 Q): RAGAS, custom evals
- `rag-anti-patterns` (4 Q)
- `multi-modal-rag` (4 Q)
- `comparisons` (5 Q)
- `scenario` (5 Q)

### 39.14 — `vector-databases-and-embeddings` (50 Q)

Topics: embedding-vs-vector-space, choosing-embedding-models,
`pinecone-deep`, `weaviate-deep`, `qdrant-deep`, `pgvector-deep`,
`milvus-and-chroma`, indexing-algorithms-hnsw-ivf-pq,
filtering-with-vector-search, hybrid-search-bm25-plus-vector,
comparisons (Pinecone vs Weaviate vs Qdrant vs pgvector), scenario.

### 39.15 — `agents-and-tool-use` (40 Q)

Topics: react-pattern, function-calling-tool-use,
`langchain-agents`, `langgraph`, `crew-ai`, multi-agent-orchestration,
agentic-rag, evaluation-of-agents, comparisons, scenario.

### 39.17 — `mlops-and-deployment` (60 Q)

Topics:
- `model-versioning-mlflow-wandb` (6 Q)
- `feature-stores` (6 Q): Feast, Tecton, custom
- `model-serving` (8 Q): TorchServe, BentoML, KServe, FastAPI + ONNX
- `batch-vs-realtime-inference` (5 Q)
- `inference-optimization` (6 Q): ONNX, TensorRT, vLLM, llama.cpp
- `monitoring-and-drift-detection` (6 Q)
- `experiment-tracking` (4 Q)
- `cicd-for-ml` (5 Q)
- `data-versioning-dvc-lakefs` (4 Q)
- `comparisons` (5 Q)
- `scenario` (5 Q)

### 39.18 — `ml-system-design-cases` (50 Q ≈ 12 cases)

Cases (each `complete-qa.json` with mermaid + capacity + cost):

1. Design Netflix-style recommendation system
2. Design a fraud-detection system (real-time)
3. Design a search ranking system (e-commerce)
4. Design an image-classification API at scale
5. Design a chatbot with RAG over enterprise docs
6. Design a feed-ranking system (TikTok-like)
7. Design an A/B testing platform for ML
8. Design a real-time bidding (RTB) ML pipeline
9. Design a multi-tenant ML model-serving platform
10. Design a feature store from scratch
11. Design an LLM-based agent platform (multi-tool, multi-step)
12. Design a fine-tuning + serving pipeline for domain-specific LLMs

Each: include numbers (latency, throughput, model size, GPU vs CPU,
cost), mermaid diagram, multi-tenant variant.

### + `ml-behavioral` (65 Q, archetype G)

Topics: tell-me-about-yourself-ml, tell-me-about-a-model-you-shipped,
tell-me-about-a-failed-experiment, dealing-with-bad-data,
explaining-ml-to-non-technical, navigating-ml-vs-rules-tradeoff,
prioritising-research-vs-production, mentoring-data-scientists,
career-and-growth.

## Content rules

- Python 3.12+; type hints throughout.
- PyTorch examples target 2.x (compile() is fair game).
- Hugging Face transformers ≥ 4.40.
- LangChain examples target 0.2+ (LCEL).
- Vector-DB examples cite quantitative ANN tuning (recall %, latency ms).
- RAG examples include an `evaluation` step (RAGAS or custom precision@k).

## Execution steps

### Step A — Scaffold

```bash
python3 scripts/new_locked_domain.py \
  --slug python-ml-ai \
  --label "Python ML & AI" \
  --language python --level intermediate \
  --seo-slug machine-learning-interview-questions-python \
  --alt-slug ml-engineer-interview-questions \
  --alt-slug deep-learning-interview-questions \
  --alt-slug pytorch-interview-questions \
  --alt-slug scikit-learn-interview-questions \
  --alt-slug llm-interview-questions \
  --alt-slug rag-interview-questions \
  --alt-slug langchain-interview-questions \
  --alt-slug transformer-interview-questions \
  --alt-slug ai-engineer-interview-questions \
  --alt-slug mlops-interview-questions \
  --modules \
    ml-fundamentals-and-statistics:P01 \
    numpy-and-scientific-python:P01 \
    pandas-for-ml:P01 \
    classical-ml-scikit-learn:P01 \
    feature-engineering-and-selection:P01 \
    evaluation-and-metrics:P08 \
    deep-learning-fundamentals:P01 \
    pytorch-deep-dive:P01 \
    tensorflow-and-keras:P01 \
    transformers-and-attention:P01 \
    huggingface-ecosystem:P02 \
    llms-and-finetuning:P02 \
    rag-systems:P02 \
    vector-databases-and-embeddings:P03 \
    agents-and-tool-use:P02 \
    prompt-engineering:P02 \
    mlops-and-deployment:P09 \
    ml-system-design-cases:P06 \
    ml-behavioral:P12
```

### Step B — Write

Apply per-module blueprints; meet Q targets.

### Step C — Launch

```typescript
{
  title:      'Python ML & AI',
  audience:   'intermediate',
  language:   'python',
  href:       '/interview/python-ml-ai',
  description:'ML / DL / LLM / RAG / Agent interview prep with Python — sklearn, PyTorch, transformers, vector DBs, MLOps.',
},
```

## Quality gates

| Gate                                          | Threshold      |
| --------------------------------------------- | -------------- |
| 19 modules (18 + behavioral) at Q target      | 19 of 19       |
| 12 ML system-design cases with mermaid        | 12 of 12       |
| All 24 money comparisons live                 | 24 of 24       |
| Speakable domain pass+warn                    | ≥ 88 %         |
| 10 SEO/alt URLs 301                            | 10 of 10       |
| Vector-DB section names ≥ 4 vendors with comparison | 4 of 4   |

## Failure modes & rollback

- **A LLM/RAG Q ignores eval** (retrieval recall, faithfulness, latency):
  add it; ML interviews always probe eval.
- **PyTorch example uses `loss.backward()` without `optimizer.zero_grad()`:**
  add it; a real interview tell.
- **MLOps Q skips drift / monitoring:** add it; production-MLE content
  is graded heavily on it.
- **System-design ML case mixes online + batch serving without
  distinguishing:** clarify; this is the canonical ML-SD probe.
- **A model card / data card is missing on a "responsible ML" Q:**
  add; this is increasingly required.
- **An LLM Q recommends a specific model name** without acknowledging
  it might be outdated (LLM landscape moves monthly): cite version
  and mention "as of <date>" explicitly.
- **You hit hard stop with modules thin:** record per-module Q count;
  surface to user.
- **Rollback:** remove the domain from `LOCKED_DOMAINS` /
  `LAUNCH_QUICK_PATHS`; content stays on disk.

## Definition of Done

- [ ] All gates green.
- [ ] Tag `pml-launch-<YYYY-MM-DD>` created.
- [ ] `00-INDEX.md` row for `39` flipped to `DONE`.

## Estimated effort

- **Ideal:** 160 hours.
- **Hard stop:** 240 hours.
