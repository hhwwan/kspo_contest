package com.example.backend.controller;

import com.example.backend.service.OpenAIService;
import com.example.backend.entity.ChatMessage;
import com.example.backend.dto.ChatMessageDTO;
import com.example.backend.jwt.JwtTokenProvider;
import com.example.backend.service.ChatService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final JwtTokenProvider jwtTokenProvider;
    private final OpenAIService openAIService;

    public ChatController(ChatService chatService,
                          JwtTokenProvider jwtTokenProvider,
                          OpenAIService openAIService) {
        this.chatService = chatService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.openAIService = openAIService;
    }

    private String extractUsername(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String actualToken = token.substring(7);
            if (jwtTokenProvider.validateToken(actualToken)) {
                return jwtTokenProvider.extractUsername(actualToken);
            }
        }
        return null;
    }
    
    // 메시지 전송
    @PostMapping("/send")
    public Map<String, String> sendMessage(@RequestBody Map<String, String> payload,
                                           @RequestHeader(value = "Authorization", required = false) String token,
                                           HttpSession session) {

        String username = extractUsername(token);
        String userMessage = payload.get("message");

        String botResponse;

        if (username != null) {
            // 로그인 유저: 저장하기 전에 이전 대화 히스토리만 불러오기
            List<ChatMessageDTO> historyBeforeCurrent = chatService.getChatHistory(username, session);
            
            // 🔍 디버깅: 히스토리 확인
            System.out.println("📝 현재 메시지: " + userMessage);
            System.out.println("📚 히스토리 개수: " + historyBeforeCurrent.size());
            
            botResponse = openAIService.getChatbotReplyWithHistory(userMessage, historyBeforeCurrent);
        } else {
            // 🔹 비로그인 유저: 현재 메시지만 전달
            botResponse = openAIService.getChatbotReply(userMessage);
        }

        // 🔹 사용자 메시지 저장 (OpenAI 호출 후)
        chatService.saveMessage("user", userMessage, username, session);
        
        // 🔹 챗봇 응답 저장
        chatService.saveMessage("bot", botResponse, username, session);

        return Map.of("reply", botResponse);
    }

    // 대화 기록 조회
    @GetMapping("/history")
    public List<ChatMessageDTO> getChatHistory(@RequestHeader(value = "Authorization", required = false) String token,
                                            HttpSession session) {

        String username = extractUsername(token);
        if (username == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 필요");
        }

        System.out.println("ChatController username: " + username); // 테스트용 안지우고 놔둬도 될듯
        return chatService.getChatHistory(username, session);
    }
}