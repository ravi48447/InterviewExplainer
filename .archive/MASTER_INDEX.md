# 📚 MASTER INDEX - InterviewExplainer Content System

## 🎯 Complete 8-Domain Architecture

**Status**: ✅ All domains created, ready for content generation
**Total**: 8 domains • 165 stacks • 4,045 questions
**Structure**: Self-contained, scalable, easy to manage

---

## 🗂️ Quick Navigation

### Core Documentation
| File | Purpose | Start Here? |
|------|---------|-------------|
| **MASTER_INDEX.md** | This file - master navigation | ⭐ |
| **QUICK_START_v2.md** | Quick reference & commands | ⭐ |
| **content/ALL_DOMAINS_OVERVIEW.md** | All 8 domains at a glance | ⭐ |
| **content/COMPLETE_DOMAIN_PLAN.md** | Detailed stack breakdown | 📋 |
| **content/NEW_SCALABLE_STRUCTURE.md** | Architecture explanation | 📖 |
| **content/MASTER_CONTENT_PHILOSOPHY.md** | Quality standards | 📖 |

---

## 📂 All Domains

### Java Domains (4)

#### 1. Java Backend (1-3 Years) ✅ COMPLETE
- **Path**: `content/domains/java-backend-1-3/`
- **Stacks**: 20 (Spring Boot, JPA, REST APIs, Testing...)
- **Questions**: 525
- **Target**: Mid-level engineers, startups
- **Status**: ✅ Full structure + documentation
- **Docs**: [README](content/domains/java-backend-1-3/README.md) • [Definition](content/domains/java-backend-1-3/domain-definition.md)

#### 2. Java Backend (5+ Years) 🆕
- **Path**: `content/domains/java-backend-5-plus/`
- **Stacks**: 18 (Microservices, K8s, JVM tuning, Architecture...)
- **Questions**: 515
- **Target**: Senior/Staff engineers, FAANG
- **Status**: 🆕 Structure ready, needs questions
- **Docs**: [README](content/domains/java-backend-5-plus/README.md) • [Definition](content/domains/java-backend-5-plus/domain-definition.md)

#### 3. Java Fullstack (1-3 Years) 🆕
- **Path**: `content/domains/java-fullstack-1-3/`
- **Stacks**: 25 (Spring Boot + React + Integration)
- **Questions**: 530
- **Target**: Mid-level fullstack, startups
- **Status**: 🆕 Structure ready, needs questions
- **Docs**: [README](content/domains/java-fullstack-1-3/README.md)

#### 4. Java Fullstack (5+ Years) 🆕
- **Path**: `content/domains/java-fullstack-5-plus/`
- **Stacks**: 20 (Fullstack architecture, Advanced patterns)
- **Questions**: 495
- **Target**: Senior fullstack architects
- **Status**: 🆕 Structure ready, needs questions
- **Docs**: [README](content/domains/java-fullstack-5-plus/README.md)

---

### Python Domains (4)

#### 5. Python Backend (1-3 Years) 🆕
- **Path**: `content/domains/python-backend-1-3/`
- **Stacks**: 22 (Django, FastAPI, SQLAlchemy, Celery...)
- **Questions**: 535
- **Target**: Mid-level Python engineers
- **Status**: 🆕 Structure ready, needs questions
- **Docs**: [README](content/domains/python-backend-1-3/README.md) • [Definition](content/domains/python-backend-1-3/domain-definition.md)

#### 6. Python Backend (5+ Years) 🆕
- **Path**: `content/domains/python-backend-5-plus/`
- **Stacks**: 18 (Async architecture, Microservices, Scale...)
- **Questions**: 490
- **Target**: Senior Python engineers
- **Status**: 🆕 Structure ready, needs questions
- **Docs**: [README](content/domains/python-backend-5-plus/README.md)

#### 7. Python Fullstack (1-3 Years) 🆕
- **Path**: `content/domains/python-fullstack-1-3/`
- **Stacks**: 24 (Django/FastAPI + React + Integration)
- **Questions**: 505
- **Target**: Mid-level Python fullstack
- **Status**: 🆕 Structure ready, needs questions
- **Docs**: [README](content/domains/python-fullstack-1-3/README.md)

#### 8. Python Fullstack (5+ Years) 🆕
- **Path**: `content/domains/python-fullstack-5-plus/`
- **Stacks**: 18 (Fullstack architecture, Advanced patterns)
- **Questions**: 450
- **Target**: Senior Python fullstack architects
- **Status**: 🆕 Structure ready, needs questions
- **Docs**: [README](content/domains/python-fullstack-5-plus/README.md)

---

## 🚀 Quick Commands

### View All Domains
```bash
ls -la content/domains/
```

### View Stacks in a Domain
```bash
ls content/domains/python-backend-1-3/stacks/
```

### Generate Prompt for Stack
```bash
npx tsx scripts/domainAwareGenerator.ts generate python-backend-1-3 django-basics
```

### Check Progress
```bash
find content/domains/*/stacks/*/questions.json -not -empty | wc -l
```

---

## 📊 Statistics

### By Language
- **Java**: 4 domains, 83 stacks, 2,065 questions
- **Python**: 4 domains, 82 stacks, 1,980 questions

### By Experience
- **1-3 Years**: 4 domains, 91 stacks, 2,095 questions
- **5+ Years**: 4 domains, 74 stacks, 1,950 questions

### By Type
- **Backend**: 4 domains, 78 stacks, 2,065 questions
- **Fullstack**: 4 domains, 87 stacks, 1,980 questions

### Current Status
- ✅ **Complete**: 1 domain (java-backend-1-3)
- 🆕 **Ready**: 7 domains (structure done, needs content)
- 📊 **Total**: 165 stacks across 8 domains

---

## 🎯 Generation Priority

### Phase 1: High-Demand Backend (Do First) ⭐
1. ✅ java-backend-1-3 (20 stacks) - DONE
2. 🔄 python-backend-1-3 (22 stacks) - NEXT
3. 🔄 java-backend-5-plus (18 stacks)
4. 🔄 python-backend-5-plus (18 stacks)

### Phase 2: Mid-Level Fullstack
5. java-fullstack-1-3 (25 stacks)
6. python-fullstack-1-3 (24 stacks)

### Phase 3: Senior Fullstack
7. java-fullstack-5-plus (20 stacks)
8. python-fullstack-5-plus (18 stacks)

---

## 🏗️ Architecture Principles

### Three-Layer System
```
Layer 1: MASTER_CONTENT_PHILOSOPHY.md (Universal quality)
         ↓
Layer 2: domain-definition.md (Experience-level context)
         ↓
Layer 3: domain-config.json (Stack definitions with SEO)
         ↓
         Combined Prompt → High-Quality Questions
```

### Self-Contained Structure
```
Each domain is completely independent:
domain-name/
├── README.md
├── domain-definition.md
├── domain-config.json
└── stacks/
    └── stack-name/
        ├── generation-prompt.md
        ├── questions.json
        └── answers/
```

### Benefits
✅ Everything in one place per domain
✅ Easy manual editing
✅ Scales to 100+ domains
✅ Clear hierarchy
✅ Version control friendly
✅ Independent evolution

---

## 📖 How to Use This System

### For New Contributors
1. Start with **QUICK_START_v2.md**
2. Read **content/ALL_DOMAINS_OVERVIEW.md**
3. Pick a domain and read its **README.md**
4. Generate prompts and questions

### For Generating Questions
1. Choose domain and stack
2. Run: `npx tsx scripts/domainAwareGenerator.ts generate {domain} {stack}`
3. Copy prompt to Claude
4. Save JSON to `content/domains/{domain}/stacks/{stack}/questions.json`
5. Import to database

### For Manual Editing
1. Navigate to: `content/domains/{domain}/stacks/{stack}/`
2. Edit `questions.json` directly
3. Re-import to database if needed

### For Adding New Domains
1. Create folder: `content/domains/new-domain/`
2. Write `domain-definition.md`
3. Create `domain-config.json`
4. Create stack folders
5. Generate prompts

---

## 🔗 External Links

### Tools
- Generator: `scripts/domainAwareGenerator.ts`
- Importer: `scripts/importToDatabase.ts`
- Domain Creator: `scripts/createAllDomains.sh`

### Frontend
- UI Base: `http://localhost:3000/`
- Domain View: `http://localhost:3000/{domain-slug}`
- Stack View: `http://localhost:3000/{domain-slug}/{stack-slug}`

### Backend API
- Domains: `http://localhost:8080/api/v2/domains`
- Categories: `http://localhost:8080/api/v2/domains/{domain}/categories`
- Questions: `http://localhost:8080/api/v2/questions/{id}`

---

## ✅ What's Complete

### Infrastructure
- ✅ Folder structure for all 8 domains
- ✅ All 165 stack folders created
- ✅ Generator script updated
- ✅ Import script updated
- ✅ Documentation complete

### Content
- ✅ java-backend-1-3: Full structure + docs
- ✅ java-backend-5-plus: Definition + structure
- ✅ python-backend-1-3: Definition + structure
- ✅ All other domains: Structure + READMEs

### Documentation
- ✅ Master philosophy
- ✅ Complete domain plan
- ✅ All domains overview
- ✅ Quick start guide
- ✅ Architecture explanation

---

## 🎉 Ready to Scale!

The system is now ready to generate **4,045 high-quality interview questions** across:
- 2 programming languages (Java & Python)
- 2 experience levels (1-3 years & 5+ years)
- 2 specializations (Backend & Fullstack)
- 165 carefully curated stacks

**No stacks missing. Comprehensive coverage. Ready for generation.**

---

*Version 2.0 - March 2026*
*Self-contained • Scalable • Comprehensive*