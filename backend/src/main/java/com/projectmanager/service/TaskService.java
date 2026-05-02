package com.projectmanager.service;

import com.projectmanager.dto.TaskRequest;
import com.projectmanager.dto.TaskResponse;
import com.projectmanager.entity.*;
import com.projectmanager.exception.ResourceNotFoundException;
import com.projectmanager.exception.UnauthorizedException;
import com.projectmanager.repository.ProjectRepository;
import com.projectmanager.repository.TaskRepository;
import com.projectmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Transactional
    public TaskResponse createTask(TaskRequest request, User currentUser) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", request.getProjectId()));

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", request.getAssigneeId()));
        }

        String tagsStr = request.getTags() != null ? String.join(",", request.getTags()) : null;

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .assignee(assignee)
                .project(project)
                .dueDate(request.getDueDate())
                .priority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM)
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TO_DO)
                .tags(tagsStr)
                .createdBy(currentUser)
                .build();

        return toResponse(taskRepository.save(task));
    }

    public List<TaskResponse> getAllTasks(Long projectId, TaskStatus status, Long assigneeId,
                                          Priority priority, LocalDate dueDate, User currentUser) {
        List<Task> tasks = taskRepository.findWithFilters(projectId, status, assigneeId, priority, dueDate);

        // Members only see tasks in their projects
        if (currentUser.getRole() == Role.USER) {
            tasks = tasks.stream()
                    .filter(t -> t.getProject().getMembers().stream()
                            .anyMatch(m -> m.getId().equals(currentUser.getId()))
                            || t.getProject().getCreatedBy().getId().equals(currentUser.getId()))
                    .collect(Collectors.toList());
        }
        return tasks.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
        return toResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request, User currentUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));

        // Members can only update status of their own assigned tasks
        if (currentUser.getRole() == Role.USER) {
            boolean isAssignee = task.getAssignee() != null && task.getAssignee().getId().equals(currentUser.getId());
            if (!isAssignee) {
                throw new UnauthorizedException("You can only update tasks assigned to you");
            }
            // Members can only change status
            task.setStatus(request.getStatus() != null ? request.getStatus() : task.getStatus());
            return toResponse(taskRepository.save(task));
        }

        // Admin/Manager can update all fields
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getTags() != null) task.setTags(String.join(",", request.getTags()));

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", request.getAssigneeId()));
            task.setAssignee(assignee);
        }

        return toResponse(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long id, User currentUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));

        boolean isOwner = task.getCreatedBy() != null && task.getCreatedBy().getId().equals(currentUser.getId());
        boolean isProjectOwner = task.getProject().getCreatedBy().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOwner && !isProjectOwner && !isAdmin) {
            throw new UnauthorizedException("You cannot delete this task");
        }
        taskRepository.delete(task);
    }

    public TaskResponse toResponse(Task task) {
        List<String> tags = (task.getTags() != null && !task.getTags().isBlank())
                ? Arrays.asList(task.getTags().split(","))
                : List.of();

        boolean overdue = task.getDueDate() != null
                && task.getDueDate().isBefore(LocalDate.now())
                && task.getStatus() != TaskStatus.DONE;

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .assignee(task.getAssignee() != null ? userService.toDto(task.getAssignee()) : null)
                .projectId(task.getProject().getId())
                .projectName(task.getProject().getName())
                .dueDate(task.getDueDate())
                .priority(task.getPriority())
                .status(task.getStatus())
                .tags(tags)
                .createdBy(task.getCreatedBy() != null ? userService.toDto(task.getCreatedBy()) : null)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .overdue(overdue)
                .build();
    }
}
