package com.naman.todo_prj.service.impl;

import com.naman.todo_prj.dto.UserDto;
import com.naman.todo_prj.entity.User;
import com.naman.todo_prj.repository.UserRepository;
import com.naman.todo_prj.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    @Override
    public UserDto getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User name does not exists!"));

        return mapToDTO(user);
    }

    @Override
    public UserDto updateUserProfile(String username, UserDto updatedUser) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User name does not exist!!"));
        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());

        userRepository.save(user);
        return mapToDTO(user);
    }

    @Override
    public void updatePassword(String username, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private UserDto mapToDTO(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPassword(user.getPassword());
        dto.setRoles(user.getRoles().stream().map(role -> role.getName()).collect(Collectors.toSet()));
        return dto;
    }


}
