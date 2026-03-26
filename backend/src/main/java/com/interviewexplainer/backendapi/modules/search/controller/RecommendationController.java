package com.interviewexplainer.backendapi.modules.search.controller;

import com.interviewexplainer.backendapi.modules.content.dto.QuestionSummaryDTO;
import com.interviewexplainer.backendapi.modules.search.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Endpoint for the expanding "People Also Ask" Graph tree.
 */
@RestController
@RequestMapping("/api/v2/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    /**
     * Recursive "People Also Ask" expansion.
     * GET /api/question/paa/{questionId}
     */
    @GetMapping("/paa/{questionId}")
    public ResponseEntity<Map<String, List<QuestionSummaryDTO>>> getPeopleAlsoAsk(@PathVariable("questionId") Long questionId) {
        List<QuestionSummaryDTO> questions = recommendationService.getPeopleAlsoAsk(questionId);
        return ResponseEntity.ok(Map.of("questions", questions));
    }
}
