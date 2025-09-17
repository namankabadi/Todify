package com.naman.todo_prj.controller;

import com.naman.todo_prj.dto.UserDto;
import com.naman.todo_prj.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private UserService userService;

    @GetMapping("/{username}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserProfile(username));
    }

    @PutMapping("/{username}")
    public ResponseEntity<UserDto> updateUser(@PathVariable String username, @RequestBody UserDto updatedUser) {
        return ResponseEntity.ok(userService.updateUserProfile(username,updatedUser));
    }

    @PutMapping("/{username}/password")
    public ResponseEntity<String> updatePassword(@PathVariable String username,
                                                 @RequestBody Map<String, String> payload) {
        String newPassword = payload.get("newPassword");
        userService.updatePassword(username, newPassword);
        return ResponseEntity.ok("Password updated successfully.");
    }

}
