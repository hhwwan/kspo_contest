package com.example.backend.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

/**
 * EnvConfig.java
 *
 * 이 클래스는 프로젝트 실행 시 .env 파일을 자동으로 로드하여
 * .env 내의 환경 변수를 System Property로 등록합니다.
 * application.properties에서는 ${KEY_NAME} 형태로 접근할 수 있습니다.
 */
@Configuration
public class EnvConfig {

    static {
        // .env 파일 로드
        Dotenv dotenv = Dotenv.configure()
                .directory("./")   // .env 파일이 backend 루트에 위치한 경우
                .ignoreIfMissing() // 파일이 없을 경우 에러 없이 무시
                .load();

        // .env의 모든 key-value를 시스템 속성으로 등록
        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );
    }
}
