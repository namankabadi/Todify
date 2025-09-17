package com.naman.todo_prj.service;

import com.naman.todo_prj.dto.JwtAuthResponse;
import com.naman.todo_prj.dto.LoginDto;
import com.naman.todo_prj.dto.RegisterDto;
import com.naman.todo_prj.dto.UserDto;
import com.naman.todo_prj.entity.User;

import java.util.List;

public interface AuthService  {
    String register(RegisterDto registerDto);
    JwtAuthResponse login(LoginDto loginDto);
    List<User> getAllUsers();
    String deleteUser(Long id);
    JwtAuthResponse refreshToken(String expiredToken);
    interface UserService {
        UserDto getUserProfile(String username);

    }
}
