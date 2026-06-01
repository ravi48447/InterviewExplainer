package com.interviewexplainer.backendapi.modules.content.service;

import com.interviewexplainer.backendapi.shared.exception.ResourceNotFoundException;

import com.interviewexplainer.backendapi.modules.content.entity.*;
import com.interviewexplainer.backendapi.modules.content.dto.DomainCategoryDTO;
import com.interviewexplainer.backendapi.modules.content.dto.DomainDTO;
import com.interviewexplainer.backendapi.modules.content.dto.TechStackDTO;
import com.interviewexplainer.backendapi.modules.content.repository.*;
import com.interviewexplainer.backendapi.modules.content.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class DomainService {

    private final DomainRepository domainRepository;
    private final DomainCategoryMapRepository domainCategoryMapRepository;
    private final DomainStackMapRepository domainStackMapRepository;
    private final QuestionRepository questionRepository;

    public DomainService(DomainRepository domainRepository,
                         DomainCategoryMapRepository domainCategoryMapRepository,
                         DomainStackMapRepository domainStackMapRepository,
                         QuestionRepository questionRepository) {
        this.domainRepository = domainRepository;
        this.domainCategoryMapRepository = domainCategoryMapRepository;
        this.domainStackMapRepository = domainStackMapRepository;
        this.questionRepository = questionRepository;
    }

    public List<DomainDTO> getAllDomains() {
        return domainRepository.findAll().stream().map(this::toDTO).toList();
    }

    public List<DomainDTO> getDomainsByLanguage(String languageSlug) {
        return domainRepository.findByLanguageSlug(languageSlug).stream()
                .map(this::toDTO)
                .toList();
    }

    public DomainDTO getDomainBySlug(String slug) {
        return domainRepository.findBySlug(slug)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Domain not found: " + slug));
    }

    public DomainDTO resolveDomain(String lang, String track, String exp) {
        // 1. Try exact match on experience_level label (e.g. "beginner")
        var byTriple = domainRepository.findByTriple(lang, track, exp);
        if (byTriple.isPresent()) return toDTO(byTriple.get());

        // 2. Try canonical slug: {lang}-{track}-{exp}  (e.g. "java-backend-beginner")
        String canonicalSlug = lang + "-" + track + "-" + exp;
        var bySlug = domainRepository.findBySlug(canonicalSlug);
        if (bySlug.isPresent()) return toDTO(bySlug.get());

        // 3. Map legacy numeric labels to new level words and retry
        String mappedExp = switch (exp) {
            case "0-1", "1-3" -> "beginner";
            case "3-5"        -> "intermediate";
            case "5+"         -> "advanced";
            default           -> exp;
        };
        if (!mappedExp.equals(exp)) {
            var byMappedTriple = domainRepository.findByTriple(lang, track, mappedExp);
            if (byMappedTriple.isPresent()) return toDTO(byMappedTriple.get());

            String mappedSlug = lang + "-" + track + "-" + mappedExp;
            var byMappedSlug = domainRepository.findBySlug(mappedSlug);
            if (byMappedSlug.isPresent()) return toDTO(byMappedSlug.get());
        }

        throw new ResourceNotFoundException("No domain matches selection: " + lang + "/" + track + "/" + exp);
    }

    /**
     * Get ordered categories and inner stacks for a domain.
     * Used on domain landing page to render the grouped taxonomy.
     */
    public List<DomainCategoryDTO> getCategoriesForDomain(String domainSlug) {
        Domain domain = domainRepository.findBySlug(domainSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Domain not found: " + domainSlug));

        // Get all stacks for this domain
        List<DomainStackMap> stackMaps = domainStackMapRepository.findByIdDomainId(domain.getId());

        // Group stacks by category
        java.util.Map<Integer, List<DomainStackMap>> stacksByCategory = stackMaps.stream()
                .collect(java.util.stream.Collectors.groupingBy(dsm -> dsm.getCategory().getId()));

        return stacksByCategory.entrySet().stream().map(entry -> {
            Integer categoryId = entry.getKey();
            List<DomainStackMap> stacks = entry.getValue();

            // Get category from first stack
            StackCategory category = stacks.get(0).getCategory();

            // Build stack DTOs
            List<TechStackDTO> stackDTOs = stacks.stream()
                    .map(dsm -> {
                        TechStack s = dsm.getStack();
                        return new TechStackDTO(
                                s.getId(), s.getName(), s.getSlug(), s.getDescription(), s.getIconUrl(),
                                questionRepository.findByStackIdOrdered(s.getId()).size()
                        );
                    })
                    .toList();

            return new DomainCategoryDTO(category.getId(), category.getName(), category.getSlug(), stackDTOs);
        }).toList();
    }

    private DomainDTO toDTO(Domain d) {
        return new DomainDTO(
                d.getId(),
                d.getName(),
                d.getSlug(),
                d.getDescription(),
                d.getLanguage() != null ? d.getLanguage().getName() : null,
                d.getLanguage() != null ? d.getLanguage().getSlug() : null,
                d.getTrack() != null ? d.getTrack().getName() : null,
                d.getTrack() != null ? d.getTrack().getSlug() : null,
                d.getExperienceLevel() != null ? d.getExperienceLevel().getLabel() : null
        );
    }
}
