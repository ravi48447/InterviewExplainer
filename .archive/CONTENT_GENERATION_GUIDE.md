# Complete Content Generation System

## 🎯 System Overview

This is an **intelligent content generation system** that:
- ✅ Understands domain hierarchies and stack boundaries
- ✅ Prevents question overlap between stacks
- ✅ Generates context-aware prompts
- ✅ Manages 880+ questions across 26 Java Backend stacks
- ✅ Scales to ALL 64 domains

## 📁 Folder Structure

```
content/
├── domains/              # Domain definitions
│   └── java-backend/
│       └── domain-config.json    # 26 stacks defined
│
├── questions/            # Generated questions
│   └── java-backend/
│       ├── core-java/
│       │   ├── generation-prompt.md
│       │   └── questions.json
│       ├── spring-boot/
│       └── ...
│
├── imports/              # Database import scripts
└── logs/                 # Generation tracking
```

## 🚀 Quick Start

### 1. View Domain Structure

```bash
# See all 26 Java Backend stacks
npx tsx scripts/intelligentQuestionGenerator.ts list java-backend
```

**Output**: Complete domain hierarchy with:
- 26 stacks organized by category (Foundation, Frameworks, APIs, Security, etc.)
- 880 total questions
- Clear coverage and exclusions for each stack

### 2. Generate Intelligent Prompt for a Stack

```bash
# Generate prompt for Core Java
npx tsx scripts/intelligentQuestionGenerator.ts generate java-backend core-java 1-3
```

**What it does**:
- Creates context-aware prompt
- Lists EXACTLY what this stack covers
- Lists what it EXCLUDES (to prevent overlap)
- Enforces boundaries (e.g., no Spring questions in Core Java)
- Saves prompt to: `content/questions/java-backend/core-java/generation-prompt.md`

**Example exclusions for Core Java**:
- ❌ Spring features → Belongs in Spring stacks
- ❌ Testing → Belongs in JUnit/Mockito stacks
- ❌ REST APIs → Belongs in REST API stack
- ❌ Database queries → Belongs in SQL/JDBC stacks

### 3. Copy Prompt to Claude

The script outputs the complete prompt. Copy it and paste into Claude to get 50 high-quality questions in JSON format.

### 4. Save Questions

Save Claude's JSON response to:
```
content/questions/java-backend/core-java/questions.json
```

### 5. Import to Database

```bash
# Import questions to PostgreSQL
npx tsx scripts/importToDatabase.ts java-backend core-java 219
```

**Note**: You need the database `stack_id`. Find it with:
```bash
curl http://localhost:8080/api/v2/domains/java-backend-1-3/categories | grep "core-java"
```

### 6. Verify on UI

Open browser: `http://localhost:3000/java-backend-1-3`

You should see 50 questions under "Core Java" stack!

## 📊 Workflow Management

### Check Progress

```bash
# See overall progress
npx tsx scripts/contentWorkflow.ts workflow java-backend
```

Shows:
- Stacks completed vs total (e.g., 3/26)
- Next 5 stacks to generate
- Quick commands

### Generate All Prompts at Once

```bash
# Generate prompts for all 26 stacks
npx tsx scripts/contentWorkflow.ts generate-prompts java-backend 1-3
```

Creates 26 prompt files ready for batch generation.

### Validate Generated Questions

```bash
# Check if questions meet quality standards
npx tsx scripts/contentWorkflow.ts validate java-backend core-java
```

Validates:
- Correct question count
- No duplicate slugs
- Required fields present

## 🧠 How It Prevents Overlap

### Example: Core Java vs Spring Boot

**Core Java COVERS**:
- JVM internals
- Collections framework
- Concurrency & multithreading
- Generics

**Core Java EXCLUDES**:
- Spring-specific features ❌
- Database operations ❌
- REST APIs ❌

**Spring Boot COVERS**:
- Auto-configuration
- Dependency injection
- Spring Boot actuator

**Spring Boot EXCLUDES**:
- Spring Data (separate stack) ❌
- Spring Security (separate stack) ❌
- REST API design (separate stack) ❌

### Smart Boundary Example

**WRONG Question for Core Java**:
❌ "How do you create a REST endpoint in Spring?"
→ This belongs in Spring REST stack

**CORRECT Question for Core Java**:
✅ "Explain HashMap internal implementation"
✅ "What's the difference between synchronized and ReentrantLock?"

## 📋 Complete Java Backend Stack List

### Foundation (125 questions)
1. **Core Java** (50q) - JVM, Collections, Concurrency
2. **Java 8+ Features** (35q) - Streams, Lambdas, Optional
3. **Advanced Java** (40q) - Reflection, ClassLoaders, JVM Tuning

### Frameworks (155 questions)
4. **Spring Boot** (45q) - Auto-config, Starters, Actuator
5. **Spring Core & DI** (35q) - IoC, Bean Lifecycle
6. **Spring Data JPA** (40q) - Repositories, JPQL
7. **Hibernate ORM** (35q) - Session, Caching, HQL

### APIs (105 questions)
8. **REST API Design** (40q) - RESTful principles, Best practices
9. **Spring REST** (35q) - @RestController, Exception handling
10. **GraphQL** (30q) - Schema, Resolvers, DataLoader

### Security (70 questions)
11. **Spring Security** (40q) - JWT, OAuth2, Filter Chain
12. **Security Best Practices** (30q) - Validation, XSS, HTTPS

### Testing (95 questions)
13. **JUnit** (35q) - JUnit 5, Assertions, Parameterized tests
14. **Mockito** (30q) - Mocks, Spies, Verification
15. **Integration Testing** (30q) - TestContainers, MockMvc

### Databases (55 questions)
16. **JDBC** (25q) - Connection pooling, PreparedStatements
17. **Database Performance** (30q) - Query optimization, Indexing

### Messaging (65 questions)
18. **Kafka** (35q) - Producers, Consumers, Streams
19. **RabbitMQ** (30q) - Exchanges, Queues, Dead Letter

### Microservices (75 questions)
20. **Microservices Fundamentals** (40q) - Service decomposition, Circuit breakers
21. **Spring Cloud** (35q) - Config Server, Eureka, Gateway

### Caching (30 questions)
22. **Redis & Caching** (30q) - Cache patterns, Redis structures

### Deployment (60 questions)
23. **Docker** (30q) - Dockerfile, Multi-stage builds
24. **Kubernetes** (30q) - Pods, Services, Deployments

### Monitoring (25 questions)
25. **Logging & Monitoring** (25q) - SLF4J, ELK, Metrics

### Performance (30 questions)
26. **Java Performance** (30q) - Profiling, GC tuning, Memory leaks

**Total: 880 questions**

## 🎯 Next Steps

1. **Generate prompts for top 5 stacks**:
   ```bash
   npx tsx scripts/intelligentQuestionGenerator.ts generate java-backend core-java 1-3
   npx tsx scripts/intelligentQuestionGenerator.ts generate java-backend spring-boot 1-3
   npx tsx scripts/intelligentQuestionGenerator.ts generate java-backend spring-data-jpa 1-3
   npx tsx scripts/intelligentQuestionGenerator.ts generate java-backend rest-api-design 1-3
   npx tsx scripts/intelligentQuestionGenerator.ts generate java-backend spring-security 1-3
   ```

2. **Copy each prompt to Claude** and save responses

3. **Import to database** one by one

4. **Track progress**:
   ```bash
   npx tsx scripts/contentWorkflow.ts status java-backend
   ```

## 🔄 Creating More Domains

To create other domains (Python, React, etc.):

1. Copy `content/domains/java-backend/domain-config.json`
2. Modify for new domain (define stacks, coverage, exclusions)
3. Use same workflow commands with new domain ID

Example:
```bash
npx tsx scripts/intelligentQuestionGenerator.ts list python-backend
```

## 💡 Pro Tips

1. **Start with Foundation stacks** - Core concepts first
2. **Generate 3-5 stacks per day** - Quality over speed
3. **Review prompts before sending** - Adjust if needed
4. **Validate after generation** - Catch issues early
5. **Track progress regularly** - Use workflow commands