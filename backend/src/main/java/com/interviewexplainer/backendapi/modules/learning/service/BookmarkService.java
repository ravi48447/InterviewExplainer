package com.interviewexplainer.backendapi.modules.learning.service;

import com.interviewexplainer.backendapi.modules.learning.entity.UserBookmark;
import com.interviewexplainer.backendapi.modules.learning.repository.UserBookmarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class BookmarkService {

    @Autowired
    private UserBookmarkRepository bookmarkRepository;

    @Transactional
    public void addBookmark(UUID userId, Long questionId) {
        if (bookmarkRepository.findByUserIdAndQuestionId(userId, questionId).isEmpty()) {
            bookmarkRepository.save(new UserBookmark(userId, questionId));
        }
    }

    @Transactional
    public void removeBookmark(UUID userId, Long questionId) {
        bookmarkRepository.findByUserIdAndQuestionId(userId, questionId)
                .ifPresent(bookmarkRepository::delete);
    }

    public List<UserBookmark> getBookmarks(UUID userId) {
        return bookmarkRepository.findByUserId(userId);
    }

    public boolean isBookmarked(UUID userId, Long questionId) {
        return bookmarkRepository.findByUserIdAndQuestionId(userId, questionId).isPresent();
    }
}
