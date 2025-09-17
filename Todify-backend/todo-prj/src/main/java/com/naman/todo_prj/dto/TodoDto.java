package com.naman.todo_prj.dto;
// We are using DTO to transfer data between client and server DTO is a design pattern
// In order to protect the sensitive information we use DTO so that client can only get the essential details / information.

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TodoDto {
    private Long id;
    private String title;
    private String description;
    private Date startDate;
    private Date endDate;
    private boolean completed;

}
