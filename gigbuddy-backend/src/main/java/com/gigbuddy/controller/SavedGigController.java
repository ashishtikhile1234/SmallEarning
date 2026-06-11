package com.gigbuddy.controller;

import com.gigbuddy.dto.gig.GigResponse;
import com.gigbuddy.model.User;
import com.gigbuddy.service.SavedGigService;
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
@RequestMapping("/api/saved-gigs")
@RequiredArgsConstructor
@Tag(name = "Saved Gigs", description = "Bookmark/favourite gig endpoints")
@SecurityRequirement(name = "bearerAuth")
public class SavedGigController {

    private final SavedGigService savedGigService;

    @GetMapping
    @Operation(summary = "Get all saved gigs for current user")
    public ResponseEntity<List<GigResponse>> getSaved(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(savedGigService.getSavedGigs(user));
    }

    @PostMapping("/{gigId}")
    @Operation(summary = "Bookmark a gig")
    public ResponseEntity<Map<String, String>> save(
            @AuthenticationPrincipal User user,
            @PathVariable Long gigId) {
        savedGigService.save(user, gigId);
        return ResponseEntity.ok(Map.of("message", "Gig bookmarked successfully"));
    }

    @DeleteMapping("/{gigId}")
    @Operation(summary = "Remove bookmark from a gig")
    public ResponseEntity<Map<String, String>> unsave(
            @AuthenticationPrincipal User user,
            @PathVariable Long gigId) {
        savedGigService.unsave(user, gigId);
        return ResponseEntity.ok(Map.of("message", "Bookmark removed"));
    }

    @GetMapping("/{gigId}/check")
    @Operation(summary = "Check if a gig is bookmarked")
    public ResponseEntity<Map<String, Boolean>> isSaved(
            @AuthenticationPrincipal User user,
            @PathVariable Long gigId) {
        return ResponseEntity.ok(Map.of("saved", savedGigService.isSaved(user, gigId)));
    }
}
