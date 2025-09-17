import React, { useEffect, useState } from "react";
import { getTodo, saveTodo, updateTodo } from "../services/TodoService";
import { useNavigate, useParams } from "react-router-dom";

const TodoComponent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate,setStartDate] = useState("");
  const [endDate,setEndDate] = useState("");
  const [completed, setCompleted] = useState(false);
  

  const navigate = useNavigate();
  const { id } = useParams();

  function saveOrUpdateTodo(e) {
    e.preventDefault();
    const todo = { title, description, completed, startDate, endDate};

    if (id) {
      updateTodo(id, todo)
         
        .then(() => navigate('/todos'))
        .catch(error => console.error(error));
        console.log(todo)
    } else {
      saveTodo(todo)
        .then(() => navigate('/todos'))
        .catch(error => console.error(error));
    }
  }

  function pageTitle() {
    return (
      <h2 className="text-center">
        {id ? "🖊️ Update Todo Task" : "➕ Add Todo Task"}
      </h2>
    );
  }

  useEffect(() => {
    if (id) {
      getTodo(id)
        .then((response) => {
          setTitle(response.data.title);
          setDescription(response.data.description);
          setStartDate(response.data.startDate);
          setEndDate(response.data.endDate);
          setCompleted(response.data.completed);
          
        })
        .catch(error => console.error(error));
    }
  }, [id]);

  return (
    <div className="container">
      <div className="todo-card">
        {pageTitle()}
        <div className="card-body">
          <form>
            <div className="form-group">
              <label>Todo Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Todo Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Todo Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Todo Description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Start Date:</label>
              <input type="date"  className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              
            </div>

            <div className="form-group">
              <label>End Date:</label>
              <input type="date"  className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Todo Completed</label>
              <select
                className="form-control"
                value={completed}
                onChange={(e) => setCompleted(e.target.value === "true")}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          <br></br>
            <button
              className="btn btn-primary submit-btn"
              onClick={(e) => saveOrUpdateTodo(e)}
            >
              🚀 SUBMIT
            </button>
          </form>
        </div>
      </div>

      {/* Custom Styles */}
      <style>
        {`
          .container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f3f4f6;
            padding: 20px;
          }

          .todo-card {
            background: #fff;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            width: 100%;
            max-width: 500px;
            padding: 30px;
            text-align: center;
          }

          .card-body {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .form-group {
            text-align: left;
          }

          .form-control {
            border: 2px solid #00adb5;
            border-radius: 8px;
            padding: 10px;
            font-size: 1rem;
            transition: border 0.3s ease-in-out;
          }

          .form-control:focus {
            border-color: #00fff5;
            outline: none;
            box-shadow: 0 0 8px rgba(0, 255, 245, 0.4);
          }

          .submit-btn {
            background-color: #00adb5;
            border: none;
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            font-weight: bold;
            transition: background 0.3s ease;
          }

          .submit-btn:hover {
            background-color: #00fff5;
            transform: scale(1.05);
          }

          @media (max-width: 600px) {
            .todo-card {
              padding: 20px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default TodoComponent;
