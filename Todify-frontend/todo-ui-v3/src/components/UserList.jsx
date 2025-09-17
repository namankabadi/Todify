// src/components/UserList.jsx
import React, { useEffect, useState } from "react";
import { getAllUsers, isAdminUser, getToken } from "../services/AuthService"; // Correctly import the functions
import UserCard from "./UserCard";
import {   useNavigate} from "react-router-dom"; // Import useHistory for navigation
import '../css/userList.css'; // Import CSS for styling

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log("Is Admin:", isAdminUser());
                console.log("Token:", getToken());
                console.log("Role from session:", sessionStorage.getItem("role"));

                if (isAdminUser()) {
                    const token = getToken();
                    console.log("Fetching users with token:", token); // Debugging step
                    const users = await getAllUsers(token);
                    console.log("Fetched users:", users); // Debugging step
                    setUsers(users);
                } else {
                    setError('You do not have permission to view this data');
                }
            } catch (error) {
                console.error('Error fetching users:', error); // Debugging step
                setError('Failed to fetch users');
            }
        };

        fetchUsers();
    }, []);

    const navigateToTodos = () => {
        navigate('/todos');
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div className="header">
                <h1 className="registered-users-title">Manage Users</h1>
                <button 
                    className="todos-button" 
                    onClick={navigateToTodos}
                    style={{
                        backgroundColor: '#00adb5',
                        color: '#fff',
                        border: 'none',
                        textAlign: 'center',
                        padding: '10px 20px',
                        fontSize: '1rem',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                        alignSelf: 'center'
                    }}
                >
                    View All Todos
                </button>
            </div>
            <div className="user-list">
                {users.map(user => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
};

export default UserList;
