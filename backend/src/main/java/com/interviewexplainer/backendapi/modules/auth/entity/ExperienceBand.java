package com.interviewexplainer.backendapi.modules.auth.entity;

/**
 * ExperienceBand enum - Represents user's experience level.
 * Used for personalizing content recommendations.
 */
public enum ExperienceBand {
    E0_0_TO_1,    // 0-1 years (Fresher)
    E1_1_TO_3,    // 1-3 years (Junior)
    E2_3_TO_5,    // 3-5 years (Mid-level)
    E3_5_PLUS     // 5+ years (Senior/Lead)
}