package com.gigbuddy.controller;

import com.gigbuddy.dto.gig.GigRequest;
import com.gigbuddy.dto.gig.GigResponse;
import com.gigbuddy.model.User;
import com.gigbuddy.model.enums.GigCategory;
import com.gigbuddy.service.GigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gigs")
@RequiredArgsConstructor
@Tag(name = "Gigs", description = "Gig CRUD operations")
public class GigController {

    private final GigService gigService;

    @GetMapping
    @Operation(summary = "Get all open gigs (with optional filters)")
    public ResponseEntity<List<GigResponse>> getAllGigs(
            @RequestParam(required = false) GigCategory category,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(gigService.getAllOpenGigs(category, location));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get gig by ID")
    public ResponseEntity<GigResponse> getGigById(@PathVariable Long id) {
        return ResponseEntity.ok(gigService.getGigById(id));
    }

    @PostMapping
    @Operation(summary = "Post a new gig (Employer only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<GigResponse> createGig(@Valid @RequestBody GigRequest request,
                                                  @AuthenticationPrincipal User employer) {
        return ResponseEntity.status(HttpStatus.CREATED).body(gigService.createGig(request, employer));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a gig (Employer only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<GigResponse> updateGig(@PathVariable Long id,
                                                  @Valid @RequestBody GigRequest request,
                                                  @AuthenticationPrincipal User employer) {
        return ResponseEntity.ok(gigService.updateGig(id, request, employer));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a gig (Employer only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Void> deleteGig(@PathVariable Long id,
                                           @AuthenticationPrincipal User employer) {
        gigService.deleteGig(id, employer);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-posted")
    @Operation(summary = "Get employer's own posted gigs", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<GigResponse>> getMyPostedGigs(@AuthenticationPrincipal User employer) {
        return ResponseEntity.ok(gigService.getMyPostedGigs(employer));
    }
}
