-- Migration 018: Additional Composite Indexes for Performance
-- Designed for 500k questions, 3M answer sections, 10M relations

-- Navigation queries: get ordered questions in a stack
CREATE INDEX IF NOT EXISTS idx_qsm_nav
    ON question_stack_map(stack_id, order_index ASC)
    INCLUDE (question_id);

-- Domain landing page: domains by language
CREATE INDEX IF NOT EXISTS idx_domains_lang_track
    ON domains(language_id, track_id, experience_id);

-- Answer rendering: get all sections for a question quickly
CREATE INDEX IF NOT EXISTS idx_answer_sections_qid_ord
    ON answer_sections(question_id ASC, section_order ASC);

-- Related questions via concept graph
CREATE INDEX IF NOT EXISTS idx_qconcepts_cid
    ON question_concepts(concept_id, question_id);

-- Question views analytics: recent top pages
CREATE INDEX IF NOT EXISTS idx_views_date_count
    ON question_views(view_date DESC, views DESC);

-- Page cache lookup by slug
CREATE INDEX IF NOT EXISTS idx_cache_slug_lookup
    ON question_page_cache(slug);
