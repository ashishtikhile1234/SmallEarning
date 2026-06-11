package com.gigbuddy.controller;

import com.gigbuddy.model.Application;
import com.gigbuddy.model.GigCheckIn;
import com.gigbuddy.model.User;
import com.gigbuddy.model.enums.ApplicationStatus;
import com.gigbuddy.repository.ApplicationRepository;
import com.gigbuddy.repository.GigCheckInRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/checkin")
@RequiredArgsConstructor
@Tag(name = "CheckIn", description = "QR/OTP Gig check-in verification")
@SecurityRequirement(name = "bearerAuth")
public class CheckInController {

    private final ApplicationRepository applicationRepository;
    private final GigCheckInRepository checkInRepository;

    @PostMapping("/generate/{applicationId}")
    @Operation(summary = "Generate 6-digit OTP for gig check-in (Employer only)")
    public ResponseEntity<Map<String, Object>> generateOtp(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal User employer) {

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        if (!app.getGig().getEmployer().getId().equals(employer.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your gig");
        }
        if (app.getStatus() != ApplicationStatus.ACCEPTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only accepted applications can be checked in");
        }

        // Invalidate old OTP if exists
        checkInRepository.findByApplication(app).ifPresent(checkInRepository::delete);

        // Generate 6-digit OTP
        String otp = String.format("%06d", new SecureRandom().nextInt(1_000_000));

        GigCheckIn checkIn = GigCheckIn.builder()
                .application(app)
                .otpCode(otp)
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .used(false)
                .build();

        checkInRepository.save(checkIn);

        return ResponseEntity.ok(Map.of(
                "otp", otp,
                "applicationId", applicationId,
                "expiresInMinutes", 15,
                "message", "Share this OTP with the student for check-in"
        ));
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify OTP and mark application as COMPLETED (Student only)")
    public ResponseEntity<Map<String, Object>> verifyOtp(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User student) {

        Long appId = Long.valueOf(body.get("applicationId").toString());
        String otp = body.get("otp").toString().trim();

        Application app = applicationRepository.findById(appId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        if (!app.getStudent().getId().equals(student.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your application");
        }

        GigCheckIn checkIn = checkInRepository.findByApplication(app)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No OTP generated for this gig"));

        if (checkIn.getUsed()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "OTP already used");
        }
        if (LocalDateTime.now().isAfter(checkIn.getExpiresAt())) {
            throw new ResponseStatusException(HttpStatus.GONE, "OTP has expired. Ask employer to generate a new one.");
        }
        if (!checkIn.getOtpCode().equals(otp)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Incorrect OTP");
        }

        checkIn.setUsed(true);
        checkIn.setCheckedInAt(LocalDateTime.now());
        checkInRepository.save(checkIn);

        app.setStatus(ApplicationStatus.COMPLETED);
        applicationRepository.save(app);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "🎉 Check-in successful! Gig marked as completed."
        ));
    }
}
