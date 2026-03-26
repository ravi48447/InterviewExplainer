package com.interviewexplainer.backendapi.modules.content.repository;

import com.interviewexplainer.backendapi.modules.content.entity.DomainStackMap;
import com.interviewexplainer.backendapi.modules.content.entity.DomainStackMapId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DomainStackMapRepository extends JpaRepository<DomainStackMap, DomainStackMapId> {

    @Query("SELECT dsm FROM DomainStackMap dsm JOIN FETCH dsm.stack WHERE dsm.domain.id = :domainId AND dsm.category.id = :categoryId ORDER BY dsm.displayOrder ASC")
    List<DomainStackMap> findStacksByDomainAndCategory(@Param("domainId") Long domainId, @Param("categoryId") Integer categoryId);

    List<DomainStackMap> findByIdDomainId(Long domainId);
}
