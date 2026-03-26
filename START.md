# 🚀 Quick Start Guide - InterviewExplainer

**Get up and running in 5 minutes!**

---

## 📋 What You'll Need

Before starting, make sure you have:
- ✅ **Java 17+** ([Download](https://www.oracle.com/java/technologies/downloads/))
- ✅ **PostgreSQL 15+** ([Download](https://www.postgresql.org/download/))
- ✅ **Node.js 18+** ([Download](https://nodejs.org/))
- ✅ **Maven 3.8+** (Usually comes with Java)

---

## ⚡ 5-Minute Setup

### **Step 1: Get the Code**
```bash
git clone https://github.com/ravi48447/InterviewExplainer.git
cd InterviewExplainer
```

### **Step 2: Setup Database**
```bash
# Open PostgreSQL terminal
psql -U postgres

# Run these commands (copy-paste all at once):
CREATE DATABASE interviewexplainer;
CREATE USER interviewexplainer WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE interviewexplainer TO interviewexplainer;
\q
```

**Note:** Replace `your_secure_password_here` with any password you want. Remember it for later steps if needed.

### **Step 3: Start Backend** (First Terminal)
```bash
cd backend
./mvnw spring-boot:run
```

**Wait for this message:**
```
✅ Generated 500 questions with 1000 answer sections
Started BackendApiApplication in X.XXX seconds
```

Backend is now running at: **http://localhost:8080**

### **Step 4: Start Frontend** (Second Terminal)
```bash
cd frontend
npm install
npm run dev
```

**Wait for this message:**
```
✓ Ready in X.Xs
Local: http://localhost:3000
```

Frontend is now running at: **http://localhost:3000**

---

## 🎯 Test It's Working

Open your browser and try these URLs:

1. **Home Page:**
   ```
   http://localhost:3000
   ```

2. **Domain Page (Stack List):**
   ```
   http://localhost:3000/java-backend-1-3
   ```
   You should see:
   - ✅ Categories (cloud, language, framework...)
   - ✅ Stacks (AWS - 90 questions, Advanced Java - 10 questions)

3. **Question Page:**
   ```
   http://localhost:3000/java-backend-1-3/aws/java-backend-1-3-aws-overview
   ```
   You should see:
   - ✅ Question title: "What is Aws and when should you use it?"
   - ✅ 2 answer sections with content
   - ✅ Previous/Next navigation

---

## 🔧 Common Issues

### **Issue: Backend won't start - "Port 8080 already in use"**
```bash
# Kill the process using port 8080
lsof -ti:8080 | xargs kill -9

# Or use a different port in application.properties:
# server.port=8081
```

### **Issue: Database connection failed**
```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# If not running, start it:
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Windows: Start PostgreSQL service from Services
```

### **Issue: Frontend can't connect to backend**
```bash
# Check backend is running on port 8080
curl http://localhost:8080/actuator/health

# Should return: {"status":"UP"}
```

### **Issue: "Module not found" in frontend**
```bash
# Delete node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 What Gets Created

On first run, the system automatically:
- ✅ Creates 30+ database tables
- ✅ Loads 64 domains (Java Backend 1-3, Python Backend 3-5, etc.)
- ✅ Loads 244 tech stacks (Spring Boot, React, AWS, Docker, etc.)
- ✅ Generates 500 questions with 1,000 answer sections

**Current Coverage:**
- 50 stack-domain combinations
- 10 questions per combination
- 2 sections per question (will be expanded)

---

## 🎓 What's Next?

### **Explore the Application**
1. Browse different domains
2. Check stack questions
3. Read question answers
4. Try navigation between questions

### **Expand Question Coverage**
Currently limited to 50 combinations. To generate all 6,380 questions:

1. Open: `backend/src/main/java/.../infrastructure/seeding/QuestionSeedLoader.java`
2. Find line ~117: `LIMIT 50`
3. Remove that line
4. Restart backend
5. Wait ~2 minutes for generation
6. **Result**: 6,380 questions across 638 domain-stack combinations!

---

## 📚 Documentation

For more details, check:
- **README.md** - Full project documentation
- **DATABASE_STRATEGY.md** - Database schema and design
- **CONTENT_GENERATION_STATUS.md** - Question generation system
- **DATA_MANAGEMENT_STRATEGY.md** - Data seeding strategy
- **DOMAIN_SPECIFIC_QUESTIONS_SUCCESS.md** - Domain-specific approach
- **INTELLIGENT_CONTENT_SYSTEM.md** - Content generation details
- **UI_WORKING_STATUS.md** - Frontend integration

---

## 🆘 Need Help?

### **Check Logs**

**Backend logs:**
```bash
# In backend terminal, scroll up to see errors
# Or check Spring Boot output
```

**Frontend logs:**
```bash
# In frontend terminal
# Or check browser console (F12 → Console tab)
```

### **Reset Everything**

If something goes wrong, reset and start fresh:

```bash
# 1. Stop both servers (Ctrl+C in both terminals)

# 2. Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS interviewexplainer;"
psql -U postgres -c "CREATE DATABASE interviewexplainer;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE interviewexplainer TO interviewexplainer;"

# 3. Clear frontend cache
cd frontend
rm -rf .next node_modules
npm install

# 4. Restart backend (it will recreate everything)
cd ../backend
./mvnw spring-boot:run

# 5. Restart frontend (in new terminal)
cd frontend
npm run dev
```

---

## 💬 Get Support

### **GitHub Issues**
Report bugs or request features:
```
https://github.com/ravi48447/InterviewExplainer/issues
```

### **Contact**
- **GitHub:** [@ravi48447](https://github.com/ravi48447)
- **Project:** [InterviewExplainer](https://github.com/ravi48447/InterviewExplainer)

### **Before Asking for Help**
Please provide:
1. What you were trying to do
2. What error message you got (exact text or screenshot)
3. Your OS (Mac/Windows/Linux)
4. Java version (`java -version`)
5. Node version (`node -v`)
6. PostgreSQL version (`psql --version`)

---

## ✅ Success Checklist

Make sure you can:
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can see domains listed
- [ ] Can open a domain page
- [ ] Can see stacks with question counts
- [ ] Can open a question page
- [ ] Can see answer sections
- [ ] Can navigate to next/previous questions

If all checked ✅ - **You're ready!** 🎉

---

## 🚀 Quick Commands Reference

```bash
# Start Backend
cd backend && ./mvnw spring-boot:run

# Start Frontend
cd frontend && npm run dev

# Check Backend Health
curl http://localhost:8080/actuator/health

# Check Frontend
curl http://localhost:3000

# View Database
psql -U interviewexplainer -d interviewexplainer

# Stop All (in each terminal)
Ctrl+C
```

---

## 📚 More Information

- **Full Documentation**: Check **[README.md](README.md)** for complete feature list and architecture
- **Production Deployment**: See **[README.md - Security Section](README.md#-security--production-deployment)** before deploying to production
- **Security Best Practices**: Check **[SECURITY.md](SECURITY.md)** for detailed security guidelines
- **Database Schema**: See **[DATABASE_STRATEGY.md](DATABASE_STRATEGY.md)**
- **Content Generation**: See **[CONTENT_GENERATION_STATUS.md](CONTENT_GENERATION_STATUS.md)**

---

## ⚠️ Important Note

This quick start uses **development credentials** for easy local setup.

**Before deploying to production**, you MUST:
- Change JWT_SECRET (see SECURITY.md)
- Change database password
- Configure HTTPS/SSL
- Review security checklist

See **[SECURITY.md](SECURITY.md)** for complete production deployment guide.

---

**Questions?** Open an issue on [GitHub](https://github.com/ravi48447/InterviewExplainer/issues)!
