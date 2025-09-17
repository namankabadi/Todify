package com.naman.todo_prj.controller_testing;

import com.naman.todo_prj.controller.NotificationController;
import com.naman.todo_prj.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NotificationControllerTest {

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private NotificationController notificationController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetUserNotifications() {
        String username = "naman";
        List<String> mockNotifications = Arrays.asList(
                "⚠️ Urgent: The task titled 'Fix Bug' is overdue.",
                "⏰ Reminder: The task titled 'Write Report' is due today."
        );

        when(notificationService.getNotificationsForUser(username)).thenReturn(mockNotifications);

        ResponseEntity<List<String>> response = notificationController.getUserNotifications(username);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertTrue(response.getBody().get(0).contains("Urgent"));
        assertTrue(response.getBody().get(1).contains("Reminder"));

        verify(notificationService, times(1)).getNotificationsForUser(username);
    }
}
