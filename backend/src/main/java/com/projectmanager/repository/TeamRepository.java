package com.projectmanager.repository;

import com.projectmanager.entity.Team;
import com.projectmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByCreatedBy(User user);

    @Query("SELECT t FROM Team t JOIN t.members m WHERE m = :user")
    List<Team> findByMember(User user);
}
