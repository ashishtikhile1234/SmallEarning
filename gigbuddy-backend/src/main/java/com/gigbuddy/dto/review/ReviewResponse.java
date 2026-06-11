package com.gigbuddy.dto.review;

import com.gigbuddy.model.Review;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long id;
    private Long reviewerId;
    private String reviewerName;
    private Long revieweeId;
    private String revieweeName;
    private Long applicationId;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    public static ReviewResponse from(Review r) {
        return ReviewResponse.builder()
                .id(r.getId())
                .reviewerId(r.getReviewer().getId())
                .reviewerName(r.getReviewer().getName())
                .revieweeId(r.getReviewee().getId())
                .revieweeName(r.getReviewee().getName())
                .applicationId(r.getApplication().getId())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
