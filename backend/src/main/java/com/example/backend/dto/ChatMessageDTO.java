package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private Long id;
    private String role;
    private String message;
    private LocalDateTime createdAt;
    
    // ChatMessage 엔티티를 DTO로 변환하는 정적 메서드
    public static ChatMessageDTO fromEntity(com.example.backend.entity.ChatMessage entity) {
        return new ChatMessageDTO(
            entity.getId(),
            entity.getRole(),
            entity.getMessage(),
            entity.getCreatedAt()
        );
    }
}