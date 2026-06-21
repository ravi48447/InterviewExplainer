-- V005: Migrate experience levels from 4-tier (0-1, 1-3, 3-5, 5+)
--        to 3-tier (beginner 0-2, intermediate 2-5, advanced 5+)
--
-- Old labels → New label mapping:
--   0-1  → beginner   (merged: 0-1 and 1-3 both become beginner)
--   1-3  → beginner
--   3-5  → intermediate
--   5+   → advanced

DO $$
DECLARE
    v_beginner_id     INT;
    v_intermediate_id INT;
    v_advanced_id     INT;
BEGIN
    -- ── Step 1: Insert the 3 canonical levels (idempotent) ─────────────────
    IF NOT EXISTS (SELECT 1 FROM experience_levels WHERE label = 'beginner') THEN
        INSERT INTO experience_levels (label, min_years, max_years) VALUES ('beginner', 0, 2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM experience_levels WHERE label = 'intermediate') THEN
        INSERT INTO experience_levels (label, min_years, max_years) VALUES ('intermediate', 2, 5);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM experience_levels WHERE label = 'advanced') THEN
        INSERT INTO experience_levels (label, min_years, max_years) VALUES ('advanced', 5, NULL);
    END IF;

    SELECT id INTO v_beginner_id     FROM experience_levels WHERE label = 'beginner'     LIMIT 1;
    SELECT id INTO v_intermediate_id FROM experience_levels WHERE label = 'intermediate' LIMIT 1;
    SELECT id INTO v_advanced_id     FROM experience_levels WHERE label = 'advanced'     LIMIT 1;

    -- ── Step 2: Re-point domain rows to new experience levels ────────────────
    UPDATE domains
    SET experience_id = v_beginner_id
    WHERE experience_id IN (SELECT id FROM experience_levels WHERE label IN ('0-1', '1-3'));

    UPDATE domains
    SET experience_id = v_intermediate_id
    WHERE experience_id IN (SELECT id FROM experience_levels WHERE label IN ('3-5'));

    UPDATE domains
    SET experience_id = v_advanced_id
    WHERE experience_id IN (SELECT id FROM experience_levels WHERE label IN ('5+'));

    -- ── Step 3: Delete old 4-tier experience level rows ──────────────────────
    DELETE FROM experience_levels WHERE label IN ('0-1', '1-3', '3-5', '5+');

    -- ── Step 4: Rename domain slugs to canonical level-word format ───────────
    -- Remove 0-1 duplicates (1-3 content is preferred; both map to beginner)
    -- First remove FK references from domain_stack_map for the duplicate %-0-1 domains
    DELETE FROM domain_stack_map
    WHERE domain_id IN (
        SELECT id FROM domains
        WHERE slug LIKE '%-0-1'
          AND EXISTS (
            SELECT 1 FROM domains d2
            WHERE d2.slug = regexp_replace(domains.slug, '-0-1$', '-beginner')
               OR d2.slug = regexp_replace(domains.slug, '-0-1$', '-1-3')
          )
    );

    DELETE FROM domains
    WHERE slug LIKE '%-0-1'
      AND EXISTS (
        SELECT 1 FROM domains d2
        WHERE d2.slug = regexp_replace(domains.slug, '-0-1$', '-beginner')
           OR d2.slug = regexp_replace(domains.slug, '-0-1$', '-1-3')
      );

    -- Rename %-1-3 → %-beginner (skip if target already exists)
    UPDATE domains
    SET slug = regexp_replace(slug, '-1-3$', '-beginner')
    WHERE slug ~ '-1-3$'
      AND NOT EXISTS (
        SELECT 1 FROM domains d2
        WHERE d2.slug = regexp_replace(domains.slug, '-1-3$', '-beginner')
      );

    -- Rename remaining %-0-1 → %-beginner
    UPDATE domains
    SET slug = regexp_replace(slug, '-0-1$', '-beginner')
    WHERE slug ~ '-0-1$'
      AND NOT EXISTS (
        SELECT 1 FROM domains d2
        WHERE d2.slug = regexp_replace(domains.slug, '-0-1$', '-beginner')
      );

    -- Rename %-3-5 → %-intermediate
    UPDATE domains
    SET slug = regexp_replace(slug, '-3-5$', '-intermediate')
    WHERE slug ~ '-3-5$'
      AND NOT EXISTS (
        SELECT 1 FROM domains d2
        WHERE d2.slug = regexp_replace(domains.slug, '-3-5$', '-intermediate')
      );

    -- Rename %-5+ → %-advanced  (escape the + in regex)
    UPDATE domains
    SET slug = regexp_replace(slug, '-5\+$', '-advanced')
    WHERE slug ~ '-5\+$'
      AND NOT EXISTS (
        SELECT 1 FROM domains d2
        WHERE d2.slug = regexp_replace(domains.slug, '-5\+$', '-advanced')
      );

END $$;
