package com.interviewexplainer.backendapi.modules.content.dto;

import java.util.List;

public record DomainCategoryDTO(
        Integer id,
        String name,
        String slug,
        List<TechStackDTO> stacks
) {}
