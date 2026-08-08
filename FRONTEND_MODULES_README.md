# Frontend Module Structure

## Overview
Frontend has been restructured to align with backend modules for consistency.

## Module Structure

```
frontend/
├── modules/                    # Feature modules (NEW)
│   ├── auth/
│   │   ├── api/               # authApi.ts
│   │   ├── hooks/             # useAuth.ts
│   │   ├── types/             # User, AuthState
│   │   └── components/        # Login, Signup (to be migrated)
│   ├── content/
│   │   ├── api/               # contentApi.ts
│   │   ├── types/             # Domain, Question, TechStack
│   │   ├── hooks/             # useQuestion, useDomain (to be created)
│   │   └── components/        # QuestionCard, DomainList (to be migrated)
│   ├── learning/
│   │   ├── api/               # learningApi.ts
│   │   ├── types/             # Progress, Bookmark, Streak
│   │   └── components/        # ProgressTracker (to be migrated)
│   ├── analytics/
│   │   ├── api/               # analyticsApi.ts
│   │   ├── types/             # Dashboard, StackPerformance
│   │   └── components/        # DashboardCharts (to be migrated)
│   └── search/
│       ├── api/               # searchApi.ts
│       ├── types/             # SearchResult, Recommendation
│       └── components/        # SearchBar (to be migrated)
│
├── shared/                     # Shared utilities
│   ├── components/            # Reusable UI components
│   ├── hooks/                 # Shared hooks
│   ├── lib/                   # api-client, utils
│   └── types/                 # Common types
│
├── app/                       # Next.js 13+ app directory
├── components/                # Legacy components (to be migrated)
└── lib/                       # Legacy lib (to be migrated)
```

## New API Clients

### Auth Module
```typescript
import { authApi } from '@/modules/auth/api/authApi';

// Usage
await authApi.login({ email, password });
await authApi.signup({ name, email, password, experienceBand });
await authApi.getMe();
```

### Content Module
```typescript
import { contentApi } from '@/modules/content/api/contentApi';

// Usage
await contentApi.getDomains();
await contentApi.getQuestion(slug);
await contentApi.getStacksByDomain(domainSlug);
```

### Learning Module
```typescript
import { learningApi } from '@/modules/learning/api/learningApi';

// Usage
await learningApi.markQuestionCompleted(questionId);
await learningApi.addBookmark(questionId);
await learningApi.getStreak();
```

### Analytics Module
```typescript
import { analyticsApi } from '@/modules/analytics/api/analyticsApi';

// Usage
await analyticsApi.getDashboard();
await analyticsApi.getWeakAreas();
```

### Search Module
```typescript
import { searchApi } from '@/modules/search/api/searchApi';

// Usage
await searchApi.searchQuestions(query);
await searchApi.getRecommendations(questionId);
```

## Migration Guide

### Step 1: Update API URLs
All API endpoints now use the new module-based routing:
- `/api/v2/*` → `/api/content/*`
- Add new endpoints: `/api/auth/*`, `/api/learning/*`, `/api/analytics/*`, `/api/search/*`

### Step 2: Use New API Clients
Replace direct fetch calls with module API clients:

**Before:**
```typescript
const res = await fetch('http://localhost:8080/api/v2/domains');
```

**After:**
```typescript
import { contentApi } from '@/modules/content/api/contentApi';
const domains = await contentApi.getDomains();
```

### Step 3: Migrate Components (Optional)
Move feature-specific components to their modules:
- `components/dashboard-content.tsx` → `modules/analytics/components/DashboardContent.tsx`
- `components/question-sidebar.tsx` → `modules/content/components/QuestionSidebar.tsx`

### Step 4: Update Imports
```typescript
// Old
import { Question } from '@/lib/api';

// New
import { Question } from '@/modules/content/types';
```

## Benefits

✅ **Consistency:** Matches backend module structure  
✅ **Clarity:** Clear ownership of features  
✅ **Scalability:** Easy to add new modules  
✅ **Type Safety:** Strongly typed APIs and data  
✅ **Maintainability:** Self-contained modules  

## Current Status

✅ Module structure created  
✅ API clients implemented  
✅ Type definitions created  
✅ useAuth hook created  
⏳ Component migration (optional)  
⏳ Legacy lib deprecation (optional)  

## Notes

- **Backward Compatibility:** Old `lib/api.ts` still works
- **Gradual Migration:** Migrate pages/components as needed
- **No Breaking Changes:** Both old and new APIs coexist
