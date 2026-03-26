-- Quick Test Seed - Simplified version matching actual schema
-- Run this to test UI with sample data

-- 1. Experience Levels (simple version)
INSERT INTO experience_levels (label, min_years, max_years) VALUES
    ('0-1', 0, 1),
    ('1-3', 1, 3),
    ('3-5', 3, 5),
    ('5+', 5, 20)
ON CONFLICT DO NOTHING;

-- 2. Domains (using foreign keys)
INSERT INTO domains (name, slug, description, language_id, track_id, experience_id)
SELECT
    'Java Backend 1-3', 'java-backend-1-3', 'Java Backend for 1-3 years',
    l.id, t.id, e.id
FROM languages l, tracks t, experience_levels e
WHERE l.slug = 'java' AND t.slug = 'backend' AND e.label = '1-3'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO domains (name, slug, description, language_id, track_id, experience_id)
SELECT
    'Java Backend 3-5', 'java-backend-3-5', 'Java Backend for 3-5 years',
    l.id, t.id, e.id
FROM languages l, tracks t, experience_levels e
WHERE l.slug = 'java' AND t.slug = 'backend' AND e.label = '3-5'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO domains (name, slug, description, language_id, track_id, experience_id)
SELECT
    'Python Backend 1-3', 'python-backend-1-3', 'Python Backend for 1-3 years',
    l.id, t.id, e.id
FROM languages l, tracks t, experience_levels e
WHERE l.slug = 'python' AND t.slug = 'backend' AND e.label = '1-3'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO domains (name, slug, description, language_id, track_id, experience_id)
SELECT
    'Frontend React 1-3', 'frontend-react-1-3', 'React Frontend for 1-3 years',
    l.id, t.id, e.id
FROM languages l, tracks t, experience_levels e
WHERE l.slug = 'react' AND t.slug = 'frontend' AND e.label = '1-3'
ON CONFLICT (slug) DO NOTHING;

-- 3. Tech Stacks (no category field in schema)
INSERT INTO tech_stacks (name, slug, description) VALUES
    ('Spring Boot', 'spring-boot', 'Spring Boot framework'),
    ('JPA/Hibernate', 'jpa-hibernate', 'Java Persistence API'),
    ('REST API', 'rest-api', 'RESTful API design'),
    ('Docker', 'docker', 'Docker containerization'),
    ('PostgreSQL', 'postgresql', 'PostgreSQL database'),
    ('Django', 'django', 'Django Python framework'),
    ('FastAPI', 'fastapi', 'FastAPI Python framework'),
    ('React', 'react', 'React JavaScript library'),
    ('Next.js', 'nextjs', 'Next.js React framework'),
    ('TypeScript', 'typescript', 'TypeScript language')
ON CONFLICT (slug) DO NOTHING;

-- 4. Domain-Stack Mapping (link domains to stacks)
INSERT INTO domain_stack_map (domain_id, stack_id)
SELECT d.id, s.id
FROM domains d, tech_stacks s
WHERE d.slug = 'java-backend-1-3'
  AND s.slug IN ('spring-boot', 'jpa-hibernate', 'rest-api', 'docker', 'postgresql')
ON CONFLICT DO NOTHING;

INSERT INTO domain_stack_map (domain_id, stack_id)
SELECT d.id, s.id
FROM domains d, tech_stacks s
WHERE d.slug = 'java-backend-3-5'
  AND s.slug IN ('spring-boot', 'jpa-hibernate', 'rest-api', 'docker', 'postgresql')
ON CONFLICT DO NOTHING;

INSERT INTO domain_stack_map (domain_id, stack_id)
SELECT d.id, s.id
FROM domains d, tech_stacks s
WHERE d.slug = 'python-backend-1-3'
  AND s.slug IN ('django', 'fastapi', 'postgresql', 'docker')
ON CONFLICT DO NOTHING;

INSERT INTO domain_stack_map (domain_id, stack_id)
SELECT d.id, s.id
FROM domains d, tech_stacks s
WHERE d.slug = 'frontend-react-1-3'
  AND s.slug IN ('react', 'nextjs', 'typescript')
ON CONFLICT DO NOTHING;

-- 5. Question-Stack Index (use question_stack_index table)
INSERT INTO question_stack_index (question_id, stack_id, order_index)
SELECT q.id, s.id, 1
FROM questions q, tech_stacks s
WHERE q.slug IN ('what-is-spring-boot', 'component-service-repository-difference',
                  'spring-boot-autoconfiguration', 'dependency-injection-spring')
  AND s.slug = 'spring-boot'
ON CONFLICT DO NOTHING;

INSERT INTO question_stack_index (question_id, stack_id, order_index)
SELECT q.id, s.id, 1
FROM questions q, tech_stacks s
WHERE q.slug IN ('react-virtual-dom', 'react-hooks-basics', 'props-vs-state',
                  'react-context-api', 'react-server-components')
  AND s.slug = 'react'
ON CONFLICT DO NOTHING;

-- Show results
SELECT 'Database populated successfully!' as status;
SELECT
    (SELECT COUNT(*) FROM languages) as languages,
    (SELECT COUNT(*) FROM tracks) as tracks,
    (SELECT COUNT(*) FROM experience_levels) as experience_levels,
    (SELECT COUNT(*) FROM domains) as domains,
    (SELECT COUNT(*) FROM tech_stacks) as stacks,
    (SELECT COUNT(*) FROM questions) as questions,
    (SELECT COUNT(*) FROM answer_sections) as answer_sections;