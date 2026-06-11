package com.gigbuddy.dto.gig;

import com.gigbuddy.model.Gig;
import com.gigbuddy.model.enums.GigCategory;
import com.gigbuddy.model.enums.GigStatus;
import com.gigbuddy.model.enums.PayType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GigResponse {
    private Long id;
    private String title;
    private GigCategory category;
    private String description;
    private Integer durationHours;
    private LocalDate date;
    private LocalTime timeSlot;
    private String location;
    private Double payAmount;
    private PayType payType;
    private Integer slotsAvailable;
    private GigStatus status;
    private LocalDateTime createdAt;
    private Long employerId;
    private String employerName;

    public static GigResponse from(Gig gig) {
        return GigResponse.builder()
                .id(gig.getId())
                .title(gig.getTitle())
                .category(gig.getCategory())
                .description(gig.getDescription())
                .durationHours(gig.getDurationHours())
                .date(gig.getDate())
                .timeSlot(gig.getTimeSlot())
                .location(gig.getLocation())
                .payAmount(gig.getPayAmount())
                .payType(gig.getPayType())
                .slotsAvailable(gig.getSlotsAvailable())
                .status(gig.getStatus())
                .createdAt(gig.getCreatedAt())
                .employerId(gig.getEmployer().getId())
                .employerName(gig.getEmployer().getName())
                .build();
    }
}
