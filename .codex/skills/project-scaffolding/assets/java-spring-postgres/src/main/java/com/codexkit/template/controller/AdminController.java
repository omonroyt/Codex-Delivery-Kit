package com.codexkit.template.controller;

import com.codexkit.template.domain.User;
import com.codexkit.template.repo.UserRepository;
import com.codexkit.template.service.AuthService;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {
  private final AuthService authService;
  private final UserRepository userRepository;

  public AdminController(AuthService authService, UserRepository userRepository) {
    this.authService = authService;
    this.userRepository = userRepository;
  }

  @GetMapping("/users")
  public Map<String, Object> users(@RequestHeader("Authorization") String authorization) {
    User user = authService.requireUser(authorization);
    if (!"admin".equals(user.getRole())) {
      throw new RuntimeException("forbidden");
    }
    return Map.of("users", userRepository.findAll());
  }
}

