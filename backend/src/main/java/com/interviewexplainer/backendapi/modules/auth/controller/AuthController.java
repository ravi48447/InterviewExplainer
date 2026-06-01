package com.interviewexplainer.backendapi.modules.auth.controller;

import com.interviewexplainer.backendapi.modules.auth.entity.User;
import com.interviewexplainer.backendapi.modules.auth.service.AuthService;
import com.interviewexplainer.backendapi.modules.auth.repository.UserRepository;
import com.interviewexplainer.backendapi.modules.auth.dto.*;
import com.interviewexplainer.backendapi.modules.analytics.repository.UserProfileRepository;
import com.interviewexplainer.backendapi.modules.content.repository.DomainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private DomainRepository domainRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        var profileOpt = userProfileRepository.findById(user.getId());
        String domainSlug = profileOpt.map(p -> p.getPrimaryDomainSlug()).orElse(null);
        if (domainSlug == null) {
            domainSlug = profileOpt
                    .map(p -> p.getPrimaryDomainId())
                    .filter(id -> id != null)
                    .flatMap(id -> domainRepository.findById(id))
                    .map(domain -> domain.getSlug())
                    .orElse(null);
        }

        return ResponseEntity.ok(new UserResponse(user.getId(), user.getName(), user.getEmail(), domainSlug));
    }
}
