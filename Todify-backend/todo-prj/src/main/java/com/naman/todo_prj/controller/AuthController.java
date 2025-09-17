package com.naman.todo_prj.controller;

import com.naman.todo_prj.dto.JwtAuthResponse;
import com.naman.todo_prj.dto.LoginDto;
import com.naman.todo_prj.dto.RegisterDto;
import com.naman.todo_prj.entity.User;
import com.naman.todo_prj.security.JwtTokenProvider;
import com.naman.todo_prj.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/auth/")
@AllArgsConstructor
public class AuthController {
    private AuthService authService;
    private JwtTokenProvider jwtTokenProvider;
    // Build Register REST API
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto){
        String response = authService.register(registerDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Build Login REST API
    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@RequestBody LoginDto loginDto){
        JwtAuthResponse jwtAuthResponse = authService.login(loginDto);

        return new ResponseEntity<>(jwtAuthResponse,HttpStatus.OK);
    }
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers(){
        return authService.getAllUsers();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteUser(@PathVariable Long id){
        authService.deleteUser(id);
        return "User with id " +id +" deleted successfully";
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtAuthResponse> refreshToken(@RequestBody Map<String, String> request) {
        String expiredToken = request.get("token");
        JwtAuthResponse response = authService.refreshToken(expiredToken);
        return ResponseEntity.ok(response);
    }


}
