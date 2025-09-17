package com.naman.todo_prj.controller;

import com.naman.todo_prj.entity.UserTask;
import com.naman.todo_prj.repository.UserTaskRepository;
import com.naman.todo_prj.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/usertasks")
@AllArgsConstructor
public class UserTaskController {
    private UserTaskRepository userTaskRepository;

    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserTask> assignTask(@RequestBody UserTask task) {
        return ResponseEntity.ok(userTaskRepository.save(task));
    }

    @GetMapping("/{username}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<UserTask> getTasksForUser(@PathVariable String username) {
        return userTaskRepository.findByAssignedTo(username);
    }

    @PutMapping("/{taskId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserTask> updateTask(@PathVariable Long taskId, @RequestBody UserTask updatedTask) {
        return userTaskRepository.findById(taskId)
                .map(task -> {
                    task.setTitle(updatedTask.getTitle());
                    task.setDescription(updatedTask.getDescription());
                    task.setStartDate(updatedTask.getStartDate());
                    task.setEndDate(updatedTask.getEndDate());
                    task.setAssignedTo(updatedTask.getAssignedTo());
                    task.setStatus(updatedTask.getStatus());
                    return ResponseEntity.ok(userTaskRepository.save(task));
                })
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserTask> getAllTasks() {
        return userTaskRepository.findAll();
    }
    @DeleteMapping("/{taskId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        if (userTaskRepository.existsById(taskId)) {
            userTaskRepository.deleteById(taskId);
            System.out.println("User Deleted Successfully");
            return ResponseEntity.ok().build();


        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{taskId}/status")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<UserTask> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> statusPayload) {

        return userTaskRepository.findById(taskId)
                .map(task -> {
                    String status = statusPayload.get("status");
                    task.setStatus(UserTask.Status.valueOf(status));
                    return ResponseEntity.ok(userTaskRepository.save(task));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status-count/{username}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getStatusCountByUser(@PathVariable String username) {
        List<UserTask> tasks = userTaskRepository.findByAssignedTo(username);

        long completed = tasks.stream().filter(task -> task.getStatus() == UserTask.Status.COMPLETE).count();
        long incomplete = tasks.stream().filter(task -> task.getStatus() == UserTask.Status.INCOMPLETE).count();

        Map<String, Long> response = new HashMap<>();
        response.put("completed", completed);
        response.put("incomplete", incomplete);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/status-summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Map<String, Long>>> getAdminTaskSummary() {
        List<UserTask> tasks = userTaskRepository.findAll();

        Map<String, Map<String, Long>> summary = new TreeMap<>();

        for (UserTask task : tasks) {
            String date = task.getEndDate().toString(); // Format: yyyy-MM-dd

            summary.putIfAbsent(date, new HashMap<>());
            Map<String, Long> statusMap = summary.get(date);

            String status = task.getStatus().name();
            statusMap.put(status, statusMap.getOrDefault(status, 0L) + 1);
        }

        return ResponseEntity.ok(summary);
    }

}
