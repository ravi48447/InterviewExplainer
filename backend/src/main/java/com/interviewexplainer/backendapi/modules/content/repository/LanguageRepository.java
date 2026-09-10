package com.interviewexplainer.backendapi.modules.content.repository;

import com.interviewexplainer.backendapi.modules.content.entity.Language;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {
    Optional<Language> findBySlug(String slug);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT l FROM Language l JOIN Domain d ON d.language = l WHERE d.track.slug = :trackSlug")
    List<Language> findByTrackSlug(String trackSlug);
}
