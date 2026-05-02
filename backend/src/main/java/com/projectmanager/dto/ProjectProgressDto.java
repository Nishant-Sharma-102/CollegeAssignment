package com.projectmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectProgressDto {
    private Long projectId;
    private String projectName;
    private long totalTasks;
    private long completedTasks;
    private int progressPercent;
}
