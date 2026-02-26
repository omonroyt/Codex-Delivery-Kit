package com.codexkit.template.controller;

import com.codexkit.template.domain.User;
import com.codexkit.template.service.AuthService;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public Map<String, Object> register(@RequestBody Map<String, String> payload) {
    return authService.register(payload.get("email"), payload.get("password"), payload.get("name"));
  }

  @PostMapping("/login")
  public Map<String, Object> login(@RequestBody Map<String, String> payload) {
    return authService.login(payload.get("email"), payload.get("password"));
  }

  @PostMapping("/refresh")
  public Map<String, Object> refresh(@RequestBody Map<String, String> payload) {
    return authService.refresh(payload.get("refresh_token"));
  }

  @GetMapping("/me")
  public Map<String, Object> me(@RequestHeader("Authorization") String authorization) {
    User user = authService.requireUser(authorization);
    return Map.of("user", Map.of("id", user.getId(), "email", user.getEmail(), "role", user.getRole()));
  }
}

