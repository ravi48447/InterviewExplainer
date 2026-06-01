package com.interviewexplainer.backendapi.modules.auth.dto;

public class SignupRequest {
    private String email;
    private String password;
    private String name;
    private Long domainId;
    private String domainSlug;
    private String experienceLevel;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getDomainId() { return domainId; }
    public void setDomainId(Long domainId) { this.domainId = domainId; }

    public String getDomainSlug() { return domainSlug; }
    public void setDomainSlug(String domainSlug) { this.domainSlug = domainSlug; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
}
