package com.projectmanager.service;

import com.projectmanager.dto.ProjectProgressDto;
import com.projectmanager.dto.ProjectRequest;
import com.projectmanager.dto.ProjectResponse;
import com.projectmanager.dto.UserDto;
import com.projectmanager.entity.*;
import com.projectmanager.exception.ResourceNotFoundException;
import com.projectmanager.exception.UnauthorizedException;
import com.projectmanager.repository.ProjectRepository;
import com.projectmanager.repository.TaskRepository;
import com.projectmanager.repository.TeamRepository;
import com.projectmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final TaskRepository taskRepository;
    private final UserService userService;

    @Transactional
    public ProjectResponse createProject(ProjectRequest request, User currentUser) {
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .deadline(request.getDeadline())
                .priority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM)
                .status(request.getStatus() != null ? request.getStatus() : ProjectStatus.PLANNING)
                .createdBy(currentUser)
                .build();

        if (request.getTeamId() != null) {
            Team team = teamRepository.findById(request.getTeamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team", request.getTeamId()));
            project.setTeam(team);
        }

        Set<User> members = new HashSet<>();
        members.add(currentUser);
        if (request.getMemberIds() != null) {
            request.getMemberIds().forEach(memberId -> {
                User member = userRepository.findById(memberId)
                        .orElseThrow(() -> new ResourceNotFoundException("User", memberId));
                members.add(member);
            });
        }
        project.setMembers(members);

        return toResponse(projectRepository.save(project));
    }

    public List<ProjectResponse> getAllProjects(User currentUser) {
        List<Project> projects;
        if (currentUser.getRole() == Role.ADMIN) {
            projects = projectRepository.findAll();
        } else {
            projects = projectRepository.findAllAccessibleToUser(currentUser);
        }
        return projects.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(Long id, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        assertAccess(project, currentUser);
        return toResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        assertOwnerOrAdmin(project, currentUser);

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setDeadline(request.getDeadline());
        if (request.getPriority() != null) project.setPriority(request.getPriority());
        if (request.getStatus() != null) project.setStatus(request.getStatus());

        if (request.getTeamId() != null) {
            Team team = teamRepository.findById(request.getTeamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team", request.getTeamId()));
            project.setTeam(team);
        }

        if (request.getMemberIds() != null) {
            Set<User> members = new HashSet<>();
            members.add(project.getCreatedBy());
            request.getMemberIds().forEach(memberId -> {
                User member = userRepository.findById(memberId)
                        .orElseThrow(() -> new ResourceNotFoundException("User", memberId));
                members.add(member);
            });
            project.setMembers(members);
        }

        return toResponse(projectRepository.save(project));
    }

    @Transactional
    public void deleteProject(Long id, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        assertOwnerOrAdmin(project, currentUser);
        projectRepository.delete(project);
    }

    @Transactional
    public ProjectResponse addMember(Long projectId, Long userId, User currentUser) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", projectId));
        assertOwnerOrAdmin(project, currentUser);
        User newMember = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        project.getMembers().add(newMember);
        return toResponse(projectRepository.save(project));
    }

    @Transactional
    public ProjectResponse removeMember(Long projectId, Long userId, User currentUser) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", projectId));
        assertOwnerOrAdmin(project, currentUser);
        User member = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        project.getMembers().remove(member);
        return toResponse(projectRepository.save(project));
    }

    public ProjectProgressDto getProgress(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", projectId));
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
    }

    // ---- helpers ----
    private void assertAccess(Project project, User user) {
        if (user.getRole() == Role.ADMIN) return;
        boolean isMember = project.getMembers().stream().anyMatch(m -> m.getId().equals(user.getId()));
        boolean isOwner = project.getCreatedBy().getId().equals(user.getId());
        if (!isMember && !isOwner) {
            throw new UnauthorizedException("You do not have access to this project");
        }
    }

    private void assertOwnerOrAdmin(Project project, User user) {
        if (user.getRole() == Role.ADMIN) return;
        if (!project.getCreatedBy().getId().equals(user.getId())) {
            throw new UnauthorizedException("Only project owner or admin can perform this action");
        }
    }

    public ProjectResponse toResponse(Project project) {
        long total = taskRepository.countByProject(project);
        long completed = taskRepository.countCompletedByProject(project);

        Set<UserDto> memberDtos = project.getMembers().stream()
                .map(userService::toDto)
                .collect(Collectors.toSet());

        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .deadline(project.getDeadline())
                .priority(project.getPriority())
                .status(project.getStatus())
                .createdBy(userService.toDto(project.getCreatedBy()))
                .teamId(project.getTeam() != null ? project.getTeam().getId() : null)
                .teamName(project.getTeam() != null ? project.getTeam().getName() : null)
                .members(memberDtos)
                .totalTasks(total)
                .completedTasks(completed)
                .build();
    }
}
