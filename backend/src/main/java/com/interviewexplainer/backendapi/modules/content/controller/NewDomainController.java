package com.interviewexplainer.backendapi.modules.content.controller;

import com.interviewexplainer.backendapi.modules.content.dto.DomainCategoryDTO;
import com.interviewexplainer.backendapi.modules.content.dto.DomainDTO;
import com.interviewexplainer.backendapi.modules.content.service.DomainService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2")
@CrossOrigin(origins = "*")
public class NewDomainController {

    private final DomainService domainService;

    public NewDomainController(DomainService domainService) {
        this.domainService = domainService;
    }

    @GetMapping("/domains")
    public ResponseEntity<List<DomainDTO>> getAllDomains() {
        return ResponseEntity.ok(domainService.getAllDomains());
    }

    @GetMapping("/domains/{slug}")
    public ResponseEntity<DomainDTO> getDomain(@PathVariable("slug") String slug) {
        return ResponseEntity.ok(domainService.getDomainBySlug(slug));
    }

    @GetMapping("/domains/resolve")
    public ResponseEntity<DomainDTO> resolveDomain(
            @RequestParam("language") String language,
            @RequestParam("track") String track,
            @RequestParam("experience") String experience) {
        return ResponseEntity.ok(domainService.resolveDomain(language, track, experience));
    }

    @GetMapping("/languages/{languageSlug}/domains")
    public ResponseEntity<List<DomainDTO>> getDomainsByLanguage(@PathVariable("languageSlug") String languageSlug) {
        return ResponseEntity.ok(domainService.getDomainsByLanguage(languageSlug));
    }

    @GetMapping("/domains/{slug}/categories")
    public ResponseEntity<List<DomainCategoryDTO>> getCategories(@PathVariable("slug") String slug) {
        return ResponseEntity.ok(domainService.getCategoriesForDomain(slug));
    }
}
