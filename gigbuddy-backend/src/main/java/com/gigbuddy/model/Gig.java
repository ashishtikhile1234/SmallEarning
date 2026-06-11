package com.gigbuddy.model;

import com.gigbuddy.model.enums.GigCategory;
import com.gigbuddy.model.enums.GigStatus;
import com.gigbuddy.model.enums.PayType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "gigs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    private User employer;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GigCategory category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "duration_hours")
    private Integer durationHours;

    private LocalDate date;

    @Column(name = "time_slot")
    private LocalTime timeSlot;

    private String location;

    @Column(name = "pay_amount")
    private Double payAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "pay_type")
    private PayType payType;

    @Column(name = "slots_available")
    private Integer slotsAvailable;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private GigStatus status = GigStatus.OPEN;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
