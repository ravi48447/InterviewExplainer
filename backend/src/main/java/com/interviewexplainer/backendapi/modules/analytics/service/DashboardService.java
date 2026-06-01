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
import com.interviewexplainer.backendapi.modules.content.entity.enums.QuestionDifficulty;
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
        int longestStreak = 0;
        long bookmarksCount = 0;
        List<RecentActivityDTO> recentActivity = new ArrayList<>();
        List<StackPerformanceDTO> performance = new ArrayList<>();
        List<WeakAreaDTO> weakAreas = new ArrayList<>();
        List<RadarDataDTO> radarData = new ArrayList<>();
        List<DailyActivityDTO> dailyActivity = new ArrayList<>();
        DifficultyBreakdownDTO difficultyBreakdown = new DifficultyBreakdownDTO(0, 0, 0);
        java.util.Set<Long> completedQuestionIds = new java.util.HashSet<>();

        String primaryDomainName = null;
        String primaryDomainSlug = null;
        String experienceLevelStr = null;

        if (userId != null) {
            // Get user profile to find primary domain
            UserProfile profile = userProfileRepository.findById(userId).orElse(null);
            
            if (profile != null) {
                experienceLevelStr = profile.getExperienceLevel();
                Long domainId = profile.getPrimaryDomainId();
                String storedSlug = profile.getPrimaryDomainSlug();
                
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

                            for (UserQuestionProgress p : domainProgress) {
                                if ("completed".equals(p.getStatus())) {
                                    completedQuestionIds.add(p.getQuestionId());
                                }
                            }
                            completedQuestions = completedQuestionIds.size();

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
                UserStreak streakEntity = streakRepository.findById(userId).orElse(null);
                currentStreak = streakEntity != null && streakEntity.getCurrentStreak() != null ? streakEntity.getCurrentStreak() : 0;
                longestStreak = streakEntity != null && streakEntity.getLongestStreak() != null ? streakEntity.getLongestStreak() : 0;
                bookmarksCount = bookmarkRepository.findByUserId(userId).size();

                List<UserActivityLog> activityLogs = activityLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
                recentActivity = activityLogs.stream()
                        .limit(5)
                        .map(this::toRecentActivity)
                        .collect(Collectors.toList());

                // Real study-activity heatmap (last 53 weeks), counting engagement per day.
                dailyActivity = buildDailyActivity(userId, activityLogs);

                // Real difficulty distribution of the user's completed questions.
                difficultyBreakdown = buildDifficultyBreakdown(completedQuestionIds);

                // The stored content slug is the source of truth for the focus
                // domain (the frontend renders that domain's real stacks/questions
                // from the filesystem content tree). Prefer it over the slug
                // derived from the legacy numeric domain id.
                if (storedSlug != null && !storedSlug.isBlank()) {
                    primaryDomainSlug = storedSlug;
                }
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
                longestStreak,
                bookmarksCount,
                performance,
                weakAreas,
                recentActivity,
                primaryDomainName,
                primaryDomainSlug,
                experienceLevelStr,
                radarData,
                dailyActivity,
                difficultyBreakdown);
    }

    /* ── Real-data helpers ─────────────────────────────────────────── */

    private RecentActivityDTO toRecentActivity(UserActivityLog log) {
        String rawType = log.getActivityType() != null ? log.getActivityType() : "ACTIVITY";
        String title = humanizeActivityType(rawType);
        String detail = null;
        if (log.getEntityType() != null
                && log.getEntityType().toLowerCase().contains("question")
                && log.getEntityId() != null) {
            detail = questionRepository.findById(log.getEntityId())
                    .map(Question::getTitle)
                    .orElse(null);
        }
        String date = log.getCreatedAt() != null ? log.getCreatedAt().toLocalDate().toString() : "";
        return new RecentActivityDTO(title, detail, rawType, date);
    }

    private String humanizeActivityType(String type) {
        switch (type.toUpperCase()) {
            case "QUESTION_COMPLETED": return "Completed a question";
            case "QUESTION_VIEWED":    return "Viewed a question";
            case "QUESTION_STARTED":   return "Started a question";
            case "BOOKMARK_ADDED":     return "Saved a bookmark";
            case "BOOKMARK_REMOVED":   return "Removed a bookmark";
            case "MOCK_STARTED":       return "Started a mock interview";
            case "MOCK_COMPLETED":     return "Finished a mock interview";
            default:
                String lower = type.toLowerCase().replace('_', ' ').trim();
                if (lower.isEmpty()) return "Activity";
                return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
        }
    }

    /**
     * Builds a per-day engagement count for the dashboard heatmap (last ~53
     * weeks). Prefers the activity log; if that is empty it falls back to the
     * user's question-progress timestamps so the heatmap still reflects real
     * study even before activity-log instrumentation is complete. Only non-zero
     * days are emitted (the frontend fills the gaps).
     */
    private List<DailyActivityDTO> buildDailyActivity(UUID userId, List<UserActivityLog> activityLogs) {
        java.util.Map<LocalDate, Integer> dayCounts = new java.util.HashMap<>();
        for (UserActivityLog log : activityLogs) {
            if (log.getCreatedAt() != null) {
                dayCounts.merge(log.getCreatedAt().toLocalDate(), 1, Integer::sum);
            }
        }
        if (dayCounts.isEmpty()) {
            for (UserQuestionProgress p : progressRepository.findByUserId(userId)) {
                LocalDate day = null;
                if (p.getCompletedAt() != null) day = p.getCompletedAt().toLocalDate();
                else if (p.getLastViewedAt() != null) day = p.getLastViewedAt().toLocalDate();
                if (day != null) dayCounts.merge(day, 1, Integer::sum);
            }
        }
        List<DailyActivityDTO> out = new ArrayList<>();
        LocalDate today = LocalDate.now();
        LocalDate start = today.minusDays(370);
        for (LocalDate d = start; !d.isAfter(today); d = d.plusDays(1)) {
            int c = dayCounts.getOrDefault(d, 0);
            if (c > 0) out.add(new DailyActivityDTO(d.toString(), c));
        }
        return out;
    }

    private DifficultyBreakdownDTO buildDifficultyBreakdown(java.util.Set<Long> completedQuestionIds) {
        if (completedQuestionIds.isEmpty()) return new DifficultyBreakdownDTO(0, 0, 0);
        int easy = 0, medium = 0, hard = 0;
        for (Question q : questionRepository.findAllById(completedQuestionIds)) {
            QuestionDifficulty diff = q.getDifficulty();
            if (diff == QuestionDifficulty.easy) easy++;
            else if (diff == QuestionDifficulty.hard) hard++;
            else medium++;
        }
        return new DifficultyBreakdownDTO(easy, medium, hard);
    }

    @Transactional
    public void updatePrimaryDomain(UUID userId, Long domainId) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElse(new UserProfile(userId, domainId, "E1_1_TO_3"));
        profile.setPrimaryDomainId(domainId);
        userProfileRepository.save(profile);
    }

    /**
     * Sets the user's focus domain by its canonical content slug (e.g.
     * "java-backend-intermediate"). This is what the dashboard uses to load the
     * domain's real stacks/questions from the filesystem content tree.
     */
    @Transactional
    public void updatePrimaryDomainSlug(UUID userId, String slug) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElse(new UserProfile(userId, null, "intermediate"));
        profile.setPrimaryDomainSlug(slug);
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
