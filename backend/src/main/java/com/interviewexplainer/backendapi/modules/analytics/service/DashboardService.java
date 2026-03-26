package com.interviewexplainer.backendapi.modules.analytics.service;

import com.interviewexplainer.backendapi.modules.analytics.entity.UserProfile;
import com.interviewexplainer.backendapi.modules.analytics.entity.UserActivityLog;
import com.interviewexplainer.backendapi.modules.analytics.repository.UserProfileRepository;
import com.interviewexplainer.backendapi.modules.analytics.repository.UserActivityLogRepository;
import com.interviewexplainer.backendapi.modules.analytics.dto.*;
import com.interviewexplainer.backendapi.modules.learning.entity.UserQuestionProgress;
import com.interviewexplainer.backendapi.modules.learning.entity.UserBookmark;
import com.interviewexplainer.backendapi.modules.learning.entity.UserStreak;
import com.interviewexplainer.backendapi.modules.learning.repository.UserQuestionProgressRepository;
import com.interviewexplainer.backendapi.modules.learning.repository.UserBookmarkRepository;
import com.interviewexplainer.backendapi.modules.learning.repository.UserStreakRepository;
import com.interviewexplainer.backendapi.modules.content.entity.*;
import com.interviewexplainer.backendapi.modules.content.repository.*;
import com.interviewexplainer.backendapi.modules.content.dto.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private UserQuestionProgressRepository progressRepository;

    @Autowired
    private UserStreakRepository streakRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private DomainRepository domainRepository;

    @Autowired
    private TechStackRepository stackRepository;

    @Autowired
    private UserBookmarkRepository bookmarkRepository;

    @Autowired
    private UserActivityLogRepository activityLogRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private DomainStackMapRepository domainStackMapRepository;

    @Autowired
    private QuestionStackIndexRepository questionStackIndexRepository;

    @Autowired
    private ConceptRepository conceptRepository;

    @Autowired
    private TrackRepository trackRepository;

    @Autowired
    private DomainCategoryMapRepository domainCategoryMapRepository;

    @Transactional
    public DashboardSummaryDTO getSummary(UUID userId) {
        long totalQuestions = 0;
        long completedQuestions = 0;
        long totalTimeSpent = 0;
        int currentStreak = 0;
        long bookmarksCount = 0;
        List<String> recentActivity = new ArrayList<>();
        List<StackPerformanceDTO> performance = new ArrayList<>();
        List<WeakAreaDTO> weakAreas = new ArrayList<>();
        List<RadarDataDTO> radarData = new ArrayList<>();

        String primaryDomainName = null;
        String primaryDomainSlug = null;
        String experienceLevelStr = null;

        if (userId != null) {
            // Get user profile to find primary domain
            UserProfile profile = userProfileRepository.findById(userId).orElse(null);
            
            if (profile != null) {
                experienceLevelStr = profile.getExperienceLevel();
                Long domainId = profile.getPrimaryDomainId();
                
                if (domainId != null) {
                    var domainOpt = domainRepository.findById(domainId);
                    if (domainOpt.isPresent()) {
                        Domain domain = domainOpt.get();
                        primaryDomainName = domain.getName();
                        primaryDomainSlug = domain.getSlug();

                        // 1. Get all stacks in this domain
                        List<DomainStackMap> domainStacks = domainStackMapRepository.findByIdDomainId(domainId);
                        
                        // 2. Collect all unique question IDs in this domain
                        java.util.Set<Long> domainQuestionIds = new java.util.HashSet<>();
                        for (DomainStackMap dsm : domainStacks) {
                            List<QuestionStackIndex> questionsInStack = questionStackIndexRepository
                                    .findByStackIdOrderByOrderIndexAsc(dsm.getStack().getId());
                            for (QuestionStackIndex qsi : questionsInStack) {
                                domainQuestionIds.add(qsi.getQuestionId());
                            }
                        }
                        totalQuestions = domainQuestionIds.size();

                        // 3. Get progress for these specific questions
                        if (!domainQuestionIds.isEmpty()) {
                            List<UserQuestionProgress> domainProgress = progressRepository
                                    .findByUserIdAndQuestionIdIn(userId, domainQuestionIds);
                            
                            completedQuestions = domainProgress.stream()
                                    .filter(p -> "completed".equals(p.getStatus()))
                                    .count();
                            
                            totalTimeSpent = domainProgress.stream()
                                    .mapToLong(p -> p.getTimeSpentSeconds() != null ? p.getTimeSpentSeconds() : 0L)
                                    .sum();
                        }

                        // 4. Calculate performance per stack (Only in domain)
                        for (DomainStackMap dsm : domainStacks) {
                            TechStack stack = dsm.getStack();
                            List<QuestionStackIndex> questionsInStack = questionStackIndexRepository
                                    .findByStackIdOrderByOrderIndexAsc(stack.getId());

                            if (questionsInStack.isEmpty()) continue;

                            long completedInStack = 0;
                            List<Long> stackQIds = questionsInStack.stream().map(QuestionStackIndex::getQuestionId).collect(Collectors.toList());
                            List<UserQuestionProgress> stackProgress = progressRepository.findByUserIdAndQuestionIdIn(userId, stackQIds);
                            completedInStack = stackProgress.stream().filter(p -> "completed".equals(p.getStatus())).count();

                            int progressPercent = (int) ((completedInStack * 100) / questionsInStack.size());
                            performance.add(new StackPerformanceDTO(stack.getName(), progressPercent, "text-primary", (int) completedInStack, questionsInStack.size()));
                        }

                        // 5. Calculate Radar Data (By Category in Domain)
                        List<DomainCategoryMap> domainCategories = domainCategoryMapRepository.findCategoriesByDomainId(domainId);
                        for (DomainCategoryMap dcm : domainCategories) {
                            StackCategory category = dcm.getCategory();
                            List<DomainStackMap> stacksInCategory = domainStacks.stream()
                                    .filter(s -> s.getCategory().getId().equals(category.getId()))
                                    .collect(Collectors.toList());

                            long totalQuestionsInCategory = 0;
                            long completedQuestionsInCategory = 0;
                            java.util.Set<Long> categoryQIds = new java.util.HashSet<>();

                            for (DomainStackMap dsm : stacksInCategory) {
                                List<QuestionStackIndex> qisList = questionStackIndexRepository.findByStackIdOrderByOrderIndexAsc(dsm.getStack().getId());
                                for (QuestionStackIndex qsi : qisList) {
                                    categoryQIds.add(qsi.getQuestionId());
                                }
                            }

                            if (!categoryQIds.isEmpty()) {
                                totalQuestionsInCategory = categoryQIds.size();
                                List<UserQuestionProgress> catProgress = progressRepository.findByUserIdAndQuestionIdIn(userId, categoryQIds);
                                completedQuestionsInCategory = catProgress.stream().filter(p -> "completed".equals(p.getStatus())).count();
                            }

                            int mastery = totalQuestionsInCategory > 0 
                                    ? (int) ((completedQuestionsInCategory * 100) / totalQuestionsInCategory) 
                                    : 0;
                            
                            radarData.add(new RadarDataDTO(category.getName(), mastery));

                            // Add to Weak Areas if mastery is low
                            if (mastery < 50 && weakAreas.size() < 3 && totalQuestionsInCategory > 0) {
                                weakAreas.add(new WeakAreaDTO(category.getName(), 
                                    "Mastery at " + mastery + "%. Practice more " + category.getName() + " patterns.", 
                                    mastery, 
                                    mastery < 25 ? "bg-red-500/20" : "bg-amber-500/20"));
                            }
                        }
                    }
                }

                // Global user stats (Streak/Bookmarks/Activity)
                currentStreak = streakRepository.findById(userId).map(UserStreak::getCurrentStreak).orElse(0);
                bookmarksCount = bookmarkRepository.findByUserId(userId).size();
                recentActivity = activityLogRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                        .limit(5)
                        .map(log -> (log.getActivityType() != null ? log.getActivityType().replace("_", " ") : "Activity") + " - " + (log.getCreatedAt() != null ? log.getCreatedAt().toLocalDate().toString() : ""))
                        .collect(Collectors.toList());
            }
        }

        // Fallbacks
        if (performance.isEmpty()) {
            performance = stackRepository.findAll().stream().limit(4)
                    .map(s -> new StackPerformanceDTO(s.getName(), 0, "text-muted", 0, 0))
                    .collect(Collectors.toList());
        }
        if (radarData.isEmpty()) {
            radarData.add(new RadarDataDTO("Architecture", 0));
            radarData.add(new RadarDataDTO("Logic", 0));
            radarData.add(new RadarDataDTO("Concurrency", 0));
            radarData.add(new RadarDataDTO("Data", 0));
            radarData.add(new RadarDataDTO("UI", 0));
        }
        if (weakAreas.isEmpty()) {
            weakAreas.add(new WeakAreaDTO("Ready to Start", "Select a domain and start reading to track gaps.", 0, "bg-primary/10"));
        }

        return new DashboardSummaryDTO(
                totalQuestions,
                conceptRepository.count(),
                (int) trackRepository.count(),
                (int) domainRepository.count(),
                completedQuestions,
                totalTimeSpent,
                currentStreak,
                bookmarksCount,
                performance,
                weakAreas,
                recentActivity,
                primaryDomainName,
                primaryDomainSlug,
                experienceLevelStr,
                radarData);
    }

    @Transactional
    public void updatePrimaryDomain(UUID userId, Long domainId) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElse(new UserProfile(userId, domainId, "E1_1_TO_3"));
        profile.setPrimaryDomainId(domainId);
        userProfileRepository.save(profile);
    }

    @Transactional
    public void updateStreak(UUID userId) {
        UserStreak streak = streakRepository.findById(userId)
                .orElse(new UserStreak(userId));

        LocalDate today = LocalDate.now();
        LocalDate lastActivity = streak.getLastActivityDate();

        if (lastActivity == null) {
            streak.setCurrentStreak(1);
        } else if (lastActivity.equals(today.minusDays(1))) {
            streak.setCurrentStreak(streak.getCurrentStreak() + 1);
        } else if (!lastActivity.equals(today)) {
            streak.setCurrentStreak(1);
        }

        if (streak.getCurrentStreak() > streak.getLongestStreak()) {
            streak.setLongestStreak(streak.getCurrentStreak());
        }

        streak.setLastActivityDate(today);
        streak.setUpdatedAt(LocalDateTime.now());
        streakRepository.save(streak);
    }
}
