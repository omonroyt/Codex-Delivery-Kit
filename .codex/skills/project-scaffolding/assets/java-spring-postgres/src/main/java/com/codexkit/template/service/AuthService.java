package com.codexkit.template.service;

import com.codexkit.template.domain.RefreshToken;
import com.codexkit.template.domain.User;
import com.codexkit.template.repo.RefreshTokenRepository;
import com.codexkit.template.repo.UserRepository;
import com.codexkit.template.security.JwtProvider;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.Map;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final UserRepository userRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final JwtProvider jwtProvider;
  private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

  public AuthService(
      UserRepository userRepository,
      RefreshTokenRepository refreshTokenRepository,
      JwtProvider jwtProvider) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
    this.jwtProvider = jwtProvider;
  }

  public Map<String, Object> register(String email, String password, String name) {
    String normalized = email.toLowerCase();
    userRepository.findByEmail(normalized).ifPresent(user -> {
      throw new RuntimeException("email_already_exists");
    });
    User user = new User();
    user.setEmail(normalized);
    user.setPasswordHash(encoder.encode(password));
    user.setName(name);
    user.setRole("user");
    userRepository.save(user);
    return Map.of("user", Map.of("id", user.getId(), "email", user.getEmail(), "role", user.getRole()));
  }

  public Map<String, Object> login(String email, String password) {
    User user = userRepository.findByEmail(email.toLowerCase())
        .orElseThrow(() -> new RuntimeException("invalid_credentials"));
    if (!encoder.matches(password, user.getPasswordHash())) {
      throw new RuntimeException("invalid_credentials");
    }
    String access = jwtProvider.createAccessToken(user.getId(), user.getRole());
    String refresh = jwtProvider.createRefreshToken(user.getId(), user.getRole());
    RefreshToken token = new RefreshToken();
    token.setTokenHash(hashToken(refresh));
    token.setUser(user);
    token.setExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS));
    refreshTokenRepository.save(token);
    return Map.of(
        "access_token", access,
        "refresh_token", refresh,
        "user", Map.of("id", user.getId(), "email", user.getEmail(), "role", user.getRole()));
  }

  public Map<String, Object> refresh(String refreshToken) {
    Map<String, Object> claims = jwtProvider.parseToken(refreshToken);
    if (!"refresh".equals(String.valueOf(claims.get("token_type")))) {
      throw new RuntimeException("invalid_token_type");
    }
    RefreshToken saved = refreshTokenRepository.findByTokenHash(hashToken(refreshToken))
        .orElseThrow(() -> new RuntimeException("refresh_token_not_found"));
    if (saved.getExpiresAt().isBefore(Instant.now())) {
      throw new RuntimeException("refresh_token_expired");
    }
    Long userId = Long.parseLong(String.valueOf(claims.get("sub")));
    String role = String.valueOf(claims.get("role"));
    return Map.of("access_token", jwtProvider.createAccessToken(userId, role));
  }

  public User requireUser(String authorizationHeader) {
    if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
      throw new RuntimeException("missing_token");
    }
    String token = authorizationHeader.substring(7);
    Map<String, Object> claims = jwtProvider.parseToken(token);
    if (!"access".equals(String.valueOf(claims.get("token_type")))) {
      throw new RuntimeException("invalid_token_type");
    }
    Long userId = Long.parseLong(String.valueOf(claims.get("sub")));
    return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("user_not_found"));
  }

  public String hashToken(String token) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] output = digest.digest(token.getBytes(StandardCharsets.UTF_8));
      return HexFormat.of().formatHex(output);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}

