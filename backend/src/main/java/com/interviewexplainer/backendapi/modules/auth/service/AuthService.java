package com.interviewexplainer.backendapi.modules.auth.service;

import com.interviewexplainer.backendapi.modules.auth.entity.User;
import com.interviewexplainer.backendapi.modules.auth.entity.ExperienceBand;
import com.interviewexplainer.backendapi.modules.auth.dto.*;
import com.interviewexplainer.backendapi.modules.content.entity.Domain;
import com.interviewexplainer.backendapi.modules.analytics.entity.UserProfile;
import com.interviewexplainer.backendapi.modules.auth.repository.UserRepository;
import com.interviewexplainer.backendapi.modules.analytics.repository.UserProfileRepository;
import com.interviewexplainer.backendapi.modules.content.repository.DomainRepository;
import com.interviewexplainer.backendapi.shared.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private DomainRepository domainRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        UUID userId = UUID.randomUUID();
        User user = new User(
                userId,
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                parseExperienceBand(request.getExperienceLevel())
        );

        userRepository.save(user);

        UserProfile profile = new UserProfile(
                userId,
                request.getDomainId(),
                request.getExperienceLevel()
        );
        profile.setPrimaryDomainSlug(request.getDomainSlug());
        userProfileRepository.save(profile);

        // The content slug chosen at signup is the source of truth. Fall back to
        // resolving a slug from a (legacy) numeric domain id only when no slug
        // was supplied.
        String domainSlug = request.getDomainSlug();
        if (domainSlug == null && request.getDomainId() != null) {
            domainSlug = domainRepository.findById(request.getDomainId())
                    .map(Domain::getSlug)
                    .orElse(null);
        }

        String token = jwtUtil.generateToken(userId, user.getEmail());
        UserResponse userResp = new UserResponse(user.getId(), user.getName(), user.getEmail(), domainSlug);
        return new AuthResponse(token, userResp);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        UserProfile loginProfile = userProfileRepository.findById(user.getId()).orElse(null);
        String domainSlug = null;
        if (loginProfile != null) {
            domainSlug = loginProfile.getPrimaryDomainSlug();
            if (domainSlug == null && loginProfile.getPrimaryDomainId() != null) {
                domainSlug = domainRepository.findById(loginProfile.getPrimaryDomainId())
                        .map(Domain::getSlug)
                        .orElse(null);
            }
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        UserResponse userResp = new UserResponse(user.getId(), user.getName(), user.getEmail(), domainSlug);
        return new AuthResponse(token, userResp);
    }

    private ExperienceBand parseExperienceBand(String level) {
        if (level == null) return ExperienceBand.BEGINNER;
        try {
            return switch (level.toLowerCase()) {
                case "0-1", "1-3", "0-2", "beginner"    -> ExperienceBand.BEGINNER;
                case "3-5", "2-5", "intermediate"        -> ExperienceBand.INTERMEDIATE;
                case "5+",  "advanced"                   -> ExperienceBand.ADVANCED;
                default -> ExperienceBand.valueOf(level.toUpperCase());
            };
        } catch (Exception e) {
            return ExperienceBand.BEGINNER;
        }
    }
}
