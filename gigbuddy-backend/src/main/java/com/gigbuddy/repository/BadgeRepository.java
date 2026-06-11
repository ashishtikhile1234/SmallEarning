package com.gigbuddy.repository;

import com.gigbuddy.model.Badge;
import com.gigbuddy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {

    List<Badge> findByUser(User user);

    long countByUser(User user);
}
