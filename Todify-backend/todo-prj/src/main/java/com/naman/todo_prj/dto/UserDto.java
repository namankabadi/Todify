package com.naman.todo_prj.dto;

import lombok.*;

import java.util.Set;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String username;
    private String email;
    private String password;
    private Set<String> roles;
}