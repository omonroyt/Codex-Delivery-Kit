package com.codexkit.template.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "messages")
public class Message {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "sender_id")
  private User sender;

  @Column(nullable = false, length = 50)
  private String channel = "in_app";

  @Column(nullable = false, length = 1000)
  private String payload;

  @Column(nullable = false, length = 20)
  private String status = "QUEUED";

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public User getSender() { return sender; }
  public void setSender(User sender) { this.sender = sender; }
  public String getChannel() { return channel; }
  public void setChannel(String channel) { this.channel = channel; }
  public String getPayload() { return payload; }
  public void setPayload(String payload) { this.payload = payload; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
}

