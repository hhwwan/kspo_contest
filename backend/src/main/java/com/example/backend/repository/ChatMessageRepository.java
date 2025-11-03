package com.example.backend.repository;

import com.example.backend.entity.ChatMessage;
import com.example.backend.entity.ChatHistory;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByUser(User user);
    List<ChatMessage> findByChatHistory_SessionId(String sessionId);
    List<ChatMessage> findByUserId(Long userId);
}