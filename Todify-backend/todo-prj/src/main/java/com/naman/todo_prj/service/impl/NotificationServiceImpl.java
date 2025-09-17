package com.naman.todo_prj.service.impl;

import com.naman.todo_prj.dto.UserDto;
import com.naman.todo_prj.entity.UserTask;
import com.naman.todo_prj.repository.UserTaskRepository;
import com.naman.todo_prj.service.EmailService;
import com.naman.todo_prj.service.NotificationService;
import com.naman.todo_prj.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final UserTaskRepository userTaskRepository;
    private final UserService userService;
    private final EmailService emailService;
    private static final Logger logger = LoggerFactory.getLogger(NotificationServiceImpl.class);

    @Override
    public List<String> getNotificationsForUser(String username) {
        List<UserTask> tasks = userTaskRepository.findByAssignedTo(username);
        List<String> notifications = new ArrayList<>();
        LocalDate today = LocalDate.now(); // Current date stored in a variable

        logger.info("Fetching notifications for user: {}", username);

        // Check if user exists
        UserDto user = userService.getUserProfile(username);

        if (user == null) {
            logger.warn("User not found: {}", username);
            notifications.add("User not found: " + username);
            return notifications;
        }

        logger.debug("User fetched: Name = {}, Email = {}", user.getName(), user.getEmail());

        // Loop through each task and process it
        for (UserTask task : tasks) {
            logger.debug("Task details: {}", task.toString()); // Print full task details
            logger.debug("End Date for Task '{}' is: {}", task.getTitle(), task.getEndDate());

            // Check if endDate is null in the task
            if (task.getEndDate() == null) {
                logger.error("Task '{}' has a null end date. Skipping task.", task.getTitle());
                continue; // Skip processing this task if endDate is null
            }

            try {
                // Convert java.sql.Date to LocalDate
                Date endDate = (Date) task.getEndDate();  // Get the java.sql.Date object
                logger.debug("Raw end date object: {}", endDate);
                logger.debug("End date class: {}", endDate.getClass());

                LocalDate taskEndDate = endDate.toLocalDate(); // This works with Java 8 and above
                logger.debug("Task '{}' has end date as LocalDate: {}", task.getTitle(), taskEndDate);
                logger.debug("Today's date: {}", today);

                // Only process incomplete tasks
                if (task.getStatus() != null && task.getStatus() == UserTask.Status.INCOMPLETE) {
                    if (taskEndDate.isBefore(today)) {
                        // Overdue case
                        String message = "⚠️ Urgent: The task titled '" + task.getTitle() + "' is overdue.\n"
                                + "\nDue Date: " + taskEndDate + "\n"
                                + "\nPlease take immediate action.";

                        notifications.add(message);
                        logger.info("Overdue task notification generated for task: {}", task.getTitle());
                        sendEmailNotification(user, username, "Reminder: You have an overdue task", message);

                    } else if (taskEndDate.isEqual(today)) {
                        // Due Today case
                        String message = "⏰ Reminder: The task titled '" + task.getTitle() + "' is due today.\n"
                                + "Due Date: " + taskEndDate + "\n"
                                + "Please ensure it is completed on time.";

                        notifications.add(message);
                        logger.info("Due today task notification generated for task: {}", task.getTitle());
                        sendEmailNotification(user, username, "Reminder: Task is due today", message);

                    } else if (taskEndDate.isEqual(today.plusDays(1))) {
                        // Due Tomorrow case
                        String message = "🔔 Heads Up: The task titled '" + task.getTitle() + "' is due tomorrow.\n"
                                + "Due Date: " + taskEndDate + "\n"
                                + "Prepare in advance to complete it on time.";

                        notifications.add(message);
                        logger.info("Task due tomorrow notification generated for task: {}", task.getTitle());
                        sendEmailNotification(user, username, "REMINDER: Task Due Tomorrow ", message);
                    }
                }

            } catch (Exception e) {
                logger.error("Error processing task end date for task '{}': {}", task.getTitle(), e.getMessage());
            }
        }
        return notifications;
    }

    private void sendEmailNotification(UserDto user, String username, String subject, String message) {
        logger.debug("Before Email");
        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            logger.debug("if block inside");
            logger.debug("Email is {} ", user.getEmail());
            emailService.sendEmail(
                    user.getEmail(),
                    subject,
                    "Dear " + user.getName() + ",\n\n" + message + "\n\nThank You,\nTodify Team"
            );
            logger.info("Email successfully sent to: {}", user.getEmail());
        } else {
            logger.warn("User '{}' does not have a valid email address.", username);
        }
    }
}
