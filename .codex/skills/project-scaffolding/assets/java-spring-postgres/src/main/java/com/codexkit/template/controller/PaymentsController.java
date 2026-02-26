package com.codexkit.template.controller;

import com.codexkit.template.domain.Payment;
import com.codexkit.template.domain.User;
import com.codexkit.template.repo.PaymentRepository;
import com.codexkit.template.service.AuthService;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentsController {
  private final AuthService authService;
  private final PaymentRepository paymentRepository;

  public PaymentsController(AuthService authService, PaymentRepository paymentRepository) {
    this.authService = authService;
    this.paymentRepository = paymentRepository;
  }

  @PostMapping("/checkout")
  public Map<String, Object> checkout(
      @RequestHeader("Authorization") String authorization,
      @RequestBody Map<String, Object> payload) {
    User user = authService.requireUser(authorization);
    Payment payment = new Payment();
    payment.setUser(user);
    payment.setAmount(Integer.parseInt(String.valueOf(payload.get("amount"))));
    payment.setCurrency(String.valueOf(payload.getOrDefault("currency", "USD")));
    payment.setProvider(String.valueOf(payload.getOrDefault("provider", "mock")));
    payment.setStatus("PENDING");
    paymentRepository.save(payment);
    return Map.of("payment", payment, "next_action", "connect_real_payment_provider");
  }
}

