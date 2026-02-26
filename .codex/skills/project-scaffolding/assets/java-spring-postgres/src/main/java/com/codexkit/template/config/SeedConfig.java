package com.codexkit.template.config;

import com.codexkit.template.domain.User;
import com.codexkit.template.repo.UserRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SeedConfig {
  @Bean
  CommandLineRunner seedAdmin(
      UserRepository userRepository,
      @Value("${SEED_ADMIN_EMAIL:admin@example.com}") String adminEmail,
      @Value("${SEED_ADMIN_PASSWORD:admin123456}") String adminPassword) {
    return args -> {
      Optional<User> exists = userRepository.findByEmail(adminEmail.toLowerCase());
      if (exists.isPresent()) return;
      User admin = new User();
      admin.setEmail(adminEmail.toLowerCase());
      admin.setPasswordHash(new BCryptPasswordEncoder().encode(adminPassword));
      admin.setRole("admin");
      admin.setName("Admin");
      userRepository.save(admin);
    };
  }
}

