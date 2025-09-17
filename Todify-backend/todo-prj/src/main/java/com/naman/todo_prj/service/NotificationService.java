package com.naman.todo_prj.service;

import java.util.List;

public interface NotificationService {
    List<String> getNotificationsForUser(String username);

}
