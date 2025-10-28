package com.example.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.*;
import com.example.backend.model.Exercise;
import com.example.backend.service.S3CsvService;

@Slf4j
@Service
public class OpenAIService {

    private final WebClient webClient;
    private final S3CsvService s3CsvService;

    @Value("${openai.api.key}")
    private String openaiApiKey;

    private static final String OPENAI_MODEL = "gpt-3.5-turbo";

    private final String bucketName = "kspo";
    private final String fileKey = "processed_data/kspo_physical_100/kspo_video_link.csv";

    public OpenAIService(WebClient.Builder webClientBuilder, S3CsvService s3CsvService) {
        this.webClient = webClientBuilder
                .baseUrl("https://api.openai.com/v1/chat/completions")
                .build();
        this.s3CsvService = s3CsvService;
    }

public String getChatbotReply(String message) {
    if (message == null || message.isEmpty()) {
        return "메시지가 비어 있습니다. 입력을 다시 확인해주세요.";
    }

    // 공백 제거 후 정규식으로 실내/실외 운동 감지
    String normalized = message.replaceAll("\\s+", "");
    if (normalized.matches(".*실내\\s*운동.*") || message.matches(".*실내\\s*운동.*")) {
        return getExerciseRecommendation("실내운동");
    } else if (normalized.matches(".*실외\\s*운동.*") || message.matches(".*실외\\s*운동.*")) {
        return getExerciseRecommendation("실외운동");
    }

    // 일반 대화용 OpenAI API 호출
    List<Map<String, String>> systemPrompts = List.of(
            Map.of("role", "system", "content", "너는 친절한 한국어 챗봇이야."),
            Map.of("role", "system", "content", "너는 체육시설에 대해 전문적으로 설명할 수 있어."),
            Map.of("role", "system", "content", "항상 존댓말을 사용해야 해."),
            Map.of("role", "system", "content", "너의 답변은 명확하고 간결해야 해.")
    );

    List<Map<String, String>> messages = new ArrayList<>(systemPrompts);
    messages.add(Map.of("role", "user", "content", message));

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
                .block();

        if (response == null) return "응답이 비어 있습니다.";

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


    private String getExerciseRecommendation(String locationType) {
    List<Exercise> exercises = s3CsvService.loadExercisesFromS3(bucketName, fileKey);
    if (exercises.isEmpty()) return "운동 데이터를 불러오지 못했습니다.";

    List<Exercise> filtered = new ArrayList<>();
    for (Exercise e : exercises) {
        if (e.getLocationType().equalsIgnoreCase(locationType)) {
            filtered.add(e);
        }
    }

    if (filtered.isEmpty()) return locationType + " 관련 운동을 찾을 수 없습니다.";

    Collections.shuffle(filtered);
    List<Exercise> selected = new ArrayList<>(filtered.stream().limit(3).toList());

    StringBuilder sb = new StringBuilder();
    sb.append("추천드리는 ").append(locationType).append("이에요!<br><br>");

    for (Exercise e : selected) {
        sb.append("• ").append(e.getTitle()).append("<br>")
          .append("<a href='").append(e.getVideoUrl())
          .append("' target='_blank' style='color:#007bff;text-decoration:underline;'>")
          .append("영상 보러가기")
          .append("</a><br><br>");
    }

    sb.append("즐겁게 운동해보세요! 🏃‍♀️");
    return sb.toString();
}
}
