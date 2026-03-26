-- Table Comments (Step 1 of Audit)
COMMENT ON TABLE languages IS 'Supported programming languages';
COMMENT ON TABLE tracks IS 'Learning path tracks (e.g., Backend, Frontend)';
COMMENT ON TABLE experience_levels IS 'Experience level categories (e.g., 1-3 years)';
COMMENT ON TABLE domains IS 'Specific preparation paths combining language, track, and experience';
COMMENT ON TABLE tech_stacks IS 'Reusable technical skill stacks across domains';
COMMENT ON TABLE domain_stack_map IS 'Mapping of tech stacks to specific domains with ordering';
COMMENT ON TABLE questions IS 'Individual interview questions optimized for SEO';
COMMENT ON TABLE question_stack_map IS 'Ordering and mapping of questions within a stack curriculum';
COMMENT ON TABLE concepts IS 'Knowledge graph nodes representing core concepts';
COMMENT ON TABLE question_concepts IS 'Tags grouping questions by concept';
COMMENT ON TABLE answer_sections IS 'Structured answer components (interviewer expectation, core concepts, etc.)';
COMMENT ON TABLE tags IS 'General categorization tags for questions';
COMMENT ON TABLE question_tags IS 'Mapping of questions to general tags';
COMMENT ON TABLE question_relations IS 'Directed graph relationships between questions (prerequisite, related, etc.)';
COMMENT ON TABLE question_page_cache IS 'Materialized JSON view of a question page for extreme performance';
COMMENT ON TABLE question_views IS 'Analytics tracking daily views per question';
