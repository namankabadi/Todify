package com.naman.todo_prj.controller;

import com.naman.todo_prj.service.NotificationService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@AllArgsConstructor
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping("/{username}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<List<String>> getUserNotifications(@PathVariable String username) {
        List<String> notifications = notificationService.getNotificationsForUser(username);
        return ResponseEntity.ok(notifications);
    }
}
