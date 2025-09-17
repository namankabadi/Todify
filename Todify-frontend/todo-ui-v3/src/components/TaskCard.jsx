import React from "react";
import "../css/tasks.css";

const TaskCard = ({ task, toggleStatus }) => {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p><strong>Assigned To:</strong> {task.assignedTo}</p>
      <p><strong>Status:</strong> {task.completed ? "✅ Completed" : "❌ Incomplete"}</p>
      {toggleStatus && (
        <button onClick={() => toggleStatus(task.id, !task.completed)}>
          Mark as {task.completed ? "Incomplete" : "Completed"}
        </button>
      )}
    </div>
  );
};

export default TaskCard;
