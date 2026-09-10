package com.interviewexplainer.backendapi.infrastructure.seeding;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Complete Seed Loader - Loads all taxonomy data from single JSON file
 * Loads: Languages, Tracks, Experience Levels, and all 64 Domains
 */
@Component
@Order(1) // Run first, before StackSeedLoader
public class CompleteSeedLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(CompleteSeedLoader.class);

    private final JdbcTemplate jdbcTemplate;
    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;

    public CompleteSeedLoader(JdbcTemplate jdbcTemplate, ResourceLoader resourceLoader, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.resourceLoader = resourceLoader;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("🌱 Starting complete seed data load...");

        // Check if already seeded
        if (isAlreadySeeded()) {
            log.info("✅ Database already contains data. Skipping seed.");
            return;
        }

        try {
            Resource resource = resourceLoader.getResource("classpath:content/complete-seed-data.json");
            JsonNode root = objectMapper.readTree(resource.getInputStream());

            loadLanguages(root.path("languages"));
            loadTracks(root.path("tracks"));
            loadExperienceLevels(root.path("experienceLevels"));
            loadDomains(root.path("domains"));

            log.info("✅ Complete seed data loaded successfully!");

            // Display summary
            displaySummary();

        } catch (Exception e) {
            log.error("❌ Seed loading failed: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void loadLanguages(JsonNode languages) {
        log.info("📦 Loading languages...");
        int count = 0;

        for (JsonNode lang : languages) {
            String name = lang.path("name").asText();
            String slug = lang.path("slug").asText();
            String description = lang.path("description").asText("");

            try {
                jdbcTemplate.update(
                    "INSERT INTO languages (name, slug, description) VALUES (?, ?, ?) " +
                    "ON CONFLICT (slug) DO NOTHING",
                    name, slug, description
                );
                count++;
            } catch (Exception e) {
                log.warn("Failed to insert language {}: {}", slug, e.getMessage());
            }
        }

        log.info("✅ Loaded {} languages", count);
    }

    private void loadTracks(JsonNode tracks) {
        log.info("📦 Loading tracks...");
        int count = 0;

        for (JsonNode track : tracks) {
            String name = track.path("name").asText();
            String slug = track.path("slug").asText();
            String description = track.path("description").asText("");

            try {
                jdbcTemplate.update(
                    "INSERT INTO tracks (name, slug, description) VALUES (?, ?, ?) " +
                    "ON CONFLICT (slug) DO NOTHING",
                    name, slug, description
                );
                count++;
            } catch (Exception e) {
                log.warn("Failed to insert track {}: {}", slug, e.getMessage());
            }
        }

        log.info("✅ Loaded {} tracks", count);
    }

    private void loadExperienceLevels(JsonNode levels) {
        log.info("📦 Loading experience levels...");
        int count = 0;

        for (JsonNode level : levels) {
            String label = level.path("label").asText();
            int minYears = level.path("minYears").asInt();
            int maxYears = level.path("maxYears").asInt();

            try {
                // Check if exists
                Integer existing = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM experience_levels WHERE label = ?",
                    Integer.class, label
                );

                if (existing == 0) {
                    jdbcTemplate.update(
                        "INSERT INTO experience_levels (label, min_years, max_years) VALUES (?, ?, ?)",
                        label, minYears, maxYears
                    );
                    count++;
                }
            } catch (Exception e) {
                log.warn("Failed to insert experience level {}: {}", label, e.getMessage());
            }
        }

        log.info("✅ Loaded {} experience levels", count);
    }

    private void loadDomains(JsonNode domains) {
        log.info("📦 Loading domains...");
        int count = 0;
        int failed = 0;

        for (JsonNode domain : domains) {
            String slug = domain.path("slug").asText();
            String name = domain.path("name").asText();
            String languageSlug = domain.path("language").asText();
            String trackSlug = domain.path("track").asText();
            String experienceLabel = domain.path("experience").asText();
            String description = domain.path("description").asText("");

            try {
                // Get foreign key IDs
                Integer languageId = jdbcTemplate.queryForObject(
                    "SELECT id FROM languages WHERE slug = ?",
                    Integer.class, languageSlug
                );

                Integer trackId = jdbcTemplate.queryForObject(
                    "SELECT id FROM tracks WHERE slug = ?",
                    Integer.class, trackSlug
                );

                Integer experienceId = jdbcTemplate.queryForObject(
                    "SELECT id FROM experience_levels WHERE label = ?",
                    Integer.class, experienceLabel
                );

                // Insert domain
                jdbcTemplate.update(
                    "INSERT INTO domains (name, slug, description, language_id, track_id, experience_id) " +
                    "VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (slug) DO NOTHING",
                    name, slug, description, languageId, trackId, experienceId
                );

                count++;

                if (count % 10 == 0) {
                    log.info("  Loaded {} domains...", count);
                }

            } catch (Exception e) {
                failed++;
                log.warn("Failed to insert domain {}: {}", slug, e.getMessage());
            }
        }

        log.info("✅ Loaded {} domains ({} failed)", count, failed);
    }

    private boolean isAlreadySeeded() {
        try {
            Integer domainCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM domains",
                Integer.class
            );
            return domainCount != null && domainCount > 0;
        } catch (Exception e) {
            return false;
        }
    }

    private void displaySummary() {
        try {
            Integer languages = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM languages", Integer.class);
            Integer tracks = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM tracks", Integer.class);
            Integer experiences = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM experience_levels", Integer.class);
            Integer domains = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM domains", Integer.class);

            log.info("📊 Seed Summary:");
            log.info("   Languages: {}", languages);
            log.info("   Tracks: {}", tracks);
            log.info("   Experience Levels: {}", experiences);
            log.info("   Domains: {}", domains);
        } catch (Exception e) {
            log.warn("Could not display summary: {}", e.getMessage());
        }
    }
}
