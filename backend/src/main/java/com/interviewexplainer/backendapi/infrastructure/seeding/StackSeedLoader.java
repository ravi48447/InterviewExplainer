package com.interviewexplainer.backendapi.infrastructure.seeding;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.ResourcePatternUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * Stack Seed Loader - Loads tech stacks and domain-stack mappings from domain JSON files
 * Runs after CompleteSeedLoader (domains must exist first)
 */
@Component
@Order(2) // Run after CompleteSeedLoader (Order 1)
public class StackSeedLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(StackSeedLoader.class);

    private final JdbcTemplate jdbcTemplate;
    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;

    public StackSeedLoader(JdbcTemplate jdbcTemplate, ResourceLoader resourceLoader, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.resourceLoader = resourceLoader;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("🔧 Starting stack and mapping seed...");

        // Check if already seeded
        if (isAlreadySeeded()) {
            log.info("✅ Stacks already loaded. Skipping seed.");
            return;
        }

        try {
            // Load all domain JSON files
            Resource[] resources = ResourcePatternUtils
                .getResourcePatternResolver(resourceLoader)
                .getResources("classpath:content/domains/*-final-1.0.json");

            // Collect all unique categories, stacks, and mappings
            Set<String> allCategories = new LinkedHashSet<>();
            Map<String, StackInfo> allStacks = new LinkedHashMap<>();
            Map<String, List<DomainStackMapping>> domainMappings = new LinkedHashMap<>();

            for (Resource resource : resources) {
                JsonNode root = objectMapper.readTree(resource.getInputStream());
                JsonNode domainsArray = root.path("domains");

                for (JsonNode domainNode : domainsArray) {
                    String domainSlug = domainNode.path("slug").asText();
                    JsonNode categories = domainNode.path("categories");

                    int displayOrder = 1;
                    for (JsonNode category : categories) {
                        String categoryName = category.path("name").asText();
                        allCategories.add(categoryName);

                        JsonNode stacks = category.path("stacks");

                        for (JsonNode stackSlug : stacks) {
                            String slug = stackSlug.asText();

                            // Add to global stack collection
                            if (!allStacks.containsKey(slug)) {
                                allStacks.put(slug, new StackInfo(slug, generateStackName(slug), categoryName));
                            }

                            // Record domain-stack mapping
                            domainMappings
                                .computeIfAbsent(domainSlug, k -> new ArrayList<>())
                                .add(new DomainStackMapping(slug, categoryName, displayOrder++));
                        }
                    }
                }
            }

            log.info("📦 Found {} categories, {} unique stacks across all domains",
                allCategories.size(), allStacks.size());

            // Insert categories first
            int categoriesLoaded = loadCategories(allCategories);
            log.info("✅ Loaded {} categories", categoriesLoaded);

            // Insert stacks
            int stacksLoaded = loadStacks(allStacks);
            log.info("✅ Loaded {} tech stacks", stacksLoaded);

            // Insert domain-stack mappings
            int mappingsLoaded = loadDomainStackMappings(domainMappings);
            log.info("✅ Loaded {} domain-stack mappings", mappingsLoaded);

            displaySummary();

        } catch (Exception e) {
            log.error("❌ Stack seeding failed: {}", e.getMessage(), e);
            throw e;
        }
    }

    private int loadCategories(Set<String> categories) {
        int count = 0;
        for (String category : categories) {
            String slug = category.toLowerCase().replace(" ", "-");
            try {
                jdbcTemplate.update(
                    "INSERT INTO stack_categories (name, slug) " +
                    "VALUES (?, ?) ON CONFLICT (slug) DO NOTHING",
                    category, slug
                );
                count++;
            } catch (Exception e) {
                log.warn("Failed to insert category {}: {}", category, e.getMessage());
            }
        }
        return count;
    }

    private int loadStacks(Map<String, StackInfo> stacks) {
        int count = 0;
        for (StackInfo stack : stacks.values()) {
            try {
                jdbcTemplate.update(
                    "INSERT INTO tech_stacks (name, slug, description) " +
                    "VALUES (?, ?, ?) ON CONFLICT (slug) DO NOTHING",
                    stack.name,
                    stack.slug,
                    generateStackDescription(stack.slug, stack.name)
                );
                count++;
            } catch (Exception e) {
                log.warn("Failed to insert stack {}: {}", stack.slug, e.getMessage());
            }
        }
        return count;
    }

    private int loadDomainStackMappings(Map<String, List<DomainStackMapping>> mappings) {
        int count = 0;

        for (Map.Entry<String, List<DomainStackMapping>> entry : mappings.entrySet()) {
            String domainSlug = entry.getKey();

            // Get domain ID
            try {
                Integer domainId = jdbcTemplate.queryForObject(
                    "SELECT id FROM domains WHERE slug = ?",
                    Integer.class, domainSlug
                );

                for (DomainStackMapping mapping : entry.getValue()) {
                    try {
                        Integer stackId = jdbcTemplate.queryForObject(
                            "SELECT id FROM tech_stacks WHERE slug = ?",
                            Integer.class, mapping.stackSlug
                        );

                        String categorySlug = mapping.categoryName.toLowerCase().replace(" ", "-");
                        Integer categoryId = jdbcTemplate.queryForObject(
                            "SELECT id FROM stack_categories WHERE slug = ?",
                            Integer.class, categorySlug
                        );

                        jdbcTemplate.update(
                            "INSERT INTO domain_stack_map (domain_id, stack_id, category_id, display_order) " +
                            "VALUES (?, ?, ?, ?) ON CONFLICT (category_id, domain_id, stack_id) DO NOTHING",
                            domainId, stackId, categoryId, mapping.displayOrder
                        );
                        count++;
                    } catch (Exception e) {
                        log.warn("Failed to map stack {} to domain {}: {}",
                            mapping.stackSlug, domainSlug, e.getMessage());
                    }
                }
            } catch (Exception e) {
                log.warn("Domain not found: {}", domainSlug);
            }
        }

        return count;
    }

    private boolean isAlreadySeeded() {
        try {
            Integer stackCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM tech_stacks",
                Integer.class
            );
            return stackCount != null && stackCount > 0;
        } catch (Exception e) {
            return false;
        }
    }

    private void displaySummary() {
        try {
            Integer stacks = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM tech_stacks", Integer.class);
            Integer mappings = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM domain_stack_map", Integer.class);
            Integer domains = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM domains", Integer.class);

            log.info("📊 Stack Seed Summary:");
            log.info("   Tech Stacks: {}", stacks);
            log.info("   Domains: {}", domains);
            log.info("   Domain-Stack Mappings: {}", mappings);
        } catch (Exception e) {
            log.warn("Could not display summary: {}", e.getMessage());
        }
    }

    private String generateStackName(String slug) {
        // Convert slug to readable name
        String[] words = slug.split("-");
        StringBuilder name = new StringBuilder();
        for (String word : words) {
            if (name.length() > 0) name.append(" ");
            name.append(Character.toUpperCase(word.charAt(0)))
                .append(word.substring(1));
        }
        return name.toString();
    }

    private String generateStackDescription(String slug, String name) {
        // Generate basic description for now
        return name + " - Interview preparation and concepts";
    }

    private static class StackInfo {
        String slug;
        String name;
        String category;

        StackInfo(String slug, String name, String category) {
            this.slug = slug;
            this.name = name;
            this.category = category;
        }
    }

    private static class DomainStackMapping {
        String stackSlug;
        String categoryName;
        int displayOrder;

        DomainStackMapping(String stackSlug, String categoryName, int displayOrder) {
            this.stackSlug = stackSlug;
            this.categoryName = categoryName;
            this.displayOrder = displayOrder;
        }
    }
}