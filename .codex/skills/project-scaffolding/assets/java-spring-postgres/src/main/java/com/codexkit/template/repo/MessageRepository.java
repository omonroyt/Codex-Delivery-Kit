package com.codexkit.template.repo;

import com.codexkit.template.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {}

