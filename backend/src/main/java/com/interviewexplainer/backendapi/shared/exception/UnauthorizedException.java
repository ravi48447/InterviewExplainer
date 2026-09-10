package com.interviewexplainer.backendapi.shared.exception;

/**
 * Exception thrown when user is not authorized to perform an action.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException() {
        super("Unauthorized access");
    }
}