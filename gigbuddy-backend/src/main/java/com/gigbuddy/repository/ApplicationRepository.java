package com.gigbuddy.repository;

import com.gigbuddy.model.Application;
import com.gigbuddy.model.Gig;
import com.gigbuddy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentOrderByAppliedAtDesc(User student);
    List<Application> findByGigOrderByAppliedAtDesc(Gig gig);
    Optional<Application> findByGigAndStudent(Gig gig, User student);
    boolean existsByGigAndStudent(Gig gig, User student);
    int countByGig(Gig gig);
}
