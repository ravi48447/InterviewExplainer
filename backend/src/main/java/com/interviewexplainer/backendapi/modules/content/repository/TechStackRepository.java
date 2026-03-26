package com.interviewexplainer.backendapi.modules.content.repository;

import com.interviewexplainer.backendapi.modules.content.entity.TechStack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TechStackRepository extends JpaRepository<TechStack, Long> {
    
    Optional<TechStack> findBySlug(String slug);
    
    /**
     * Get all stacks for a domain, ordered by display_order.
     * Uses native query to join with domain_stack_map.
     */
    @Query(value = """
        SELECT ts.* FROM tech_stacks ts
        JOIN domain_stack_map dsm ON ts.id = dsm.stack_id
        WHERE dsm.domain_id = :domainId
        ORDER BY dsm.display_order ASC
        """, nativeQuery = true)
    List<TechStack> findByDomainIdOrdered(@Param("domainId") Long domainId);
    
    @Query(value = """
        SELECT ts.* FROM tech_stacks ts
        JOIN domain_stack_map dsm ON ts.id = dsm.stack_id
        JOIN domains d ON d.id = dsm.domain_id
        WHERE d.slug = :domainSlug
        ORDER BY dsm.display_order ASC
        """, nativeQuery = true)
    List<TechStack> findByDomainSlugOrdered(@Param("domainSlug") String domainSlug);
}
