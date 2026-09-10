package com.interviewexplainer.backendapi.modules.learning.controller;

import com.interviewexplainer.backendapi.shared.security.JwtUtil;
import com.interviewexplainer.backendapi.modules.learning.entity.UserQuestionProgress;
import com.interviewexplainer.backendapi.modules.learning.service.ProgressService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/question/{id}/view")
    public ResponseEntity<Void> recordView(@PathVariable("id") Long questionId, HttpServletRequest request) {
        UUID userId = extractUserId(request);
        progressService.recordView(userId, questionId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/question/{id}/complete")
    public ResponseEntity<Void> markCompleted(@PathVariable("id") Long questionId, HttpServletRequest request) {
        UUID userId = extractUserId(request);
        progressService.markCompleted(userId, questionId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-progress")
    public ResponseEntity<List<UserQuestionProgress>> getMyProgress(HttpServletRequest request) {
        UUID userId = extractUserId(request);
        return ResponseEntity.ok(progressService.getUserProgress(userId));
    }

    private UUID extractUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        throw new RuntimeException("Unauthorized");
    }
}
