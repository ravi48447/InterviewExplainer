package com.interviewexplainer.backendapi.infrastructure.seeding;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.ResourcePatternUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

/**
 * Data Seeder - Loads taxonomy data from JSON files after Flyway migrations
 * Runs automatically on application startup if tables are empty
 */
// Replaced by CompleteSeedLoader
// @Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final JdbcTemplate jdbcTemplate;
    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;

    public DataSeeder(JdbcTemplate jdbcTemplate, ResourceLoader resourceLoader, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.resourceLoader = resourceLoader;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("🌱 Checking if data seeding is needed...");

        // Check if domains table is empty
        Long domainCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM domains",
            Long.class
        );

        if (domainCount != null && domainCount > 0) {
            log.info("✅ Database already contains {} domains. Skipping seed.", domainCount);
            return;
        }

        log.info("📦 Database is empty. Starting data seed...");

        try {
            seedLanguages();
            seedTracks();
            seedExperienceLevels();
            seedDomains();
            seedStacks();

            log.info("✅ Data seeding completed successfully!");
        } catch (Exception e) {
            log.error("❌ Data seeding failed: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void seedLanguages() {
        log.info("Seeding languages...");
        Set<String> languages = Set.of(
            "Java", "Python", "Go", "C++", "Ruby", "React", "Angular", "JavaScript", "Na"
        );

        for (String lang : languages) {
            String slug = lang.toLowerCase().replace("+", "p");
            jdbcTemplate.update(
                "INSERT INTO languages (name, slug, description) VALUES (?, ?, ?) " +
                "ON CONFLICT (slug) DO NOTHING",
                lang, slug, lang + " programming language"
            );
        }
        log.info("✅ Seeded {} languages", languages.size());
    }

    private void seedTracks() {
        log.info("Seeding tracks...");
        Set<String> tracks = Set.of(
            "Backend", "Frontend", "Fullstack", "Data", "Devops", "Business"
        );

        for (String track : tracks) {
            String slug = track.toLowerCase();
            jdbcTemplate.update(
                "INSERT INTO tracks (name, slug, description) VALUES (?, ?, ?) " +
                "ON CONFLICT (slug) DO NOTHING",
                track, slug, track + " development track"
            );
        }
        log.info("✅ Seeded {} tracks", tracks.size());
    }

    private void seedExperienceLevels() {
        log.info("Seeding experience levels...");
        String[][] levels = {
            {"0-1", "0", "1"},
            {"1-3", "1", "3"},
            {"3-5", "3", "5"},
            {"5+", "5", "20"}
        };

        for (String[] level : levels) {
            // Check if exists first
            Integer existing = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM experience_levels WHERE label = ?",
                Integer.class, level[0]
            );
            if (existing == 0) {
                jdbcTemplate.update(
                    "INSERT INTO experience_levels (label, min_years, max_years) VALUES (?, ?, ?)",
                    level[0], Integer.parseInt(level[1]), Integer.parseInt(level[2])
                );
            }
        }
        log.info("✅ Seeded {} experience levels", levels.length);
    }

    private void seedDomains() throws IOException {
        log.info("Seeding domains from JSON files...");

        Resource[] resources = ResourcePatternUtils
            .getResourcePatternResolver(resourceLoader)
            .getResources("classpath:content/domains/*-final-1.0.json");

        int count = 0;
        for (Resource resource : resources) {
            try {
                JsonNode root = objectMapper.readTree(resource.getInputStream());
                JsonNode domainsArray = root.path("domains");

                for (JsonNode domainNode : domainsArray) {
                    String slug = domainNode.path("slug").asText();
                    String language = domainNode.path("language").asText();
                    String track = domainNode.path("track").asText();
                    String experience = domainNode.path("experience").asText();

                    // Build name from slug
                    String name = slug.replace("-", " ");
                    name = Character.toUpperCase(name.charAt(0)) + name.substring(1);

                    // Get foreign key IDs
                    Integer languageId = jdbcTemplate.queryForObject(
                        "SELECT id FROM languages WHERE slug = ?", Integer.class, language
                    );
                    Integer trackId = jdbcTemplate.queryForObject(
                        "SELECT id FROM tracks WHERE slug = ?", Integer.class, track
                    );
                    Integer experienceId = jdbcTemplate.queryForObject(
                        "SELECT id FROM experience_levels WHERE label = ?", Integer.class, experience
                    );

                    // Insert domain
                    jdbcTemplate.update(
                        "INSERT INTO domains (name, slug, language_id, track_id, experience_id) " +
                        "VALUES (?, ?, ?, ?, ?) ON CONFLICT (slug) DO NOTHING",
                        name, slug, languageId, trackId, experienceId
                    );

                    count++;
                }
            } catch (Exception e) {
                log.warn("Failed to load domain from {}: {}", resource.getFilename(), e.getMessage());
            }
        }

        log.info("✅ Seeded {} domains from JSON files", count);
    }

    private void seedStacks() throws IOException {
        log.info("Seeding stacks from JSON files...");

        Resource[] resources = ResourcePatternUtils
            .getResourcePatternResolver(resourceLoader)
            .getResources("classpath:content/stacks/*.json");

        int count = 0;
        for (Resource resource : resources) {
            try {
                JsonNode stackData = objectMapper.readTree(resource.getInputStream());

                String name = stackData.path("name").asText();
                String slug = stackData.path("slug").asText();
                String description = stackData.path("description").asText("");
                String category = stackData.path("category").asText("");

                // Insert stack
                jdbcTemplate.update(
                    "INSERT INTO tech_stacks (name, slug, description, category) " +
                    "VALUES (?, ?, ?, ?) ON CONFLICT (slug) DO NOTHING",
                    name, slug, description, category
                );

                count++;
            } catch (Exception e) {
                log.warn("Failed to load stack from {}: {}", resource.getFilename(), e.getMessage());
            }
        }

        log.info("✅ Seeded {} stacks from JSON files", count);
    }
}
