package com.interviewexplainer.backendapi.modules.content.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "domains")
public class Domain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "language_id")
    private Language language;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id")
    private Track track;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "experience_id")
    private ExperienceLevel experienceLevel;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(unique = true, nullable = false, length = 255)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "meta_title", length = 255)
    private String metaTitle;

    @Column(name = "meta_description", columnDefinition = "TEXT")
    private String metaDescription;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    protected Domain() {}

    public Domain(Language language, Track track, ExperienceLevel experienceLevel,
                        String name, String slug) {
        this.language = language;
        this.track = track;
        this.experienceLevel = experienceLevel;
        this.name = name;
        this.slug = slug;
    }

    public Long getId() { return id; }
    public Language getLanguage() { return language; }
    public void setLanguage(Language language) { this.language = language; }
    public Track getTrack() { return track; }
    public void setTrack(Track track) { this.track = track; }
    public ExperienceLevel getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(ExperienceLevel experienceLevel) { this.experienceLevel = experienceLevel; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getMetaTitle() { return metaTitle; }
    public void setMetaTitle(String metaTitle) { this.metaTitle = metaTitle; }
    public String getMetaDescription() { return metaDescription; }
    public void setMetaDescription(String metaDescription) { this.metaDescription = metaDescription; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
