package com.naman.todo_prj.service_layer_testing;


import com.naman.todo_prj.dto.JwtAuthResponse;
import com.naman.todo_prj.dto.LoginDto;
import com.naman.todo_prj.dto.RegisterDto;
import com.naman.todo_prj.entity.Role;
import com.naman.todo_prj.entity.User;
import com.naman.todo_prj.exception.TodoAPIException;
import com.naman.todo_prj.repository.RoleRepository;
import com.naman.todo_prj.repository.UserRepository;
import com.naman.todo_prj.security.JwtTokenProvider;
import com.naman.todo_prj.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtTokenProvider jwtTokenProvider;

    @InjectMocks private AuthServiceImpl authService;

    private RegisterDto registerDto;
    private LoginDto loginDto;
    private User mockUser;
    private Role mockRole;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        registerDto = new RegisterDto("Naman", "naman", "naman@example.com", "password");
        loginDto = new LoginDto("naman", "password");

        mockRole = new Role();
        mockRole.setName("ROLE_USER");

        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername("naman");
        mockUser.setEmail("naman@example.com");
        mockUser.setPassword("encodedPassword");
        mockUser.setRoles(Set.of(mockRole));
    }

    @Test
    void testRegister_Success() {
        when(userRepository.existsByUsername("naman")).thenReturn(false);
        when(userRepository.existsByEmail("naman@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(roleRepository.findByName("ROLE_USER")).thenReturn(mockRole);

        String result = authService.register(registerDto);

        assertEquals("User Registered Successfully..!", result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testRegister_UsernameExists() {
        when(userRepository.existsByUsername("naman")).thenReturn(true);

        TodoAPIException ex = assertThrows(TodoAPIException.class, () -> authService.register(registerDto));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
    }

    @Test
    void testLogin_Success() {
        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(jwtTokenProvider.generateToken(auth)).thenReturn("mockToken");
        when(userRepository.findByUsernameOrEmail("naman", "naman")).thenReturn(Optional.of(mockUser));

        JwtAuthResponse response = authService.login(loginDto);

        assertEquals("mockToken", response.getAccessToken());
        assertEquals("ROLE_USER", response.getRole());
    }

//    @Test
//    void testDeleteUser_Success() {
//        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
//
//        String result = authService.deleteUser(1L);
//
//        assertEquals("User with id 1deleted Successfully!!", result);
//        verify(userRepository).delete(mockUser);
//    }

    @Test
    void testDeleteUser_NotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> authService.deleteUser(99L));
    }

    @Test
    void testRefreshToken_Success() {
        when(jwtTokenProvider.getUsername("expiredToken")).thenReturn("naman");
        when(jwtTokenProvider.generateTokenFromUsername("naman")).thenReturn("newToken");
        when(userRepository.findByUsernameOrEmail("naman", "naman")).thenReturn(Optional.of(mockUser));

        JwtAuthResponse response = authService.refreshToken("expiredToken");

        assertEquals("newToken", response.getAccessToken());
        assertEquals("ROLE_USER", response.getRole());
    }
}
