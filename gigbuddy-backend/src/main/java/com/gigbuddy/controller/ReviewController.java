package com.gigbuddy.controller;

import com.gigbuddy.dto.review.ReviewRequest;
import com.gigbuddy.dto.review.ReviewResponse;
import com.gigbuddy.model.User;
import com.gigbuddy.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Review and rating endpoints")
@SecurityRequirement(name = "bearerAuth")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @Operation(summary = "Submit a review for a completed gig")
    public ResponseEntity<ReviewResponse> submit(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ReviewRequest req) {
        return ResponseEntity.ok(reviewService.submitReview(user, req));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all reviews for a user")
    public ResponseEntity<List<ReviewResponse>> getForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsForUser(userId));
    }

    @GetMapping("/user/{userId}/rating")
    @Operation(summary = "Get average rating for a user")
    public ResponseEntity<Double> getAvgRating(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getAverageRating(userId));
    }
}
