package com.naman.todo_prj.service;

public interface EmailService {
    void sendEmail(String to, String subject, String body);
}
