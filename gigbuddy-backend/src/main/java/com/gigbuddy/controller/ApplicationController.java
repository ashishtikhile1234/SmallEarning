package com.gigbuddy.controller;

import com.gigbuddy.dto.application.*;
import com.gigbuddy.model.User;
import com.gigbuddy.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Tag(name = "Applications", description = "Gig application management")
@SecurityRequirement(name = "bearerAuth")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @Operation(summary = "Apply to a gig (Student only)")
    public ResponseEntity<ApplicationResponse> apply(@RequestBody ApplicationRequest request,
                                                      @AuthenticationPrincipal User student) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(applicationService.applyToGig(request, student));
    }

    @GetMapping("/my")
    @Operation(summary = "Get student's own applications")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(@AuthenticationPrincipal User student) {
        return ResponseEntity.ok(applicationService.getMyApplications(student));
    }

    @GetMapping("/gig/{gigId}")
    @Operation(summary = "Get all applications for a gig (Employer only)")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsForGig(@PathVariable Long gigId,
                                                                             @AuthenticationPrincipal User employer) {
        return ResponseEntity.ok(applicationService.getApplicationsForGig(gigId, employer));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Accept or Reject an application (Employer only)")
    public ResponseEntity<ApplicationResponse> updateStatus(@PathVariable Long id,
                                                             @RequestBody StatusUpdateRequest request,
                                                             @AuthenticationPrincipal User employer) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, request, employer));
    }
}
