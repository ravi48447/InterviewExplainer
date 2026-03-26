package com.interviewexplainer.backendapi.infrastructure.seeding;

import com.interviewexplainer.backendapi.infrastructure.seeding.content.IntelligentQuestionGenerator;
import com.interviewexplainer.backendapi.infrastructure.seeding.content.IntelligentQuestionGenerator.QuestionContent;
import com.interviewexplainer.backendapi.infrastructure.seeding.content.IntelligentQuestionGenerator.AnswerSection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * Question Seed Loader - Generates and loads 10 essential questions per stack
 * Experience-level appropriate, professional quality content
 */
@Component
@Order(3) // Run after CompleteSeedLoader and StackSeedLoader
public class QuestionSeedLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(QuestionSeedLoader.class);

    private final JdbcTemplate jdbcTemplate;
    private final IntelligentQuestionGenerator questionGenerator;

    public QuestionSeedLoader(JdbcTemplate jdbcTemplate, IntelligentQuestionGenerator questionGenerator) {
        this.jdbcTemplate = jdbcTemplate;
        this.questionGenerator = questionGenerator;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("📝 Starting intelligent question generation...");

        // Check if already seeded
        if (isAlreadySeeded()) {
            log.info("✅ Questions already loaded. Skipping seed.");
            return;
        }

        try {
            // Get all stacks with their domains
            List<StackWithDomain> stacks = getStacksWithDomains();

            log.info("📦 Found {} stacks across all domains", stacks.size());
            log.info("🎯 Generating 10 questions per stack (intelligent, experience-aware)...");

            int totalQuestions = 0;
            int totalSections = 0;
            int stacksProcessed = 0;

            for (StackWithDomain stack : stacks) {
                try {
                    // Generate 10 intelligent questions for this stack in this domain
                    List<QuestionContent> questions = questionGenerator.generateQuestionsForStack(
                        stack.stackSlug,
                        stack.stackName,
                        stack.domainSlug,
                        stack.experienceLevel
                    );

                    // Insert questions and their sections
                    for (QuestionContent question : questions) {
                        Long questionId = insertQuestion(question, stack);
                        if (questionId != null) {
                            int sectionCount = insertAnswerSections(questionId, question);
                            insertQuestionStackMapping(questionId, stack.stackId);

                            totalQuestions++;
                            totalSections += sectionCount;
                        }
                    }

                    stacksProcessed++;

                    // Log progress every 20 stacks
                    if (stacksProcessed % 20 == 0) {
                        log.info("  Progress: {} stacks processed, {} questions generated...",
                            stacksProcessed, totalQuestions);
                    }

                } catch (Exception e) {
                    log.warn("Failed to generate questions for stack {}: {}",
                        stack.stackSlug, e.getMessage());
                }
            }

            log.info("✅ Generated {} questions with {} answer sections for {} stacks",
                totalQuestions, totalSections, stacksProcessed);

            displaySummary();

        } catch (Exception e) {
            log.error("❌ Question generation failed: {}", e.getMessage(), e);
            throw e;
        }
    }

    private List<StackWithDomain> getStacksWithDomains() {
        String sql = """
            SELECT DISTINCT
                ts.id as stack_id,
                ts.slug as stack_slug,
                ts.name as stack_name,
                d.id as domain_id,
                d.slug as domain_slug,
                el.label as experience_level,
                el.min_years as min_years
            FROM tech_stacks ts
            JOIN domain_stack_map dsm ON ts.id = dsm.stack_id
            JOIN domains d ON dsm.domain_id = d.id
            JOIN experience_levels el ON d.experience_id = el.id
            ORDER BY ts.slug, el.min_years
            LIMIT 50
            """; // Start with first 50 stack-domain combinations for testing

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            StackWithDomain s = new StackWithDomain();
            s.stackId = rs.getLong("stack_id");
            s.stackSlug = rs.getString("stack_slug");
            s.stackName = rs.getString("stack_name");
            s.domainId = rs.getLong("domain_id");
            s.domainSlug = rs.getString("domain_slug");
            s.experienceLevel = rs.getString("experience_level");
            return s;
        });
    }

    private Long insertQuestion(QuestionContent question, StackWithDomain stack) {
        try {
            // Check if question already exists
            Integer existing = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM questions WHERE slug = ?",
                Integer.class, question.getSlug()
            );

            if (existing > 0) {
                return jdbcTemplate.queryForObject(
                    "SELECT id FROM questions WHERE slug = ?",
                    Long.class, question.getSlug()
                );
            }

            // Insert new question
            jdbcTemplate.update(
                "INSERT INTO questions (title, slug, difficulty, estimated_read_time, is_published) " +
                "VALUES (?, ?, CAST(? AS question_difficulty), ?, TRUE)",
                question.getTitle(),
                question.getSlug(),
                question.getDifficulty().toLowerCase(),
                calculateReadTime(question)
            );

            return jdbcTemplate.queryForObject(
                "SELECT id FROM questions WHERE slug = ?",
                Long.class, question.getSlug()
            );

        } catch (Exception e) {
            log.warn("Failed to insert question {}: {}", question.getSlug(), e.getMessage());
            return null;
        }
    }

    private int insertAnswerSections(Long questionId, QuestionContent question) {
        // Check if sections already exist for this question
        Integer existingSections = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM answer_sections WHERE question_id = ?",
            Integer.class, questionId
        );

        if (existingSections != null && existingSections > 0) {
            return existingSections; // Sections already exist, skip
        }

        int count = 0;
        for (AnswerSection section : question.getSections()) {
            try {
                jdbcTemplate.update(
                    "INSERT INTO answer_sections (question_id, section_type, content, section_order) " +
                    "VALUES (?, ?, ?, ?)",
                    questionId,
                    section.getType().name(),
                    section.getContent(),
                    section.getOrder()
                );
                count++;
            } catch (Exception e) {
                log.warn("Failed to insert section {} for question {}: {}",
                    section.getType(), questionId, e.getMessage());
            }
        }
        return count;
    }

    private void insertQuestionStackMapping(Long questionId, Long stackId) {
        try {
            jdbcTemplate.update(
                "INSERT INTO question_stack_index (question_id, stack_id, order_index) " +
                "VALUES (?, ?, ?)",
                questionId, stackId, 0
            );
        } catch (Exception e) {
            log.warn("Failed to map question {} to stack {}: {}",
                questionId, stackId, e.getMessage());
        }
    }

    private int calculateReadTime(QuestionContent question) {
        int totalWords = 0;
        for (AnswerSection section : question.getSections()) {
            totalWords += section.getContent().split("\\s+").length;
        }
        // Average reading speed: 200 words per minute
        int minutes = (totalWords / 200) + 1;
        return Math.max(3, Math.min(minutes, 20)); // Between 3-20 minutes
    }

    private boolean isAlreadySeeded() {
        try {
            Integer questionCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM questions WHERE generation_status = 'generated' OR id > 20",
                Integer.class
            );
            return questionCount != null && questionCount > 0;
        } catch (Exception e) {
            return false;
        }
    }

    private void displaySummary() {
        try {
            Integer questions = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM questions", Integer.class);
            Integer sections = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM answer_sections", Integer.class);
            Integer stacks = jdbcTemplate.queryForObject(
                "SELECT COUNT(DISTINCT stack_id) FROM question_stack_index", Integer.class);

            log.info("📊 Question Seed Summary:");
            log.info("   Total Questions: {}", questions);
            log.info("   Total Answer Sections: {}", sections);
            log.info("   Stacks with Questions: {}", stacks);
            log.info("   Avg Sections per Question: {}", sections / Math.max(questions, 1));
        } catch (Exception e) {
            log.warn("Could not display summary: {}", e.getMessage());
        }
    }

    private static class StackWithDomain {
        Long stackId;
        String stackSlug;
        String stackName;
        Long domainId;
        String domainSlug;
        String experienceLevel;
    }
}