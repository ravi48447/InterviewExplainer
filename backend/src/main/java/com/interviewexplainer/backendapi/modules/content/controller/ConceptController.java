package com.interviewexplainer.backendapi.modules.content.controller;

import com.interviewexplainer.backendapi.modules.content.dto.ConceptDTO;
import com.interviewexplainer.backendapi.modules.content.service.ConceptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2")
@CrossOrigin(origins = "*")
public class ConceptController {

    private final ConceptService conceptService;

    public ConceptController(ConceptService conceptService) {
        this.conceptService = conceptService;
    }

    @GetMapping("/concepts")
    public ResponseEntity<List<ConceptDTO>> getAllConcepts() {
        return ResponseEntity.ok(conceptService.getAllConcepts());
    }

    @GetMapping("/concepts/{slug}")
    public ResponseEntity<ConceptDTO> getConceptBySlug(@PathVariable("slug") String slug) {
        return ResponseEntity.ok(conceptService.getConceptBySlug(slug));
    }
}
