package com.interviewexplainer.backendapi.modules.content.controller;

import com.interviewexplainer.backendapi.modules.content.dto.*;
import com.interviewexplainer.backendapi.modules.content.service.LanguageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2")
@CrossOrigin(origins = "*")
public class LanguageController {

    private final LanguageService languageService;

    public LanguageController(LanguageService languageService) {
        this.languageService = languageService;
    }

    @GetMapping("/languages")
    public ResponseEntity<List<LanguageDTO>> getAllLanguages(@RequestParam(name = "track", required = false) String track) {
        return ResponseEntity.ok(languageService.getAllLanguages(track));
    }

    @GetMapping("/languages/{slug}")
    public ResponseEntity<LanguageDTO> getLanguageBySlug(@PathVariable("slug") String slug) {
        return ResponseEntity.ok(languageService.getLanguageBySlug(slug));
    }

    @GetMapping("/tracks")
    public ResponseEntity<List<TrackDTO>> getAllTracks(@RequestParam(name = "language", required = false) String language) {
        return ResponseEntity.ok(languageService.getAllTracks(language));
    }

    @GetMapping("/experience-levels")
    public ResponseEntity<List<ExperienceLevelDTO>> getAllExperienceLevels() {
        return ResponseEntity.ok(languageService.getAllExperienceLevels());
    }
}
