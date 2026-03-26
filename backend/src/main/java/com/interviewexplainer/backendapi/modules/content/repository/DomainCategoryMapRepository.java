package com.interviewexplainer.backendapi.modules.content.repository;

import com.interviewexplainer.backendapi.modules.content.entity.DomainCategoryMap;
import com.interviewexplainer.backendapi.modules.content.entity.DomainCategoryMapId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DomainCategoryMapRepository extends JpaRepository<DomainCategoryMap, DomainCategoryMapId> {

    @Query("SELECT dcm FROM DomainCategoryMap dcm JOIN FETCH dcm.category WHERE dcm.domain.id = :domainId ORDER BY dcm.displayOrder ASC")
    List<DomainCategoryMap> findCategoriesByDomainId(@Param("domainId") Long domainId);
}
