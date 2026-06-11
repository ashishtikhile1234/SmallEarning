package com.gigbuddy.service;

import com.gigbuddy.dto.review.ReviewRequest;
import com.gigbuddy.dto.review.ReviewResponse;
import com.gigbuddy.model.*;
import com.gigbuddy.model.enums.ApplicationStatus;
import com.gigbuddy.model.enums.Role;
import com.gigbuddy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ApplicationRepository applicationRepository;
    private final BadgeRepository badgeRepository;

    public ReviewResponse submitReview(User reviewer, ReviewRequest req) {
        Application app = applicationRepository.findById(req.getApplicationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        // Only accepted applications can be reviewed
        if (app.getStatus() != ApplicationStatus.ACCEPTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can only review accepted applications");
        }

        // Prevent duplicate review
        if (reviewRepository.existsByReviewerAndApplicationId(reviewer, req.getApplicationId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already reviewed this");
        }

        // Determine reviewee: employer reviews student, student reviews employer
        User reviewee;
        if (reviewer.getRole() == Role.EMPLOYER) {
            // Employer reviews student
            if (!app.getGig().getEmployer().getId().equals(reviewer.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your gig");
            }
            reviewee = app.getStudent();
        } else {
            // Student reviews employer
            if (!app.getStudent().getId().equals(reviewer.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your application");
            }
            reviewee = app.getGig().getEmployer();
        }

        Review review = Review.builder()
                .reviewer(reviewer)
                .reviewee(reviewee)
                .application(app)
                .rating(req.getRating())
                .comment(req.getComment())
                .build();

        review = reviewRepository.save(review);

        // Award badges based on milestones
        awardBadgesIfEligible(reviewee);

        return ReviewResponse.from(review);
    }

    public List<ReviewResponse> getReviewsForUser(Long userId) {
        // Build a proxy user to use in query
        User user = new User();
        user.setId(userId);
        return reviewRepository.findByReviewee(user).stream()
                .map(ReviewResponse::from)
                .toList();
    }

    public Double getAverageRating(Long userId) {
        User user = new User();
        user.setId(userId);
        Double avg = reviewRepository.findAverageRatingByUser(user);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    // ─── Badge award logic ─────────────────────────────────────────────────────

    private void awardBadgesIfEligible(User user) {
        long reviewCount = reviewRepository.findByReviewee(user).size();
        long currentBadges = badgeRepository.countByUser(user);

        if (reviewCount >= 1 && currentBadges == 0) {
            awardBadge(user, "First Gig ⭐", "Completed your first gig!", "⭐");
        }
        if (reviewCount >= 5 && currentBadges < 2) {
            awardBadge(user, "Gig Pro 🚀", "Completed 5 gigs!", "🚀");
        }
        if (reviewCount >= 10 && currentBadges < 3) {
            awardBadge(user, "Super Star 🌟", "Completed 10 gigs!", "🌟");
        }
    }

    private void awardBadge(User user, String name, String desc, String emoji) {
        Badge badge = Badge.builder()
                .user(user)
                .name(name)
                .description(desc)
                .emoji(emoji)
                .build();
        badgeRepository.save(badge);
    }
}
