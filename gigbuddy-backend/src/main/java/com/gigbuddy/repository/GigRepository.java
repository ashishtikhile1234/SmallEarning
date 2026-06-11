package com.gigbuddy.repository;

import com.gigbuddy.model.Gig;
import com.gigbuddy.model.User;
import com.gigbuddy.model.enums.GigCategory;
import com.gigbuddy.model.enums.GigStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GigRepository extends JpaRepository<Gig, Long> {
    List<Gig> findByStatusOrderByCreatedAtDesc(GigStatus status);
    List<Gig> findByEmployerOrderByCreatedAtDesc(User employer);
    List<Gig> findByCategoryAndStatusOrderByCreatedAtDesc(GigCategory category, GigStatus status);

    @Query("SELECT g FROM Gig g WHERE g.status = 'OPEN' " +
           "AND (:category IS NULL OR g.category = :category) " +
           "AND (:location IS NULL OR LOWER(g.location) LIKE LOWER(CONCAT('%',:location,'%')))" +
           "ORDER BY g.createdAt DESC")
    List<Gig> findOpenGigsFiltered(@Param("category") GigCategory category,
                                   @Param("location") String location);
}
