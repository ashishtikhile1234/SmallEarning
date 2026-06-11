package com.gigbuddy.service;

import com.gigbuddy.dto.gig.GigResponse;
import com.gigbuddy.model.Gig;
import com.gigbuddy.model.SavedGig;
import com.gigbuddy.model.User;
import com.gigbuddy.repository.GigRepository;
import com.gigbuddy.repository.SavedGigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedGigService {

    private final SavedGigRepository savedGigRepository;
    private final GigRepository gigRepository;

    public void save(User user, Long gigId) {
        Gig gig = gigRepository.findById(gigId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gig not found"));

        if (savedGigRepository.existsByUserAndGig(user, gig)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already bookmarked");
        }

        SavedGig saved = SavedGig.builder().user(user).gig(gig).build();
        savedGigRepository.save(saved);
    }

    public void unsave(User user, Long gigId) {
        Gig gig = gigRepository.findById(gigId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gig not found"));

        SavedGig saved = savedGigRepository.findByUserAndGig(user, gig)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bookmark not found"));

        savedGigRepository.delete(saved);
    }

    public List<GigResponse> getSavedGigs(User user) {
        return savedGigRepository.findByUser(user).stream()
                .map(sg -> GigResponse.from(sg.getGig()))
                .toList();
    }

    public boolean isSaved(User user, Long gigId) {
        Gig gig = new Gig();
        gig.setId(gigId);
        return savedGigRepository.existsByUserAndGig(user, gig);
    }
}
