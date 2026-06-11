package com.gigbuddy.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "badges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** e.g. "Coffee Pro ☕", "Event Star 🎉", "Super Student 📚" */
    @Column(nullable = false)
    private String name;

    /** Short description of how it was earned */
    @Column(length = 255)
    private String description;

    /** Emoji icon stored separately for easy display */
    @Column(length = 10)
    private String emoji;

    @Column(nullable = false, updatable = false)
    private LocalDateTime earnedAt;

    @PrePersist
    protected void onCreate() {
        this.earnedAt = LocalDateTime.now();
    }
}
