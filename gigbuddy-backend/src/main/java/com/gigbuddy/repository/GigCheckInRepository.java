package com.gigbuddy.repository;

import com.gigbuddy.model.Application;
import com.gigbuddy.model.GigCheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GigCheckInRepository extends JpaRepository<GigCheckIn, Long> {
    Optional<GigCheckIn> findByApplication(Application application);
}
