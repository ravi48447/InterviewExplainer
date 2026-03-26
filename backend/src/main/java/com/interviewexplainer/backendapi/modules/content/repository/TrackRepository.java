package com.interviewexplainer.backendapi.modules.content.repository;

import com.interviewexplainer.backendapi.modules.content.entity.Track;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TrackRepository extends JpaRepository<Track, Long> {
    Optional<Track> findBySlug(String slug);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT t FROM Track t WHERE EXISTS (SELECT d FROM Domain d WHERE d.track = t AND d.language.slug = :languageSlug)")
    java.util.List<Track> findByLanguageSlug(@org.springframework.data.repository.query.Param("languageSlug") String languageSlug);
}
