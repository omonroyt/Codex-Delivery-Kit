package com.codexkit.template.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtProvider {
  private final SecretKey key;
  private final int accessTokenMinutes;
  private final int refreshTokenDays;

  public JwtProvider(
      @Value("${app.jwtSecret}") String secret,
      @Value("${app.accessTokenMinutes}") int accessTokenMinutes,
      @Value("${app.refreshTokenDays}") int refreshTokenDays) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.accessTokenMinutes = accessTokenMinutes;
    this.refreshTokenDays = refreshTokenDays;
  }

  public String createAccessToken(Long userId, String role) {
    Instant now = Instant.now();
    return Jwts.builder()
        .claims(Map.of("role", role, "token_type", "access"))
        .subject(String.valueOf(userId))
        .issuedAt(Date.from(now))
        .expiration(Date.from(now.plusSeconds(accessTokenMinutes * 60L)))
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  public String createRefreshToken(Long userId, String role) {
    Instant now = Instant.now();
    return Jwts.builder()
        .claims(Map.of("role", role, "token_type", "refresh"))
        .subject(String.valueOf(userId))
        .issuedAt(Date.from(now))
        .expiration(Date.from(now.plusSeconds(refreshTokenDays * 86400L)))
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  public Map<String, Object> parseToken(String token) {
    return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
  }
}

