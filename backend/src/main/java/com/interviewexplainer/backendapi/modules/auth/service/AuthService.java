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
        userProfileRepository.save(profile);

        String domainSlug = domainRepository.findById(request.getDomainId())
                .map(Domain::getSlug)
                .orElse(null);

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

        String domainSlug = userProfileRepository.findById(user.getId())
                .flatMap(profile -> domainRepository.findById(profile.getPrimaryDomainId()))
                .map(Domain::getSlug)
                .orElse(null);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        UserResponse userResp = new UserResponse(user.getId(), user.getName(), user.getEmail(), domainSlug);
        return new AuthResponse(token, userResp);
    }

    private ExperienceBand parseExperienceBand(String level) {
        if (level == null) return ExperienceBand.E1_1_TO_3;
        try {
            if (level.contains("0-1")) return ExperienceBand.E0_0_TO_1;
            if (level.contains("1-3")) return ExperienceBand.E1_1_TO_3;
            if (level.contains("3-5")) return ExperienceBand.E2_3_TO_5;
            if (level.contains("5+")) return ExperienceBand.E3_5_PLUS;
            return ExperienceBand.valueOf(level);
        } catch (Exception e) {
            return ExperienceBand.E1_1_TO_3;
        }
    }
}
