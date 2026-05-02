package com.projectmanager.dto;

import com.projectmanager.entity.Priority;
import com.projectmanager.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TaskRequest {

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    private Long assigneeId;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    private LocalDate dueDate;

    private Priority priority;

    private TaskStatus status;

    private List<String> tags;
}
