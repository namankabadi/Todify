package com.naman.todo_prj.controller_testing;

import com.naman.todo_prj.controller.NotificationController;
import com.naman.todo_prj.controller.TodoController;
import com.naman.todo_prj.dto.TodoDto;
import com.naman.todo_prj.service.NotificationService;
import com.naman.todo_prj.service.TodoService;
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

class TodoControllerTest {

    @Mock
    private TodoService todoService;

    @InjectMocks
    private TodoController todoController;

    private TodoDto sampleTodo;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sampleTodo = new TodoDto();
        sampleTodo.setTitle("Test Todo");
        sampleTodo.setDescription("Test Description");
        sampleTodo.setCompleted(false);
    }

    @Test
    void testAddTodo() {
        when(todoService.addTodo(any(TodoDto.class))).thenReturn(sampleTodo);

        ResponseEntity<TodoDto> response = todoController.addTodo(sampleTodo);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals(sampleTodo, response.getBody());
    }

    @Test
    void testGetTodo() {
        when(todoService.getTodo(1L)).thenReturn(sampleTodo);

        ResponseEntity<TodoDto> response = todoController.getTodo(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(sampleTodo, response.getBody());
    }

    @Test
    void testGetAllTodos() {
        List<TodoDto> todos = Arrays.asList(sampleTodo);
        when(todoService.getAllTodos()).thenReturn(todos);

        ResponseEntity<List<TodoDto>> response = todoController.getAllTodos();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(todos, response.getBody());
    }

    @Test
    void testUpdateTodo() {
        sampleTodo.setTitle("Updated Title");
        when(todoService.updateTodo(any(TodoDto.class), eq(1L))).thenReturn(sampleTodo);

        ResponseEntity<TodoDto> response = todoController.updateTodo(sampleTodo, 1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Updated Title", response.getBody().getTitle());
    }

    @Test
    void testDeleteTodo() {
        doNothing().when(todoService).deleteTodo(1L);

        ResponseEntity<String> response = todoController.deleteTodo(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Todo Deleted Successfully!", response.getBody());
    }

    @Test
    void testCompleteTodo() {
        sampleTodo.setCompleted(true);
        when(todoService.completeTodo(1L)).thenReturn(sampleTodo);

        ResponseEntity<TodoDto> response = todoController.completeTodo(1L);

        assertTrue(response.getBody().isCompleted());
    }

    @Test
    void testInCompleteTodo() {
        sampleTodo.setCompleted(false);
        when(todoService.inCompleteTodo(1L)).thenReturn(sampleTodo);

        ResponseEntity<TodoDto> response = todoController.inCompleteTodo(1L);

        assertFalse(response.getBody().isCompleted());
    }

    static class NotificationControllerTest {

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
}
