package com.projectmanager.config;

import com.projectmanager.entity.*;
import com.projectmanager.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping.");
            return;
        }

        log.info("Seeding database with sample data...");

        // Create users
        User admin = userRepository.save(User.builder()
                .name("Admin User")
                .email("admin@pm.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .avatar("https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff&size=128")
                .build());

        User manager = userRepository.save(User.builder()
                .name("Jane Manager")
                .email("manager@pm.com")
                .password(passwordEncoder.encode("manager123"))
                .role(Role.USER)
                .avatar("https://ui-avatars.com/api/?name=Jane+Manager&background=10b981&color=fff&size=128")
                .build());

        User alice = userRepository.save(User.builder()
                .name("Alice Dev")
                .email("alice@pm.com")
                .password(passwordEncoder.encode("alice123"))
                .role(Role.USER)
                .avatar("https://ui-avatars.com/api/?name=Alice+Dev&background=f59e0b&color=fff&size=128")
                .build());

        User bob = userRepository.save(User.builder()
                .name("Bob Designer")
                .email("bob@pm.com")
                .password(passwordEncoder.encode("bob123"))
                .role(Role.USER)
                .avatar("https://ui-avatars.com/api/?name=Bob+Designer&background=ef4444&color=fff&size=128")
                .build());

        // Create teams
        Team devTeam = teamRepository.save(Team.builder()
                .name("Development Team")
                .description("Core development team responsible for backend and frontend")
                .createdBy(admin)
                .members(Set.of(admin, manager, alice, bob))
                .build());

        Team designTeam = teamRepository.save(Team.builder()
                .name("Design Team")
                .description("UI/UX design and frontend team")
                .createdBy(manager)
                .members(Set.of(manager, bob))
                .build());

        // Create projects
        Project alphaProject = projectRepository.save(Project.builder()
                .name("Project Alpha")
                .description("Main product development for Q1 release. Includes API, dashboard and reporting modules.")
                .deadline(LocalDate.now().plusDays(30))
                .priority(Priority.HIGH)
                .status(ProjectStatus.ACTIVE)
                .createdBy(admin)
                .team(devTeam)
                .members(Set.of(admin, manager, alice, bob))
                .build());

        Project betaProject = projectRepository.save(Project.builder()
                .name("Project Beta")
                .description("Customer portal redesign with new UX guidelines and improved accessibility.")
                .deadline(LocalDate.now().plusDays(60))
                .priority(Priority.MEDIUM)
                .status(ProjectStatus.PLANNING)
                .createdBy(manager)
                .team(designTeam)
                .members(Set.of(manager, bob))
                .build());

        // Create tasks for Project Alpha
        taskRepository.save(Task.builder()
                .title("Set up CI/CD pipeline")
                .description("Configure GitHub Actions for automated testing and deployment to staging.")
                .assignee(alice)
                .project(alphaProject)
                .dueDate(LocalDate.now().plusDays(7))
                .priority(Priority.HIGH)
                .status(TaskStatus.IN_PROGRESS)
                .tags("devops,infrastructure")
                .createdBy(admin)
                .build());

        taskRepository.save(Task.builder()
                .title("Implement JWT authentication")
                .description("Build secure JWT-based auth with refresh tokens and role-based access control.")
                .assignee(alice)
                .project(alphaProject)
                .dueDate(LocalDate.now().plusDays(5))
                .priority(Priority.CRITICAL)
                .status(TaskStatus.DONE)
                .tags("security,backend")
                .createdBy(admin)
                .build());

        taskRepository.save(Task.builder()
                .title("Design dashboard UI")
                .description("Create mockups and implement responsive dashboard with charts and KPIs.")
                .assignee(bob)
                .project(alphaProject)
                .dueDate(LocalDate.now().plusDays(10))
                .priority(Priority.MEDIUM)
                .status(TaskStatus.REVIEW)
                .tags("frontend,design")
                .createdBy(manager)
                .build());

        taskRepository.save(Task.builder()
                .title("Write API documentation")
                .description("Document all REST endpoints using OpenAPI/Swagger specifications.")
                .assignee(manager)
                .project(alphaProject)
                .dueDate(LocalDate.now().minusDays(2))  // Overdue!
                .priority(Priority.LOW)
                .status(TaskStatus.TO_DO)
                .tags("documentation")
                .createdBy(admin)
                .build());

        taskRepository.save(Task.builder()
                .title("Database optimization")
                .description("Add indexes to frequently queried columns and optimize slow queries.")
                .assignee(alice)
                .project(alphaProject)
                .dueDate(LocalDate.now().minusDays(5))  // Overdue!
                .priority(Priority.HIGH)
                .status(TaskStatus.IN_PROGRESS)
                .tags("backend,database")
                .createdBy(admin)
                .build());

        // Create tasks for Project Beta
        taskRepository.save(Task.builder()
                .title("Customer portal wireframes")
                .description("Design wireframes for the new customer-facing portal with Figma.")
                .assignee(bob)
                .project(betaProject)
                .dueDate(LocalDate.now().plusDays(14))
                .priority(Priority.HIGH)
                .status(TaskStatus.IN_PROGRESS)
                .tags("design,ux")
                .createdBy(manager)
                .build());

        taskRepository.save(Task.builder()
                .title("Accessibility audit")
                .description("Review all pages for WCAG 2.1 AA compliance and fix identified issues.")
                .assignee(bob)
                .project(betaProject)
                .dueDate(LocalDate.now().plusDays(20))
                .priority(Priority.MEDIUM)
                .status(TaskStatus.TO_DO)
                .tags("accessibility,frontend")
                .createdBy(manager)
                .build());

        log.info("Database seeding complete. Sample users: admin@pm.com, manager@pm.com, alice@pm.com, bob@pm.com (password = name+123)");
    }
}
