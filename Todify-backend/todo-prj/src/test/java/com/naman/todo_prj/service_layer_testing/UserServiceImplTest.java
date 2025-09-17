package com.naman.todo_prj.service_layer_testing;


import com.naman.todo_prj.dto.UserDto;
import com.naman.todo_prj.entity.User;
import com.naman.todo_prj.entity.Role;
import com.naman.todo_prj.repository.UserRepository;
import com.naman.todo_prj.service.UserService;
import com.naman.todo_prj.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        Role role = new Role();
        role.setName("ROLE_USER");

        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername("naman");
        mockUser.setName("Naman Kabadi");
        mockUser.setEmail("naman@example.com");
        mockUser.setPassword("encodedPassword");
        mockUser.setRoles(Set.of(role));
    }

    @Test
    void testGetUserProfile_Success() {
        when(userRepository.findByUsername("naman")).thenReturn(Optional.of(mockUser));

        UserDto userDto = userService.getUserProfile("naman");

        assertEquals("naman", userDto.getUsername());
        assertEquals("Naman Kabadi", userDto.getName());
        assertEquals("naman@example.com", userDto.getEmail());
        assertTrue(userDto.getRoles().contains("ROLE_USER"));
    }

    @Test
    void testGetUserProfile_UserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userService.getUserProfile("unknown"));
    }

    @Test
    void testUpdateUserProfile_Success() {
        UserDto updatedDto = new UserDto();
        updatedDto.setName("Updated Name");
        updatedDto.setEmail("updated@example.com");

        when(userRepository.findByUsername("naman")).thenReturn(Optional.of(mockUser));
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        UserDto result = userService.updateUserProfile("naman", updatedDto);

        assertEquals("Updated Name", result.getName());
        assertEquals("updated@example.com", result.getEmail());
    }

    @Test
    void testUpdatePassword_Success() {
        when(userRepository.findByUsername("naman")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");

        userService.updatePassword("naman", "newPassword");

        verify(userRepository, times(1)).save(mockUser);
        assertEquals("encodedNewPassword", mockUser.getPassword());
    }

    @Test
    void testUpdatePassword_UserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userService.updatePassword("unknown", "newPassword"));
    }
}
