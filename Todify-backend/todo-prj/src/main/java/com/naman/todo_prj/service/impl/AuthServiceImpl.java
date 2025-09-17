package com.naman.todo_prj.service.impl;

import com.naman.todo_prj.dto.JwtAuthResponse;
import com.naman.todo_prj.dto.LoginDto;
import com.naman.todo_prj.dto.RegisterDto;
import com.naman.todo_prj.entity.Role;
import com.naman.todo_prj.entity.User;
import com.naman.todo_prj.exception.TodoAPIException;
import com.naman.todo_prj.repository.RoleRepository;
import com.naman.todo_prj.repository.UserRepository;
import com.naman.todo_prj.security.JwtTokenProvider;
import com.naman.todo_prj.service.AuthService;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    // Injecting DI for login
    private AuthenticationManager authenticationManager;

    private JwtTokenProvider jwtTokenProvider;

    @Override
    public String register(RegisterDto registerDto) {
        //check username is already exists in database
        if (userRepository.existsByUsername(registerDto.getUsername())){
            throw new TodoAPIException(HttpStatus.BAD_REQUEST,"User name Already exists.");
        }

        // Check if email id already exists in database
        if(userRepository.existsByEmail(registerDto.getEmail())){
            throw new TodoAPIException(HttpStatus.BAD_REQUEST,"User email already exists please login back or click forgot password to reset the password");
        }

        User user = new User();

        user.setName(registerDto.getName());
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));

        Set<Role> roles = new HashSet<>();

        Role userRole = roleRepository.findByName("ROLE_USER");
        roles.add(userRole);

        user.setRoles(roles);
        userRepository.save(user);
        return "User Registered Successfully..!";
    }

    @Override
    public JwtAuthResponse login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getUsernameOrEmail(),
                loginDto.getPassword()
        ));
        // setting authentication to security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token =  jwtTokenProvider.generateToken(authentication);
        Optional<User> userOptional = userRepository.findByUsernameOrEmail(loginDto.getUsernameOrEmail(),
                loginDto.getUsernameOrEmail());
        // Setting role based login
        String role = null;
        if(userOptional.isPresent()){
            User loggedInUser = userOptional.get();
            Optional<Role> optionalRole = loggedInUser.getRoles().stream().findFirst();

            if(optionalRole.isPresent()){
                Role userRole = optionalRole.get();
                role = userRole.getName();
            }
        }

        JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
        jwtAuthResponse.setRole(role);
        jwtAuthResponse.setAccessToken(token);

        return jwtAuthResponse;
    }
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    @Override
    public String deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(()-> new UsernameNotFoundException("User Not found"));
        user.getRoles().clear();
        userRepository.save(user);
        userRepository.delete(user);

        return "User with id " +id+ "deleted Successfully!!";
    }

    @Override
    public JwtAuthResponse refreshToken(String expiredToken) {
        try {
            String username = jwtTokenProvider.getUsername(expiredToken); // even if expired, extract subject
            String newToken = jwtTokenProvider.generateTokenFromUsername(username);

            // Optional: Fetch user role again if needed
            Optional<User> userOptional = userRepository.findByUsernameOrEmail(username, username);
            String role = null;
            if (userOptional.isPresent()) {
                Optional<Role> optionalRole = userOptional.get().getRoles().stream().findFirst();
                if (optionalRole.isPresent()) {
                    role = optionalRole.get().getName();
                }
            }

            JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
            jwtAuthResponse.setAccessToken(newToken);
            jwtAuthResponse.setRole(role);

            return jwtAuthResponse;
        } catch (ExpiredJwtException ex) {
            // If the token is expired, we still want to extract the username
            String username = ex.getClaims().getSubject();
            String newToken = jwtTokenProvider.generateTokenFromUsername(username);

            JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
            jwtAuthResponse.setAccessToken(newToken);
            // Optional: Set role if needed
            return jwtAuthResponse;
        } catch (Exception ex) {
            throw new RuntimeException("Cannot refresh token: " + ex.getMessage());
        }
    }

}
