package com.codexkit.template.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 255)
  private String email;

  @Column(nullable = false, length = 255)
  private String passwordHash;

  @Column(length = 255)
  private String name;

  @Column(nullable = false, length = 50)
  private String role = "user";

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPasswordHash() { return passwordHash; }
  public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getRole() { return role; }
  public void setRole(String role) { this.role = role; }
  public Instant getCreatedAt() { return createdAt; }
}

