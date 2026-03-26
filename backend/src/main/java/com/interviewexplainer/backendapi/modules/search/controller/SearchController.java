package com.interviewexplainer.backendapi.modules.search.controller;

import com.interviewexplainer.backendapi.modules.content.dto.QuestionSummaryDTO;
import com.interviewexplainer.backendapi.modules.search.service.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2")
@CrossOrigin(origins = "*")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    /**
     * Full-text search endpoint using PostgreSQL tsvector + GIN index.
     * Query example: GET /api/v2/search?q=hashmap&limit=20
     */
    @GetMapping("/search")
    public ResponseEntity<List<QuestionSummaryDTO>> search(
            @RequestParam("q") String q,
            @RequestParam(name = "limit", defaultValue = "20") int limit) {
        return ResponseEntity.ok(searchService.search(q, Math.min(limit, 100)));
    }
}
