package com.naman.todo_prj.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public class TodoAPIException extends RuntimeException{
    private HttpStatus status;
    private String message;


}
