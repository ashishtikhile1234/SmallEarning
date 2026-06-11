package com.gigbuddy.dto.application;

import com.gigbuddy.model.Application;
import com.gigbuddy.model.enums.ApplicationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private Long gigId;
    private String gigTitle;
    private String gigLocation;
    private Long studentId;
    private String studentName;
    private String message;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;

    public static ApplicationResponse from(Application app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .gigId(app.getGig().getId())
                .gigTitle(app.getGig().getTitle())
                .gigLocation(app.getGig().getLocation())
                .studentId(app.getStudent().getId())
                .studentName(app.getStudent().getName())
                .message(app.getMessage())
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())
                .build();
    }
}
