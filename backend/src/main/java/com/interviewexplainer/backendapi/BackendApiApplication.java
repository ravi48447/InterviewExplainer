package com.interviewexplainer.backendapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

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
public class BackendApiApplication {

    public static void main(String[] args) {
        System.out.println("InterviewExplainer Backend Starting...");
        SpringApplication.run(BackendApiApplication.class, args);
    }
}
