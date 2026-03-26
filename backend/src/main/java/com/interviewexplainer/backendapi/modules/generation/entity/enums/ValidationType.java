package com.interviewexplainer.backendapi.modules.generation.entity.enums;

/**
 * Types of validation checks for generated content.
 */
public enum ValidationType {
    DUPLICATE_CHECK,      // Check if question already exists
    QUALITY_SCORE,        // Overall quality assessment
    GUIDELINES_CHECK,     // Adherence to content guidelines
    READABILITY_SCORE,    // Text readability analysis
    TECHNICAL_ACCURACY,   // Technical correctness check
    LENGTH_VALIDATION,    // Content length requirements
    KEYWORD_PRESENCE      // Required keywords check
}