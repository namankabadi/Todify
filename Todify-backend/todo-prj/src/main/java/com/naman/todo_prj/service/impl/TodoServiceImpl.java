package com.naman.todo_prj.service.impl;

import com.naman.todo_prj.dto.TodoDto;
import com.naman.todo_prj.entity.Todo;
import com.naman.todo_prj.exception.ResourceNotFoundException;
import com.naman.todo_prj.repository.TodoRepository;
import com.naman.todo_prj.service.TodoService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TodoServiceImpl implements TodoService {

    private TodoRepository todoRepository;
    private ModelMapper modelMapper;
    @Override
    public TodoDto addTodo(TodoDto todoDto) {
        // convert todoDto into Todo Jpa entity
        Todo todo = modelMapper.map(todoDto,Todo.class);


        // Todo Jpa Repository
        Todo savedTodo = todoRepository.save(todo);

        // Convert saved Todo Jpa Entity object into TodoDto
        AtomicReference<TodoDto> savedTodoDto = new AtomicReference<>(modelMapper.map(savedTodo, TodoDto.class));
        return savedTodoDto.get();
    }

    @Override
    public TodoDto getTodo(Long id) {
        Todo todo = todoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Todo task not found with id : "+ id));
        return modelMapper.map(todo,TodoDto.class);

    }

    @Override
    public List<TodoDto> getAllTodos() {
        // Converting List of JPA entity into list of Todo DTOs
        List<Todo> todos = todoRepository.findAll();
        return todos.stream().map((todo) ->
                modelMapper.map(todo,TodoDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public TodoDto updateTodo(TodoDto todoDto, Long id) {
        Todo todo = todoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Todo not found with id : "+ id));

        todo.setTitle(todoDto.getTitle());
        todo.setDescription(todoDto.getDescription());
        todo.setStartDate(todoDto.getStartDate());
        todo.setEndDate(todoDto.getEndDate());
        todo.setCompleted(todoDto.isCompleted());


        Todo updatedTodo = todoRepository.save(todo);
        return modelMapper.map(updatedTodo,TodoDto.class);
    }

    @Override
    public void deleteTodo(Long id) {
       Todo todo = todoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: "+id));
        todoRepository.deleteById(id);
    }

    @Override
    public TodoDto completeTodo(Long id) {
        //Retrieve existing Todo By Id
        Todo todo = todoRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Todo not found with id: "+ id));

        todo.setCompleted(Boolean.TRUE);
        Todo updatedTodo = todoRepository.save(todo);
        return modelMapper.map(updatedTodo,TodoDto.class);
    }

    @Override
    public TodoDto inCompleteTodo(Long id) {
        //Retrieve existing Todo By Id
        Todo todo = todoRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Todo not found with id: "+ id));

        todo.setCompleted(Boolean.FALSE);
        Todo updatedTodo = todoRepository.save(todo);
        return modelMapper.map(updatedTodo,TodoDto.class);
    }
}
