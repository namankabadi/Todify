import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getAllUsers } from "../services/AuthService";
import "../css/userTasks.css";

const UserTasks = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "INCOMPLETE",
    startDate: "",
    endDate: "",
    assignedTo: "",
  });

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getToken();
        const usersData = await getAllUsers(token);
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const validateForm = () => {
    const errors = {};

    if (!task.title.trim()) errors.title = "Title is required.";
    if (!task.description.trim()) errors.description = "Description is required.";
    if (!task.startDate) errors.startDate = "Start Date is required.";
    if (!task.endDate) errors.endDate = "End Date is required.";
    if (task.startDate && task.endDate && new Date(task.startDate) > new Date(task.endDate)) {
      errors.date = "Start Date cannot be after End Date.";
    }
    if (!task.assignedTo) errors.assignedTo = "Please select a user.";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    const token = getToken();

    try {
      await axios.post("http://localhost:8080/api/usertasks/assign", task, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Task assigned successfully!");
      setTask({
        title: "",
        description: "",
        status: "INCOMPLETE",
        startDate: "",
        endDate: "",
        assignedTo: "",
      });
      setSearchTerm("");
    } catch (error) {
      console.error("Error assigning task", error);
      alert("Failed to assign task.");
    }
  };

  return (
    <div className="assign-task-container">
      <h2 style={{ textAlign: "center", color: "#222d2d" }}>Assign Task to User</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <label>Title</label>
        <input type="text" name="title" placeholder="Task title" value={task.title} onChange={handleChange} required />
        {formErrors.title && <small className="error">{formErrors.title}</small>}

        <label>Description</label>
        <textarea name="description" placeholder="Task description" value={task.description} onChange={handleChange} required />
        {formErrors.description && <small className="error">{formErrors.description}</small>}

        <label>Status</label>
        <select name="status" value={task.status} onChange={handleChange}>
          <option value="INCOMPLETE">Incomplete</option>
          <option value="COMPLETE">Complete</option>
        </select>

        <label>Start Date</label>
        <input type="date" name="startDate" value={task.startDate} onChange={handleChange} required />
        {formErrors.startDate && <small className="error">{formErrors.startDate}</small>}

        <label>End Date</label>
        <input type="date" name="endDate" value={task.endDate} onChange={handleChange} required />
        {formErrors.endDate && <small className="error">{formErrors.endDate}</small>}
        {formErrors.date && <small className="error">{formErrors.date}</small>}

        <label>Search User</label>
        <input
          type="text"
          placeholder="Search Username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <label>Assign To</label>
        <select name="assignedTo" value={task.assignedTo} onChange={handleChange} required>
          <option value="">Select a user</option>
          {filteredUsers.map((user) => (
            <option key={user.id} value={user.username}>
              {user.username}
            </option>
          ))}
        </select>
        {formErrors.assignedTo && <small className="error">{formErrors.assignedTo}</small>}

        <button type="submit" className="btn-submit">Assign Task</button>
      </form>
    </div>
  );
};

export default UserTasks;
