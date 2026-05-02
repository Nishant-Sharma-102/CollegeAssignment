package com.projectmanager.repository;

import com.projectmanager.entity.Project;
import com.projectmanager.entity.ProjectStatus;
import com.projectmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCreatedBy(User user);

    @Query("SELECT p FROM Project p JOIN p.members m WHERE m = :user")
    List<Project> findByMember(User user);

    @Query("SELECT p FROM Project p WHERE p.createdBy = :user OR :user MEMBER OF p.members")
    List<Project> findAllAccessibleToUser(User user);

    List<Project> findByStatus(ProjectStatus status);

    long countByStatus(ProjectStatus status);
}
