package com.projectmanager.repository;

import com.projectmanager.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject(Project project);

    List<Task> findByAssignee(User assignee);

    List<Task> findByProjectAndStatus(Project project, TaskStatus status);

    @Query("SELECT t FROM Task t WHERE t.assignee = :user AND t.status = :status")
    List<Task> findByAssigneeAndStatus(@Param("user") User user, @Param("status") TaskStatus status);

    // Dashboard: count tasks assigned to user by status
    long countByAssigneeAndStatus(User assignee, TaskStatus status);

    // Dashboard: count overdue tasks for a user
    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignee = :user AND t.dueDate < :today AND t.status <> com.projectmanager.entity.TaskStatus.DONE")
    long countOverdueTasksByUser(@Param("user") User user, @Param("today") LocalDate today);

    // Dashboard: total tasks assigned to user
    long countByAssignee(User assignee);

    // Filtering tasks
    @Query("SELECT t FROM Task t WHERE " +
           "(:projectId IS NULL OR t.project.id = :projectId) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:assigneeId IS NULL OR t.assignee.id = :assigneeId) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:dueDate IS NULL OR t.dueDate <= :dueDate)")
    List<Task> findWithFilters(
        @Param("projectId") Long projectId,
        @Param("status") TaskStatus status,
        @Param("assigneeId") Long assigneeId,
        @Param("priority") Priority priority,
        @Param("dueDate") LocalDate dueDate
    );

    // Recent tasks ordered by updatedAt
    List<Task> findTop10ByOrderByUpdatedAtDesc();

    // Project-wise task counts for progress summary
    @Query("SELECT COUNT(t) FROM Task t WHERE t.project = :project")
    long countByProject(@Param("project") Project project);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project = :project AND t.status = com.projectmanager.entity.TaskStatus.DONE")
    long countCompletedByProject(@Param("project") Project project);

    // All overdue tasks
    @Query("SELECT t FROM Task t WHERE t.dueDate < :today AND t.status <> com.projectmanager.entity.TaskStatus.DONE")
    List<Task> findOverdueTasks(@Param("today") LocalDate today);
}
