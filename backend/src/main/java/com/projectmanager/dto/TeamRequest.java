package com.projectmanager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Set;

@Data
public class TeamRequest {

    @NotBlank(message = "Team name is required")
    private String name;

    private String description;

    private Set<Long> memberIds;
}
