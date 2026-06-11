package com.gigbuddy.service;

import com.gigbuddy.dto.application.*;
import com.gigbuddy.model.*;
import com.gigbuddy.model.enums.ApplicationStatus;
import com.gigbuddy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final GigRepository gigRepository;
    private final NotificationService notificationService;

    public ApplicationResponse applyToGig(ApplicationRequest request, User student) {
        Gig gig = gigRepository.findById(request.getGigId())
                .orElseThrow(() -> new RuntimeException("Gig not found: " + request.getGigId()));

        if (applicationRepository.existsByGigAndStudent(gig, student)) {
            throw new RuntimeException("You have already applied to this gig");
        }

        Application application = Application.builder()
                .gig(gig)
                .student(student)
                .message(request.getMessage())
                .build();

        Application saved = applicationRepository.save(application);

        // 🔔 Notify employer: new application received
        notificationService.send(
                gig.getEmployer(),
                "📩 New application from " + student.getName() + " for \"" + gig.getTitle() + "\"",
                "APPLICATION_RECEIVED"
        );

        return ApplicationResponse.from(saved);
    }

    public List<ApplicationResponse> getMyApplications(User student) {
        return applicationRepository.findByStudentOrderByAppliedAtDesc(student)
                .stream().map(ApplicationResponse::from).toList();
    }

    public List<ApplicationResponse> getApplicationsForGig(Long gigId, User employer) {
        Gig gig = gigRepository.findById(gigId)
                .orElseThrow(() -> new RuntimeException("Gig not found: " + gigId));
        if (!gig.getEmployer().getId().equals(employer.getId())) {
            throw new AccessDeniedException("Not your gig");
        }
        return applicationRepository.findByGigOrderByAppliedAtDesc(gig)
                .stream().map(ApplicationResponse::from).toList();
    }

    public ApplicationResponse updateApplicationStatus(Long appId, StatusUpdateRequest request, User employer) {
        Application application = applicationRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + appId));
        if (!application.getGig().getEmployer().getId().equals(employer.getId())) {
            throw new AccessDeniedException("Not your gig's application");
        }

        ApplicationStatus newStatus = request.getStatus();
        application.setStatus(newStatus);
        Application saved = applicationRepository.save(application);

        // 🔔 Notify student of decision
        User student = application.getStudent();
        String gigTitle = application.getGig().getTitle();

        if (newStatus == ApplicationStatus.ACCEPTED) {
            notificationService.send(
                    student,
                    "🎉 Congratulations! Your application for \"" + gigTitle + "\" was ACCEPTED!",
                    "APPLICATION_ACCEPTED"
            );
        } else if (newStatus == ApplicationStatus.REJECTED) {
            notificationService.send(
                    student,
                    "😔 Your application for \"" + gigTitle + "\" was not selected this time.",
                    "APPLICATION_REJECTED"
            );
        }

        return ApplicationResponse.from(saved);
    }
}
