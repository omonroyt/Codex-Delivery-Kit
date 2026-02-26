package com.codexkit.template.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "payments")
public class Payment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id")
  private User user;

  @Column(nullable = false)
  private Integer amount;

  @Column(nullable = false, length = 10)
  private String currency = "USD";

  @Column(nullable = false, length = 50)
  private String provider = "mock";

  @Column(nullable = false, length = 20)
  private String status = "PENDING";

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public Integer getAmount() { return amount; }
  public void setAmount(Integer amount) { this.amount = amount; }
  public String getCurrency() { return currency; }
  public void setCurrency(String currency) { this.currency = currency; }
  public String getProvider() { return provider; }
  public void setProvider(String provider) { this.provider = provider; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
}

