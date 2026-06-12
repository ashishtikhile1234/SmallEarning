package com.gigbuddy.controller;

import com.gigbuddy.model.User;
import com.gigbuddy.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/referral")
@RequiredArgsConstructor
@Tag(name = "Referral", description = "Invite-a-friend referral system")
@SecurityRequirement(name = "bearerAuth")
public class ReferralController {

    private final UserRepository userRepository;

    @GetMapping("/my-code")
    @Operation(summary = "Get your personal referral code and coin balance")
    public ResponseEntity<Map<String, Object>> getMyCode(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(Map.of(
                "referralCode", user.getReferralCode() != null ? user.getReferralCode() : "N/A",
                "coins", user.getCoins() != null ? user.getCoins() : 0,
                "shareUrl", "https://gigbuddy.app/signup?ref=" + user.getReferralCode()
        ));
    }

    @PostMapping("/apply")
    @Operation(summary = "Apply a referral code to earn coins")
    public ResponseEntity<Map<String, Object>> applyCode(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {

        if (user.getReferredBy() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already used a referral code");
        }

        String code = body.getOrDefault("code", "").trim().toUpperCase();
        if (code.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Referral code required");
        }
        if (code.equals(user.getReferralCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot use your own referral code");
        }

        User referrer = userRepository.findAll().stream()
                .filter(u -> code.equals(u.getReferralCode()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid referral code"));

        // Credit coins: 50 to referrer, 25 to new user
        referrer.setCoins((referrer.getCoins() != null ? referrer.getCoins() : 0) + 50);
        userRepository.save(referrer);

        user.setCoins((user.getCoins() != null ? user.getCoins() : 0) + 25);
        user.setReferredBy(referrer.getId());
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "coinsEarned", 25,
                "yourCoins", user.getCoins(),
                "message", "🎉 You earned 25 coins! Your friend earned 50 coins."
        ));
    }
}
