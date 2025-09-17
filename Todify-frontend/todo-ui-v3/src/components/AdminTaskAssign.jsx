import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../services/AuthService.js";
import "../css/tasks.css";

const AdminTaskAssign = () => {
  const [task, setTask] = useState({ title: "", description: "", assignedTo: "" });
  const token = getToken();

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleAssign = () => {
    axios
      .post("http://localhost:8080/api/usertasks/assign", task, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Task assigned!");
        setTask({ title: "", description: "", assignedTo: "" });
      })
      .catch(() => alert("Failed to assign task."));
  };

  return (
    <div className="task-container">
      <div className="task-card">
        <h2>Assign Task to User</h2>
        <input
          type="text"
          name="title"
          value={task.title}
          placeholder="Title"
          onChange={handleChange}
        />
        <textarea
          name="description"
          value={task.description}
          placeholder="Description"
          onChange={handleChange}
        ></textarea>
        <input
          type="text"
          name="assignedTo"
          value={task.assignedTo}
          placeholder="Username"
          onChange={handleChange}
        />
        <button onClick={handleAssign}>Assign Task</button>
      </div>
    </div>
  );
};

export default AdminTaskAssign;
