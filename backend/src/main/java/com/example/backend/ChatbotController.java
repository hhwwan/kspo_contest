package com.example.backend.controller;

import com.example.backend.service.OpenAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

@RestController
@RequestMapping("/api/chat")

public class ChatbotController {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotController.class);

    @Autowired
    private OpenAIService openAIService;

    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        logger.info("사용자 입력: {}", userMessage);   // 사용자 입력 로그

        String botReply = openAIService.getChatbotReply(userMessage);
        logger.info("챗봇 응답: {}", botReply);       // 챗봇 응답 로그

        Map<String, String> response = new HashMap<>();
        response.put("reply", botReply);
        return response;
    }
}