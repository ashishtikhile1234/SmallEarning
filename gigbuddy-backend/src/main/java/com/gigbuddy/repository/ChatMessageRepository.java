package com.gigbuddy.repository;

import com.gigbuddy.model.Application;
import com.gigbuddy.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByApplicationOrderBySentAtAsc(Application application);
}
