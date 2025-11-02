package com.example.backend.repository;

import com.example.backend.entity.ChatHistory;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    Optional<ChatHistory> findByUser(User user);
    Optional<ChatHistory> findBySessionId(String sessionId);
    List<ChatHistory> findByUserId(Long userId);
}