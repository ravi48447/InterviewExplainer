package com.interviewexplainer.backendapi.modules.content.controller;

import com.interviewexplainer.backendapi.modules.content.dto.QuestionSummaryDTO;
import com.interviewexplainer.backendapi.modules.content.dto.TechStackDTO;
import com.interviewexplainer.backendapi.modules.content.service.StackService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2")
@CrossOrigin(origins = "*")
public class StackController {

    private final StackService stackService;

    public StackController(StackService stackService) {
        this.stackService = stackService;
    }

    @GetMapping("/stacks/{slug}")
    public ResponseEntity<TechStackDTO> getStackBySlug(@PathVariable("slug") String slug) {
        return ResponseEntity.ok(stackService.getStackBySlug(slug));
    }

    /**
     * Get all questions for a stack ordered by order_index.
     */
    @GetMapping("/stacks/{slug}/questions")
    public ResponseEntity<List<QuestionSummaryDTO>> getQuestions(@PathVariable("slug") String slug) {
        return ResponseEntity.ok(stackService.getQuestionsForStack(slug));
    }

    /**
     * Get paginated questions for a stack.
     */
    @GetMapping("/stacks/{slug}/questions/paged")
    public ResponseEntity<Page<QuestionSummaryDTO>> getQuestionsPaged(
            @PathVariable("slug") String slug,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        return ResponseEntity.ok(stackService.getQuestionsForStackPaged(slug, page, size));
    }
}
