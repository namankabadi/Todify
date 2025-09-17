import axios from "axios";
import { useNavigate } from "react-router-dom";

const AUTH_REST_API_BASE_URL = "http://localhost:8080/api/auth"

export const registerAPICall = (registerObj) => axios.post(AUTH_REST_API_BASE_URL + '/register', registerObj);

export const loginAPICall = (usernameOrEmail, password) => axios.post(AUTH_REST_API_BASE_URL + '/login', { usernameOrEmail, password});

export const storeToken = (token) => localStorage.setItem("token", token);

export const getToken = () => localStorage.getItem("token");

export const saveLoggedInUser = (username,role) => { 
    sessionStorage.setItem("authenticatedUser", username);
    sessionStorage.setItem("role",role);
};

export const isUserLoggedIn = () => {

    const username = sessionStorage.getItem("authenticatedUser");

    if(username == null) {
        return false;
    }    
    else {
        return true;
    }   
}

export const getLoggedInUser = () => {
    const username = sessionStorage.getItem("authenticatedUser");
    return username;
}

export const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    
}

export const isAdminUser = () => {
    let role = sessionStorage.getItem("role");

    if(role != null && role === 'ROLE_ADMIN'){
        return true;
    }
    else{
        return false;
    }
}

const API_URL = 'http://localhost:8080/api/auth';

// Function to get all users
export const getAllUsers = async (token) => {
    try {
        const response = await axios.get(API_URL + '/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(token);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const deleteUser = (id) => {
    const token = getToken();
    const isAdmin = isAdminUser();

    if (!token || !isAdmin) {
        throw new Error("Unauthorized: Only admins can delete users.");
    }

    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const assignTaskToUser = async (taskData) => {
    const token = getToken();

    return axios.post('http://localhost:8080/api/usertasks/assign', taskData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};


const USERTASK_API_URL = 'http://localhost:8080/api/usertasks';

export const fetchTasksByUsername = async (username, token) => {
  return axios.get(`${USERTASK_API_URL}/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateTaskStatus = async (taskId, status, token) => {
  return axios.put(
    `${USERTASK_API_URL}/${taskId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const fetchAllTasks = async (token) => {
  return axios.get(`${USERTASK_API_URL}/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTask = async (taskId, token) => {
  return axios.delete(`${USERTASK_API_URL}/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const updateTask = async (taskId, updatedTask, token) => {
    return axios.put(`http://localhost:8080/api/usertasks/${taskId}`, updatedTask, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  


  const API_URL_NO = 'http://localhost:8080/api/';

  const getNotifications = async (username) => {
    try {
      console.log("username" ,username)
      const response = await axios.get(`${API_URL_NO}notifications/${username}`);
      return response.data;  // The response should be a list of notifications
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  };
  
  export default {
    getNotifications,
  };



const BASE_URL_REFRESH = "http://localhost:8080/api/auth";

export const refreshTokenAPICall = (expiredToken) => {
  return axios.post(`${BASE_URL_REFRESH}/refresh`, { token: expiredToken.replace("Bearer ", "") });
};

