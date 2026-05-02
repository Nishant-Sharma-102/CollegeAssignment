package com.projectmanager.service;

import com.projectmanager.dto.DashboardResponse;
import com.projectmanager.dto.ProjectProgressDto;
import com.projectmanager.dto.TaskResponse;
import com.projectmanager.entity.*;
import com.projectmanager.repository.ProjectRepository;
import com.projectmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final TaskService taskService;

    public DashboardResponse getDashboard(User currentUser) {
        LocalDate today = LocalDate.now();

        // Task counts for current user
        long totalTasks = taskRepository.countByAssignee(currentUser);
        long completedTasks = taskRepository.countByAssigneeAndStatus(currentUser, TaskStatus.DONE);
        long inProgressTasks = taskRepository.countByAssigneeAndStatus(currentUser, TaskStatus.IN_PROGRESS);
        long reviewTasks = taskRepository.countByAssigneeAndStatus(currentUser, TaskStatus.REVIEW);
        long pendingTasks = taskRepository.countByAssigneeAndStatus(currentUser, TaskStatus.TO_DO);
        long overdueTasks = taskRepository.countOverdueTasksByUser(currentUser, today);

        // Recent tasks (last 10 updated)
        List<TaskResponse> recentTasks = taskRepository.findTop10ByOrderByUpdatedAtDesc()
                .stream()
                .map(taskService::toResponse)
                .collect(Collectors.toList());

        // Overdue task list for current user
        List<TaskResponse> overdueList = taskRepository.findOverdueTasks(today)
                .stream()
                .filter(t -> t.getAssignee() != null && t.getAssignee().getId().equals(currentUser.getId()))
                .map(taskService::toResponse)
                .collect(Collectors.toList());

        // Project progress for accessible projects
        List<Project> projects;
        if (currentUser.getRole() == Role.ADMIN) {
            projects = projectRepository.findAll();
        } else {
            projects = projectRepository.findAllAccessibleToUser(currentUser);
        }

        List<ProjectProgressDto> projectProgress = projects.stream().map(project -> {
            long total = taskRepository.countByProject(project);
            long completed = taskRepository.countCompletedByProject(project);
            int percent = total == 0 ? 0 : (int) ((completed * 100) / total);
            return ProjectProgressDto.builder()
                    .projectId(project.getId())
                    .projectName(project.getName())
                    .totalTasks(total)
                    .completedTasks(completed)
                    .progressPercent(percent)
                    .build();
        }).collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .pendingTasks(pendingTasks)
                .inProgressTasks(inProgressTasks)
                .reviewTasks(reviewTasks)
                .overdueTasks(overdueTasks)
                .projectProgress(projectProgress)
                .recentTasks(recentTasks)
                .overduetaskList(overdueList)
                .build();
    }
}
