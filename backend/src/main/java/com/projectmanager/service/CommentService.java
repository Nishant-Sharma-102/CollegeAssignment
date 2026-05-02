package com.projectmanager.service;

import com.projectmanager.dto.CommentRequest;
import com.projectmanager.dto.CommentResponse;
import com.projectmanager.entity.Comment;
import com.projectmanager.entity.Task;
import com.projectmanager.entity.User;
import com.projectmanager.exception.ResourceNotFoundException;
import com.projectmanager.exception.UnauthorizedException;
import com.projectmanager.repository.CommentRepository;
import com.projectmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserService userService;

    @Transactional
    public CommentResponse addComment(Long taskId, CommentRequest request, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", taskId));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .author(currentUser)
                .task(task)
                .build();

        return toResponse(commentRepository.save(comment));
    }

    public List<CommentResponse> getCommentsByTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", taskId));
        return commentRepository.findByTaskOrderByCreatedAtAsc(task)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteComment(Long commentId, User currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));
        if (!comment.getAuthor().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only delete your own comments");
        }
        commentRepository.delete(comment);
    }

    private CommentResponse toResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(userService.toDto(comment.getAuthor()))
                .taskId(comment.getTask().getId())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
