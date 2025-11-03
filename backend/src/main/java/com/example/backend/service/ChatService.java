package com.example.backend.service;

import com.example.backend.entity.ChatHistory;
import com.example.backend.entity.ChatMessage;
import com.example.backend.model.User;
import com.example.backend.repository.ChatHistoryRepository;
import com.example.backend.repository.ChatMessageRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.dto.ChatMessageDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatHistoryRepository chatHistoryRepository;
    private final UserRepository userRepository;

    public ChatService(ChatMessageRepository chatMessageRepository,
                      ChatHistoryRepository chatHistoryRepository,
                      UserRepository userRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatHistoryRepository = chatHistoryRepository;
        this.userRepository = userRepository;
    }

    // 메시지 저장
    public void saveMessage(String role, String message, String username, HttpSession session) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setRole(role);
        chatMessage.setMessage(message);
        chatMessage.setCreatedAt(LocalDateTime.now());

        if (username != null) {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            chatMessage.setUser(user);

            ChatHistory chatHistory = chatHistoryRepository.findByUserId(user.getId())
                    .stream()
                    .findFirst()
                    .orElseGet(() -> {
                        ChatHistory newChatHistory = new ChatHistory();
                        newChatHistory.setUser(user);
                        newChatHistory.setTitle(username + "의 채팅");
                        newChatHistory.setSessionId(session.getId());
                        newChatHistory.setCreatedAt(LocalDateTime.now());
                        return chatHistoryRepository.save(newChatHistory);
                    });

            chatMessage.setChatHistory(chatHistory);
        }

        chatMessageRepository.save(chatMessage);
        System.out.println("Saved message: " + chatMessage);
    }

    //  대화 히스토리 조회 (DTO로 변환, 최근 20개만)
    public List<ChatMessageDTO> getChatHistory(String username, HttpSession session) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ChatMessage> messages = chatMessageRepository.findByUserId(user.getId());
        
        //  최근 20개만 선택
        int startIdx = Math.max(0, messages.size() - 20);
        List<ChatMessage> recentMessages = messages.subList(startIdx, messages.size());
        
        // DTO로 변환 (순환 참조 방지)
        return recentMessages.stream()
                .map(ChatMessageDTO::fromEntity)
                .collect(Collectors.toList());
    }
}