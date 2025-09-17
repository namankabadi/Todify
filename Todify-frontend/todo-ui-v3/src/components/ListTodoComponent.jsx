
import React, { useEffect, useState } from "react";
import {
  completeTodo,
  deleteTodo,
  getAllTodos,
  inCompleteTodo,
} from "../services/TodoService";
import profileIcon from '../assets/ProfileIcon.png'; 
import { useNavigate } from "react-router-dom";
import { isAdminUser, isUserLoggedIn } from "../services/AuthService";
import "../css/ListTodoComponent.css";

const ListTodoComponent = () => {
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();
  const isAdmin = isAdminUser();

  useEffect(() => {
    listTodos();
  }, []);

  function listTodos() {
    getAllTodos()
      .then((response) => setTodos(response.data))
      .catch((error) => console.error(error));
  }

  function addNewTodo() {
    navigate("/add-todo");
  }

  function updateTodo(id) {
    navigate(`/update-todo/${id}`);
  }

  function removeTodo(id) {
    deleteTodo(id)
      .then(() => listTodos())
      .catch((error) => console.error(error));
  }

  function markCompleteTodo(id) {
    completeTodo(id)
      .then(() => listTodos())
      .catch((error) => console.error(error));
  }

  function markInCompleteTodo(id) {
    inCompleteTodo(id)
      .then(() => listTodos())
      .catch((error) => console.error(error));
  }

  function getAllUsersDetails(){
    navigate("/userDetails");
  }

  function getProfile(){
    navigate("/profile");
  }

  return (
    <div className="container">
      {isAdmin && (
        <button className="btn btn-secondary btn-lg add-btn" onClick={addNewTodo}>
          ➕ Add Todo Task
        </button>
      )}

      {isAdmin && (
        <button className="btn btn-secondary btn-lg add-btn" onClick={getAllUsersDetails}>
          ➕ Get All Users Details
        </button>
      )}

      <h2 className="text-center mb-4"> List of Todo Tasks</h2>

      <div className="todo-list">
        {todos.map((todo) => (
          <div key={todo.id} className={`todo-card ${todo.completed ? "completed" : ""}`}>
            <h5>Title: {todo.title}</h5>
            <p>Description: {todo.description}</p>
            <p>Start date: {todo.startDate}</p>
            <p>End Date: {todo.endDate}</p>
            <div className="todo-actions">
              {isAdmin && (
                <button className="btn btn-info" onClick={() => updateTodo(todo.id)}>
                  ✏️ Update
                </button>
              )}

              {isAdmin && (
                <button className="btn btn-danger" onClick={() => removeTodo(todo.id)}>
                  🗑️ Delete
                </button>
              )}
              {!todo.completed ? (
                <button className="btn btn-success" onClick={() => markCompleteTodo(todo.id)}>
                  ✅ Mark as Completed
                </button>
              ) : (
                <button className="btn btn-warning" onClick={() => markInCompleteTodo(todo.id)}>
                  🔄 Mark as In-Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <br />
    </div>
  );
};

export default ListTodoComponent;
