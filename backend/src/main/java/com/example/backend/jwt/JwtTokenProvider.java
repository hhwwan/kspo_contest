package com.example.backend.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;
import java.util.Base64;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKeyString;

    @Value("${jwt.expiration}")
    private long validityInMilliseconds;

    private Key secretKey;

    // --- 초기화 ---
    @PostConstruct
    protected void init() {
        // Base64로 인코딩된 문자열을 실제 Key 객체로 변환
        byte[] keyBytes = Base64.getEncoder().encode(secretKeyString.getBytes());
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    // 토큰 생성
    public String createToken(String username) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(secretKey, SignatureAlgorithm.HS256) // 반드시 시그니처 알고리즘 지정
                .compact();
    }

    // 토큰에서 username 추출
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // 토큰 유효성 체크
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // 이전 코드에서 사용한 getUsernameFromToken -> extractUsername으로 통일
    public String getUsernameFromToken(String token) {
        return extractUsername(token);
    }
}
