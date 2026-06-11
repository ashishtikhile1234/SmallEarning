package com.gigbuddy.service;

import com.gigbuddy.model.Badge;
import com.gigbuddy.model.User;
import com.gigbuddy.repository.ApplicationRepository;
import com.gigbuddy.repository.BadgeRepository;
import com.gigbuddy.repository.ReviewRepository;
import com.gigbuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final ApplicationRepository applicationRepository;
    private final ReviewRepository reviewRepository;
    private final BadgeRepository badgeRepository;
    private final UserRepository userRepository;

    public List<Map<String, Object>> getTopStudents(int limit) {
        // Rank students by number of accepted applications (gigs completed)
        return userRepository.findAll().stream()
                .filter(u -> u.getRole().name().equals("STUDENT"))
                .map(u -> {
                    long gigsCompleted = applicationRepository
                            .findByStudentOrderByAppliedAtDesc(u).stream()
                            .filter(a -> a.getStatus().name().equals("ACCEPTED"))
                            .count();

                    Double avgRating = reviewRepository.findAverageRatingByUser(u);
                    long badges = badgeRepository.countByUser(u);

                    Map<String, Object> entry = new LinkedHashMap<>();
                    entry.put("userId", u.getId());
                    entry.put("name", u.getName());
                    entry.put("gigsCompleted", gigsCompleted);
                    entry.put("avgRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
                    entry.put("badges", badges);
                    entry.put("score", gigsCompleted * 10 + badges * 5);
                    return entry;
                })
                .sorted(Comparator.comparingLong((Map<String, Object> m) ->
                        (Long) m.get("score")).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }
}
