package com.gigbuddy.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "gig_checkins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GigCheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private Application application;

    @Column(name = "otp_code", nullable = false)
    private String otpCode;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Builder.Default
    private Boolean used = false;

    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;

    @PrePersist
    protected void onCreate() {
        if (expiresAt == null) {
            expiresAt = LocalDateTime.now().plusMinutes(15);
        }
    }
}
