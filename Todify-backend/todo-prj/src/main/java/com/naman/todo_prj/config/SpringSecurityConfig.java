package com.naman.todo_prj.config;

import com.naman.todo_prj.security.JwtAuthenticationEntryPoint;
import com.naman.todo_prj.security.JwtAuthenticationFilter;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@AllArgsConstructor
public class SpringSecurityConfig {
    private UserDetailsService userDetailsService;

    private JwtAuthenticationEntryPoint authenticationEntryPoint;
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    @Bean
    public static PasswordEncoder  passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests((authorize) ->{
//              Role based authentication
//            authorize.requestMatchers(HttpMethod.POST,"/api/**").hasRole("ADMIN");
//            authorize.requestMatchers(HttpMethod.PUT,"/api/**").hasRole("ADMIN");
//            authorize.requestMatchers(HttpMethod.DELETE,"/api/**").hasRole("ADMIN");
//            authorize.requestMatchers(HttpMethod.GET,"/api/**").hasAnyRole("ADMIN","USER");
//            authorize.requestMatchers(HttpMethod.PATCH,"/api/**").hasAnyRole("ADMIN","USER");
//            authorize.requestMatchers(HttpMethod.GET,"/api/**").permitAll();
              authorize.requestMatchers("/api/auth/**").permitAll();
              authorize.requestMatchers("/api/auth/refresh").permitAll();
              authorize.requestMatchers("/api/auth/users").permitAll();
              authorize.requestMatchers("/api/users/**").permitAll();
              authorize.requestMatchers(HttpMethod.OPTIONS,"/**").permitAll();
              authorize.requestMatchers("/api/usertasks/**").authenticated();
              authorize.requestMatchers(HttpMethod.GET,"/**").hasAnyRole("ADMIN","USER");
              authorize.requestMatchers(HttpMethod.PUT,"/**").hasAnyRole("ADMIN","USER");
              authorize.requestMatchers(HttpMethod.GET,"/api/notifications/**").hasAnyRole("ADMIN","USER");


                    authorize.anyRequest().authenticated();
        }).httpBasic(Customizer.withDefaults());

        http.exceptionHandling(exception ->  exception
                .authenticationEntryPoint(authenticationEntryPoint));

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    // authentication manager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }


//    @Bean
//    public UserDetailsService userDetailsService(){
//        UserDetails naman = User.builder()
//                .username("naman")
//                .password(passwordEncoder().encode("password"))
//                .roles("USER")
//                .build();
//
//        UserDetails admin = User.builder()
//                .username("admin")
//                .password(passwordEncoder().encode("admin"))
//                .roles("ADMIN")
//                .build();
//
//        return new InMemoryUserDetailsManager(naman,admin);
//    }


}
