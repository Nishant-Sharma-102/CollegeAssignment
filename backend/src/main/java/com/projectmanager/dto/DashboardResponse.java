package com.projectmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private long overdueTasks;
    private long reviewTasks;
    private List<ProjectProgressDto> projectProgress;
    private List<TaskResponse> recentTasks;
    private List<TaskResponse> overduetaskList;
}
