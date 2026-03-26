package com.interviewexplainer.backendapi.modules.analytics.controller;

import com.interviewexplainer.backendapi.shared.security.JwtUtil;
import com.interviewexplainer.backendapi.modules.analytics.entity.UserActivityLog;
import com.interviewexplainer.backendapi.modules.analytics.repository.UserActivityLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/activity")
@CrossOrigin(origins = "*")
public class ActivityLogController {

    @Autowired
    private UserActivityLogRepository activityLogRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<UserActivityLog>> getActivity(HttpServletRequest request) {
        UUID userId = extractUserId(request);
        return ResponseEntity.ok(activityLogRepository.findByUserIdOrderByCreatedAtDesc(userId));
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
