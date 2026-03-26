# 🔒 Security Policy

## Overview

InterviewExplainer takes security seriously. This document outlines security considerations, best practices, and how to report vulnerabilities.

---

## 🚨 Reporting Security Vulnerabilities

**DO NOT** open public GitHub issues for security vulnerabilities.

Instead, please report them privately:
- **Email**: [Your security contact email]
- **GitHub**: Use [Private Security Reporting](https://github.com/ravi48447/InterviewExplainer/security/advisories/new)

We will respond within **48 hours** and work with you to address the issue.

---

## 🔐 Authentication & Authorization

### JWT Token Security

**Development Mode:**
- Default JWT secret is included for quick setup
- **WARNING**: Do NOT use in production

**Production Mode:**
- **MUST** set custom `JWT_SECRET` environment variable
- Minimum 256 bits (32 characters)
- Use cryptographically random generation

**Generate secure key:**
```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Option 3: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Set in production:**
```bash
# Environment variable
export JWT_SECRET="your_generated_secret_here"

# Docker Compose
services:
  backend:
    environment:
      JWT_SECRET: "your_generated_secret_here"

# Kubernetes Secret
kubectl create secret generic jwt-secret \
  --from-literal=JWT_SECRET='your_generated_secret_here'
```

### Password Security

**User Passwords:**
- Hashed with BCrypt (cost factor: 10)
- Never stored in plain text
- Minimum requirements enforced:
  - 8 characters minimum
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character

**Database Password:**
- Default: `changeme` (development only)
- **MUST** change in production
- Use strong passwords (20+ characters, mixed case, numbers, symbols)

---

## 🗄️ Database Security

### PostgreSQL Configuration

**Development:**
```sql
CREATE USER interviewexplainer WITH PASSWORD 'changeme';
```

**Production:**
```sql
-- Use strong password
CREATE USER interviewexplainer WITH PASSWORD 'Str0ng_P@ssw0rd_H3r3!2024';

-- Grant minimal permissions
GRANT CONNECT ON DATABASE interviewexplainer TO interviewexplainer;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO interviewexplainer;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO interviewexplainer;

-- Revoke dangerous permissions
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
```

### Connection Security

**Development:**
- Local connection without SSL

**Production:**
- **MUST** enable SSL/TLS for database connections
- Update `application.properties`:
  ```properties
  spring.datasource.url=jdbc:postgresql://host:5432/db?ssl=true&sslmode=require
  ```

### SQL Injection Prevention

- **All queries use JPA/parameterized queries**
- Never concatenate user input into SQL
- Input validation on all endpoints

---

## 🌐 API Security

### CORS (Cross-Origin Resource Sharing)

**Development:**
```java
@CrossOrigin(origins = "http://localhost:3000")
```

**Production:**
```java
@CrossOrigin(origins = "https://interviewexplainer.com")
```

Update in `CorsConfig.java`:
```java
config.setAllowedOrigins(Arrays.asList("https://interviewexplainer.com"));
```

### Rate Limiting

**Recommended for production:**
```java
// Add Spring Cloud Gateway or Bucket4j for rate limiting
@RateLimiter(name = "authRateLimiter")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    // Max 5 attempts per minute per IP
}
```

### Input Validation

All endpoints validate input:
- Email format validation
- Password strength requirements
- SQL injection prevention (parameterized queries)
- XSS prevention (output encoding)

---

## 🔒 HTTPS/SSL Configuration

### Development
- HTTP is acceptable for localhost

### Production (REQUIRED)

**Option 1: Reverse Proxy (Recommended)**
```nginx
# Nginx configuration
server {
    listen 443 ssl http2;
    server_name interviewexplainer.com;

    ssl_certificate /etc/letsencrypt/live/interviewexplainer.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/interviewexplainer.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Option 2: Spring Boot SSL**
```properties
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=your_keystore_password
server.ssl.key-store-type=PKCS12
```

---

## 🛡️ Environment Variables

### Sensitive Configuration

**NEVER commit these to Git:**
- JWT_SECRET
- Database passwords
- API keys
- Private keys

**Use environment variables:**
```bash
# .env file (add to .gitignore)
JWT_SECRET=your_secret
SPRING_DATASOURCE_PASSWORD=your_db_password
OPENAI_API_KEY=your_openai_key
```

**Load in Spring Boot:**
```properties
jwt.secret=${JWT_SECRET}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
```

---

## 🔄 Security Updates

### Dependency Management

**Check for vulnerabilities:**
```bash
# Backend (Maven)
./mvnw dependency-check:check

# Frontend (npm)
npm audit
npm audit fix
```

**Update regularly:**
```bash
# Backend
./mvnw versions:display-dependency-updates
./mvnw versions:use-latest-releases

# Frontend
npm update
npx npm-check-updates -u
```

### Spring Security Updates

- Monitor [Spring Security Advisories](https://spring.io/security)
- Subscribe to security mailing lists
- Update to latest stable versions

---

## 📋 Production Security Checklist

Before deploying to production:

### Configuration
- [ ] Changed JWT_SECRET from default
- [ ] Changed database password from 'changeme'
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate`
- [ ] Disabled SQL logging (`spring.jpa.show-sql=false`)
- [ ] Configured CORS for production domain only
- [ ] Removed development endpoints

### Infrastructure
- [ ] HTTPS/SSL enabled (443)
- [ ] HTTP redirects to HTTPS
- [ ] Database connections use SSL
- [ ] Firewall configured (only expose 80/443)
- [ ] Reverse proxy configured (Nginx/Apache)

### Monitoring
- [ ] Log all authentication attempts
- [ ] Alert on failed login spikes
- [ ] Monitor API usage patterns
- [ ] Set up health check monitoring
- [ ] Configure error tracking (Sentry, etc.)

### Backups
- [ ] Database automated backups (daily)
- [ ] Backup retention policy defined
- [ ] Tested restore procedure
- [ ] Off-site backup storage

### Updates
- [ ] All dependencies up to date
- [ ] Security patches applied
- [ ] Vulnerability scan passed
- [ ] Penetration test completed (if applicable)

---

## 🔐 Secret Rotation Policy

### JWT Secret
- **Rotation**: Every 90 days
- **Process**:
  1. Generate new secret
  2. Deploy with both old and new secrets (grace period)
  3. Wait 24 hours (token expiry)
  4. Remove old secret

### Database Passwords
- **Rotation**: Every 90 days
- **Process**:
  1. Create new password
  2. Update application config
  3. Change database password
  4. Restart application
  5. Verify connectivity

### API Keys (OpenAI, etc.)
- **Rotation**: Every 180 days or on suspected compromise
- **Process**:
  1. Generate new key in provider dashboard
  2. Update environment variables
  3. Deploy
  4. Revoke old key

---

## 🚫 Common Security Anti-Patterns

### ❌ DO NOT

1. **Commit secrets to Git**
   ```bash
   # Bad
   git add .env
   git commit -m "Add config"
   ```

2. **Use weak JWT secrets**
   ```java
   // Bad
   private String SECRET_KEY = "secret";
   ```

3. **Disable CSRF protection**
   ```java
   // Bad (unless you have a good reason)
   http.csrf().disable();
   ```

4. **Log sensitive data**
   ```java
   // Bad
   log.info("User password: " + password);
   ```

5. **Store passwords in plain text**
   ```java
   // Bad
   user.setPassword(plainPassword);
   ```

### ✅ DO

1. **Use environment variables**
   ```bash
   export JWT_SECRET=$(openssl rand -base64 32)
   ```

2. **Use strong secrets**
   ```java
   private String SECRET_KEY = System.getenv("JWT_SECRET");
   ```

3. **Enable security features**
   ```java
   http.csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
   ```

4. **Sanitize logs**
   ```java
   log.info("User authenticated: " + user.getEmail()); // No password
   ```

5. **Hash passwords**
   ```java
   user.setPassword(passwordEncoder.encode(plainPassword));
   ```

---

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)

---

## 📞 Contact

For security concerns:
- **Email**: [Your security email]
- **GitHub**: [@ravi48447](https://github.com/ravi48447)
- **Private Disclosure**: [GitHub Security Advisories](https://github.com/ravi48447/InterviewExplainer/security/advisories/new)

---

**Last Updated**: 2026-03-27

We appreciate responsible disclosure and will acknowledge contributors in our security hall of fame.
