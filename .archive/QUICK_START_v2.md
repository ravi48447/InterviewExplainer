# 🚀 QUICK START - v2.0 Self-Contained Architecture

## 📁 New Structure (Everything in One Place!)

```
content/domains/{domain-name}/
├── README.md
├── domain-definition.md
├── domain-config.json
└── stacks/
    └── {stack-name}/
        ├── generation-prompt.md
        ├── questions.json
        └── answers/
```

**Example**: `content/domains/java-backend-1-3/stacks/spring-boot-basics/questions.json`

---

## ⚡ Generate Questions (3 Commands)

### 1️⃣ Generate Prompt
```bash
npx tsx scripts/domainAwareGenerator.ts generate java-backend-1-3 spring-boot-basics
```
**Output**: `content/domains/java-backend-1-3/stacks/spring-boot-basics/generation-prompt.md`

---

### 2️⃣ Get Questions from Claude
1. Copy prompt from file above
2. Paste into Claude
3. Save JSON response to: `content/domains/java-backend-1-3/stacks/spring-boot-basics/questions.json`

---

### 3️⃣ Import to Database
```bash
# Find stack ID
curl http://localhost:8080/api/v2/domains/java-backend-1-3/categories | jq '.[] | select(.slug=="spring-boot-basics") | .id'

# Import (replace 219 with actual stack ID)
npx tsx scripts/importToDatabase.ts java-backend-1-3 spring-boot-basics 219
```

---

## 🎯 Generate All 20 Stacks

```bash
# List all stacks
ls content/domains/java-backend-1-3/stacks/

# Generate prompt for each stack
for stack in spring-boot-basics rest-api-design jpa-hibernate-basics; do
  npx tsx scripts/domainAwareGenerator.ts generate java-backend-1-3 $stack
done
```

---

## 📂 Domain Structure Example

```
java-backend-1-3/
│
├── 📖 README.md                    ← Start here!
├── 📖 domain-definition.md         ← 1-3 years specialization
├── 📊 domain-config.json           ← 20 stacks configuration
│
└── 📁 stacks/ (20 stacks)
    │
    ├── 📂 spring-boot-basics/       (40 questions)
    ├── 📂 rest-api-design/          (35 questions)
    ├── 📂 jpa-hibernate-basics/     (40 questions)
    ├── 📂 java-collections-algorithms/ (40 questions)
    ├── 📂 sql-queries-optimization/ (35 questions)
    ├── 📂 testing-basics/           (30 questions)
    ├── 📂 java-core-basics/         (35 questions)
    ├── 📂 exception-handling/       (25 questions)
    ├── 📂 git-version-control/      (20 questions)
    ├── 📂 system-design-basics/     (25 questions)
    ├── 📂 spring-security-basics/   (25 questions)
    ├── 📂 docker-basics/            (20 questions)
    ├── 📂 performance-debugging-basics/ (20 questions)
    ├── 📂 api-integration/          (20 questions)
    ├── 📂 logging-monitoring/       (15 questions)
    ├── 📂 kafka-basics/             (15 questions)
    ├── 📂 redis-caching/            (15 questions)
    ├── 📂 ci-cd-basics/             (15 questions)
    ├── 📂 swagger-api-docs/         (10 questions)
    └── 📂 behavioral-questions/     (20 questions)

TOTAL: 525 questions
```

---

## 🆕 Create New Domain

```bash
# 1. Create folder
mkdir -p content/domains/python-backend-1-3/stacks

# 2. Copy template
cp content/templates/domain-template.json content/domains/python-backend-1-3/domain-config.json

# 3. Write domain definition (manual)
# Create: content/domains/python-backend-1-3/domain-definition.md

# 4. Create README (manual)
# Create: content/domains/python-backend-1-3/README.md

# 5. Create stacks (from config)
cd content/domains/python-backend-1-3
# Create stack folders based on your config
```

---

## 📊 Current Status

### ✅ Complete
- New self-contained architecture
- Java Backend 1-3 Years domain (20 stacks)
- All stack folders created
- Generator updated
- Import script updated
- Documentation complete

### ⏳ In Progress
- Generate prompts for all 20 stacks
- Get questions from Claude
- Import to database

### 🔜 Next
- Java Backend 5+ Years domain
- Python Backend 1-3 Years domain
- React Frontend 1-3 Years domain

---

## 🛠️ Manual Editing

### Edit Questions
```bash
# Open in editor
code content/domains/java-backend-1-3/stacks/spring-boot-basics/questions.json

# Edit directly, save, re-import
```

### Add Answer
```bash
# Create answer file
touch content/domains/java-backend-1-3/stacks/spring-boot-basics/answers/question-1.md

# Write answer in markdown
```

### Regenerate Prompt
```bash
# If you change domain-config.json, regenerate
npx tsx scripts/domainAwareGenerator.ts generate java-backend-1-3 spring-boot-basics
```

---

## 🎯 Key Files to Know

| File | Location | Purpose |
|------|----------|---------|
| Master Philosophy | `content/MASTER_CONTENT_PHILOSOPHY.md` | Universal quality standards |
| Domain Overview | `content/domains/{domain}/README.md` | Start here for each domain |
| Domain Definition | `content/domains/{domain}/domain-definition.md` | Experience specialization |
| Domain Config | `content/domains/{domain}/domain-config.json` | All stacks configuration |
| Stack Questions | `content/domains/{domain}/stacks/{stack}/questions.json` | Generated questions |

---

## 🔗 Three-Layer System

```
Layer 1: MASTER_CONTENT_PHILOSOPHY.md
         (Universal - applies to all 64 domains)
         ↓
Layer 2: domain-definition.md
         (Experience-level: 1-3 years vs 5+ years)
         ↓
Layer 3: domain-config.json
         (Stacks: Spring Boot, JPA, REST APIs...)
         ↓
         COMBINED PROMPT
         ↓
         40+ HIGH-QUALITY QUESTIONS
```

---

## 📖 Full Documentation

- **NEW_SCALABLE_STRUCTURE.md** - Complete architecture explanation
- **content/domains/java-backend-1-3/README.md** - Domain-specific guide
- **MASTER_CONTENT_PHILOSOPHY.md** - Quality standards
- **COMPLETE_SYSTEM_GUIDE.md** - Original system guide

---

## ✨ Why This Structure is Better

### Old (Scattered)
```
content/
├── domains/java-backend-1-3/domain-config.json
├── questions/java-backend-1-3/spring-boot-basics/
└── answers/java-backend-1-3/spring-boot-basics/
```
❌ Files in 3 different places
❌ Hard to navigate
❌ Confusing for manual edits

### New (Self-Contained)
```
content/domains/java-backend-1-3/
└── stacks/spring-boot-basics/
    ├── questions.json
    └── answers/
```
✅ Everything in one place
✅ Easy to find and edit
✅ Scales to 100+ domains
✅ Clear hierarchy

---

**Start here**: `content/domains/java-backend-1-3/README.md`

*Version 2.0 - Self-Contained Architecture*
*March 2026*