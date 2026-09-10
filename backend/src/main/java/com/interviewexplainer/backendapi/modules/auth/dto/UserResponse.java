package com.interviewexplainer.backendapi.modules.auth.dto;

import java.util.UUID;

public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String domainSlug;

    public UserResponse(UUID id, String name, String email, String domainSlug) {
        this.id = id.toString();
        this.name = name;
        this.email = email;
        this.domainSlug = domainSlug;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getDomainSlug() { return domainSlug; }
}
