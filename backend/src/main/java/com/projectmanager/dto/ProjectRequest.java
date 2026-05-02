package com.projectmanager.dto;

import com.projectmanager.entity.Priority;
import com.projectmanager.entity.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class ProjectRequest {

    @NotBlank(message = "Project name is required")
    private String name;

    private String description;

    private LocalDate deadline;

    @NotNull(message = "Priority is required")
    private Priority priority;

    private ProjectStatus status;

    private Long teamId;

    private Set<Long> memberIds;
}
