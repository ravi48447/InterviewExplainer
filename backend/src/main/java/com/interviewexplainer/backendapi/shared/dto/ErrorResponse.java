package com.interviewexplainer.backendapi.shared.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standard error response structure.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private boolean success = false;
    private ErrorDetail error;
    private LocalDateTime timestamp;

    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(String code, String message) {
        this.error = new ErrorDetail(code, message, null);
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(String code, String message, Map<String, String> details) {
        this.error = new ErrorDetail(code, message, details);
        this.timestamp = LocalDateTime.now();
    }

    public static class ErrorDetail {
        private String code;
        private String message;
        private Map<String, String> details;

        public ErrorDetail() {}

        public ErrorDetail(String code, String message, Map<String, String> details) {
            this.code = code;
            this.message = message;
            this.details = details;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Map<String, String> getDetails() {
            return details;
        }

        public void setDetails(Map<String, String> details) {
            this.details = details;
        }
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public ErrorDetail getError() {
        return error;
    }

    public void setError(ErrorDetail error) {
        this.error = error;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
