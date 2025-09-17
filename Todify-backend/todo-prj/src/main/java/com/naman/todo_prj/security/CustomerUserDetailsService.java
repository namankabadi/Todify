package com.naman.todo_prj.security;

import com.naman.todo_prj.entity.User;
import com.naman.todo_prj.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CustomerUserDetailsService implements UserDetailsService {

    private UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail,usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User doesn't exists for given username or email"));
        //Converting set of roles into granted authority
        Set<GrantedAuthority> authorities = user.getRoles().stream().map((role) -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toSet());


        return new org.springframework.security.core.userdetails.User(usernameOrEmail,user.getPassword(),authorities);
    }
}
