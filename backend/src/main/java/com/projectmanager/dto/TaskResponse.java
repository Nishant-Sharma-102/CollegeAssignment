package com.projectmanager.dto;

import com.projectmanager.entity.Priority;
import com.projectmanager.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private UserDto assignee;
    private Long projectId;
    private String projectName;
    private LocalDate dueDate;
    private Priority priority;
    private TaskStatus status;
    private List<String> tags;
    private UserDto createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean overdue;
}
