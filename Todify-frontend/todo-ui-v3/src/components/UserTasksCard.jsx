import React, { useEffect, useState } from "react";
import {
  getToken,
  getLoggedInUser,
  isAdminUser,
} from "../services/AuthService";
import {
  fetchTasksByUsername,
  fetchAllTasks,
  updateTaskStatus,
  deleteTask,
  updateTask,
} from "../services/AuthService";
import "../css/userTasksCard.css";

const UserTasksCard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);

  const token = getToken();
  const username = getLoggedInUser();
  const isAdmin = isAdminUser();

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = isAdmin
        ? await fetchAllTasks(token)
        : await fetchTasksByUsername(username, token);
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status, token);
      loadTasks();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure to delete this task?")) {
      try {
        await deleteTask(taskId, token);
        loadTasks();
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  const handleEditClick = (task) => {
    setEditingTask({ ...task });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setEditingTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask(editingTask.id, editingTask, token);
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="task-container">
      <h2>{isAdmin ? "All Tasks" : "My Tasks"}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p>
                <strong>Description:</strong> {task.description}
              </p>
              <p>
                <strong>Start Date:</strong> {task.startDate}
              </p>
              <p>
                <strong>End Date:</strong> {task.endDate}
              </p>
              <p>
                <strong>Assigned To:</strong> {task.assignedTo}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: task.status === "COMPLETE" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {task.status}
                </span>
              </p>

              <button
                className="btn status-btn"
                style={{ backgroundColor: "#555", color: "white" }}
                onClick={() =>
                  handleStatusChange(
                    task.id,
                    task.status === "COMPLETE" ? "INCOMPLETE" : "COMPLETE"
                  )
                }
              >
                Mark as {task.status === "COMPLETE" ? "Incomplete" : "Complete"}
              </button>

              {isAdmin && (
                <>
                  <button
                    style={{
                      backgroundColor: "red",
                      color: "white",
                    }}
                    className="btn delete-btn"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                  <button
                    style={{ backgroundColor: "#51bb6a", color: "white" }}
                    className="btn update-btn"
                    onClick={() => handleEditClick(task)}
                  >
                    Update
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {editingTask && (
        <div className="fullscreen-modal">
          <div className="fullscreen-modal-content">
            <button
              className="fullscreen-close-btn"
              onClick={() => setEditingTask(null)}
            >
              ×
            </button>
            <h3>Edit Task</h3>
            <form onSubmit={handleUpdateSubmit} className="edit-task-form">
              <input
                type="text"
                name="title"
                value={editingTask.title}
                onChange={handleUpdateChange}
                placeholder="Title"
                required
              />
              <textarea
                name="description"
                value={editingTask.description}
                onChange={handleUpdateChange}
                placeholder="Description"
                required
              />
              <input
                type="date"
                name="startDate"
                value={editingTask.startDate}
                onChange={handleUpdateChange}
                required
              />
              <input
                type="date"
                name="endDate"
                value={editingTask.endDate}
                onChange={handleUpdateChange}
                required
              />
              <input
                type="text"
                name="assignedTo"
                value={editingTask.assignedTo}
                onChange={handleUpdateChange}
                placeholder="Assigned To"
                required
              />
              <select
                name="status"
                value={editingTask.status}
                onChange={handleUpdateChange}
              >
                <option value="INCOMPLETE">INCOMPLETE</option>
                <option value="COMPLETE">COMPLETE</option>
              </select>
              <div className="modal-buttons">
                <button type="submit" className="btn save-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn cancel-btn"
                  onClick={() => setEditingTask(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTasksCard;
