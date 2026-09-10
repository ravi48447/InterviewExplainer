#!/bin/bash

# Create complete domain structure for all 8 domains

cd "$(dirname "$0")/../content/domains"

echo "🚀 Creating 8 Complete Domains..."
echo ""

# ============================================================================
# 1. JAVA BACKEND 5+ YEARS
# ============================================================================
echo "📁 Creating: java-backend-5-plus"
mkdir -p java-backend-5-plus/stacks

stacks_java_backend_5plus=(
  "microservices-architecture"
  "distributed-systems-design"
  "spring-cloud-ecosystem"
  "api-gateway-design"
  "event-driven-architecture"
  "database-scaling-sharding"
  "jvm-performance-tuning"
  "kubernetes-orchestration"
  "service-mesh-patterns"
  "caching-strategies-advanced"
  "message-queue-architecture"
  "observability-monitoring"
  "security-architecture"
  "data-consistency-patterns"
  "resilience-patterns"
  "api-versioning-governance"
  "tech-leadership"
  "architecture-trade-offs"
)

for stack in "${stacks_java_backend_5plus[@]}"; do
  mkdir -p "java-backend-5-plus/stacks/$stack/answers"
  touch "java-backend-5-plus/stacks/$stack/generation-prompt.md"
  touch "java-backend-5-plus/stacks/$stack/questions.json"
done
echo "✅ Created 18 stacks for java-backend-5-plus"
echo ""

# ============================================================================
# 2. JAVA FULLSTACK 1-3 YEARS
# ============================================================================
echo "📁 Creating: java-fullstack-1-3"
mkdir -p java-fullstack-1-3/stacks

stacks_java_fullstack_1_3=(
  "spring-boot-fullstack"
  "rest-api-basics"
  "jpa-database-basics"
  "spring-security-auth"
  "file-upload-processing"
  "java-collections"
  "testing-backend"
  "api-documentation"
  "caching-basics"
  "background-jobs"
  "email-notifications"
  "deployment-basics"
  "react-fundamentals"
  "react-hooks-state"
  "api-integration-frontend"
  "form-validation"
  "routing-navigation"
  "component-design"
  "css-styling-basics"
  "frontend-testing"
  "frontend-backend-integration"
  "authentication-flow"
  "state-management"
  "debugging-fullstack"
  "deployment-fullstack"
)

for stack in "${stacks_java_fullstack_1_3[@]}"; do
  mkdir -p "java-fullstack-1-3/stacks/$stack/answers"
  touch "java-fullstack-1-3/stacks/$stack/generation-prompt.md"
  touch "java-fullstack-1-3/stacks/$stack/questions.json"
done
echo "✅ Created 25 stacks for java-fullstack-1-3"
echo ""

# ============================================================================
# 3. JAVA FULLSTACK 5+ YEARS
# ============================================================================
echo "📁 Creating: java-fullstack-5-plus"
mkdir -p java-fullstack-5-plus/stacks

stacks_java_fullstack_5plus=(
  "fullstack-architecture-patterns"
  "frontend-backend-separation"
  "spa-architecture"
  "api-design-advanced"
  "performance-optimization-fullstack"
  "security-fullstack"
  "scalability-patterns"
  "deployment-strategies"
  "microservices-frontend-integration"
  "graphql-architecture"
  "websockets-realtime"
  "serverless-patterns"
  "database-optimization-advanced"
  "caching-cdn-strategies"
  "react-advanced-patterns"
  "state-management-advanced"
  "build-optimization"
  "micro-frontends"
  "accessibility-performance"
  "frontend-monitoring"
)

for stack in "${stacks_java_fullstack_5plus[@]}"; do
  mkdir -p "java-fullstack-5-plus/stacks/$stack/answers"
  touch "java-fullstack-5-plus/stacks/$stack/generation-prompt.md"
  touch "java-fullstack-5-plus/stacks/$stack/questions.json"
done
echo "✅ Created 20 stacks for java-fullstack-5-plus"
echo ""

# ============================================================================
# 4. PYTHON BACKEND 1-3 YEARS
# ============================================================================
echo "📁 Creating: python-backend-1-3"
mkdir -p python-backend-1-3/stacks

stacks_python_backend_1_3=(
  "python-fundamentals"
  "python-data-structures"
  "python-oop-concepts"
  "python-async-programming"
  "python-testing-pytest"
  "django-basics"
  "django-rest-framework"
  "fastapi-basics"
  "flask-basics"
  "sqlalchemy-orm"
  "postgresql-basics"
  "database-migrations"
  "rest-api-python"
  "api-authentication"
  "api-documentation-python"
  "third-party-api-integration"
  "celery-background-tasks"
  "redis-python"
  "docker-python"
  "git-python-projects"
  "logging-debugging-python"
  "deployment-python-apps"
)

for stack in "${stacks_python_backend_1_3[@]}"; do
  mkdir -p "python-backend-1-3/stacks/$stack/answers"
  touch "python-backend-1-3/stacks/$stack/generation-prompt.md"
  touch "python-backend-1-3/stacks/$stack/questions.json"
done
echo "✅ Created 22 stacks for python-backend-1-3"
echo ""

# ============================================================================
# 5. PYTHON BACKEND 5+ YEARS
# ============================================================================
echo "📁 Creating: python-backend-5-plus"
mkdir -p python-backend-5-plus/stacks

stacks_python_backend_5plus=(
  "microservices-python"
  "async-architecture-advanced"
  "event-driven-python"
  "api-gateway-python"
  "service-communication-patterns"
  "django-advanced-patterns"
  "fastapi-advanced"
  "graphql-python"
  "grpc-python"
  "database-optimization-python"
  "caching-strategies-python"
  "data-pipeline-architecture"
  "nosql-databases-python"
  "performance-optimization-python"
  "concurrent-programming"
  "distributed-systems-python"
  "monitoring-observability-python"
  "python-at-scale"
)

for stack in "${stacks_python_backend_5plus[@]}"; do
  mkdir -p "python-backend-5-plus/stacks/$stack/answers"
  touch "python-backend-5-plus/stacks/$stack/generation-prompt.md"
  touch "python-backend-5-plus/stacks/$stack/questions.json"
done
echo "✅ Created 18 stacks for python-backend-5-plus"
echo ""

# ============================================================================
# 6. PYTHON FULLSTACK 1-3 YEARS
# ============================================================================
echo "📁 Creating: python-fullstack-1-3"
mkdir -p python-fullstack-1-3/stacks

stacks_python_fullstack_1_3=(
  "django-fullstack"
  "fastapi-react-integration"
  "rest-api-python-fullstack"
  "sqlalchemy-fullstack"
  "authentication-python"
  "file-handling-python"
  "celery-tasks"
  "python-testing-fullstack"
  "websockets-python"
  "api-docs-python"
  "react-python-backend"
  "react-hooks-fullstack"
  "api-integration-react"
  "form-handling-react"
  "routing-react"
  "state-management-react"
  "component-patterns"
  "css-frameworks"
  "frontend-testing-react"
  "cors-integration"
  "auth-flow-fullstack"
  "deployment-python-react"
  "debugging-fullstack-python"
  "environment-management"
)

for stack in "${stacks_python_fullstack_1_3[@]}"; do
  mkdir -p "python-fullstack-1-3/stacks/$stack/answers"
  touch "python-fullstack-1-3/stacks/$stack/generation-prompt.md"
  touch "python-fullstack-1-3/stacks/$stack/questions.json"
done
echo "✅ Created 24 stacks for python-fullstack-1-3"
echo ""

# ============================================================================
# 7. PYTHON FULLSTACK 5+ YEARS
# ============================================================================
echo "📁 Creating: python-fullstack-5-plus"
mkdir -p python-fullstack-5-plus/stacks

stacks_python_fullstack_5plus=(
  "fullstack-architecture-python"
  "microservices-fullstack-python"
  "api-design-architecture"
  "scalability-python-fullstack"
  "security-architecture-fullstack"
  "deployment-architecture"
  "async-patterns-advanced"
  "graphql-python-advanced"
  "event-driven-fullstack"
  "data-architecture"
  "caching-cdn-python"
  "monitoring-python-fullstack"
  "react-architecture-advanced"
  "state-management-architecture"
  "performance-frontend-advanced"
  "ssr-ssg-patterns"
  "micro-frontends-python"
  "frontend-build-optimization"
)

for stack in "${stacks_python_fullstack_5plus[@]}"; do
  mkdir -p "python-fullstack-5-plus/stacks/$stack/answers"
  touch "python-fullstack-5-plus/stacks/$stack/generation-prompt.md"
  touch "python-fullstack-5-plus/stacks/$stack/questions.json"
done
echo "✅ Created 18 stacks for python-fullstack-5-plus"
echo ""

# ============================================================================
echo ""
echo "🎉 COMPLETE!"
echo ""
echo "📊 Summary:"
echo "  • 8 domains created"
echo "  • 165 total stacks"
echo "  • ~4,045 questions planned"
echo ""
echo "✅ Structure ready for:"
echo "  1. java-backend-5-plus (18 stacks)"
echo "  2. java-fullstack-1-3 (25 stacks)"
echo "  3. java-fullstack-5-plus (20 stacks)"
echo "  4. python-backend-1-3 (22 stacks)"
echo "  5. python-backend-5-plus (18 stacks)"
echo "  6. python-fullstack-1-3 (24 stacks)"
echo "  7. python-fullstack-5-plus (18 stacks)"
echo ""
echo "📁 Next: Create domain-definition.md and domain-config.json for each"
echo ""