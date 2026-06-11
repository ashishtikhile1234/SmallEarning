package com.gigbuddy.service;

import com.gigbuddy.model.Notification;
import com.gigbuddy.model.User;
import com.gigbuddy.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void send(User user, String message, String type) {
        Notification n = Notification.builder()
                .user(user)
                .message(message)
                .type(type)
                .build();
        notificationRepository.save(n);
    }

    public List<Notification> getForUser(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public void markRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }
}
