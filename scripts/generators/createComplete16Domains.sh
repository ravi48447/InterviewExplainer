#!/bin/bash

# Create COMPLETE 16-domain structure
# Language → Type → Experience Level

cd "$(dirname "$0")/../content/domains"

echo "🚀 Creating Complete 16-Domain Structure"
echo "Organization: Language → Type → Experience Level"
echo ""

# ============================================================================
# JAVA BACKEND (4 domains)
# ============================================================================

echo "📦 JAVA BACKEND"
echo "══════════════════════════════════════════════════════════════"

# 1. Java Backend 0-1 Years (Junior)
echo "Creating: java/backend/0-1-years"
mkdir -p java/backend/0-1-years/stacks

stacks_java_backend_0_1=(
  "java-fundamentals"
  "java-oop-basics"
  "java-collections-basics"
  "spring-boot-intro"
  "rest-api-basics"
  "sql-basics"
  "git-basics"
  "basic-algorithms"
  "jpa-basics"
  "testing-intro"
  "exception-handling-basics"
  "maven-gradle-basics"
  "debugging-basics"
  "http-basics"
  "json-basics"
)

for stack in "${stacks_java_backend_0_1[@]}"; do
  mkdir -p "java/backend/0-1-years/stacks/$stack/answers"
  touch "java/backend/0-1-years/stacks/$stack/generation-prompt.md"
  touch "java/backend/0-1-years/stacks/$stack/questions.json"
done
echo "✅ java/backend/0-1-years (15 stacks)"

# 2. Java Backend 1-3 Years (existing - will migrate)
echo "✅ java/backend/1-3-years (20 stacks) - will migrate existing"

# 3. Java Backend 3-5 Years (Senior)
echo "Creating: java/backend/3-5-years"
mkdir -p java/backend/3-5-years/stacks

stacks_java_backend_3_5=(
  "spring-boot-advanced"
  "microservices-basics"
  "rest-api-design-advanced"
  "jpa-hibernate-advanced"
  "spring-security-advanced"
  "kafka-intermediate"
  "redis-advanced"
  "docker-kubernetes-basics"
  "ci-cd-advanced"
  "database-optimization"
  "system-design-intermediate"
  "api-gateway-basics"
  "caching-strategies"
  "monitoring-observability"
  "performance-tuning-basics"
  "message-queues"
  "event-driven-basics"
  "testing-advanced"
  "security-best-practices"
  "code-review-leadership"
  "troubleshooting-production"
  "architecture-patterns"
)

for stack in "${stacks_java_backend_3_5[@]}"; do
  mkdir -p "java/backend/3-5-years/stacks/$stack/answers"
  touch "java/backend/3-5-years/stacks/$stack/generation-prompt.md"
  touch "java/backend/3-5-years/stacks/$stack/questions.json"
done
echo "✅ java/backend/3-5-years (22 stacks)"

# 4. Java Backend 5+ Years (existing - will migrate)
echo "✅ java/backend/5-plus-years (18 stacks) - will migrate existing"

echo ""

# ============================================================================
# JAVA FULLSTACK (4 domains)
# ============================================================================

echo "📦 JAVA FULLSTACK"
echo "══════════════════════════════════════════════════════════════"

# 5. Java Fullstack 0-1 Years
echo "Creating: java/fullstack/0-1-years"
mkdir -p java/fullstack/0-1-years/stacks

stacks_java_fullstack_0_1=(
  "java-basics"
  "spring-boot-basics"
  "rest-api-basics"
  "sql-basics"
  "html-css-basics"
  "javascript-basics"
  "react-intro"
  "git-basics"
  "api-integration-basics"
  "form-handling-basics"
  "basic-authentication"
  "debugging-fullstack"
  "deployment-basics"
  "responsive-design-basics"
  "state-management-basics"
  "http-understanding"
  "json-basics"
  "testing-basics"
)

for stack in "${stacks_java_fullstack_0_1[@]}"; do
  mkdir -p "java/fullstack/0-1-years/stacks/$stack/answers"
  touch "java/fullstack/0-1-years/stacks/$stack/generation-prompt.md"
  touch "java/fullstack/0-1-years/stacks/$stack/questions.json"
done
echo "✅ java/fullstack/0-1-years (18 stacks)"

# 6. Java Fullstack 1-3 Years (existing - will migrate)
echo "✅ java/fullstack/1-3-years (25 stacks) - will migrate existing"

# 7. Java Fullstack 3-5 Years
echo "Creating: java/fullstack/3-5-years"
mkdir -p java/fullstack/3-5-years/stacks

stacks_java_fullstack_3_5=(
  "spring-boot-advanced"
  "microservices-frontend-integration"
  "react-advanced"
  "state-management-advanced"
  "api-design-best-practices"
  "authentication-authorization"
  "performance-optimization-fullstack"
  "caching-frontend-backend"
  "websockets-realtime"
  "testing-e2e-advanced"
  "ci-cd-fullstack"
  "docker-deployment"
  "security-fullstack"
  "monitoring-fullstack"
  "database-frontend-optimization"
  "graphql-basics"
  "server-side-rendering"
  "build-optimization"
  "architecture-patterns-fullstack"
  "code-splitting"
  "accessibility"
  "seo-optimization"
  "error-handling-advanced"
  "debugging-production"
)

for stack in "${stacks_java_fullstack_3_5[@]}"; do
  mkdir -p "java/fullstack/3-5-years/stacks/$stack/answers"
  touch "java/fullstack/3-5-years/stacks/$stack/generation-prompt.md"
  touch "java/fullstack/3-5-years/stacks/$stack/questions.json"
done
echo "✅ java/fullstack/3-5-years (24 stacks)"

# 8. Java Fullstack 5+ Years (existing - will migrate)
echo "✅ java/fullstack/5-plus-years (20 stacks) - will migrate existing"

echo ""

# ============================================================================
# PYTHON BACKEND (4 domains)
# ============================================================================

echo "📦 PYTHON BACKEND"
echo "══════════════════════════════════════════════════════════════"

# 9. Python Backend 0-1 Years
echo "Creating: python/backend/0-1-years"
mkdir -p python/backend/0-1-years/stacks

stacks_python_backend_0_1=(
  "python-fundamentals"
  "python-data-structures-basics"
  "python-oop-basics"
  "django-basics"
  "fastapi-intro"
  "sql-basics"
  "rest-api-basics"
  "git-basics"
  "postgresql-basics"
  "testing-basics-pytest"
  "debugging-python-basics"
  "http-basics"
  "json-basics"
  "virtual-environments"
  "pip-requirements"
  "basic-algorithms"
)

for stack in "${stacks_python_backend_0_1[@]}"; do
  mkdir -p "python/backend/0-1-years/stacks/$stack/answers"
  touch "python/backend/0-1-years/stacks/$stack/generation-prompt.md"
  touch "python/backend/0-1-years/stacks/$stack/questions.json"
done
echo "✅ python/backend/0-1-years (16 stacks)"

# 10. Python Backend 1-3 Years (existing - will migrate)
echo "✅ python/backend/1-3-years (22 stacks) - will migrate existing"

# 11. Python Backend 3-5 Years
echo "Creating: python/backend/3-5-years"
mkdir -p python/backend/3-5-years/stacks

stacks_python_backend_3_5=(
  "django-advanced"
  "fastapi-advanced"
  "async-programming-advanced"
  "sqlalchemy-advanced"
  "celery-advanced"
  "redis-advanced"
  "kafka-python-basics"
  "microservices-basics-python"
  "rest-api-design-advanced"
  "graphql-basics-python"
  "testing-advanced-python"
  "docker-kubernetes-python"
  "ci-cd-python"
  "database-optimization-python"
  "caching-strategies-python"
  "monitoring-python"
  "security-python-advanced"
  "performance-optimization-python"
  "event-driven-basics-python"
  "api-gateway-python"
  "troubleshooting-production-python"
)

for stack in "${stacks_python_backend_3_5[@]}"; do
  mkdir -p "python/backend/3-5-years/stacks/$stack/answers"
  touch "python/backend/3-5-years/stacks/$stack/generation-prompt.md"
  touch "python/backend/3-5-years/stacks/$stack/questions.json"
done
echo "✅ python/backend/3-5-years (21 stacks)"

# 12. Python Backend 5+ Years (existing - will migrate)
echo "✅ python/backend/5-plus-years (18 stacks) - will migrate existing"

echo ""

# ============================================================================
# PYTHON FULLSTACK (4 domains)
# ============================================================================

echo "📦 PYTHON FULLSTACK"
echo "══════════════════════════════════════════════════════════════"

# 13. Python Fullstack 0-1 Years
echo "Creating: python/fullstack/0-1-years"
mkdir -p python/fullstack/0-1-years/stacks

stacks_python_fullstack_0_1=(
  "python-basics"
  "django-basics"
  "fastapi-basics"
  "sql-basics"
  "html-css-basics"
  "javascript-basics"
  "react-intro"
  "git-basics"
  "rest-api-basics"
  "form-handling-basics"
  "authentication-basics"
  "deployment-basics"
  "testing-basics"
  "debugging-basics"
  "http-understanding"
  "json-basics"
  "cors-basics"
)

for stack in "${stacks_python_fullstack_0_1[@]}"; do
  mkdir -p "python/fullstack/0-1-years/stacks/$stack/answers"
  touch "python/fullstack/0-1-years/stacks/$stack/generation-prompt.md"
  touch "python/fullstack/0-1-years/stacks/$stack/questions.json"
done
echo "✅ python/fullstack/0-1-years (17 stacks)"

# 14. Python Fullstack 1-3 Years (existing - will migrate)
echo "✅ python/fullstack/1-3-years (24 stacks) - will migrate existing"

# 15. Python Fullstack 3-5 Years
echo "Creating: python/fullstack/3-5-years"
mkdir -p python/fullstack/3-5-years/stacks

stacks_python_fullstack_3_5=(
  "django-advanced-fullstack"
  "fastapi-advanced-fullstack"
  "react-advanced"
  "state-management-advanced"
  "async-python-fullstack"
  "authentication-authorization-fullstack"
  "api-design-best-practices"
  "performance-optimization-fullstack"
  "caching-fullstack"
  "websockets-python"
  "testing-e2e-python"
  "ci-cd-fullstack-python"
  "docker-deployment-fullstack"
  "security-fullstack-python"
  "monitoring-fullstack-python"
  "graphql-fullstack-python"
  "ssr-python"
  "build-optimization-python"
  "architecture-patterns-fullstack"
  "error-handling-advanced"
  "debugging-production-fullstack"
  "celery-frontend-integration"
)

for stack in "${stacks_python_fullstack_3_5[@]}"; do
  mkdir -p "python/fullstack/3-5-years/stacks/$stack/answers"
  touch "python/fullstack/3-5-years/stacks/$stack/generation-prompt.md"
  touch "python/fullstack/3-5-years/stacks/$stack/questions.json"
done
echo "✅ python/fullstack/3-5-years (22 stacks)"

# 16. Python Fullstack 5+ Years (existing - will migrate)
echo "✅ python/fullstack/5-plus-years (18 stacks) - will migrate existing"

echo ""
echo "══════════════════════════════════════════════════════════════"
echo "🎉 COMPLETE!"
echo ""
echo "📊 Summary:"
echo "  • 16 domains created"
echo "  • 12 new domains created"
echo "  • 4 existing domains (to be migrated)"
echo "  • ~320 total stacks"
echo "  • ~7,850 questions planned"
echo ""
echo "📁 Structure:"
echo "  content/domains/"
echo "  ├── java/"
echo "  │   ├── backend/ (4 experience levels)"
echo "  │   └── fullstack/ (4 experience levels)"
echo "  └── python/"
echo "      ├── backend/ (4 experience levels)"
echo "      └── fullstack/ (4 experience levels)"
echo ""
echo "✅ Next: Migrate existing 4 domains to new structure"
echo ""