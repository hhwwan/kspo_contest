package com.example.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.*;
import com.example.backend.model.Exercise;
import com.example.backend.dto.ChatMessageDTO;

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

    //  비로그인 사용자용 (기존 방식)
    public String getChatbotReply(String message) {
        if (message == null || message.isEmpty()) {
            return "메시지가 비어 있습니다. 입력을 다시 확인해주세요.";
        }

        // 🔍 디버깅 로그
        log.info(" [비로그인] 입력 메시지: {}", message);

        // 운동 추천 키워드 체크 (현재 메시지만)
        if (isExerciseRequest(message)) {
            String exerciseType = getExerciseType(message);
            log.info(" [비로그인] 운동 추천 감지: {}", exerciseType);
            return getExerciseRecommendation(exerciseType);
        }

        // 일반 대화용 OpenAI API 호출
       List<Map<String, String>> systemPrompts = List.of(
            Map.of("role", "system", "content", "너는 친절한 한국어 챗봇입니다."),
            Map.of("role", "system", "content", "항상 존댓말을 사용해야합니다."),
            Map.of("role", "system", "content", "너의 답변은 명확하고 간결해야 해야합니다."),
            Map.of("role", "system", "content",
                "우리 웹사이트 이름은 '레저업'입니다." +
                "사용자가 웹사이트와 관련된 질문을 하면 반드시 모든 내용을 존댓말로 안내해야 합니다. " +
                "너는 웹사이트의 주요 서비스와 그 이름을 알고 있으며, 사용자가 질문하면 이를 이해하기 쉽게 안내해야합니다. " +
                "특히 사용자가 '사이트에 대해 설명해줘', '무슨 서비스를 제공해?', '사이트 기능 알려줘'와 같은 질문을 하면 " +
                "반드시 모든 서비스명과 핵심 기능을 함께 설명해야 해야합니다.\n" +
        
                "레저업은 다음과 같은 서비스를 제공합니다:\n" +
        
                "1. 서비스명: '챗봇'\n" +
                "   - 국민체력 100 데이터를 기반으로 개인에게 맞는 운동을 추천해 드리는 서비스입니다.\n" +
        
                "2. 서비스명: '맞춤형 체육시설 검색'\n" +
                "   - 성별·연령별 여가 활동 상위 10개 데이터를 제공하고, 사용자의 주변에서 해당 활동을 할 수 있는 시설 위치를 안내해 드립니다.\n" +
        
                "3. 서비스명: '체육시설 공공 게시판'\n" +
                "   - 체육시설 이용자들을 위한 자유게시판 커뮤니티 기능을 제공하고 있습니다.\n" +
        
                "4. 서비스명: '수요·공급 현황 확인'\n" +
                "   - 인구 특성에 따라 SDI(공급부족지수)와 PDI(잠재 수요 지수)를 분석해 시각화된 이미지로 제공하는 서비스입니다."
)

);

        List<Map<String, String>> messages = new ArrayList<>(systemPrompts);
        messages.add(Map.of("role", "user", "content", message));

        return callOpenAI(messages);
    }

    //  로그인 사용자용 (대화 히스토리 포함)
    public String getChatbotReplyWithHistory(String currentMessage, List<ChatMessageDTO> history) {
        if (currentMessage == null || currentMessage.isEmpty()) {
            return "메시지가 비어 있습니다. 입력을 다시 확인해주세요.";
        }

        //  디버깅 로그
        log.info(" [로그인] 현재 메시지: {}", currentMessage);
        log.info(" [로그인] 히스토리 개수: {}", history.size());
        
        // 오직 현재 메시지만 운동 추천 키워드 체크
        if (isExerciseRequest(currentMessage)) {
            String exerciseType = getExerciseType(currentMessage);
            log.info(" [로그인] 운동 추천 감지: {}", exerciseType);
            return getExerciseRecommendation(exerciseType);
        }

        log.info(" [로그인] 일반 대화 모드");

        // 시스템 프롬프트
       List<Map<String, String>> systemPrompts = List.of(
            Map.of("role", "system", "content", "너는 친절한 한국어 챗봇입니다."),
            Map.of("role", "system", "content", "항상 존댓말을 사용해야합니다."),
            Map.of("role", "system", "content", "너의 답변은 명확하고 간결해야 해야합니다."),
            Map.of("role", "system", "content",
                "우리 웹사이트 이름은 '레저업'입니다." +
                "사용자가 웹사이트와 관련된 질문을 하면 반드시 모든 내용을 존댓말로 안내해야 합니다. " +
                "너는 웹사이트의 주요 서비스와 그 이름을 알고 있으며, 사용자가 질문하면 이를 이해하기 쉽게 안내해야합니다. " +
                "특히 사용자가 '사이트에 대해 설명해줘', '무슨 서비스를 제공해?', '사이트 기능 알려줘'와 같은 질문을 하면 " +
                "반드시 모든 서비스명과 핵심 기능을 함께 설명해야 해야합니다.\n" +
        
                "레저업은 다음과 같은 서비스를 제공합니다:\n" +
        
                "1. 서비스명: '챗봇'\n" +
                "   - 국민체력 100 데이터를 기반으로 개인에게 맞는 운동을 추천해 드리는 서비스입니다.\n" +
        
                "2. 서비스명: '맞춤형 체육시설 검색'\n" +
                "   - 성별·연령별 여가 활동 상위 10개 데이터를 제공하고, 사용자의 주변에서 해당 활동을 할 수 있는 시설 위치를 안내해 드립니다.\n" +
        
                "3. 서비스명: '체육시설 공공 게시판'\n" +
                "   - 체육시설 이용자들을 위한 자유게시판 커뮤니티 기능을 제공하고 있습니다.\n" +
        
                "4. 서비스명: '수요·공급 현황 확인'\n" +
                "   - 인구 특성에 따라 SDI(공급부족지수)와 PDI(잠재 수요 지수)를 분석해 시각화된 이미지로 제공하는 서비스입니다."
)
);


        List<Map<String, String>> messages = new ArrayList<>(systemPrompts);

        //  대화 히스토리 추가 (최근 10개만, 현재 메시지 제외)
        int startIdx = Math.max(0, history.size() - 10);
        for (int i = startIdx; i < history.size(); i++) {
            ChatMessageDTO msg = history.get(i);
            String role = msg.getRole().equals("user") ? "user" : "assistant";
            messages.add(Map.of("role", role, "content", msg.getMessage()));
            log.debug("  - 히스토리 추가: [{}] {}", role, msg.getMessage().substring(0, Math.min(30, msg.getMessage().length())));
        }

        //  현재 메시지 추가
        messages.add(Map.of("role", "user", "content", currentMessage));

        return callOpenAI(messages);
    }

    //  운동 추천 요청인지 확인하는 헬퍼 메서드
    private boolean isExerciseRequest(String message) {
        String normalized = message.replaceAll("\\s+", "");
        boolean isIndoor = normalized.contains("실내운동") || 
                          (normalized.contains("실내") && normalized.contains("운동"));
        boolean isOutdoor = normalized.contains("실외운동") || 
                           (normalized.contains("실외") && normalized.contains("운동"));
        
        log.info("   키워드 체크 - 실내: {}, 실외: {}", isIndoor, isOutdoor);
        return isIndoor || isOutdoor;
    }

    //  운동 타입 추출
    private String getExerciseType(String message) {
        String normalized = message.replaceAll("\\s+", "");
        if (normalized.contains("실내운동") || (normalized.contains("실내") && normalized.contains("운동"))) {
            return "실내운동";
        } else if (normalized.contains("실외운동") || (normalized.contains("실외") && normalized.contains("운동"))) {
            return "실외운동";
        }
        return "실내운동"; // 기본값
    }

    // OpenAI API 호출 공통 메서드
    private String callOpenAI(List<Map<String, String>> messages) {
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

    public String getExerciseRecommendation(String locationType) {
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