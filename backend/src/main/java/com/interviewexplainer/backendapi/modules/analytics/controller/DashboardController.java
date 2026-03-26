package com.interviewexplainer.backendapi.modules.analytics.controller;

import com.interviewexplainer.backendapi.shared.security.JwtUtil;
import com.interviewexplainer.backendapi.modules.analytics.dto.DashboardSummaryDTO;
import com.interviewexplainer.backendapi.modules.analytics.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getSummary(jakarta.servlet.http.HttpServletRequest request) {
        UUID userId = null;
        try {
            userId = extractUserId(request);
        } catch (Exception e) {
            // Guest access
        }
        return ResponseEntity.ok(dashboardService.getSummary(userId));
    }

    @PostMapping("/primary-domain/{domainId}")
    public ResponseEntity<Void> updatePrimaryDomain(@PathVariable Long domainId, jakarta.servlet.http.HttpServletRequest request) {
        UUID userId = extractUserId(request);
        if (userId != null) {
            dashboardService.updatePrimaryDomain(userId, domainId);
        }
        return ResponseEntity.ok().build();
    }
    
    private UUID extractUserId(jakarta.servlet.http.HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        return null;
    }
}
