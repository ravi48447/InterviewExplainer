package com.interviewexplainer.backendapi.modules.content.controller;

import com.interviewexplainer.backendapi.modules.content.dto.QuestionPagePayload;
import com.interviewexplainer.backendapi.modules.content.service.PageAssemblerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Unified Question Page Controller.
 * Provides the aggregated payload for a question page under /api/v2/question/{slug}.
 */
@RestController
@RequestMapping("/api/v2/question")
@CrossOrigin(origins = "*")
public class QuestionPageController {

    private final PageAssemblerService pageAssemblerService;

    public QuestionPageController(PageAssemblerService pageAssemblerService) {
        this.pageAssemblerService = pageAssemblerService;
    }

    /**
     * Get the full aggregated payload for a question page.
     */
    @GetMapping("/{slug}")
    public ResponseEntity<QuestionPagePayload> getQuestionPage(@PathVariable("slug") String slug) {
        return ResponseEntity.ok(pageAssemblerService.getPagePayload(slug));
    }

    /**
     * Invalidate the cache for a specific question.
     */
    @PostMapping("/{slug}/invalidate")
    public ResponseEntity<Void> invalidateCache(@PathVariable("slug") String slug) {
        pageAssemblerService.invalidateCache(slug);
        return ResponseEntity.noContent().build();
    }
}
