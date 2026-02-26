package com.codexkit.template.controller;

import com.codexkit.template.domain.Message;
import com.codexkit.template.domain.User;
import com.codexkit.template.repo.MessageRepository;
import com.codexkit.template.service.AuthService;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/messages")
public class MessagesController {
  private final AuthService authService;
  private final MessageRepository messageRepository;

  public MessagesController(AuthService authService, MessageRepository messageRepository) {
    this.authService = authService;
    this.messageRepository = messageRepository;
  }

  @PostMapping("/send")
  public Map<String, Object> send(
      @RequestHeader("Authorization") String authorization,
      @RequestBody Map<String, Object> payload) {
    User user = authService.requireUser(authorization);
    Message message = new Message();
    message.setSender(user);
    message.setChannel(String.valueOf(payload.getOrDefault("channel", "in_app")));
    message.setPayload(String.valueOf(payload.get("payload")));
    message.setStatus("QUEUED");
    messageRepository.save(message);
    return Map.of("message", message, "next_action", "connect_queue_or_provider");
  }
}

