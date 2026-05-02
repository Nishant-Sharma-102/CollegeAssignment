package com.projectmanager.controller;

import com.projectmanager.dto.TeamRequest;
import com.projectmanager.dto.TeamResponse;
import com.projectmanager.entity.User;
import com.projectmanager.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    public ResponseEntity<TeamResponse> createTeam(
            @Valid @RequestBody TeamRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED).body(teamService.createTeam(request, currentUser));
    }

    @GetMapping
    public ResponseEntity<List<TeamResponse>> getAllTeams(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(teamService.getAllTeams(currentUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamResponse> getTeam(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getTeamById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamResponse> updateTeam(
            @PathVariable Long id,
            @Valid @RequestBody TeamRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(teamService.updateTeam(id, request, currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        teamService.deleteTeam(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/members/{userId}")
    public ResponseEntity<TeamResponse> addMember(
            @PathVariable Long id,
            @PathVariable Long userId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(teamService.addMember(id, userId, currentUser));
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<TeamResponse> removeMember(
            @PathVariable Long id,
            @PathVariable Long userId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(teamService.removeMember(id, userId, currentUser));
    }
}
