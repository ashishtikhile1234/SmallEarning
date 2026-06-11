package com.gigbuddy.controller;

import com.gigbuddy.model.Application;
import com.gigbuddy.model.ChatMessage;
import com.gigbuddy.model.User;
import com.gigbuddy.repository.ApplicationRepository;
import com.gigbuddy.repository.ChatMessageRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Tag(name = "Chat", description = "In-app messaging per application")
@SecurityRequirement(name = "bearerAuth")
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final ApplicationRepository applicationRepository;

    @GetMapping("/{applicationId}")
    @Operation(summary = "Get message history for an application")
    public ResponseEntity<List<Map<String, Object>>> getMessages(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal User user) {

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        // Only student or employer of this application can read messages
        boolean isParticipant = app.getStudent().getId().equals(user.getId())
                || app.getGig().getEmployer().getId().equals(user.getId());
        if (!isParticipant) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your conversation");
        }

        List<Map<String, Object>> messages = chatMessageRepository
                .findByApplicationOrderBySentAtAsc(app).stream()
                .map(m -> Map.<String, Object>of(
                        "id",         m.getId(),
                        "senderId",   m.getSender().getId(),
                        "senderName", m.getSender().getName(),
                        "message",    m.getMessage(),
                        "isRead",     m.getIsRead(),
                        "sentAt",     m.getSentAt().toString()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{applicationId}")
    @Operation(summary = "Send a message in an application conversation")
    public ResponseEntity<Map<String, Object>> sendMessage(
            @PathVariable Long applicationId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User sender) {

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        boolean isParticipant = app.getStudent().getId().equals(sender.getId())
                || app.getGig().getEmployer().getId().equals(sender.getId());
        if (!isParticipant) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your conversation");
        }

        // Determine receiver (opposite party)
        User receiver = app.getStudent().getId().equals(sender.getId())
                ? app.getGig().getEmployer()
                : app.getStudent();

        String text = body.getOrDefault("message", "").trim();
        if (text.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message cannot be empty");
        }

        ChatMessage msg = ChatMessage.builder()
                .sender(sender)
                .receiver(receiver)
                .application(app)
                .message(text)
                .build();

        ChatMessage saved = chatMessageRepository.save(msg);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id",         saved.getId(),
                "senderId",   saved.getSender().getId(),
                "senderName", saved.getSender().getName(),
                "message",    saved.getMessage(),
                "sentAt",     saved.getSentAt().toString()
        ));
    }
}
