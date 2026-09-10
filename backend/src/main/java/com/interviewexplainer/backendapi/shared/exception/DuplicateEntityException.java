package com.interviewexplainer.backendapi.shared.exception;

/**
 * Exception thrown when attempting to create a duplicate entity.
 */
public class DuplicateEntityException extends RuntimeException {

    public DuplicateEntityException(String message) {
        super(message);
    }

    public DuplicateEntityException(String entity, String field, Object value) {
        super(String.format("%s already exists with %s: '%s'", entity, field, value));
    }
}