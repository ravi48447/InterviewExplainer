package com.interviewexplainer.backendapi.modules.content.repository;

import com.interviewexplainer.backendapi.modules.content.entity.Domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DomainRepository extends JpaRepository<Domain, Long> {
    
    Optional<Domain> findBySlug(String slug);
    
    @Query("SELECT d FROM Domain d WHERE d.language.slug = :languageSlug")
    List<Domain> findByLanguageSlug(@Param("languageSlug") String languageSlug);
    
    @Query("SELECT d FROM Domain d WHERE d.language.slug = :langSlug AND d.track.slug = :trackSlug AND d.experienceLevel.label = :expLabel")
    Optional<Domain> findByTriple(
        @Param("langSlug") String langSlug,
        @Param("trackSlug") String trackSlug,
        @Param("expLabel") String expLabel
    );

    List<Domain> findByLanguageId(Long languageId);
    List<Domain> findByTrackId(Long trackId);
}
