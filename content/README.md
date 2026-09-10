# Content Management System

This folder manages ALL generated content for the platform.

## Structure

```
content/
├── domains/              # Domain definitions with stack hierarchies
│   ├── java-backend/
│   │   ├── domain-config.json       # Complete domain structure
│   │   └── stack-definitions.json   # Detailed stack descriptions
│   ├── python-backend/
│   ├── react-frontend/
│   └── ...
│
├── questions/            # Generated questions by domain/stack
│   ├── java-backend/
│   │   ├── core-java/
│   │   │   ├── questions.json       # Questions only (Phase 1)
│   │   │   ├── answers.json         # Answers added (Phase 2)
│   │   │   └── metadata.json        # Generation metadata
│   │   ├── spring-boot/
│   │   └── ...
│   └── ...
│
├── imports/              # SQL/Import scripts for database
│   ├── java-backend-core-java.sql
│   └── ...
│
└── logs/                 # Generation logs and tracking
    ├── generation-tracker.json
    └── 2026-03-27-generation.log
```

## Workflow

### Phase 1: Domain Structure Definition
1. Define complete domain structure in `domains/{domain}/`
2. List ALL necessary stacks with clear boundaries
3. Define stack dependencies and hierarchies

### Phase 2: Question Generation
1. Generate questions per stack using intelligent prompts
2. Ensure no overlap between stacks
3. Save to `questions/{domain}/{stack}/`

### Phase 3: Database Import
1. Generate SQL import scripts in `imports/`
2. Import to PostgreSQL database
3. Verify in production

## Principles

1. **No Overlap**: Questions in specialized stacks should NOT appear in generic stacks
2. **Clear Boundaries**: Each stack has clear scope
3. **Proper Depth**: Stacks cover all necessary topics, not surface-level
4. **Intelligent Scoping**: System understands domain hierarchy
## Schema

See [SCHEMA.md](SCHEMA.md) for the canonical question shape and
`scripts/validate_complete_qa.py` for the validator.
