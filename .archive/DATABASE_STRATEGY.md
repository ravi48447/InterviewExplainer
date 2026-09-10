# 🗄️ Database Strategy for 20,000+ Questions at Scale

## 📊 Your Requirements
- **30+ tables**
- **64 tech stacks**
- **20,000+ Q&A**
- **Git-friendly** (anyone clones → works immediately)
- **No manual scripts** every time

---

## 🎯 Recommended Strategy: **Hybrid Smart Seeding**

This is the industry-standard approach for large datasets in version-controlled projects.

---

## 🏗️ Architecture

### **3-Layer Approach**

```
┌─────────────────────────────────────────────────────┐
│ Layer 1: Schema (Flyway Migrations)                │
│ - V001-V004: All 30+ tables                        │
│ - Fast, version-controlled                         │
│ - Runs on every fresh DB                           │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ Layer 2: Taxonomy Seed (SQL Migration)             │
│ - V005__base_taxonomy.sql                          │
│ - Languages, Tracks, Experience Levels, Stacks     │
│ - ~100 records (small, fast)                       │
│ - In Git (30KB file)                               │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ Layer 3: Bulk Content (Smart Loader)               │
│ - 20,000 questions + answers                       │
│ - Loads ONCE on first startup                      │
│ - Stores flag in DB to prevent re-loading          │
│ - Options: SQL dump, JSON files, or S3             │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Implementation Options (Choose One)

### **Option 1: SQL Dump with Git LFS** ⭐ **RECOMMENDED**

**Best for:** Large datasets, production environments

```
backend/
├── src/main/resources/
│   ├── db/
│   │   ├── migration/
│   │   │   ├── V001__initial_schema.sql       (30KB)
│   │   │   ├── V002-V004__user_system.sql     (10KB each)
│   │   │   └── V005__base_taxonomy.sql         (30KB)
│   │   └── seed/
│   │       └── questions_seed.sql.gz           (5-10MB compressed)
│   └── application.properties
```

**How it works:**
1. Flyway creates schema (30+ tables)
2. Flyway loads taxonomy (stacks, languages, tracks)
3. DataSeeder checks: `SELECT * FROM seed_status WHERE seed_name = 'questions'`
4. If not found: Load `questions_seed.sql.gz` → Insert 20K records
5. Mark as seeded: `INSERT INTO seed_status (seed_name, loaded_at) VALUES ('questions', NOW())`
6. Next startup: Skips seed (already loaded)

**Pros:**
- ✅ Fast (compressed SQL is 10x faster than individual inserts)
- ✅ Git-friendly (use Git LFS for large files)
- ✅ Runs once only
- ✅ Anyone clones → gets data automatically

**Cons:**
- ⚠️ Need Git LFS setup (or external storage)
- ⚠️ Updates require regenerating SQL dump

**Implementation:**
```java
@Component
public class BulkDataSeeder implements CommandLineRunner {

    @Override
    public void run(String... args) {
        if (isAlreadySeeded("questions")) {
            log.info("✅ Database already seeded. Skipping.");
            return;
        }

        log.info("📦 Loading 20,000 questions (one-time only)...");
        loadSQLDump("classpath:db/seed/questions_seed.sql.gz");
        markAsSeeded("questions");
        log.info("✅ Seed complete!");
    }

    private boolean isAlreadySeeded(String seedName) {
        return jdbcTemplate.queryForObject(
            "SELECT EXISTS(SELECT 1 FROM seed_status WHERE seed_name = ?)",
            Boolean.class, seedName
        );
    }
}
```

---

### **Option 2: JSON Files in Resources** ⭐ **Good for Development**

**Best for:** Development, frequent content updates

```
backend/src/main/resources/content/
├── stacks/
│   ├── spring-boot.json
│   ├── django.json
│   └── ... (64 files, ~100KB total)
└── questions/
    ├── batch-001.json  (1000 questions)
    ├── batch-002.json  (1000 questions)
    └── ... (20 files, ~50MB total)
```

**How it works:**
1. DataSeeder loads JSON files on first startup
2. Parses and inserts into database
3. Sets flag to prevent re-loading

**Pros:**
- ✅ Human-readable
- ✅ Easy to update individual questions
- ✅ Git-friendly (JSON diffs work well)

**Cons:**
- ⚠️ Slower (parsing JSON + individual inserts)
- ⚠️ Large repo size (50MB+)

---

### **Option 3: Cloud Storage (S3/CDN)** ⭐ **Best for Production**

**Best for:** Production deployments, large teams

```
Application Startup
    ↓
Check if seeded
    ↓ (No)
Download seed file from S3
    ↓
Load into database
    ↓
Mark as seeded
    ↓
Delete local copy
```

**Configuration:**
```properties
# application.properties
seed.source.url=https://your-bucket.s3.amazonaws.com/seeds/questions_v1.sql.gz
seed.auto-download=true
```

**Pros:**
- ✅ Git repo stays small
- ✅ Versioned seed files (questions_v1, v2, v3)
- ✅ Fast downloads (CDN)
- ✅ Can update without code changes

**Cons:**
- ⚠️ Requires S3/cloud setup
- ⚠️ Internet dependency

---

### **Option 4: Docker Volume with Pre-seeded DB** ⭐ **Fastest for Docker**

**Best for:** Docker-based development

```yaml
# docker-compose.yml
services:
  postgres:
    image: your-registry/interviewexplainer-db:latest
    # Pre-loaded with 20K questions
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

**How to create:**
```bash
# 1. Start clean PostgreSQL
docker run -d --name temp-postgres postgres:15

# 2. Load all data
psql -h localhost -d interviewexplainer < full_seed.sql

# 3. Commit to image
docker commit temp-postgres your-registry/interviewexplainer-db:latest

# 4. Push to registry
docker push your-registry/interviewexplainer-db:latest
```

**Pros:**
- ✅ Fastest startup (data already in DB)
- ✅ Zero seed time
- ✅ Consistent across all developers

**Cons:**
- ⚠️ Large Docker image (~200MB)
- ⚠️ Updates require rebuilding image

---

## 🎯 **Recommended for Your Project**

### **Development:** Option 1 (SQL Dump + Git LFS)
### **Production:** Option 3 (S3/Cloud Storage)
### **Docker Users:** Option 4 (Pre-seeded Image)

---

## 🛠️ Implementation: Option 1 (SQL Dump + Smart Seeder)

### **Step 1: Create Seed Status Table**

```sql
-- V006__seed_status.sql
CREATE TABLE IF NOT EXISTS seed_status (
    id SERIAL PRIMARY KEY,
    seed_name VARCHAR(100) UNIQUE NOT NULL,
    version VARCHAR(50),
    loaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    record_count INTEGER
);

CREATE INDEX idx_seed_status_name ON seed_status(seed_name);
```

### **Step 2: Generate SQL Dump**

```bash
# Export current database (after manual seeding)
pg_dump -U interviewexplainer \
    -d interviewexplainer \
    --data-only \
    --table=questions \
    --table=answer_sections \
    --table=question_stack_map \
    --table=domain_stack_map \
    | gzip > backend/src/main/resources/db/seed/questions_seed.sql.gz

# Size check
du -h backend/src/main/resources/db/seed/questions_seed.sql.gz
# Expected: 5-10MB for 20K questions
```

### **Step 3: Smart Bulk Seeder**

```java
package com.interviewexplainer.backendapi.infrastructure.seeding;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.zip.GZIPInputStream;

@Component
public class BulkDataSeeder implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;
    private final ResourceLoader resourceLoader;

    public BulkDataSeeder(JdbcTemplate jdbcTemplate, ResourceLoader resourceLoader) {
        this.jdbcTemplate = jdbcTemplate;
        this.resourceLoader = resourceLoader;
    }

    @Override
    public void run(String... args) throws Exception {
        if (isAlreadySeeded("questions")) {
            log.info("✅ Database already contains seed data. Skipping.");
            return;
        }

        log.info("🌱 First startup detected. Loading seed data...");

        // Load compressed SQL dump
        Resource resource = resourceLoader.getResource(
            "classpath:db/seed/questions_seed.sql.gz"
        );

        if (!resource.exists()) {
            log.warn("⚠️ No seed file found. Database will be empty.");
            return;
        }

        long startTime = System.currentTimeMillis();

        try (GZIPInputStream gzip = new GZIPInputStream(resource.getInputStream());
             BufferedReader reader = new BufferedReader(new InputStreamReader(gzip))) {

            StringBuilder sql = new StringBuilder();
            String line;
            int statementCount = 0;

            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty() || line.startsWith("--")) {
                    continue;
                }

                sql.append(line).append("\n");

                if (line.trim().endsWith(";")) {
                    jdbcTemplate.execute(sql.toString());
                    sql.setLength(0);
                    statementCount++;

                    if (statementCount % 100 == 0) {
                        log.info("📦 Loaded {} records...", statementCount);
                    }
                }
            }
        }

        long duration = (System.currentTimeMillis() - startTime) / 1000;

        // Mark as seeded
        Integer questionCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM questions", Integer.class
        );

        jdbcTemplate.update(
            "INSERT INTO seed_status (seed_name, version, record_count) VALUES (?, ?, ?)",
            "questions", "1.0", questionCount
        );

        log.info("✅ Seed complete! Loaded {} questions in {}s", questionCount, duration);
    }

    private boolean isAlreadySeeded(String seedName) {
        try {
            Boolean exists = jdbcTemplate.queryForObject(
                "SELECT EXISTS(SELECT 1 FROM seed_status WHERE seed_name = ?)",
                Boolean.class, seedName
            );
            return exists != null && exists;
        } catch (Exception e) {
            return false;
        }
    }
}
```

### **Step 4: Git LFS Setup**

```bash
# Install Git LFS
brew install git-lfs  # Mac
# or: apt-get install git-lfs  # Linux

# Initialize in repo
git lfs install

# Track seed files
git lfs track "*.sql.gz"
git lfs track "backend/src/main/resources/db/seed/*"

# Commit .gitattributes
git add .gitattributes
git commit -m "Add Git LFS for seed files"

# Add seed file
git add backend/src/main/resources/db/seed/questions_seed.sql.gz
git commit -m "Add question seed data (20K questions)"
git push
```

---

## 🔄 Workflow: Fresh Clone

```bash
# Developer 1: Clones repo
git clone https://github.com/you/InterviewExplainer.git
cd InterviewExplainer

# Git LFS automatically downloads seed files
git lfs pull

# Start application
./start-all.bat

# What happens:
# 1. Docker starts PostgreSQL
# 2. Flyway creates 30+ tables (2 seconds)
# 3. Flyway loads taxonomy (64 stacks) (1 second)
# 4. BulkDataSeeder checks seed_status table
# 5. Not found → Loads questions_seed.sql.gz (30 seconds)
# 6. Marks as seeded
# 7. Application starts (10 seconds)
# Total: ~45 seconds

# Next startup:
./start-all.bat
# What happens:
# 1. Flyway: "Already at version V006, skipping"
# 2. BulkDataSeeder: "Already seeded, skipping"
# 3. Application starts (5 seconds)
# Total: ~5 seconds
```

---

## 📊 Comparison

| Strategy | First Startup | Git Repo Size | Updates | Best For |
|----------|--------------|---------------|---------|----------|
| SQL Dump + Git LFS | 45s | 10MB (LFS) | Regenerate dump | **Most projects** |
| JSON Files | 2-3 min | 50MB+ | Edit files | Development |
| S3 Cloud Storage | 60s | 1MB | Upload new file | Production |
| Pre-seeded Docker | 5s | 200MB (image) | Rebuild image | Docker teams |

---

## ✅ Recommended Setup for You

```
InterviewExplainer/
├── backend/
│   └── src/main/resources/
│       ├── db/
│       │   ├── migration/
│       │   │   ├── V001__initial_schema.sql       ✅ Schema
│       │   │   ├── V002-V004__*.sql               ✅ User tables
│       │   │   ├── V005__base_taxonomy.sql        ✅ 64 stacks
│       │   │   └── V006__seed_status.sql          ✅ Track seeding
│       │   └── seed/
│       │       └── questions_seed.sql.gz          ✅ 20K Q&A (Git LFS)
│       └── application.properties
└── .gitattributes                                  ✅ Git LFS config
```

**Result:**
- ✅ Clone repo → Run once → Fully populated DB
- ✅ Subsequent runs: Fast startup (no re-seeding)
- ✅ Git-friendly (LFS handles large files)
- ✅ Scales to 100K+ questions

---

## 🚀 Next Steps

1. Choose strategy (I recommend **Option 1: SQL Dump + Git LFS**)
2. I'll implement the BulkDataSeeder
3. Generate initial seed file from your existing data
4. Set up Git LFS
5. Test: Clone → Run → Verify data

**Should I implement Option 1 (SQL Dump + Git LFS)?**