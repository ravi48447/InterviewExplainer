package com.interviewexplainer.backendapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * InterviewExplainer - Enterprise Modular Monolith
 *
 * Architecture: Domain-Driven Design with clear module boundaries
 * Modules: auth, content, learning, analytics, search, generation
 *
 * @version 2.0.0 - Modular Architecture
 */
@SpringBootApplication
@EnableJpaAuditing
@EntityScan(basePackages = {
    "com.interviewexplainer.backendapi.modules.auth.entity",
    "com.interviewexplainer.backendapi.modules.content.entity",
    "com.interviewexplainer.backendapi.modules.learning.entity",
    "com.interviewexplainer.backendapi.modules.analytics.entity",
    "com.interviewexplainer.backendapi.shared.domain"
})
@EnableJpaRepositories(basePackages = {
    "com.interviewexplainer.backendapi.modules.auth.repository",
    "com.interviewexplainer.backendapi.modules.content.repository",
    "com.interviewexplainer.backendapi.modules.learning.repository",
    "com.interviewexplainer.backendapi.modules.analytics.repository"
})
public class BackendApiApplication {

    public static void main(String[] args) {
        System.out.println("=========================================");
        System.out.println("  InterviewExplainer Backend v2.0");
        System.out.println("  Enterprise Modular Architecture");
        System.out.println("=========================================");
        System.out.println("Modules:");
        System.out.println("  - Auth: /api/auth/*");
        System.out.println("  - Content: /api/content/*");
        System.out.println("  - Learning: /api/learning/*");
        System.out.println("  - Analytics: /api/analytics/*");
        System.out.println("  - Search: /api/search/*");
        System.out.println("  - Generation: /api/generation/*");
        System.out.println("=========================================");
        System.out.println("Backend: http://localhost:8080");
        System.out.println("Health Check: http://localhost:8080/actuator/health");
        System.out.println("=========================================");
        SpringApplication.run(BackendApiApplication.class, args);
    }
}
