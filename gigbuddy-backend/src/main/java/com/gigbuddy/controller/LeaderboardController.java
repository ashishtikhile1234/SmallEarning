package com.gigbuddy.controller;

import com.gigbuddy.model.Badge;
import com.gigbuddy.model.User;
import com.gigbuddy.repository.BadgeRepository;
import com.gigbuddy.service.LeaderboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
@Tag(name = "Leaderboard & Badges", description = "Gamification endpoints")
@SecurityRequirement(name = "bearerAuth")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;
    private final BadgeRepository badgeRepository;

    @GetMapping
    @Operation(summary = "Get top students leaderboard")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(leaderboardService.getTopStudents(limit));
    }

    @GetMapping("/badges")
    @Operation(summary = "Get current user's badges")
    public ResponseEntity<List<Badge>> getMyBadges(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(badgeRepository.findByUser(user));
    }

    @GetMapping("/badges/user/{userId}")
    @Operation(summary = "Get badges for a specific user")
    public ResponseEntity<List<Badge>> getBadgesForUser(@PathVariable Long userId) {
        User user = new User();
        user.setId(userId);
        return ResponseEntity.ok(badgeRepository.findByUser(user));
    }
}
