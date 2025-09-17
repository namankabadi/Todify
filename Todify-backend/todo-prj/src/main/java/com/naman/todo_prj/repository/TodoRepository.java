package com.naman.todo_prj.repository;

import com.naman.todo_prj.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {

}
