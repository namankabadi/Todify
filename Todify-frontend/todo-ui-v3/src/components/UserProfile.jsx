import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/userProfile.css";
import { getLoggedInUser, getToken } from "../services/AuthService";
import profileIcon from "../assets/ProfileIcon.png";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const username = getLoggedInUser();
  const token = getToken();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
        setFormData({ name: response.data.name, email: response.data.email });
        console.log(response.data.name);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    if (username) fetchUserProfile();
  }, [username, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/users/${username}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
      setEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordReset = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/users/${username}/password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password updated successfully!");
      setShowPasswordForm(false);
      setNewPassword("");
    } catch (error) {
      console.error("Password update failed", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src={profileIcon} alt="Profile Icon" className="profile-icon" />

        {editing ? (
          <>
            <label
              style={{
                fontWeight: "600",
                marginBottom: "0.3rem",
                display: "block",
                textAlign: "left",
                color: "#33465a",
              }}
            >
              Name:{" "}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter correct name"
            />
            <label
              style={{
                fontWeight: "600",
                marginBottom: "0.3rem",
                display: "block",
                textAlign: "left",
                color: "#33465a",
              }}
            >
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter new email"
            />
            <div className="profile-actions">
              <button onClick={handleUpdate}>Save</button>
              <button
                onClick={() => setEditing(false)}
                style={{ backgroundColor: "#ccc", color: "#333" }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>{user.name}</h2>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              {user.roles && user.roles.length > 0
                ? user.roles[0].replace("ROLE_", "")
                : "User"}
            </p>

            <div className="profile-actions">
              <button onClick={() => setEditing(true)}>Edit Profile</button>
            </div>
          </>
        )}

{!editing && (
  <div className="reset-password-section">
    <button
      className="toggle-password-btn"
      onClick={() => setShowPasswordForm(true)}
    >
      Reset Password
    </button>

    {showPasswordForm && (
      <div className="modal-overlay" onClick={() => setShowPasswordForm(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3 className="modal-title">Reset Password</h3>
          <label htmlFor="newPassword" className="password-label">
            New Password:
          </label>
          <input
            id="newPassword"
            type="password"
            className="password-input"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="modal-buttons">
            <button onClick={handlePasswordReset}>Save</button>
            <button
              onClick={() => {
                setShowPasswordForm(false);
                setNewPassword("");
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}

      </div>
    </div>
  );
};

export default UserProfile;
