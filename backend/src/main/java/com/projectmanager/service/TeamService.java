package com.projectmanager.service;

import com.projectmanager.dto.TeamRequest;
import com.projectmanager.dto.TeamResponse;
import com.projectmanager.dto.UserDto;
import com.projectmanager.entity.Role;
import com.projectmanager.entity.Team;
import com.projectmanager.entity.User;
import com.projectmanager.exception.ResourceNotFoundException;
import com.projectmanager.exception.UnauthorizedException;
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
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Transactional
    public TeamResponse createTeam(TeamRequest request, User currentUser) {
        Team team = Team.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(currentUser)
                .build();

        Set<User> members = new HashSet<>();
        members.add(currentUser);
        if (request.getMemberIds() != null) {
            request.getMemberIds().forEach(id -> {
                User member = userRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("User", id));
                members.add(member);
            });
        }
        team.setMembers(members);
        return toResponse(teamRepository.save(team));
    }

    public List<TeamResponse> getAllTeams(User currentUser) {
        List<Team> teams;
        if (currentUser.getRole() == Role.ADMIN) {
            teams = teamRepository.findAll();
        } else {
            teams = teamRepository.findByMember(currentUser);
        }
        return teams.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TeamResponse getTeamById(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team", id));
        return toResponse(team);
    }

    @Transactional
    public TeamResponse updateTeam(Long id, TeamRequest request, User currentUser) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team", id));
        assertOwnerOrAdmin(team, currentUser);

        team.setName(request.getName());
        team.setDescription(request.getDescription());
        return toResponse(teamRepository.save(team));
    }

    @Transactional
    public void deleteTeam(Long id, User currentUser) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team", id));
        assertOwnerOrAdmin(team, currentUser);
        teamRepository.delete(team);
    }

    @Transactional
    public TeamResponse addMember(Long teamId, Long userId, User currentUser) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team", teamId));
        assertOwnerOrAdmin(team, currentUser);
        User newMember = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        team.getMembers().add(newMember);
        return toResponse(teamRepository.save(team));
    }

    @Transactional
    public TeamResponse removeMember(Long teamId, Long userId, User currentUser) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team", teamId));
        assertOwnerOrAdmin(team, currentUser);
        User member = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        team.getMembers().remove(member);
        return toResponse(teamRepository.save(team));
    }

    private void assertOwnerOrAdmin(Team team, User user) {
        if (user.getRole() == Role.ADMIN) return;
        if (!team.getCreatedBy().getId().equals(user.getId())) {
            throw new UnauthorizedException("Only team owner or admin can perform this action");
        }
    }

    public TeamResponse toResponse(Team team) {
        Set<UserDto> memberDtos = team.getMembers().stream()
                .map(userService::toDto)
                .collect(Collectors.toSet());
        return TeamResponse.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .createdBy(userService.toDto(team.getCreatedBy()))
                .members(memberDtos)
                .build();
    }
}
