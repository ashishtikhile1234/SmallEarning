package com.gigbuddy.repository;

import com.gigbuddy.model.Review;
import com.gigbuddy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByReviewee(User reviewee);

    boolean existsByReviewerAndApplicationId(User reviewer, Long applicationId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewee = :user")
    Double findAverageRatingByUser(User user);
}
