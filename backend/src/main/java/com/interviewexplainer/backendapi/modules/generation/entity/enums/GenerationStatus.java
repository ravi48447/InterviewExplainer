package com.interviewexplainer.backendapi.modules.generation.entity.enums;

/**
 * Status of a content generation job.
 */
public enum GenerationStatus {
    PENDING,        // Job created, waiting to start
    PROCESSING,     // Currently generating content
    GENERATED,      // Content generated, awaiting validation
    VALIDATED,      // Content validated, awaiting approval
    APPROVED,       // Approved for publishing
    REJECTED,       // Rejected, needs regeneration
    PUBLISHED,      // Successfully published to content module
    FAILED          // Generation failed
}