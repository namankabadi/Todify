package com.naman.todo_prj.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

//to handle all exceptions that occur in this microservice
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(TodoAPIException.class)
    public ResponseEntity<ErrorDetails>  handleTodoAPIException(TodoAPIException exception, WebRequest webRequest){
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                exception.getMessage(),
                webRequest.getDescription(false)
        );

        return new ResponseEntity<>(errorDetails,HttpStatus.BAD_REQUEST);
    }
}
