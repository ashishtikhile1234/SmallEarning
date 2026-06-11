package com.gigbuddy.service;

import com.gigbuddy.dto.gig.GigRequest;
import com.gigbuddy.dto.gig.GigResponse;
import com.gigbuddy.model.Gig;
import com.gigbuddy.model.User;
import com.gigbuddy.model.enums.GigCategory;
import com.gigbuddy.model.enums.GigStatus;
import com.gigbuddy.repository.GigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GigService {

    private final GigRepository gigRepository;

    public List<GigResponse> getAllOpenGigs(GigCategory category, String location, String sort) {
        List<Gig> results;
        if ("pay_desc".equalsIgnoreCase(sort)) {
            results = gigRepository.findOpenGigsFilteredSortByPayDesc(category, location);
        } else if ("pay_asc".equalsIgnoreCase(sort)) {
            results = gigRepository.findOpenGigsFilteredSortByPayAsc(category, location);
        } else if ("duration".equalsIgnoreCase(sort)) {
            results = gigRepository.findOpenGigsFilteredSortByDuration(category, location);
        } else {
            // default: newest first
            results = gigRepository.findOpenGigsFiltered(category, location);
        }
        return results.stream().map(GigResponse::from).toList();
    }

    public GigResponse getGigById(Long id) {
        Gig gig = gigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gig not found with id: " + id));
        return GigResponse.from(gig);
    }

    public GigResponse createGig(GigRequest request, User employer) {
        Gig gig = Gig.builder()
                .employer(employer)
                .title(request.getTitle())
                .category(request.getCategory())
                .description(request.getDescription())
                .durationHours(request.getDurationHours())
                .date(request.getDate())
                .timeSlot(request.getTimeSlot())
                .location(request.getLocation())
                .payAmount(request.getPayAmount())
                .payType(request.getPayType())
                .slotsAvailable(request.getSlotsAvailable())
                .status(GigStatus.OPEN)
                .build();
        return GigResponse.from(gigRepository.save(gig));
    }

    public GigResponse updateGig(Long id, GigRequest request, User employer) {
        Gig gig = gigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gig not found: " + id));
        if (!gig.getEmployer().getId().equals(employer.getId())) {
            throw new AccessDeniedException("You can only update your own gigs");
        }
        gig.setTitle(request.getTitle());
        gig.setCategory(request.getCategory());
        gig.setDescription(request.getDescription());
        gig.setDurationHours(request.getDurationHours());
        gig.setDate(request.getDate());
        gig.setTimeSlot(request.getTimeSlot());
        gig.setLocation(request.getLocation());
        gig.setPayAmount(request.getPayAmount());
        gig.setPayType(request.getPayType());
        gig.setSlotsAvailable(request.getSlotsAvailable());
        return GigResponse.from(gigRepository.save(gig));
    }

    public void deleteGig(Long id, User employer) {
        Gig gig = gigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gig not found: " + id));
        if (!gig.getEmployer().getId().equals(employer.getId())) {
            throw new AccessDeniedException("You can only delete your own gigs");
        }
        gigRepository.delete(gig);
    }

    public List<GigResponse> getMyPostedGigs(User employer) {
        return gigRepository.findByEmployerOrderByCreatedAtDesc(employer)
                .stream().map(GigResponse::from).toList();
    }
}
