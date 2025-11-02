package com.example.backend.controller;

import com.example.backend.dto.SignupRequest;
import com.example.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponse;

@RestController
@RequestMapping("/api") // /api/signup, /api/login
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest signupRequest) {
        try {
            authService.registerNewUser(signupRequest);
            return ResponseEntity.ok("회원가입 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // 콘솔에 자세한 예외 확인
            return ResponseEntity.internalServerError().body("회원가입 실패: " + e.getMessage());
        }
    }

    @PostMapping("/login")
public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
    try {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(new LoginResponse(null, e.getMessage()));
    } catch (Exception e) {
        return ResponseEntity.internalServerError().body(new LoginResponse(null, "로그인 실패: " + e.getMessage()));
    }
}

}
