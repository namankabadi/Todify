// src/axiosInstance.js
import axios from "axios";
import { getToken, storeToken, refreshTokenAPICall } from "./services/AuthService";

const api = axios.create();

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and this is the first retry attempt
    if (error.response?.status === 401 && !originalRequest._retry && getToken()) {
      originalRequest._retry = true;
      try {
        const oldToken = getToken();
        const response = await refreshTokenAPICall(oldToken);
        const newToken = "Bearer " + response.data.accessToken;

        storeToken(newToken);
        originalRequest.headers["Authorization"] = newToken;

        return api(originalRequest); // Retry with new token
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
