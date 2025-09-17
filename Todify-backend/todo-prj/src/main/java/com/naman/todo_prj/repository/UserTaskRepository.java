package com.naman.todo_prj.repository;

import com.naman.todo_prj.entity.UserTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserTaskRepository extends JpaRepository<UserTask, Long> {
    List<UserTask> findByAssignedTo(String username);

}
