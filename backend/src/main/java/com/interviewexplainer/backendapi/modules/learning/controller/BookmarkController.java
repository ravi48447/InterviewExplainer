package com.interviewexplainer.backendapi.modules.learning.controller;

import com.interviewexplainer.backendapi.shared.security.JwtUtil;
import com.interviewexplainer.backendapi.modules.learning.entity.UserBookmark;
import com.interviewexplainer.backendapi.modules.learning.service.BookmarkService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookmarks")
@CrossOrigin(origins = "*")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/question/{id}")
    public ResponseEntity<Void> addBookmark(@PathVariable("id") Long questionId, HttpServletRequest request) {
        UUID userId = extractUserId(request);
        bookmarkService.addBookmark(userId, questionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/question/{id}")
    public ResponseEntity<Void> removeBookmark(@PathVariable("id") Long questionId, HttpServletRequest request) {
        UUID userId = extractUserId(request);
        bookmarkService.removeBookmark(userId, questionId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<UserBookmark>> getBookmarks(HttpServletRequest request) {
        UUID userId = extractUserId(request);
        return ResponseEntity.ok(bookmarkService.getBookmarks(userId));
    }

    @GetMapping("/question/{id}/check")
    public ResponseEntity<Boolean> isBookmarked(@PathVariable("id") Long questionId, HttpServletRequest request) {
        UUID userId = extractUserId(request);
        return ResponseEntity.ok(bookmarkService.isBookmarked(userId, questionId));
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
