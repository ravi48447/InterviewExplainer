# 🚀 NEW SCALABLE ARCHITECTURE v2.0

## 📁 Complete Self-Contained Structure

```
content/
│
├── MASTER_CONTENT_PHILOSOPHY.md    ← Layer 1: Universal (all 64 domains)
│
├── templates/
│   └── domain-template.json         ← Template for new domains
│
└── domains/                         ← All domains here
    │
    ├── java-backend-1-3/            ← ✅ COMPLETE EXAMPLE
    │   │
    │   ├── README.md                      ← Domain overview & usage
    │   ├── domain-definition.md           ← Layer 2: Experience specialization
    │   ├── domain-config.json             ← Layer 3: All 20 stacks
    │   │
    │   └── stacks/                        ← Self-contained stacks
    │       │
    │       ├── spring-boot-basics/
    │       │   ├── generation-prompt.md      ← Generated (Layer 1+2+3)
    │       │   ├── questions.json            ← 40 questions from Claude
    │       │   └── answers/                  ← Phase 2
    │       │       ├── question-1.md
    │       │       ├── question-2.md
    │       │       └── ...
    │       │
    │       ├── rest-api-design/
    │       │   ├── generation-prompt.md
    │       │   ├── questions.json
    │       │   └── answers/
    │       │
    │       ├── jpa-hibernate-basics/
    │       │   ├── generation-prompt.md
    │       │   ├── questions.json
    │       │   └── answers/
    │       │
    │       └── ... (17 more stacks)
    │
    ├── java-backend-5-plus/         ← TODO: Senior level
    │   ├── README.md
    │   ├── domain-definition.md
    │   ├── domain-config.json
    │   └── stacks/
    │       ├── microservices-architecture/
    │       ├── distributed-systems/
    │       ├── jvm-performance-tuning/
    │       └── ...
    │
    ├── python-backend-1-3/          ← TODO: Python mid-level
    │   ├── README.md
    │   ├── domain-definition.md
    │   ├── domain-config.json
    │   └── stacks/
    │       ├── django-basics/
    │       ├── fastapi-basics/
    │       ├── sqlalchemy-basics/
    │       └── ...
    │
    ├── react-frontend-1-3/          ← TODO: React mid-level
    │   ├── README.md
    │   ├── domain-definition.md
    │   ├── domain-config.json
    │   └── stacks/
    │       ├── react-hooks/
    │       ├── state-management/
    │       ├── component-design/
    │       └── ...
    │
    └── ... (60+ more domains)
```

---

## 🎯 Key Benefits of This Structure

### 1. **Self-Contained Domains**
- Each domain has ALL its files in one place
- Easy to navigate: `domains/{domain}/stacks/{stack}/`
- Manual editing is straightforward
- Version control per domain

### 2. **Scalable**
- Add new domains without affecting others
- Each domain = 1 folder
- From 1 domain to 100 domains, same pattern

### 3. **Easy Manual Management**
- Want to edit Spring Boot questions? → `domains/java-backend-1-3/stacks/spring-boot-basics/questions.json`
- Want to add an answer? → `domains/java-backend-1-3/stacks/spring-boot-basics/answers/question-5.md`
- Want to regenerate prompt? → Just run generator for that stack

### 4. **Clear Hierarchy**
```
Domain (experience level)
  └─ Stack (specific technology/topic)
      ├─ Prompt (combines 3 layers)
      ├─ Questions (generated content)
      └─ Answers (comprehensive explanations)
```

---

## 🔄 Complete Workflow

### **Step 1: Create New Domain**

```bash
# 1. Create folder
mkdir -p content/domains/python-backend-1-3

# 2. Copy template
cp content/templates/domain-template.json content/domains/python-backend-1-3/domain-config.json

# 3. Write domain definition
# Create: content/domains/python-backend-1-3/domain-definition.md

# 4. Create stacks folder
mkdir -p content/domains/python-backend-1-3/stacks
```

---

### **Step 2: Generate Questions for a Stack**

```bash
# Generate prompt (connects 3 layers)
npx tsx scripts/domainAwareGenerator.ts generate java-backend-1-3 spring-boot-basics

# Output: content/domains/java-backend-1-3/stacks/spring-boot-basics/generation-prompt.md
```

---

### **Step 3: Get Questions from Claude**

1. Copy prompt from `generation-prompt.md`
2. Paste into Claude
3. Get JSON response
4. Save to: `content/domains/java-backend-1-3/stacks/spring-boot-basics/questions.json`

---

### **Step 4: Import to Database**

```bash
# Find stack_id from backend
curl http://localhost:8080/api/v2/domains/java-backend-1-3/categories | grep "spring-boot"

# Import questions
npx tsx scripts/importToDatabase.ts java-backend-1-3 spring-boot-basics 219
```

---

### **Step 5: Verify on UI**

```
http://localhost:3000/java-backend-1-3/spring-boot-basics
```

---

## 📊 Domain Examples

### **Java Backend 1-3 Years**
**Focus**: Practical skills, framework usage
**Stacks**: Spring Boot, JPA, REST APIs, Testing, Collections
**Question Count**: 525 questions across 20 stacks
**Target Companies**: Startups, Series A-C, Product companies

---

### **Java Backend 5+ Years** (To Create)
**Focus**: Architecture, optimization, leadership
**Stacks**: Microservices, Distributed Systems, JVM Tuning, System Design
**Question Count**: ~400 questions across 15 stacks
**Target Companies**: FAANG, Unicorns, Senior roles

---

### **Python Backend 1-3 Years** (To Create)
**Focus**: Practical Python backend skills
**Stacks**: Django, FastAPI, SQLAlchemy, Testing, API Design
**Question Count**: ~500 questions across 20 stacks
**Target Companies**: Startups, Product companies

---

## 🎨 File Templates

### **Domain Structure Template**

```bash
domain-name/
├── README.md                    # Overview, usage, progress tracking
├── domain-definition.md         # Experience-level specialization
├── domain-config.json           # All stacks with SEO & coverage
└── stacks/
    └── stack-name/
        ├── generation-prompt.md    # Auto-generated
        ├── questions.json          # From Claude
        └── answers/                # Manual or auto-generated
```

---

### **questions.json Format**

```json
[
  {
    "id": "spring-boot-autowired-constructor-injection",
    "title": "Spring Boot @Autowired vs Constructor Injection - Best Practices",
    "slug": "autowired-vs-constructor-injection",
    "question": "You're reviewing a Spring Boot codebase...",
    "difficulty": "medium",
    "importance": "high",
    "seoKeywords": ["spring boot autowired", "constructor injection"],
    "searchIntent": ["autowired vs constructor injection"],
    "layer": "practical",
    "interviewFrequency": "high",
    "realWorldScenario": "Code review feedback",
    "tags": ["spring-boot-basics", "dependency-injection"]
  }
]
```

---

## 🚀 Quick Commands

### **Generate Prompt**
```bash
npx tsx scripts/domainAwareGenerator.ts generate <domain> <stack>
```

### **List All Domains**
```bash
ls -la content/domains/
```

### **List Stacks in a Domain**
```bash
ls -la content/domains/java-backend-1-3/stacks/
```

### **View Domain Progress**
```bash
cat content/domains/java-backend-1-3/README.md
```

### **Create All Stack Folders for Domain**
```bash
cd content/domains/<domain-name>
# Run create script (see domain README)
```

---

## 📋 File Responsibilities

| File | Purpose | Who Creates | When |
|------|---------|-------------|------|
| `MASTER_CONTENT_PHILOSOPHY.md` | Universal quality standards | Manual | Once (done) |
| `domain-definition.md` | Experience-level context | Manual | Per domain |
| `domain-config.json` | All stacks for domain | Manual | Per domain |
| `stacks/*/generation-prompt.md` | Combined prompt | Generator | On demand |
| `stacks/*/questions.json` | Questions | Claude | After prompt |
| `stacks/*/answers/*.md` | Answers | Manual/AI | Phase 2 |

---

## ✅ Current Status

### **Complete**
- ✅ New scalable architecture designed
- ✅ Java Backend 1-3 Years domain complete (20 stacks)
- ✅ All 20 stack folders created
- ✅ Generator script updated for new structure
- ✅ Import script updated for new structure
- ✅ Domain README created
- ✅ Architecture documentation

### **In Progress**
- ⏳ Generate prompts for all 20 stacks
- ⏳ Get questions from Claude
- ⏳ Import to database

### **To Do**
- 🔜 Create Java Backend 5+ domain
- 🔜 Create Python Backend 1-3 domain
- 🔜 Create React Frontend 1-3 domain
- 🔜 Phase 2: Comprehensive answers

---

## 🎯 What Makes This Better

### **Old Structure (Scattered)**
```
content/
├── domains/java-backend-1-3/
│   └── domain-config.json
├── questions/java-backend-1-3/
│   └── spring-boot-basics/
└── answers/java-backend-1-3/
    └── spring-boot-basics/
```
❌ Files scattered across folders
❌ Hard to manage manually
❌ Confusing for new contributors

---

### **New Structure (Self-Contained)**
```
content/domains/java-backend-1-3/
├── domain-config.json
└── stacks/
    └── spring-boot-basics/
        ├── questions.json
        └── answers/
```
✅ Everything in one place
✅ Easy to navigate
✅ Manual editing straightforward
✅ Scales to 100+ domains

---

## 🎉 Ready to Scale

**This architecture supports:**
- ✅ 64+ domains (experience × technology combinations)
- ✅ 20-30 stacks per domain
- ✅ 500+ questions per domain
- ✅ 10,000+ total questions
- ✅ Manual editing at any level
- ✅ Independent domain evolution
- ✅ Clear version control
- ✅ Easy collaboration

**Each domain is a mini-project that follows the same pattern.**

---

*Self-contained, scalable, easy to manage*
*Version 2.0 - March 2026*