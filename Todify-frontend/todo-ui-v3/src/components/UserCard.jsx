// src/components/UserCard.jsx
import React from 'react';
import '../css/userCard.css'; // Import CSS for styling
import profileIcon from '../assets/ProfileIcon.png'; // Import profile icon
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../services/AuthService';

const UserCard = ({ user }) => {
    const navigate = useNavigate();
    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            alert('User deleted successfully!');
            // optionally refresh list here
            
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(error.message || 'Failed to delete user.');
        }
    };
    function assignTask(){
        navigate("/assign-task")
    }

    return (
        <div className="user-card">
            
            <img src={profileIcon} alt="Profile Icon" className="profile-icon" />
            
            <div className="user-info">
                <h2>{user.name}</h2>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Roles:</strong> {user.roles.map(role => role.name).join(', ')}</p>
                <div className="user-actions">
                    <button className="delete-button" onClick={() => handleDelete(user.id)}>Delete Details</button>
                    <button className="add-task-button" onClick={assignTask}>Add Task to User</button>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
