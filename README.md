# 🎯 InterviewExplainer

**AI-Powered Interview Preparation Platform for Every Tech Stack**

Master your next interview with personalized, domain-specific questions across **20,000+ scenarios** tailored to your exact experience level, tech stack, and career goals.

[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)

---

## 🚀 Quick Start

**New here? Start with the [Quick Start Guide →](START.md)**

---

## 📋 Table of Contents

- [Features](#-features)
- [Why InterviewExplainer?](#-why-interviewexplainer)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Domain-Specific Approach](#-domain-specific-approach)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [Support](#-support)

---

## ✨ Features

### 🎯 **Personalized Learning Paths**
- **64 Career Domains** - Java Backend, Python ML, DevOps, Full-Stack, and more
- **9 Languages** - Java, Python, JavaScript, Go, Rust, C++, Ruby, PHP, C#
- **6 Career Tracks** - Backend, Frontend, Full-Stack, DevOps, Data Science, Mobile
- **4 Experience Levels** - Fresher (0-1), Junior (1-3), Mid (3-5), Senior (5+)
- **Adaptive Content** - Questions automatically match your experience level

### 🤖 **AI-Powered Content Generation**
- **20,000+ Interview Questions** across all major tech stacks
- **Intelligent Answer Generation** - Multi-section explanations with real-world context
- **Code Examples** - Production-ready snippets with best practices
- **Interview Tips** - What recruiters actually want to hear
- **Common Mistakes** - Learn what NOT to say

### 📚 **Comprehensive Tech Stack Coverage**
- **Languages**: Spring Boot, Django, FastAPI, Express.js, Gin, Ruby on Rails
- **Frontend**: React, Angular, Vue, Next.js, Svelte
- **Databases**: PostgreSQL, MongoDB, Redis, MySQL, Cassandra
- **Cloud**: AWS, Azure, GCP, Kubernetes, Docker, Terraform
- **Tools**: Git, Jenkins, GitHub Actions, Kafka, RabbitMQ, GraphQL

### 🎓 **Interactive Learning Experience**
- **Progress Tracking** - Monitor your preparation journey
- **Smart Bookmarks** - Save questions for later review
- **Streak System** - Build consistent study habits
- **Mock Interviews** - Simulate real interview scenarios (Coming Soon)
- **Weak Area Analysis** - AI identifies topics you need to practice

### 🔍 **Advanced Search & Discovery**
- **Full-Text Search** - Find questions across all domains instantly
- **Smart Recommendations** - "People Also Ask" suggestions
- **Category Filtering** - Browse by language, framework, database, cloud, etc.
- **Difficulty Levels** - Easy, Medium, Hard question classification

### 🚀 **Enterprise Architecture**
- **Modular Design** - Auth, Content, Learning, Analytics, Search, Generation modules
- **RESTful APIs** - Clean, documented endpoints
- **Real-time Updates** - Live progress sync across sessions
- **Scalable Backend** - Handles millions of questions and users
- **SEO Optimized** - Unique URLs for every question

---

## 🏗️ Architecture

### **Domain Structure**
```
Domain = Language + Track + Experience Level
Example: "java-backend-1-3" = Java + Backend + 1-3 years

Each Domain contains:
├── Categories (language, framework, database, cloud, devops...)
    └── Tech Stacks (Spring Boot, PostgreSQL, Docker, AWS...)
        └── 50+ Comprehensive Questions per Stack
            └── 5-8 Rich Answer Sections per Question
                ├── Quick Summary (30 seconds)
                ├── Core Concepts (2-3 minutes)
                ├── Code Examples (Production-ready)
                ├── Architecture Diagrams (Visual learning)
                ├── Interview Tips (What to say)
                ├── Common Mistakes (What to avoid)
                ├── Real-World Scenarios (Applied knowledge)
                └── Follow-up Questions (Be prepared)
```

### **Question Generation Strategy (Option 1)**
- **Domain-Specific Questions**: Each domain gets its own questions
- **Unique Slugs**: `java-backend-1-3-spring-boot-overview` vs `python-backend-3-5-spring-boot-overview`
- **Content Adaptation**: Same concept, different complexity based on experience level
- **SEO Benefits**: No duplicate content, better search ranking

---

## 🛠️ Tech Stack

### **Backend**
- **Java 17+** - Modern Java with virtual threads
- **Spring Boot 3.3.1** - Production-grade framework
- **Spring Data JPA** - Advanced ORM with caching
- **PostgreSQL 15+** - Full-text search, JSONB support
- **Flyway** - Zero-downtime migrations
- **Redis** - High-performance caching layer
- **Maven** - Dependency management

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Full type safety
- **Tailwind CSS** - Modern utility-first styling
- **Framer Motion** - Smooth animations
- **shadcn/ui** - Accessible component library
- **React Query** - Advanced data fetching & caching

### **AI & Search**
- **OpenAI API** - GPT-4 for content generation
- **PostgreSQL Full-Text Search** - Fast, accurate search
- **Embeddings** - Semantic question similarity
- **LangChain** - AI workflow orchestration

---

## 📦 Installation

### **Prerequisites**
- Java 17 or higher
- PostgreSQL 15 or higher
- Node.js 18 or higher
- Maven 3.8+

### **Quick Setup**

See **[START.md](START.md)** for detailed step-by-step instructions.

**Summary:**
```bash
# 1. Clone
git clone https://github.com/ravi48447/InterviewExplainer.git
cd InterviewExplainer

# 2. Setup Database
psql -U postgres
CREATE DATABASE interviewexplainer;
CREATE USER interviewexplainer WITH PASSWORD '********';
GRANT ALL PRIVILEGES ON DATABASE interviewexplainer TO interviewexplainer;
\q

# 3. Start Backend
cd backend
./mvnw spring-boot:run

# 4. Start Frontend (new terminal)
cd frontend
npm install
npm run dev
```

**Access:** http://localhost:3000

---

## 🎯 Domain-Specific Approach

**Example: Same Question, Different Experience Levels**

```
Junior (1-3 years) → Spring Boot → "What is dependency injection?"
  ↳ "DI means Spring creates objects for you..."
  ↳ Simple @Autowired examples
  ↳ Focus: Basic understanding

Senior (5+ years) → Spring Boot → "What is dependency injection?"
  ↳ "DI inverts control flow, enabling loose coupling..."
  ↳ Constructor vs field injection trade-offs
  ↳ Performance implications, circular dependency resolution
  ↳ Focus: Design patterns, architecture decisions
```

**Benefits:**
- ✅ **Personalized** - Content matches your exact experience level
- ✅ **Efficient** - No wading through irrelevant material
- ✅ **Comprehensive** - From basics to advanced in one platform
- ✅ **Interview-Ready** - Learn what recruiters expect at YOUR level

---

## 🎯 Why InterviewExplainer?

### **Traditional Interview Prep Problems:**
- ❌ Generic questions that don't match your experience level
- ❌ Same content for freshers and seniors
- ❌ No context on what recruiters actually want to hear
- ❌ Memorizing answers without understanding
- ❌ No way to track weak areas

### **InterviewExplainer Solution:**
- ✅ **Experience-Aware Content** - Different explanations for junior vs senior roles
- ✅ **Domain-Specific** - Java Backend questions differ from Python Backend
- ✅ **Real Interview Context** - Learn what recruiters look for at each level
- ✅ **Comprehensive Coverage** - From basics to advanced architecture
- ✅ **AI-Powered Analytics** - Identify and strengthen weak areas
- ✅ **Practice → Track → Improve** - Measurable progress over time

---

## 📡 API Documentation

### **Base URL**
```
http://localhost:8080/api/v2
```

### **Endpoints**

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /domains` | List all domains | 64 domains |
| `GET /domains/{slug}` | Get domain details | `java-backend-1-3` |
| `GET /domains/{slug}/categories` | Stack list with counts | Categories + stacks |
| `GET /stacks/{slug}/questions` | Questions for stack | 90 AWS questions |
| `GET /question/{slug}` | Full question page | Complete Q&A |

### **Example Response**
```json
{
  "title": "What is Spring Boot?",
  "slug": "java-backend-1-3-spring-boot-overview",
  "difficulty": "easy",
  "estimatedReadTime": 5,
  "answerSections": [
    {
      "sectionType": "short_summary",
      "content": "Spring Boot simplifies..."
    }
  ],
  "previousQuestion": {...},
  "nextQuestion": {...}
}
```

---

## 📁 Project Structure

```
InterviewExplainer/
├── backend/                    # Spring Boot API
│   ├── src/main/java/
│   │   ├── shared/            # Security, config, exceptions
│   │   ├── modules/           # Business modules
│   │   │   ├── auth/         # Authentication
│   │   │   ├── content/      # Questions, stacks, domains
│   │   │   ├── learning/     # Progress tracking
│   │   │   └── analytics/    # Dashboard
│   │   └── infrastructure/   # Seeding, bootstrapping
│   └── src/main/resources/
│       ├── db/migration/     # Flyway SQL migrations
│       └── content/          # Seed data JSON
│
├── frontend/                  # Next.js UI
│   ├── app/                  # App router
│   │   └── [domainSlug]/    # Dynamic routes
│   ├── components/           # React components
│   └── lib/                  # API client
│
├── START.md                  # Quick start guide
└── README.md                 # This file
```

---

## 📚 Documentation

| File | Description |
|------|-------------|
| **[START.md](START.md)** | **Quick start guide - Start here!** |
| **[DATABASE_STRATEGY.md](DATABASE_STRATEGY.md)** | Database schema and design |
| **[CONTENT_GENERATION_STATUS.md](CONTENT_GENERATION_STATUS.md)** | Question generation system |
| **[DATA_MANAGEMENT_STRATEGY.md](DATA_MANAGEMENT_STRATEGY.md)** | Data seeding strategy |
| **[DOMAIN_SPECIFIC_QUESTIONS_SUCCESS.md](DOMAIN_SPECIFIC_QUESTIONS_SUCCESS.md)** | Domain-specific approach details |
| **[INTELLIGENT_CONTENT_SYSTEM.md](INTELLIGENT_CONTENT_SYSTEM.md)** | Content generation internals |
| **[UI_WORKING_STATUS.md](UI_WORKING_STATUS.md)** | Frontend integration status |

---

## 🚀 Roadmap

### **Q2 2026 - Content Scale-Up**
- [ ] **20,000+ Questions** - Full coverage across all domains
- [ ] **Video Explanations** - Visual walkthroughs for complex topics
- [ ] **Code Playgrounds** - Interactive coding challenges
- [ ] **Real Interview Recordings** - Learn from actual interview sessions

### **Q3 2026 - AI Features**
- [ ] **AI Mock Interviewer** - Practice with AI that adapts to your answers
- [ ] **Resume Analysis** - Get personalized question recommendations
- [ ] **Answer Quality Scoring** - AI rates your practice answers
- [ ] **Custom Study Plans** - AI generates roadmap based on your goal

### **Q4 2026 - Community & Live**
- [ ] **Live Mock Interviews** - Practice with real engineers
- [ ] **Peer Practice Sessions** - Match with others at your level
- [ ] **Company-Specific Prep** - Questions from specific companies
- [ ] **Interview Success Stories** - Learn from those who got offers

### **2027 - Enterprise Edition**
- [ ] **Team Accounts** - Help your team prepare together
- [ ] **Custom Content** - Upload your company's tech stack
- [ ] **Interview Analytics** - Track team performance
- [ ] **Integration APIs** - Embed in your tools

---

## 🔒 Security & Production Deployment

### **⚠️ IMPORTANT: Before Deploying to Production**

The default configuration uses development credentials that are **NOT SECURE** for production use. You must configure:

#### **1. JWT Secret Key**
The application uses a JWT secret for authentication. For production:

```bash
# Set environment variable
export JWT_SECRET="your-strong-random-secret-key-minimum-256-bits"

# Or in Docker Compose
services:
  backend:
    environment:
      JWT_SECRET: "your-strong-random-secret-key-minimum-256-bits"
```

**Generate a secure key:**
```bash
# Generate a random 256-bit key
openssl rand -base64 32
```

#### **2. Database Password**
Change the default password in production:

```bash
# PostgreSQL
CREATE USER interviewexplainer WITH PASSWORD 'your_secure_production_password';

# Update backend configuration
SPRING_DATASOURCE_PASSWORD=your_secure_production_password
```

#### **3. Security Checklist for Production**
- [ ] Changed JWT_SECRET to a strong random value
- [ ] Changed database password from 'changeme'
- [ ] Enabled HTTPS/SSL for frontend and backend
- [ ] Configured CORS for your production domain
- [ ] Disabled debug logging (set `spring.jpa.show-sql=false`)
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate` (not 'update')
- [ ] Configured firewall rules (only expose ports 80/443)
- [ ] Set up database backups
- [ ] Configured monitoring/logging (e.g., Sentry, Datadog)

#### **4. Environment Variables for Production**

```bash
# Backend
JWT_SECRET=your_generated_secret_here
SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/interviewexplainer
SPRING_DATASOURCE_USERNAME=interviewexplainer
SPRING_DATASOURCE_PASSWORD=your_secure_password
SPRING_PROFILES_ACTIVE=prod

# Frontend
NEXT_PUBLIC_API_URL=https://api.interviewexplainer.com
```

See **[START.md](START.md)** for detailed deployment instructions.

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 🆘 Support

### **Issues & Bugs**
Report at: [GitHub Issues](https://github.com/ravi48447/InterviewExplainer/issues)

### **Questions**
- Check **[START.md](START.md)** first
- Check existing issues
- Open a new issue with details

### **Contact**
- GitHub: [@ravi48447](https://github.com/ravi48447)
- Project: [InterviewExplainer](https://github.com/ravi48447/InterviewExplainer)

---

## 📄 License

This project is proprietary and confidential.

---

## 👤 Author

**Ravi**
- GitHub: [@ravi48447](https://github.com/ravi48447)

---

**Made with ❤️ for interview preparation**

---

## 🎯 Test URLs

Once running, try:
- Home: `http://localhost:3000`
- Domain: `http://localhost:3000/java-backend-1-3`
- Question: `http://localhost:3000/java-backend-1-3/aws/java-backend-1-3-aws-overview`
