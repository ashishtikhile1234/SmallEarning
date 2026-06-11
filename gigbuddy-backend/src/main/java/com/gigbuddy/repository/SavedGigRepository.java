package com.gigbuddy.repository;

import com.gigbuddy.model.SavedGig;
import com.gigbuddy.model.User;
import com.gigbuddy.model.Gig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedGigRepository extends JpaRepository<SavedGig, Long> {

    List<SavedGig> findByUser(User user);

    Optional<SavedGig> findByUserAndGig(User user, Gig gig);

    boolean existsByUserAndGig(User user, Gig gig);
}
