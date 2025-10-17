package com.example.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class OpenAIService {

    private final WebClient webClient;

    @Value("${openai.api.key}")
    private String openaiApiKey;

    private static final String OPENAI_MODEL = "gpt-3.5-turbo";

    public OpenAIService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://api.openai.com/v1/chat/completions")
                .build();
    }

    public String getChatbotReply(String message) {
        // 여러 개의 system 프롬프트를 리스트로 관리
        List<Map<String, String>> systemPrompts = List.of(
                Map.of("role", "system", "content", "너는 친절한 한국어 챗봇이야."),
                Map.of("role", "system", "content", "너는 체육시설에 대해 전문적으로 설명할 수 있어."),
                Map.of("role", "system", "content", "항상 존댓말을 사용해야 해."),
                Map.of("role", "system", "content", "너의 답변은 명확하고 간결해야 해.")
        );

        // 유저 메시지 추가
        List<Map<String, String>> messages = new ArrayList<>(systemPrompts);
        messages.add(Map.of("role", "user", "content", message));

        // 요청 JSON
        Map<String, Object> requestBody = Map.of(
                "model", OPENAI_MODEL,
                "messages", messages
        );

        try {
            Map response = webClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + openaiApiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(status -> !status.is2xxSuccessful(),
                            clientResponse -> {
                                log.error("OpenAI API 오류 상태 코드: {}", clientResponse.statusCode());
                                return Mono.error(new RuntimeException("OpenAI API 호출 실패"));
                            })
                    .bodyToMono(Map.class)
                    .block(); // 동기 방식으로 결과 대기

            if (response == null) {
                return "응답이 비어 있습니다.";
            }

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> messageObj = (Map<String, Object>) choices.get(0).get("message");
                if (messageObj != null) {
                    return (String) messageObj.getOrDefault("content", "답변이 없습니다.");
                }
            }

            return "답변을 찾을 수 없어요.";
        } catch (Exception e) {
            log.error("OpenAI API 호출 중 예외 발생", e);
            return "현재 답변을 가져오는 데 문제가 발생했어요. 잠시 후 다시 시도해주세요.";
        }
    }
}
