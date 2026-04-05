package com.mediscan.controller;

import com.mediscan.dto.ApiResponse;
import com.mediscan.dto.auth.AuthRequest;
import com.mediscan.dto.auth.AuthResponse;
import com.mediscan.dto.auth.RegisterRequest;
import com.mediscan.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                authService.register(request),
                "Staff registered successfully"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticate(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                authService.authenticate(request),
                "Authentication successful"
        ));
    }
}
