package com.interviewexplainer.backendapi.modules.content.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class MarkdownContentService {

    private final Path contentRoot = Paths.get("backend/content/questions");

    public String getContent(String filename) {
        try {
            Path file = contentRoot.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() && resource.isReadable()) {
                return Files.readString(file);
            } else {
                return "# Content Coming Soon\n\nWe are working on this detailed explanation. Please check back later!\n\n"
                        +
                        "### In the meantime...\n" +
                        "Review the official documentation or practice the next question.";
            }
        } catch (IOException e) {
            return "Error reading content file: " + e.getMessage();
        }
    }
}
