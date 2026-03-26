package com.interviewexplainer.backendapi.modules.content.service;

import com.interviewexplainer.backendapi.modules.content.entity.Language;
import com.interviewexplainer.backendapi.modules.content.entity.Track;
import com.interviewexplainer.backendapi.modules.content.dto.ExperienceLevelDTO;
import com.interviewexplainer.backendapi.modules.content.dto.LanguageDTO;
import com.interviewexplainer.backendapi.modules.content.dto.TrackDTO;
import com.interviewexplainer.backendapi.modules.content.repository.ExperienceLevelRepository;
import com.interviewexplainer.backendapi.modules.content.repository.LanguageRepository;
import com.interviewexplainer.backendapi.modules.content.repository.TrackRepository;
import com.interviewexplainer.backendapi.shared.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class LanguageService {

    private final LanguageRepository languageRepository;
    private final TrackRepository trackRepository;
    private final ExperienceLevelRepository experienceLevelRepository;

    public LanguageService(LanguageRepository languageRepository,
                           TrackRepository trackRepository,
                           ExperienceLevelRepository experienceLevelRepository) {
        this.languageRepository = languageRepository;
        this.trackRepository = trackRepository;
        this.experienceLevelRepository = experienceLevelRepository;
    }

    public List<LanguageDTO> getAllLanguages(String trackSlug) {
        List<Language> languages;
        if (trackSlug != null && !trackSlug.isEmpty()) {
            languages = languageRepository.findByTrackSlug(trackSlug);
        } else {
            languages = languageRepository.findAll();
        }
        return languages.stream()
                .map(this::toDTO)
                .toList();
    }

    public LanguageDTO getLanguageBySlug(String slug) {
        return languageRepository.findBySlug(slug)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Language not found: " + slug));
    }

    public List<TrackDTO> getAllTracks(String languageSlug) {
        List<Track> tracks;
        if (languageSlug != null && !languageSlug.isEmpty()) {
            tracks = trackRepository.findByLanguageSlug(languageSlug);
        } else {
            tracks = trackRepository.findAll();
        }
        return tracks.stream()
                .map(t -> new TrackDTO(t.getId(), t.getName(), t.getSlug(), t.getDescription()))
                .toList();
    }

    public List<ExperienceLevelDTO> getAllExperienceLevels() {
        return experienceLevelRepository.findAll().stream()
                .map(e -> new ExperienceLevelDTO(e.getId(), e.getLabel(), e.getMinYears(), e.getMaxYears()))
                .toList();
    }

    private LanguageDTO toDTO(Language l) {
        return new LanguageDTO(l.getId(), l.getName(), l.getSlug(), l.getDescription(), l.getIconUrl());
    }
}
