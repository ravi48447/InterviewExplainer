package com.interviewexplainer.backendapi.modules.auth.entity;

/**
 * ExperienceBand enum - Represents user's experience level.
 * Used for personalizing content recommendations.
 *
 * Maps to the 3-tier content model:
 *   BEGINNER     → 0–2 years  (merged legacy 0-1 + 1-3)
 *   INTERMEDIATE → 2–5 years  (legacy 3-5)
 *   ADVANCED     → 5+ years   (legacy 5+)
 */
public enum ExperienceBand {
    BEGINNER,       // 0–2 years
    INTERMEDIATE,   // 2–5 years
    ADVANCED        // 5+ years
}