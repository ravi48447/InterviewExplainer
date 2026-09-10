# 🗄️ Complete Data Management Strategy

## 📊 Your Data Types

```
┌─────────────────────────────────────────────────────┐
│ CONTENT DATA (Your Product - Version Controlled)   │
│ - 64 Tech Stacks                                    │
│ - 20,000+ Q&A                                       │
│ - Domains, Categories, Tags                         │
│ - Mock Interview Templates                          │
│ - Static content, rarely changes                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ USER DATA (Runtime - NOT in Git)                   │
│ - User accounts, passwords                          │
│ - Progress tracking                                 │
│ - Bookmarks, streaks                                │
│ - Activity logs                                     │
│ - Dynamic, changes constantly                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ GENERATED DATA (Production Only)                   │
│ - Cache (question pages)                            │
│ - Analytics                                         │
│ - Session data                                      │
│ - Temporary, can be regenerated                     │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 The Golden Rule

> **Content Data** = In Git (your product)
> **User Data** = NEVER in Git (privacy + size)
> **Generated Data** = Ephemeral (Redis/cache)

---

## 🏗️ Complete Architecture

### **Environment Profiles**

```
┌──────────────┬────────────────┬─────────────────┬──────────────────┐
│ Environment  │ Content Data   │ User Data       │ Generated Data   │
├──────────────┼────────────────┼─────────────────┼──────────────────┤
│ LOCAL DEV    │ Git (seeded)   │ Sample/empty    │ Redis (local)    │
│ GIT CLONE    │ Auto-seeded    │ Empty           │ Not needed       │
│ STAGING      │ Same as prod   │ Prod copy/mock  │ Redis (staging)  │
│ PRODUCTION   │ Same as local  │ Real users      │ Redis (prod)     │
└──────────────┴────────────────┴─────────────────┴──────────────────┘
```

---

## 🚀 Recommended Strategy: **Smart Profile-Based Seeding**

### **Architecture Diagram**

```
Application Startup
        ↓
Check Active Profile
        ↓
┌───────┴────────┐
│                │
v                v
LOCAL/DEV        PRODUCTION
│                │
│                ├─ Schema: Flyway migrations
│                ├─ Content: S3/Initial seed ONCE
│                └─ Users: Production DB (persistent)
│
├─ Schema: Flyway migrations
├─ Content: Git seed files (auto-load)
└─ Users: Sample data or empty
```

---

## 📦 Implementation: Multi-Profile Strategy

### **1. Application Profiles**

```properties
# application.properties (default)
spring.profiles.active=dev
seed.content.enabled=true
seed.users.enabled=false
```

```properties
# application-dev.properties (Local Development)
spring.profiles.active=dev
seed.content.enabled=true
seed.content.source=classpath
seed.users.enabled=true
seed.users.source=classpath:seed/sample-users.sql
```

```properties
# application-staging.properties
spring.profiles.active=staging
seed.content.enabled=true
seed.content.source=s3
seed.users.enabled=false  # Use prod copy
```

```properties
# application-prod.properties (Production)
spring.profiles.active=prod
seed.content.enabled=true
seed.content.check-only=true  # Only verify, don't reload
seed.users.enabled=false      # Never seed users in prod
```

---

### **2. Smart Seeding Service**

```java
@Service
public class SmartSeedingService implements CommandLineRunner {

    @Value("${spring.profiles.active}")
    private String activeProfile;

    @Value("${seed.content.enabled:true}")
    private boolean contentSeedEnabled;

    @Value("${seed.users.enabled:false}")
    private boolean userSeedEnabled;

    @Override
    public void run(String... args) throws Exception {
        log.info("🌱 Starting smart seeding for profile: {}", activeProfile);

        // 1. ALWAYS run schema migrations (Flyway handles this)

        // 2. Content seeding (conditional)
        if (contentSeedEnabled && !isContentSeeded()) {
            seedContent();
        }

        // 3. User seeding (dev/test only)
        if (userSeedEnabled && isDevelopment()) {
            seedSampleUsers();
        }

        // 4. Cache warming (optional)
        if (isProduction()) {
            warmupCache();
        }

        log.info("✅ Seeding complete!");
    }

    private void seedContent() {
        if (isContentSeeded()) {
            log.info("✅ Content already seeded. Skipping.");
            return;
        }

        log.info("📦 Loading content data...");

        // Load in order
        loadTaxonomy();      // Languages, tracks, stacks
        loadDomains();       // 64 domain combinations
        loadQuestions();     // 20K+ questions
        loadAnswers();       // Answer sections
        loadMockTemplates(); // Mock interview templates

        markContentAsSeeded();

        log.info("✅ Content loaded successfully!");
    }

    private void seedSampleUsers() {
        if (isProduction()) {
            throw new IllegalStateException("Cannot seed users in production!");
        }

        log.info("👤 Creating sample users for development...");

        createUser("demo@example.com", "Demo User", "0-1");
        createUser("senior@example.com", "Senior Dev", "5+");

        log.info("✅ Sample users created!");
    }

    private boolean isContentSeeded() {
        try {
            return jdbcTemplate.queryForObject(
                "SELECT EXISTS(SELECT 1 FROM seed_status WHERE seed_name = 'content_v1')",
                Boolean.class
            );
        } catch (Exception e) {
            return false;
        }
    }

    private void markContentAsSeeded() {
        jdbcTemplate.update(
            "INSERT INTO seed_status (seed_name, version, loaded_at) " +
            "VALUES ('content_v1', ?, NOW())",
            getContentVersion()
        );
    }

    private boolean isDevelopment() {
        return "dev".equals(activeProfile) || "local".equals(activeProfile);
    }

    private boolean isProduction() {
        return "prod".equals(activeProfile);
    }
}
```

---

### **3. Database Structure**

```
backend/src/main/resources/db/
├── migration/                      # Schema (ALL environments)
│   ├── V001__initial_schema.sql
│   ├── V002__user_tables.sql
│   ├── V003__mock_tables.sql
│   └── V004__seed_status.sql
│
└── seed/                           # Data (CONTENT ONLY)
    ├── local/                      # For local development (Git)
    │   ├── taxonomy.sql.gz         # 64 stacks (500KB)
    │   ├── questions.sql.gz        # 20K Q&A (5-10MB) [Git LFS]
    │   ├── mock-templates.sql.gz   # Mock templates (500KB)
    │   └── sample-users.sql        # 10 demo users (5KB)
    │
    └── production/                 # Production seeds (NOT in Git)
        ├── taxonomy.sql.gz         # Same as local
        ├── questions.sql.gz        # Production questions
        └── README.md               # "Download from S3"
```

---

## 🗂️ Git Structure

```
InterviewExplainer/
├── .gitignore                      # Exclude user data
├── .gitattributes                  # Git LFS config
├── backend/
│   └── src/main/resources/
│       ├── db/
│       │   ├── migration/          ✅ IN GIT (schema)
│       │   └── seed/
│       │       ├── local/          ✅ IN GIT (content + LFS)
│       │       └── production/     ❌ NOT IN GIT (download on deploy)
│       └── application*.properties ✅ IN GIT (configs)
```

**.gitignore:**
```
# User data - NEVER commit
**/user-data/
**/backups/
*.dump

# Production seeds - Download on deploy
**/seed/production/questions.sql.gz

# Temp files
*.log
*.tmp
```

**.gitattributes (Git LFS):**
```
# Large content files
**/seed/**/*.sql.gz filter=lfs diff=lfs merge=lfs -text
**/seed/**/*.json.gz filter=lfs diff=lfs merge=lfs -text
```

---

## 📋 Workflows

### **Workflow 1: Local Development**

```bash
# Developer clones repo
git clone https://github.com/you/InterviewExplainer.git
cd InterviewExplainer

# Git LFS downloads content
git lfs pull

# Start application
./start-all.bat

# What happens:
# 1. Flyway creates schema (30+ tables)
# 2. SmartSeedingService checks profile: "dev"
# 3. Checks if content seeded → NO
# 4. Loads taxonomy.sql.gz (64 stacks)
# 5. Loads questions.sql.gz (20K questions)
# 6. Creates sample users (10 users)
# 7. Marks as seeded in seed_status table
# 8. Application starts

# Next startup:
./start-all.bat
# Checks seed_status → Already seeded → Starts in 5 seconds
```

---

### **Workflow 2: Production Deployment**

```bash
# On production server
git clone https://github.com/you/InterviewExplainer.git
cd InterviewExplainer

# Download production seeds from S3 (one-time)
aws s3 cp s3://your-bucket/seeds/questions_v1.sql.gz \
    backend/src/main/resources/db/seed/production/

# Set production profile
export SPRING_PROFILES_ACTIVE=prod

# Start application
docker-compose up -d

# What happens:
# 1. Flyway creates schema
# 2. SmartSeedingService checks profile: "prod"
# 3. Checks if content seeded → NO (first deploy)
# 4. Loads production/questions.sql.gz
# 5. Marks as seeded
# 6. NO user seeding (production users managed separately)
# 7. Application starts

# Next deployment (updates):
docker-compose up -d
# Checks seed_status → Already seeded → Skips content load → Fast startup
```

---

### **Workflow 3: Content Updates**

```bash
# You added 1000 new questions
# Generate new seed file
pg_dump ... > questions_v2.sql.gz

# Update version
echo "v2" > backend/src/main/resources/db/seed/version.txt

# Commit to Git (LFS)
git add backend/src/main/resources/db/seed/local/questions_v2.sql.gz
git commit -m "Update: 21,000 questions (v2)"
git push

# On production (to update):
# Option A: Clear seed_status (forces reload)
psql -d interviewexplainer -c "DELETE FROM seed_status WHERE seed_name='content_v1';"
docker-compose restart backend

# Option B: Migration script
# V007__update_questions_v2.sql
# - Incremental changes only
```

---

## 🔐 User Data Management

### **Never in Git!**

```java
@Service
@Profile("!prod")  // NOT in production
public class DevelopmentDataSeeder {

    public void createSampleUsers() {
        // Only runs in dev/staging
        User demo = new User();
        demo.setEmail("demo@example.com");
        demo.setName("Demo User");
        demo.setPassword(passwordEncoder.encode("demo123"));
        userRepository.save(demo);

        // Create sample progress
        createSampleProgress(demo);
        createSampleBookmarks(demo);
    }

    private void createSampleProgress(User user) {
        // Mark 10 questions as completed
        // For UI testing
    }
}
```

### **Production User Data**

- **Backup Strategy:** Daily automated backups
- **Migration:** Blue-green deployment with DB replication
- **Never reset:** User data is sacred

```bash
# Production backups
0 2 * * * pg_dump -U postgres interviewexplainer \
    --data-only \
    --table=users \
    --table=user_progress \
    --table=user_bookmarks \
    | gzip > /backups/users_$(date +\%Y\%m\%d).sql.gz
```

---

## 🧪 Testing Strategy

### **3 Database Configurations**

```yaml
# docker-compose.test.yml
services:
  postgres-test:
    image: postgres:15
    environment:
      POSTGRES_DB: interviewexplainer_test
    volumes:
      - ./backend/src/main/resources/db/seed/local:/docker-entrypoint-initdb.d
    # Auto-loads seed on container start
```

**Test profiles:**
- `test` - Minimal data (100 questions for speed)
- `dev` - Full data (20K questions)
- `staging` - Production copy (anonymized users)

---

## 📊 Data Size Management

### **Current Estimates**

| Data Type | Count | Size (Raw) | Size (Compressed) |
|-----------|-------|------------|-------------------|
| Taxonomy | 64 stacks | 100 KB | 30 KB |
| Domains | ~200 | 500 KB | 150 KB |
| Questions | 20,000 | 100 MB | 8-10 MB |
| Answers | 20,000 | 200 MB | 15-20 MB |
| Users (prod) | Growing | N/A | N/A (backups only) |
| **Total Content** | - | **~300 MB** | **~25-30 MB** |

### **Git LFS Limits**

- **Free tier:** 1 GB storage, 1 GB bandwidth/month
- **Your needs:** 30 MB (well within limits)
- **If exceeds:** Upgrade to $5/month for 50 GB

---

## 🚀 Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          lfs: true  # Download LFS files

      - name: Download production seeds from S3
        run: |
          aws s3 sync s3://your-bucket/seeds/ \
            backend/src/main/resources/db/seed/production/

      - name: Build Docker image
        run: docker build -t interviewexplainer:latest .

      - name: Deploy
        run: |
          # Deploy with zero downtime
          # Database migration runs automatically
          # Content seeds if not already loaded
```

---

## ✅ Summary: Your Complete Strategy

### **Local Development**
```
1. Clone repo (Git LFS downloads content)
2. Run ./start-all.bat
3. Auto-seeded with 20K questions + sample users
4. Ready to develop in 1 minute
```

### **Git Repository**
```
✅ Schema migrations (SQL)
✅ Content data (compressed, LFS)
✅ Sample user data (for dev)
❌ Production user data (NEVER)
❌ Large backups (use S3)
```

### **Production**
```
1. Deploy code (Git)
2. Download production seeds (S3, one-time)
3. Flyway migrates schema
4. Smart seeder loads content (if first time)
5. User data managed separately (backups)
6. Cache warms up
7. Ready in 2 minutes
```

### **Content Updates**
```
1. Generate new seed file (questions_v2.sql.gz)
2. Commit to Git (LFS)
3. Production: Either
   a) Clear seed flag + restart (full reload)
   b) Incremental migration (V007__add_new_questions.sql)
```

---

## 🎯 Files to Create

1. **SmartSeedingService.java** - Profile-based seeder
2. **V004__seed_status.sql** - Tracking table
3. **application-{profile}.properties** - Environment configs
4. **.gitignore** - Exclude user data
5. **.gitattributes** - Git LFS config
6. **Generate seed files** - taxonomy, questions, mocks

**Should I implement this complete strategy for you?**

This handles:
- ✅ Local development (auto-seeded)
- ✅ Git-friendly (LFS for large files)
- ✅ Production deployment (S3 + smart loading)
- ✅ User data protection (never in Git)
- ✅ Scales to 100K+ questions