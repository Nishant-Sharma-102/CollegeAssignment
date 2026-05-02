package com.projectmanager.dto;

import com.projectmanager.entity.Priority;
import com.projectmanager.entity.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDate deadline;
    private Priority priority;
    private ProjectStatus status;
    private UserDto createdBy;
    private String teamName;
    private Long teamId;
    private Set<UserDto> members;
    private long totalTasks;
    private long completedTasks;
}
