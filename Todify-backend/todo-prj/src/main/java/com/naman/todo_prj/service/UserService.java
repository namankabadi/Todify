package com.naman.todo_prj.service;

import com.naman.todo_prj.dto.UserDto;

import java.util.List;

public interface UserService {
    UserDto getUserProfile(String username);
    UserDto updateUserProfile(String username, UserDto updatedUser);
    public void updatePassword(String username, String newPassword);

}
